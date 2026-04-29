import React, { useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Keyboard, StatusBar } from 'react-native';
import * as colors from "../styles/colors";
import * as Yup from 'yup';
import { Formik } from 'formik';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { createAccount } from '../services/apiService';
import { showCustom } from '../services/MessageService';
import fonts from '../constants/fonts';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';

const Registration = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const formikRef = useRef<any>(null);

  // Load saved credentials when component mounts
  useFocusEffect(
    useCallback(() => {
      formikRef.current?.resetForm();
    }, [])
  );

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  };

  // Validation schema with Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}$/, 'Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 digits').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords not matched')
      .required('Confirm Password is required'),
    phone: Yup.string()
      .matches(/^[0-9]{10,15}$/, 'Enter a valid phone number (10–15 digits)')
      .required('Phone is required'),
  });

  const registerHandler = async (values: any) => {
    Keyboard.dismiss();
    setLoading(true);
    // Handle form submission
    try {
      let res = await createAccount(
        {
          'name': values.name,
          'phone': values.phone,
          'email': values.email,
          'password': values.password
        });
      if (res && res.success) {
        navigation.navigate('OtpVerification', {
          email: values.email,
        });
      } else {
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
          <Text style={styles.header}>Register</Text>
        </View>
        <Formik
          innerRef={formikRef}
          enableReinitialize={true}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            // Handle form submission
            registerHandler(values);
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, touched, errors, setFieldValue }) => (
            <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View style={styles.content}>
                <View style={styles.InputContainer}>
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

                <View style={styles.InputContainer}>
                  <AppInput
                    label="Email"
                    value={values.email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    icon="email"
                    error={errors.email}
                    touched={touched.email}
                  />
                </View>

                <View style={styles.InputContainer}>
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

                <View style={styles.InputContainer}>
                  <AppInput
                    label="Password"
                    value={values.password}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                    placeholder="Enter password"
                    secureTextEntry
                    icon="lock"
                    error={errors.password}
                    touched={touched.password}
                  />
                </View>

                <View style={styles.InputContainer}>
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

                <AppButton
                  title="Submit"
                  style={{ marginVertical: 15 }}
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

export default Registration;

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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
    marginHorizontal: 20,
  },
  InputContainer: {
    width: '100%',
    marginVertical: 10,
  },
});
