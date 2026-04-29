import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
    StatusBar,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { OtpInput } from "react-native-otp-entry";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as colors from "../styles/colors";
import { resendOtp, verifyOtp } from "../services/apiService";
import { showCustom } from "../services/MessageService";
import Loader from "../components/Loader";
import { SafeAreaView } from "react-native-safe-area-context";
import Fonts from '../constants/fonts';
import AppButton from "../components/AppButton";

const OtpVerification = ({ navigation, route }: any) => {
    const { email, from } = route.params;
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState("");
    const [timer, setTimer] = useState(30);

    useEffect(() => {
        if (timer === 0) return;

        const interval = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const resendOtpHandler = async () => {
        try {
            let res = await resendOtp({ 'email': email });
            if (res && res.success) {
                showCustom(res.message);
                setTimer(30);
            } else {
                showCustom(res.message);
            }
        } catch (error: any) {
        }
    }

    const verifyOtpHandler = async () => {
        if (otp.length != 6) {
            showCustom('Otp is not valid.');
        }
        setLoading(true);
        try {
            let res = await verifyOtp({ 'email': email, 'otp': otp });
            if (res && res.success) {
                showCustom(res.message);
                setTimeout(() => {
                    if (from === 'FORGOTPWD') {
                        navigation.reset({ index: 0, routes: [{ name: 'ResetPassword', params: { email: email } }] })
                    } else {
                        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                    }
                }, 100);
            } else {
                console.log(JSON.stringify(res))
                showCustom(res.message);
            }
        } catch (error: any) {
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            <StatusBar barStyle={"dark-content"} />
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back" size={22} color="#000" />
                </TouchableOpacity>
                <View style={{ paddingHorizontal: 20, marginBottom: 15 }}>
                    <Text style={styles.header}>Verification</Text>
                </View>
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Title */}
                    <Text style={styles.title}>Verify OTP</Text>

                    {/* Description */}
                    <Text style={styles.subText}>
                        Please enter the OTP sent to your email
                    </Text>

                    {/* OTP */}
                    <View style={styles.otpWrapper}>
                        <OtpInput
                            numberOfDigits={6}
                            autoFocus
                            type="numeric"
                            onTextChange={setOtp}
                            onFilled={(text) => {
                                setOtp(text);
                                Keyboard.dismiss();
                            }}
                            theme={{
                                containerStyle: styles.otpContainer,
                                pinCodeContainerStyle: styles.box,
                                pinCodeTextStyle: styles.text,
                                focusedPinCodeContainerStyle: styles.focusedBox,
                            }}
                        />
                    </View>

                    {/* Resend */}
                    <View style={styles.resendContainer}>
                        {timer > 0 ? (
                            <Text style={styles.timerText}>
                                Resend OTP in {timer}s
                            </Text>
                        ) : (
                            <TouchableOpacity onPress={() => resendOtpHandler()}>
                                <Text style={styles.resendText}>Resend OTP</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Button */}
                    <AppButton
                        title="Verify"
                        style={{ marginVertical: 15 }}
                        onPress={() => verifyOtpHandler()}
                        loading={loading}
                    />
                </KeyboardAwareScrollView>
            </View>
        </SafeAreaView>
    );
};

export default OtpVerification;

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
        fontSize: Fonts.size._22px,
        fontFamily: Fonts.name.bold,
        color: colors.APPHeader_TextCOLOR,
        marginTop: 70
    },

    mainContainer: {
        flex: 1,
        backgroundColor: "#fff",
    },

    scrollContainer: {
        flexGrow: 1,
        alignItems: "center",
        marginHorizontal: 20,
        justifyContent: "center"
    },

    title: {
        fontSize: Fonts.size._22px,
        fontFamily: Fonts.name.bold,
    },

    subText: {
        fontSize: Fonts.size._14px,
        fontFamily: Fonts.name.regular,
        // fontSize: 14,
        color: colors.Header_SubtitleTextCOLOR,
        textAlign: "center",
        marginBottom: 30,
    },

    otpWrapper: {
        alignItems: "center",
        marginBottom: 20,
    },

    otpContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: '100%'
    },

    box: {
        width: 50,
        height: 50,
        marginHorizontal: 5,
        borderRadius: 12,
        borderWidth: 0.5,
        borderColor: colors.InputBorder_COLOR,
        justifyContent: "center",
        alignItems: "center",
    },

    focusedBox: {
        borderColor: colors.Inputtext_COLOR,
        borderWidth: 1,
    },

    text: {
        marginTop: 5,
        fontSize: Fonts.size._20px,
        fontFamily: Fonts.name.semibold,
        color: colors.InputBorder_COLOR,
    },

    resendContainer: {
        marginTop: 10,
        marginBottom: 30,
        alignSelf: "flex-end"
    },

    resendText: {
        color: colors.APP_COLOR,
        fontSize: Fonts.size._15px,
        fontFamily: Fonts.name.semibold,
        textDecorationLine: 'underline'
    },

    timerText: {
        color: "#999",
        fontSize: Fonts.size._12px,
        fontFamily: Fonts.name.regular,
    },
});