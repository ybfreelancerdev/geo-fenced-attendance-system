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
    ActivityIndicator,
    Linking,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { _EVENT, roleSessionKey } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import * as colors from "../styles/colors";
import fonts from '../constants/fonts';
import AppButton from "../components/AppButton";
import { applyEvent, getEventDetailById } from "../services/apiService";
import { formatEventDateTime } from "../utils/dateUtils";
import { showCustom } from "../services/MessageService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addGeofence } from "../services/geolocationService";

const EventDetails = ({ route, navigation }: any) => {
    const [loading, setLoading] = useState(false);
    const [btnloading, setbtnLoading] = useState(false);
    const [event, setevent] = useState<any>(null);
    const [eventHighlights, seteventHighlights] = useState<any[]>([]);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        getRole();
        fetchEventData(route?.params?.id);
    }, [route?.params?.id]);

    const getRole = async () => {
        const storedRole = await AsyncStorage.getItem(roleSessionKey);
        setRole(storedRole);
    };

    const fetchEventData = async (id: number) => {
        setLoading(true);
        try {
            let res = await getEventDetailById(id);
            if (res && res.success) {
                const data = res.data;
                setevent(data);

                const highlightsArray = data.highlights
                    ? data.highlights.split(",").map((item: string) => item.trim())
                    : [];

                seteventHighlights(highlightsArray);
            }
            else {
                setevent([]);
            }
        } catch (error: any) {
            setevent([]);
        } finally {
            setLoading(false);
        }
    };

    const joinEventHandler = async () => {
        setbtnLoading(true);
        try {
            let res = await applyEvent(route?.params?.id);
            if (res && res.success) {
                showCustom(res.message);
                fetchEventData(route?.params?.id);

                // Add geofence here
                await addGeofence({
                    eventId: route?.params?.id,
                    latitude: event.latitude,
                    longitude: event.longitude,
                    radius: event.radius
                });
            }
            else {
                showCustom(res.message);
            }
        } catch (error: any) {
        } finally {
            setbtnLoading(false);
        }
    }

    const openGoogleMaps = (lat: number, lng: number) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        Linking.openURL(url);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar barStyle={"dark-content"} />
            {loading ? (
                <View style={{
                    flex: 1, 
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <ActivityIndicator size="large" color={colors.APP_COLOR} />
                </View>)
                : event ?
                    <>
                        {/* Banner */}
                        <View>
                            <Image source={_EVENT} style={styles.banner} />
                            {/* Back Button */}
                            <TouchableOpacity
                                style={styles.backBtn}
                                onPress={() => navigation.goBack()}
                            >
                                <MaterialIcons name="arrow-back" size={22} color="#000" />
                            </TouchableOpacity>
                        </View>
                        {/* Scrollable Content */}
                        <View style={{
                            backgroundColor: '#fff', height: 20, borderTopLeftRadius: 25,
                            borderTopRightRadius: 25,
                            marginTop: -20
                        }}></View>
                        <ScrollView
                            showsVerticalScrollIndicator={false}>
                            {/* Content */}
                            <View style={{ paddingVertical: 0, paddingBottom: 15, marginHorizontal: 20, backgroundColor: '#fff' }}>
                                {/* Title */}
                                <Text style={styles.title}>{event.title}</Text>

                                {/* About */}
                                <Text style={styles.description}>{event.description}</Text>

                                {/* Info Row */}
                                <View style={styles.infoContainer}>
                                    <View style={styles.infoItem}>
                                        <MaterialIcons name={'people'} size={20} color="#1CB57E" />
                                        {event.joinedUsers === 0 ?
                                            <Text style={styles.infoTitle}>{event.maxMembers}</Text>
                                            :
                                            <Text style={styles.infoTitle}>{event.joinedUsers} / {event.maxMembers} Joined</Text>
                                        }
                                        <Text style={styles.infoSub}>Members</Text>
                                    </View>
                                    <View style={styles.infoItem}>
                                        <MaterialIcons name={'access-time'} size={20} color="#3A8BFA" />
                                        <Text style={styles.infoTitle}>{formatEventDateTime(event.eventDate).time}</Text>
                                        <Text style={styles.infoSub}>Start Time</Text>
                                    </View>
                                    <View style={styles.infoItem}>
                                        <MaterialIcons name={'calendar-today'} size={20} color="#FD8F52" />
                                        <Text style={styles.infoTitle}>{formatEventDateTime(event.eventDate).date}</Text>
                                        <Text style={styles.infoSub}>{formatEventDateTime(event.eventDate).day}</Text>
                                    </View>
                                </View>

                                {/* Highlights */}
                                <Text style={styles.sectionTitle}>Event Highlights</Text>

                                <View style={styles.highlights}>
                                    {eventHighlights.map((item, i) => (
                                        <View key={i} style={styles.highlightItem}>
                                            <MaterialIcons name="check" size={18} color="#24B47F" />
                                            <Text style={styles.highlightText}>{item}</Text>
                                        </View>
                                    ))}
                                </View>

                                {/* Venue */}
                                <Text style={styles.sectionTitle}>Venue</Text>

                                <View style={styles.venueCard}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.venueAddress}>
                                            {event.place + ', ' + event.address}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.venueCard}>
                                    <TouchableOpacity activeOpacity={0.5}
                                        onPress={() => openGoogleMaps(event.latitude, event.longitude)}>
                                        <Text style={{
                                            color: colors.APP_COLOR,
                                            fontFamily: fonts.name.semibold,
                                            fontSize: fonts.size._12px,
                                            textDecorationLine: 'underline'
                                            }}>Open on Map</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>

                        {/* Bottom Button */}
                        {role === 'User' && (
                            <View style={styles.bottomBar}>
                                <AppButton
                                    title={event.isJoined ? "Already Join" : "Join Event"}
                                    onPress={joinEventHandler}
                                    loading={btnloading}
                                    disabled={event.isJoined}
                                />
                            </View>
                        )}
                    </>
                    :
                    <View style={{ position: "absolute", top: '50%', width: '100%', backgroundColor: '#fff', justifyContent: "center" }}>
                        <Text style={{
                            textAlign: "center",
                            fontFamily: fonts.name.regular,
                            fontSize: fonts.size._14px,
                            color: colors.Form_InputCOLOR
                        }}>
                            No event data found
                        </Text>
                        <TouchableOpacity activeOpacity={0.5} style={{ alignItems: "center", marginTop: 10 }}
                            onPress={() => navigation.goBack()}>
                            <Text style={{
                                color: colors.APP_COLOR,
                                fontFamily: fonts.name.semibold,
                                fontSize: fonts.size._12px,
                                textDecorationLine: 'underline'
                            }}>Back to events?</Text>
                        </TouchableOpacity>
                    </View>
            }
        </SafeAreaView>
    );
};

