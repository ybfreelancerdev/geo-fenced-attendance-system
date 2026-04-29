import React from "react";
import { View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import fonts from '../constants/fonts';
import * as colors from "../styles/colors";

const PrivacyPolicy = ({ navigation }: any) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <StatusBar barStyle={"dark-content"} />
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back" size={22} color="#000" />
                </TouchableOpacity>
                <View style={{ marginHorizontal: 20, marginBottom: 10 }}>
                    <Text style={styles.header}>Privacy Policy</Text>
                    <Text style={styles.date}>Last updated: May 2025</Text>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ marginHorizontal: 20 }}>
                        <Text style={styles.paragraph}>
                            GeoMark ("we", "our", or "us") respects your privacy and is committed
                            to protecting your personal information. This Privacy Policy explains
                            how we collect, use, and safeguard your data when you use our
                            application.
                        </Text>

                        {/* Section 1 */}
                        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
                        <Text style={styles.paragraph}>
                            We may collect personal information such as your name, email address,
                            and phone number when you register or update your profile. We also
                            collect location data to provide geofencing and event tracking
                            features.
                        </Text>

                        {/* Section 2 */}
                        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
                        <Text style={styles.paragraph}>
                            Your information is used to:
                            {"\n"}• Provide and manage event services
                            {"\n"}• Send notifications related to events
                            {"\n"}• Improve app functionality and user experience
                            {"\n"}• Ensure security and prevent misuse
                        </Text>

                        {/* Section 3 */}
                        <Text style={styles.sectionTitle}>3. Location Data</Text>
                        <Text style={styles.paragraph}>
                            GeoMark uses your location to enable geofencing features. This allows
                            us to notify you when you enter or exit specific event areas. Your
                            location data is used only for this purpose and is not shared with
                            third parties without your consent.
                        </Text>

                        {/* Section 4 */}
                        <Text style={styles.sectionTitle}>4. Data Sharing</Text>
                        <Text style={styles.paragraph}>
                            We do not sell or rent your personal information. Your data may only be
                            shared with trusted services required to operate the app, such as
                            notification services.
                        </Text>

                        {/* Section 5 */}
                        <Text style={styles.sectionTitle}>5. Data Security</Text>
                        <Text style={styles.paragraph}>
                            We take reasonable measures to protect your data from unauthorized
                            access, loss, or misuse. However, no system is completely secure.
                        </Text>

                        {/* Section 6 */}
                        <Text style={styles.sectionTitle}>6. Your Rights</Text>
                        <Text style={styles.paragraph}>
                            You can update or delete your personal information at any time from
                            your profile. You may also contact us for any privacy-related concerns.
                        </Text>

                        {/* Section 7 */}
                        <Text style={styles.sectionTitle}>7. Changes to This Policy</Text>
                        <Text style={styles.paragraph}>
                            We may update this Privacy Policy from time to time. Any changes will
                            be reflected on this screen with an updated date.
                        </Text>

                        {/* Section 8 */}
                        <Text style={styles.sectionTitle}>8. Contact Us</Text>
                        <Text style={styles.paragraph}>
                            If you have any questions about this Privacy Policy, please contact us
                            at:
                            {"\n"}Email: support@geomark.com
                        </Text>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default PrivacyPolicy;

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

    date: {
        fontSize: fonts.size._12px,
        fontFamily: fonts.name.regular,
        color: colors.APPHeader_TextCOLOR,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
        marginTop: 15,
        marginBottom: 5,
    },

    paragraph: {
        fontSize: 14,
        color: "#374151",
        lineHeight: 20,
    },
});