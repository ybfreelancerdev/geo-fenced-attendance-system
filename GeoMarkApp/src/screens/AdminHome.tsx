import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    StatusBar,
    RefreshControl,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import fonts from '../constants/fonts';
import * as colors from "../styles/colors";
import { getDashboard } from "../services/apiService";

const AdminHome = ({ navigation }: any) => {
    const [refreshing, setRefreshing] = useState(false);
    const [userdata, setuserData] = useState<any>(null);

    useEffect(() => {
        const setup = async () => {
            fetchUserData();
        };
        setup();
    }, []);

    const fetchUserData = async () => {
        try {
            let res = await getDashboard();
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
                        <Text style={styles.title}>Hello, {userdata && userdata.name} 👋</Text>
                        <Text style={styles.subtitle}>
                            Manage your application
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
                    {/* 📊 Stats */}
                    <View style={{ marginHorizontal: 20, marginTop: 15 }}>
                        <Text style={styles.sectionTitle}>Users Summary</Text>
                    </View>
                    <View style={styles.statsContainer}>
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>{userdata && userdata.totalUsers}</Text>
                            <Text style={styles.statLabel}>Total Users</Text>
                        </View>

                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>{userdata && userdata.totalActiveUsers}</Text>
                            <Text style={styles.statLabel}>Active Users</Text>
                        </View>

                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>{userdata && userdata.totalInactiveUsers}</Text>
                            <Text style={styles.statLabel}>Inactive Users</Text>
                        </View>
                    </View>

                    <View style={{ marginHorizontal: 20, marginTop: 25 }}>
                        <Text style={styles.sectionTitle}>Events Summary</Text>
                    </View>
                    <View style={styles.statsContainer}>
                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>{userdata && userdata.totalEvents}</Text>
                            <Text style={styles.statLabel}>Total Events</Text>
                        </View>

                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>{userdata && userdata.totalUpcomingEvents}</Text>
                            <Text style={styles.statLabel}>Upcoming Events</Text>
                        </View>

                        <View style={styles.statBox}>
                            <Text style={styles.statValue}>{userdata && userdata.totalDeletedEvents}</Text>
                            <Text style={styles.statLabel}>Deleted Events</Text>
                        </View>
                    </View>

                    {/* ⚡ Quick Actions */}
                    <View style={{ marginHorizontal: 20, marginTop: 25 }}>
                        <Text style={styles.sectionTitle}>Quick Actions</Text>

                        <View style={styles.actionsRow}>

                            <TouchableOpacity
                                style={styles.actionCard}
                                onPress={() => navigation.navigate("CreateEvent")}
                            >
                                <View style={[styles.iconBox, { backgroundColor: "#E6F9F2" }]}>
                                    <MaterialIcons name="add-circle" size={24} color="#24B47F" />
                                </View>
                                <Text style={styles.actionText}>Create Event</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.actionCard}
                                onPress={() => navigation.navigate("Events")}
                            >
                                <View style={[styles.iconBox, { backgroundColor: "#EEF2FF" }]}>
                                    <MaterialIcons name="event" size={24} color="#6366F1" />
                                </View>
                                <Text style={styles.actionText}>Events</Text>
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

                    {/* 📂 Management Section */}
                    <View style={{ marginHorizontal: 20, marginTop: 25 }}>
                        <Text style={styles.sectionTitle}>Management</Text>

                        <TouchableOpacity
                            style={styles.row}
                            onPress={() => navigation.navigate("Events", { tab: 'all' })}
                        >
                            <View style={styles.rowLeft}>
                                <MaterialIcons name="event-note" size={22} color="#24B47F" />
                                <Text style={styles.rowText}>Manage Events</Text>
                            </View>
                            <MaterialIcons name="keyboard-arrow-right" size={22} color="#9CA3AF" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.row}
                            onPress={() => navigation.navigate("Users")}
                        >
                            <View style={styles.rowLeft}>
                                <MaterialIcons name="groups" size={22} color="#24B47F" />
                                <Text style={styles.rowText}>Manage Users</Text>
                            </View>
                            <MaterialIcons name="keyboard-arrow-right" size={22} color="#9CA3AF" />
                        </TouchableOpacity>

                        {/* <TouchableOpacity
                            style={styles.row}
                            onPress={() => navigation.navigate("ManageContact")}
                        >
                            <View style={styles.rowLeft}>
                                <MaterialIcons name="contact-phone" size={22} color="#24B47F" />
                                <Text style={styles.rowText}>Manage Contact Information</Text>
                            </View>
                            <MaterialIcons name="keyboard-arrow-right" size={22} color="#9CA3AF" />
                        </TouchableOpacity> */}
                    </View>

                    {/* Footer */}
                    <View style={{ marginTop: 40, alignItems: "center" }}>
                        <Text style={{
                            fontSize: fonts.size._12px,
                            fontFamily: fonts.name.regular,
                            color: colors.Form_InputLableCOLOR
                        }}>
                            Admin Panel Active
                        </Text>
                    </View>

                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default AdminHome;

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

    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#fff",
        marginHorizontal: 20,
        marginVertical: 5,
        borderRadius: 15,
        paddingVertical: 15,
        elevation: 3,
    },

    statBox: { alignItems: "center" },

    statValue: {
        fontSize: fonts.size._16px,
        fontFamily: fonts.name.semibold,
        color: colors.Form_InputCOLOR
    },

    statLabel: {
        fontSize: fonts.size._12px,
        fontFamily: fonts.name.regular,
        color: colors.Form_InputLableCOLOR
    },

    sectionTitle: {
        fontSize: fonts.size._16px,
        fontFamily: fonts.name.semibold,
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

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 15,
        borderBottomWidth: 0.5,
        borderColor: "#E5E7EB",
    },

    rowLeft: {
        flexDirection: "row",
        alignItems: "center",
    },

    rowText: {
        marginLeft: 10,
        color: colors.Form_InputCOLOR,
        fontSize: fonts.size._14px,
        fontFamily: fonts.name.regular,
    },
});