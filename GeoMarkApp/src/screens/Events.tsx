import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Header from "../components/Header";
import fonts from '../constants/fonts';
import * as colors from "../styles/colors";
import { Swipeable } from "react-native-gesture-handler";
import { getEvents } from "../services/apiService";
import { formatEventDateTime } from "../utils/dateUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { roleSessionKey } from "../constants";
import { useFocusEffect } from "@react-navigation/native";

const Events: React.FC = ({ navigation, route }: any) => {
  const [loading, setLoading] = useState(false); 
  const [activeTab, setActiveTab] = useState<"upcoming" | "all">("upcoming");
  const [page, setPage] = useState(1);
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [allEvents, setallEvents] = useState<any[]>([]);
  const [role, setRole] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const tab = route?.params?.tab ?? "upcoming";
      getRole();
      setPage(1);
      setHasMore(true);
      setActiveTab(tab);
      fetchAllEventData(tab, 1, true);
    }, [route?.params?.tab])
  );

  const getRole = async () => {
    const storedRole = await AsyncStorage.getItem(roleSessionKey);
    setRole(storedRole);
  };

  const fetchAllEventData = async (type: "upcoming" | "all" = 'upcoming', pageNumber = 1, isRefresh = false) => {
    if (loading || (!hasMore && !isRefresh)) return;

    setLoading(true);

    try {
      const payload = {
        pageNumber,
        pageSize: 20,
        status: type,
      };

      let newData: any[] = [];
      let res = await getEvents(payload);
      if (res && res.success) {
        newData = res.data.data;
      }

      setallEvents(prev =>
        isRefresh ? newData : [...prev, ...newData]
      );

      setHasMore(newData.length === 20);
      setPage(pageNumber);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchAllEventData(activeTab, page + 1);
    }
  };

  const renderRightActions = (item: any) => {
    return (
      <View style={styles.actionsContainer}>

        {/* Edit */}
        <TouchableOpacity
          style={styles.badge}
          onPress={() => navigation.navigate("CreateEvent", { id: item.id, isEdit: true })}
        >
          <MaterialIcons name="edit" size={20} color={colors.Form_InputLableCOLOR} />
        </TouchableOpacity>

        {/* Delete */}
        <TouchableOpacity
          style={styles.badge}
          onPress={() => setDeleteItem(item)}
        >
          <MaterialIcons name="delete" size={20} color={colors.Form_InputLableCOLOR} />
        </TouchableOpacity>
      </View>
    );
  };

  const handleDelete = (id: number) => {
    console.log("Delete event:", id);
    // API call or state update here
  };

  const onEventRefresh = async () => {
    setRefreshing(true);
    setHasMore(true);
    fetchAllEventData(activeTab, 1, true);
  };

  const renderItem = ({ item }: any) => {
    return (
      <Swipeable enabled={role === 'Admin'? true : false} renderRightActions={() => renderRightActions(item)}>
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("EventDetails", { id: item.id })}
        >
          {/* Date Badge */}
          <View style={styles.dateBox}>
            <Text style={styles.dateText}>{formatEventDateTime(item.eventDate).date}</Text>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={[styles.row]}>
              <MaterialIcons name="person" size={16} color={colors.Form_InputLableCOLOR} />
              {item.joinedUsers === 0 ?
                <Text style={styles.meta}>{item.maxMembers}</Text>
              :
                <Text style={styles.meta}>{item.joinedUsers} / {item.maxMembers} Joined</Text>
            }
            </View>

            <View style={styles.row}>
              <MaterialIcons name="access-time" size={16} color={colors.Form_InputLableCOLOR} />
              <Text style={styles.meta}>{formatEventDateTime(item.eventDate).time}</Text>
            </View>
            <View style={styles.row}>
              <MaterialIcons name="location-on" size={16} color={colors.Form_InputLableCOLOR} />
              <Text style={[styles.meta, {marginRight: 5}]}>{item.location}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <View style={{ backgroundColor: '#fff', flex: 1 }}>
      {/* Header */}
      <Header
        title={"Events"}
        navigation={navigation}
      />
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "upcoming" && styles.activeTab,
          ]}
          onPress={() => {
            setActiveTab("upcoming");
            fetchAllEventData('upcoming', 1, true);
          }}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "upcoming" && styles.activeTabText,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "all" && styles.activeTab,
          ]}
          onPress={() => {
            setActiveTab("all");
            fetchAllEventData('all', 1, true);
          }}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "all" && styles.activeTabText,
            ]}
          >
            All Events
          </Text>
        </TouchableOpacity>
      </View>
      
      {loading && allEvents.length === 0 && (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator color={colors.APP_COLOR} size={"large"} />
        </View>
      )}

      <View style={styles.container}>
        {/* Scrollable List */}
        <FlatList
          data={allEvents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ flexGrow:1, paddingTop: 10, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          onRefresh={onEventRefresh}
          ListFooterComponent={
            loading && allEvents.length > 0 ? (
              <ActivityIndicator color={colors.APP_COLOR} size={"small"} style={{ marginBottom: 20, marginTop: 5 }} />
            ) : null
          }
          ListEmptyComponent={
            !loading ? (
              <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text style={{
                  textAlign: "center", fontFamily: fonts.name.regular,
                  fontSize: fonts.size._14px
                }}>
                  Events not found
                </Text>
              </View>
            ) : null
          }
        />
      </View>

      {/* delete modal */}
      <Modal
        visible={!!deleteItem}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>

            {/* Title */}
            <Text style={styles.modal_title}>Delete Event</Text>

            {/* Description */}
            <Text style={styles.description}>
              Are you sure you want to delete{" "}
              <Text style={{ fontFamily: fonts.name.semibold }}>
                {deleteItem?.title}
              </Text>
              ?
            </Text>

            {/* Buttons */}
            <View style={styles.actions}>

              {/* Cancel */}
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setDeleteItem(null)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              {/* Delete */}
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => {
                  handleDelete(deleteItem.id);
                  setDeleteItem(null);
                }}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>

            </View>

          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Events;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 15,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },

  activeTab: {
    backgroundColor: "#fff",
  },

  tabText: {
    fontSize: fonts.size._12px,
    fontFamily: fonts.name.medium,
    color: colors.Form_InputCOLOR,
  },

  activeTabText: {
    color: colors.APP_COLOR,
    fontSize: fonts.size._12px,
    fontFamily: fonts.name.semibold,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 15,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },

  dateBox: {
    backgroundColor: "#24B47F",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    width: 100
  },

  dateText: {
    fontSize: fonts.size._12px,
    fontFamily: fonts.name.semibold,
    color: "#fff",
    textAlign: "center",
  },

  content: {
    flex: 1,
    padding: 12,
  },

  title: {
    fontSize: fonts.size._14px,
    fontFamily: fonts.name.semibold,
    color: colors.Form_InputCOLOR,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },

  meta: {
    fontSize: fonts.size._12px,
    fontFamily: fonts.name.regular,
    marginLeft: 6,
    color: colors.Form_InputLableCOLOR,
  },

  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: 10,
  },

  badge: {
    width: 50,
    height: 50,
    borderRadius: 35,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,

    // Shadow
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },

  modal_title: {
    fontSize: fonts.size._16px,
    fontFamily: fonts.name.semibold,
    color: colors.Form_InputCOLOR,
  },

  description: {
    lineHeight: 20,
    fontSize: fonts.size._12px,
    fontFamily: fonts.name.regular,
    color: colors.Form_InputLableCOLOR,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },

  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
  },

  cancelText: {
    fontSize: fonts.size._12px,
    fontFamily: fonts.name.semibold,
    color: colors.Form_InputLableCOLOR,
  },

  deleteBtn: {
    backgroundColor: "#EF4444",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  deleteText: {
    color: "#fff",
    fontSize: fonts.size._12px,
    fontFamily: fonts.name.semibold,
  },
});