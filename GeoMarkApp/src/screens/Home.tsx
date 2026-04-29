import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, StatusBar, RefreshControl, FlatList } from "react-native";
import { initGeolocation } from "../services/geolocationService";
import { requestNotificationPermission } from "../utils/notificationPermission";
import { getFcmToken, listenToNotifications } from "../services/fcmService";
import * as colors from '../styles/colors';
import LinearGradient from "react-native-linear-gradient";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { _BANNER } from "../constants";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import fonts from '../constants/fonts';
import { addfcmToken, getTopUpcomingEvents, getUserDetail } from "../services/apiService";
import { formatEventDateTime } from "../utils/dateUtils";

const Home: React.FC = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [userdata, setuserData] = useState<any>(null);
  const [eventData, seteventData] = useState<any[]>([]);

  useEffect(() => {
    const setup = async () => {
      fetchUserData();
      fetchEventData();
      await requestNotificationPermission();
      await userDeviceRegister();
      listenToNotifications();
      await initGeolocation();
    };

    setup();
  }, []);

  const userDeviceRegister = async () => {
    const fcmToken = await getFcmToken();
    if(!fcmToken) return;

    try {
      let res = await addfcmToken({fcmToken: fcmToken});
    } catch (error: any) {
    }
  }

  const fetchUserData = async () => {
    try {
      let res = await getUserDetail();
      if (res && res.success) {
        setuserData(res.data);
      }
      else {
        setuserData(null);
      }
    } catch (error: any) {
      setuserData(null);
    }
  };

  const fetchEventData = async () => {
    try {
      let res = await getTopUpcomingEvents();
      if (res && res.success) {
        seteventData(res.data);
      }
      else {
        seteventData([]);
      }
    } catch (error: any) {
      seteventData([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    await fetchEventData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle={"dark-content"} />
      <View style={styles.container}>
        {/* 👋 Header */}
        <LinearGradient
          colors={["#18B983", "#5FA0FD"]}
          style={styles.headerCard}
        >
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=3" }}
            style={styles.avatar}
          />

          <View>
            <Text style={styles.title}>Hello, {userdata && userdata.name}! 👋</Text>
            <Text style={styles.subtitle}>
              Here’s what’s happening today.
            </Text>
          </View>
        </LinearGradient>
        <ScrollView showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }>
          {/* Manage Events */}
          {eventData.length > 0 &&
            <View style={{ marginTop: 20 }}>
              <View style={[styles.rowBetween, { marginHorizontal: 20 }]}>
                <Text style={styles.sectionTitle}>Upcoming Events</Text>
                <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.navigate('Events')}>
                  <Text style={styles.link}>See All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={eventData}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item: any) => item.id.toString()}
                contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 15 }}
                ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
                renderItem={({ item }) => (
                  <View
                    style={{
                      width: 185,
                      aspectRatio: 1,
                      backgroundColor: "#fff",
                      borderRadius: 15,
                      elevation: 3,
                      shadowColor: "#000",
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      shadowOffset: { width: 0, height: 2 },
                    }}
                  >
                    {/* Header */}
                    <View
                      style={{
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,
                        backgroundColor: colors.APP_COLOR,
                        padding: 10,
                      }}
                    >
                      <Text style={styles.event_date}>{formatEventDateTime(item.eventDate).date}</Text>
                    </View>

                    {/* Content */}
                    <View style={{ padding: 10 }}>
                      <Text
                        style={styles.event_title}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {item.title}
                      </Text>

                      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
                        <MaterialIcons name="person" size={16} color={colors.Form_InputLableCOLOR} />
                        <Text style={styles.event_meta}>{item.maxMembers}</Text>
                      </View>

                      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
                        <MaterialIcons name="access-time" size={16} color={colors.Form_InputLableCOLOR} />
                        <Text style={styles.event_meta}>{formatEventDateTime(item.eventDate).time}</Text>
                      </View>

                      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
                        <MaterialIcons name="location-on" size={16} color={colors.Form_InputLableCOLOR} />
                        <Text style={styles.event_meta} numberOfLines={2}
                          ellipsizeMode="tail">{item.location}</Text>
                      </View>
                    </View>
                  </View>
                )}
              />
            </View>
          }
          {/* ⚡ Quick Actions */}
          <View style={{ marginHorizontal: 20, marginTop: 20 }}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => navigation.navigate("CreateEvent")}
              >
                <View style={[styles.iconBox, { backgroundColor: "#E6F9F2" }]}>
                  <MaterialIcons name="event-note" size={24} color="#24B47F" />
                </View>
                <Text style={styles.actionText}>Events</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => navigation.navigate("Events")}
              >
                <View style={[styles.iconBox, { backgroundColor: "#EEF2FF" }]}>
                  <MaterialIcons name="event-available" size={24} color="#6366F1" />
                </View>
                <Text style={styles.actionText}>My Events</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => navigation.navigate("MyProfile")}
              >
                <View style={[styles.iconBox, { backgroundColor: "#FFF4E6" }]}>
                  <MaterialIcons name="group" size={24} color="#F59E0B" />
                </View>
                <Text style={styles.actionText}>Profile</Text>
              </TouchableOpacity>

            </View>
          </View>

          <View style={{ marginHorizontal: 25, marginTop: 25, marginBottom: 50, alignItems: "center" }}>
            <Text>Geofence tracking started...</Text>
            <Text>Notifications Ready</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 15,
    padding: 15,
    borderRadius: 20,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2,
    borderColor: "#fff",
  },

  title: {
    fontSize: fonts.size._20px,
    fontFamily: fonts.name.semibold,
    color: "#fff",
  },

  subtitle: {
    fontSize: fonts.size._12px,
    fontFamily: fonts.name.regular,
    color: "#fff",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: fonts.size._16px,
    fontFamily: fonts.name.semibold,
    color: colors.Form_InputCOLOR
  },

  link: {
    fontSize: fonts.size._14px,
    fontFamily: fonts.name.semibold,
    color: colors.APP_COLOR
  },

  card: {
    width: 170,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginRight: 10,
    elevation: 3,
  },

  cardHeader: {
    backgroundColor: "#24B47F",
    padding: 10,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },

  event_date: {
    fontSize: fonts.size._12px,
    fontFamily: fonts.name.semibold,
    marginHorizontal: 5,
    color: '#fff',
    flexShrink: 1
  },

  event_title: {
    fontSize: fonts.size._14px,
    fontFamily: fonts.name.semibold,
    marginHorizontal: 5,
    color: colors.Form_InputCOLOR,
    flexShrink: 1
  },

  event_meta: {
    fontSize: fonts.size._12px,
    fontFamily: fonts.name.regular,
    marginHorizontal: 5,
    color: colors.Form_InputLableCOLOR,
    flexShrink: 1
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  actionCard: {
    width: "30%",
    backgroundColor: "#fff",
    borderRadius: 15,
    marginVertical: 5,
    padding: 12,
    alignItems: "center",
    elevation: 3,
  },

  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },

  actionText: {
    fontSize: fonts.size._12px,
    fontFamily: fonts.name.medium,
  },
});