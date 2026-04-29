import React, { useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Keyboard,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Formik } from "formik";
import * as Yup from "yup";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as colors from "../styles/colors";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import fonts from '../constants/fonts';
import { changePassword } from "../services/apiService";
import { showCustom } from "../services/MessageService";

const ChangePassword = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);
    const formikRef = useRef<any>(null);

    const initialValues = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    };
    
    // ✅ Validation Schema
    const validationSchema = Yup.object({
        oldPassword: Yup.string().required("Old password is required"),
        newPassword: Yup.string().min(6, 'Password must be at least 6 digits').required('Password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword')], 'Passwords not matched')
            .required('Confirm Password is required'),
    });

    const changePasswordHandler = async (values: any) => {
        Keyboard.dismiss();
        setLoading(true);
        try {
            let res = await changePassword(
                {
                    oldPassword: values.oldPassword,
                    newPassword: values.newPassword
                });
            if (res && res.success) {
                showCustom(res.message);
                navigation.goBack();
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

                <View style={{ marginHorizontal: 20 }}>
                    <Text style={styles.header}>Change Password</Text>
                </View>
                <Formik
                    innerRef={formikRef}
                    enableReinitialize={true}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                        // Handle form submission
                        changePasswordHandler(values);
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, touched, errors, setFieldValue }) => (
                        <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1, marginHorizontal: 20 }} keyboardShouldPersistTaps="handled">
                            {/* Inputs */}
                            <View style={styles.inputBox}>
                                <AppInput
                                    label="Old Password"
                                    value={values.oldPassword}
                                    onChangeText={handleChange("oldPassword")}
                                    onBlur={handleBlur("oldPassword")}
                                    placeholder="Enter old password"
                                    secureTextEntry
                                    icon="lock"
                                    error={errors.oldPassword}
                                    touched={touched.oldPassword}
                                />
                            </View>

                            <View style={styles.inputBox}>
                                <AppInput
                                    label="New Password"
                                    value={values.newPassword}
                                    onChangeText={handleChange("newPassword")}
                                    onBlur={handleBlur("newPassword")}
                                    placeholder="Enter new password"
                                    secureTextEntry
                                    icon="lock"
                                    error={errors.newPassword}
                                    touched={touched.newPassword}
                                />
                            </View>

                            <View style={styles.inputBox}>
                                <AppInput
                                    label="Confirm Password"
                                    value={values.confirmPassword}
                                    onChangeText={handleChange("confirmPassword")}
                                    onBlur={handleBlur("confirmPassword")}
                                    placeholder="Enter confirm password"
                                    secureTextEntry
                                    icon="lock"
                                    error={errors.confirmPassword}
                                    touched={touched.confirmPassword}
                                />
                            </View>

                            {/* Button */}
                            <AppButton
                                title="Update Password"
                                style={{ marginVertical: 15 }}
                                onPress={handleSubmit}
                                loading={loading}
                            />
                        </KeyboardAwareScrollView>
                    )}
                </Formik>
            </View>
        </SafeAreaView>
    );
};

export default ChangePassword;

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

    inputBox: {
        marginVertical: 10,
    },

    label: {
        fontSize: 13,
        color: colors.Form_PlaceholderColor,
        marginBottom: 6,
    },

    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 50,
        borderWidth: 1,
        borderColor: colors.Form_BorderColor,
        color: colors.Inputtext_COLOR
    },

    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: colors.Inputtext_COLOR,
    },

    error: {
        color: '#f44336',
        fontSize: 10,
        marginTop: 5,
        marginLeft: 15,
    },

    button: {
        marginTop: 25,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 15,
        backgroundColor: colors.APP_COLOR,
        height: 50
    },

    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});