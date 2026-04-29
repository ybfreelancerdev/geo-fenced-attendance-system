import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as colors from '../styles/colors';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { getMyProfile } from "../services/apiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { roleSessionKey } from "../constants";

const MyProfile = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { logout }: any = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [userdata, setuserData] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    fetchUserData();
    getRole();
  }, []);

  const getRole = async () => {
      const storedRole = await AsyncStorage.getItem(roleSessionKey);
      setRole(storedRole);
    };

  const fetchUserData = async () => {
    try {
      let res = await getMyProfile();
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

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUserData();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar backgroundColor={colors.APPHeader_COLOR} />
      <View style={styles.container}>
        <View
          style={[styles.header, { paddingTop: insets.top, paddingVertical: role === 'User' ? 40 : 15 }]}
        >
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=3" }}
            style={styles.avatar}
          />

          <Text style={styles.name}>{userdata && userdata.name}</Text>
          <Text style={styles.email}>{userdata && userdata.email}</Text>
        </View>
        {role === 'User' && (
          <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{userdata && userdata.upcomingEvents}</Text>
            <Text style={styles.statLabel}>Upcoming Events</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{userdata && userdata.totalJoinedEvents}</Text>
            <Text style={styles.statLabel}>Joined Events</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{userdata && userdata.totalAttendedEvents}</Text>
            <Text style={styles.statLabel}>Attended Events</Text>
          </View>
        </View>
        )}
        <ScrollView showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }>
          <View style={styles.section}>
            <TouchableOpacity style={[styles.row, styles.border]} activeOpacity={0.5}
              onPress={() => navigation.navigate('EditProfile')}>
              <View style={styles.rowLeft}>
                <MaterialIcons name={'person'} size={22} color="#24B47F" />
                <Text style={styles.rowText}>Edit Profile</Text>
              </View>
              <MaterialIcons name="keyboard-arrow-right" size={22} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.row, styles.border]} activeOpacity={0.5}
              onPress={() => navigation.navigate('MyEvents')}>
              <View style={styles.rowLeft}>
                <MaterialIcons name={'event'} size={22} color="#24B47F" />
                <Text style={styles.rowText}>My Events</Text>
              </View>
              <MaterialIcons name="keyboard-arrow-right" size={22} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.row, styles.border]} activeOpacity={0.5}
              onPress={() => navigation.navigate('ChangePassword')}>
              <View style={styles.rowLeft}>
                <MaterialIcons name={'lock'} size={22} color="#24B47F" />
                <Text style={styles.rowText}>Change Password</Text>
              </View>
              <MaterialIcons name="keyboard-arrow-right" size={22} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.row, styles.border]} activeOpacity={0.5}
              onPress={() => navigation.navigate('ContactUs')}>
              <View style={styles.rowLeft}>
                <MaterialIcons name={'support-agent'} size={22} color="#24B47F" />
                <Text style={styles.rowText}>Contact Us</Text>
              </View>
              <MaterialIcons name="keyboard-arrow-right" size={22} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.row, role === 'User' && styles.border]} activeOpacity={0.5}
              onPress={() => navigation.navigate('PrivacyPolicy')}>
              <View style={styles.rowLeft}>
                <MaterialIcons name={'privacy-tip'} size={22} color="#24B47F" />
                <Text style={styles.rowText}>Privacy Policy</Text>
              </View>
              <MaterialIcons name="keyboard-arrow-right" size={22} color="#9CA3AF" />
            </TouchableOpacity>
            {role === 'User' && (
              <TouchableOpacity style={styles.row} activeOpacity={0.5}
                onPress={() => navigation.navigate('DeleteAccount')}>
                <View style={styles.rowLeft}>
                  <MaterialIcons name={'delete-forever'} size={22} color="#24B47F" />
                  <Text style={styles.rowText}>Delete Account</Text>
                </View>
                <MaterialIcons name="keyboard-arrow-right" size={22} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.logoutBtn}
            onPress={() => logout()}>
            <MaterialIcons name="logout" size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
    </View>
  );
};

export default MyProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  header: {
    alignItems: "center",
    paddingVertical: 40,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    backgroundColor: colors.APPHeader_COLOR
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "#fff",
  },

  name: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },

  email: {
    fontSize: 13,
    color: "#E6FFFA",
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    marginHorizontal: 25,
    marginTop: -25,
    borderRadius: 15,
    paddingVertical: 15,
    elevation: 3,
  },

  statBox: {
    alignItems: "center",
  },

  statValue: {
    fontSize: 16,
    fontWeight: "700",
  },

  statLabel: {
    fontSize: 12,
    color: "#6B7280",
  },

  section: {
    marginTop: 20,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    borderRadius: 15,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },

  border: {
    borderBottomWidth: 0.7,
    borderColor: "#E5E7EB",
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  rowText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#111827",
  },

  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 30,
  },

  logoutText: {
    marginLeft: 8,
    color: "#EF4444",
    fontWeight: "600",
  },
});