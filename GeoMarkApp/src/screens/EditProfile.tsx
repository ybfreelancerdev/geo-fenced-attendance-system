import React, { useCallback, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Keyboard,
} from "react-native";
import * as Yup from 'yup';
import { Formik } from 'formik';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as colors from "../styles/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useFocusEffect } from "@react-navigation/native";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import fonts from '../constants/fonts';
import { getProfile, updateProfile } from "../services/apiService";
import { showCustom } from "../services/MessageService";

const EditProfile = ({ navigation }: any) => {
    const formikRef = useRef<any>(null);
    const [loading, setLoading] = useState(false);
    const [initialValues, setinitialValues] = useState({ name: '', email: '', phone: '' });

    useFocusEffect(
        useCallback(() => {
            formikRef.current?.resetForm();
            fetchUserData();
        }, [])
    );

    const fetchUserData = async () => {
        try {
            let res = await getProfile();
            if (res && res.success) {
                setinitialValues({
                    email: res.data.email,
                    name: res.data.name,
                    phone: res.data.phone
                })
            }
        } catch (error: any) {
        }
    };

    const handleSave = async (values: any) => {
        Keyboard.dismiss();
        setLoading(true);
        try {
            let res = await updateProfile(
                {
                    name: values.name,
                    phone: values.phone
                });
            if (res && res.success) {
                showCustom(res.message);
                navigation.goBack();
            }
        } catch (error: any) {
        } finally {
            setLoading(false);
        }
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string().matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}$/, 'Invalid email format').required('Email is required'),
        phone: Yup.string()
            .matches(/^[0-9]{10,15}$/, 'Enter a valid phone number (10–15 digits)')
            .required('Phone is required'),
    });

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
                    <Text style={styles.header}>Edit Profile</Text>
                </View>
                <Formik
                    innerRef={formikRef}
                    enableReinitialize={true}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                        // Handle form submission
                        handleSave(values);
                    }}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, touched, errors, setFieldValue }) => (
                        <KeyboardAwareScrollView
                            contentContainerStyle={{ flexGrow: 1, marginTop: 10 }}
                        >
                            {/* Name */}
                            <View style={styles.inputboxContainer}>
                                <AppInput
                                    label="Name"
                                    value={values.name}
                                    onChangeText={handleChange("name")}
                                    onBlur={handleBlur("name")}
                                    placeholder="Enter your name"
                                    keyboardType="default"
                                    icon="person"
                                    error={errors.name}
                                    touched={touched.name}
                                />
                            </View>

                            {/* Phone */}
                            <View style={styles.inputboxContainer}>
                                <AppInput
                                    label="Phone"
                                    value={values.phone}
                                    onChangeText={handleChange("phone")}
                                    onBlur={handleBlur("phone")}
                                    placeholder="Enter your phone"
                                    keyboardType="numeric"
                                    maxLength={15}
                                    icon="phone"
                                    error={errors.phone}
                                    touched={touched.phone}
                                />
                            </View>

                            {/* Email (Disabled) */}
                            <View style={styles.inputboxContainer}>
                                <AppInput
                                    label="Email"
                                    value={values.email}
                                    onChangeText={handleChange("email")}
                                    onBlur={handleBlur("email")}
                                    placeholder="Enter your email"
                                    keyboardType="email-address"
                                    icon="email"
                                    editable={false}
                                    error={errors.email}
                                    touched={touched.email}
                                />
                            </View>

                            {/* Save Button */}
                            <View style={{ marginVertical: 15, marginHorizontal: 20 }}>
                                <AppButton
                                    title="Save Changes"
                                    onPress={handleSubmit}
                                    loading={loading}
                                />
                            </View>
                        </KeyboardAwareScrollView>
                    )}
                </Formik>
            </View>
        </SafeAreaView>
    );
};

export default EditProfile;

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

    inputboxContainer: {
        marginVertical: 10,
        marginHorizontal: 20
    },
});