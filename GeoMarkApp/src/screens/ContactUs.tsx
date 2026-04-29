import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
    StatusBar,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import fonts from '../constants/fonts';
import * as colors from "../styles/colors";

const ContactUs = ({ route, navigation }: any) => {
    const insets = useSafeAreaInsets();

    const openLink = (type: string, value: string) => {
        if (type === "phone") {
            Linking.openURL(`tel:${value}`);
        } else if (type === "email") {
            Linking.openURL(`mailto:${value}`);
        } else {
            Linking.openURL(value);
        }
    };

    return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <StatusBar barStyle={"dark-content"} />
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation.goBack()}
            >
                <MaterialIcons name="arrow-back" size={22} color="#000" />
            </TouchableOpacity>

            <View style={{marginHorizontal: 20}}>
                <Text style={styles.header}>Contact Us</Text>
                <Text style={styles.subText}>
                    We’re here to help. Reach out to us anytime.
                </Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.card}>
                    {/* Phone */}
                    <TouchableOpacity
                        style={[styles.row, styles.border]}
                        activeOpacity={0.5}
                        onPress={() => openLink("phone", "+919999999999")}
                    >
                        <MaterialIcons name="phone" size={22} color="#24B47F" />
                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Phone</Text>
                            <Text style={styles.value}>+91 99999 99999</Text>
                        </View>
                        <MaterialIcons name="keyboard-arrow-right" size={22} color="#9CA3AF" />
                    </TouchableOpacity>

                    {/* Email */}
                    <TouchableOpacity
                        style={[styles.row, styles.border]}
                        activeOpacity={0.5}
                        onPress={() => openLink("email", "support@geomark.com")}
                    >
                        <MaterialIcons name="email" size={22} color="#24B47F" />
                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Email</Text>
                            <Text style={styles.value}>support@geomark.com</Text>
                        </View>
                        <MaterialIcons name="keyboard-arrow-right" size={22} color="#9CA3AF" />
                    </TouchableOpacity>

                    {/* Address */}
                    <TouchableOpacity
                        style={[styles.row, styles.border]}
                        activeOpacity={0.5}
                        onPress={() =>
                            openLink(
                                "map",
                                "https://www.google.com/maps/search/?api=1&query=Ahmedabad"
                            )
                        }
                    >
                        <MaterialIcons name="location-on" size={22} color="#24B47F" />
                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Address</Text>
                            <Text style={styles.value}>
                                Ahmedabad, Gujarat, India
                            </Text>
                        </View>
                        <MaterialIcons name="keyboard-arrow-right" size={22} color="#9CA3AF" />
                    </TouchableOpacity>

                    {/* Website */}
                    <TouchableOpacity
                        style={styles.row}
                        activeOpacity={0.5}
                        onPress={() => openLink("web", "https://yourwebsite.com")}
                    >
                        <MaterialIcons name="language" size={22} color="#24B47F" />
                        <View style={styles.textContainer}>
                            <Text style={styles.label}>Website</Text>
                            <Text style={styles.value}>www.geomark.com</Text>
                        </View>
                        <MaterialIcons name="keyboard-arrow-right" size={22} color="#9CA3AF" />
                    </TouchableOpacity>

                </View>

            </ScrollView>
        </View>
    </SafeAreaView>
    );
};

export default ContactUs;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
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

    header: {
        fontSize: fonts.size._22px,
        fontFamily: fonts.name.bold,
        color: colors.APPHeader_TextCOLOR,
        marginTop: 70
    },

    subText: {
        fontSize: fonts.size._12px,
        fontFamily: fonts.name.regular,
        color: colors.APPHeader_TextCOLOR,
        marginBottom: 20,
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: 15,
        marginVertical: 10,
        marginHorizontal: 20,
        elevation: 3,
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 14,
    },

    border: {
        borderBottomWidth: 0.7,
        borderColor: "#E5E7EB",
    },

    textContainer: {
        flex: 1,
        marginLeft: 10,
    },

    label: {
        fontSize: fonts.size._12px,
        fontFamily: fonts.name.regular,
        color: "#6B7280",
    },

    value: {
        fontSize: fonts.size._12px,
        fontFamily: fonts.name.bold,
        color: colors.Form_InputCOLOR,
    },
});