export default EventDetails;

const styles = StyleSheet.create({
    banner: {
        width: "100%",
        height: 250,
    },

    backBtn: {
        position: "absolute",
        top: 15,
        left: 20,
        backgroundColor: "#fff",
        padding: 8,
        borderRadius: 20,
        elevation: 3,
    },

    container: {
        padding: 16,
    },
    card: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -20,
        padding: 16,
    },

    dateBox: {
        backgroundColor: "#EEF2F7",
        padding: 10,
        borderRadius: 12,
        alignItems: "center",
    },

    title: {
        fontSize: fonts.size._20px,
        fontFamily: fonts.name.semibold,
    },

    subtitle: {
        color: colors.Form_InputLableCOLOR,
        marginTop: 5,
        fontSize: fonts.size._12px,
        fontFamily: fonts.name.regular,
    },

    infoContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
        backgroundColor: '#fff',
        elevation: 2,
        paddingVertical: 10,
        borderRadius: 10,
        paddingHorizontal: 10
    },

    infoItem: {
        alignItems: "center",
        width: "23%",
    },

    infoTitle: {
        fontSize: fonts.size._12px,
        fontFamily: fonts.name.semibold,
        color: colors.Form_InputCOLOR,
        marginTop: 5
    },

    infoSub: {
        fontSize: fonts.size._10px,
        fontFamily: fonts.name.regular,
        color: colors.Form_InputLableCOLOR,
    },

    sectionTitle: {
        fontSize: fonts.size._16px,
        fontFamily: fonts.name.semibold,
        color: colors.Form_InputCOLOR,
        marginTop: 20,
    },

    description: {
        fontSize: fonts.size._12px,
        fontFamily: fonts.name.regular,
        color: colors.Form_InputLableCOLOR,
        lineHeight: 20,
    },

    highlights: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10,
    },

    highlightItem: {
        flexDirection: "row",
        alignItems: "center",
        width: "50%",
        marginBottom: 8,
    },

    highlightText: {
        marginLeft: 5,
        fontSize: fonts.size._12px,
        fontFamily: fonts.name.regular,
        color: colors.Form_InputLableCOLOR,
    },

    venueCard: {
        flexDirection: "row",
        marginTop: 5,
    },

    venueAddress: {
        fontSize: fonts.size._14px,
        fontFamily: fonts.name.regular,
        color: colors.Form_InputLableCOLOR,
    },

    bottomBar: {
        paddingVertical: 15,
        marginHorizontal: 20,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#E5E7EB",
    },

    button: {
        paddingVertical: 14,
        alignItems: "center",
        backgroundColor: colors.BtnBackground_COLOR,
        borderRadius: 25,
        height: 50,
    },

    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});