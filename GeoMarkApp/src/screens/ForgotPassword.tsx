import React, { useCallback, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, StatusBar } from 'react-native';
import * as colors from "../styles/colors";
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useFocusEffect } from '@react-navigation/native';
import { showCustom } from '../services/MessageService';
import { forgotPassword } from '../services/apiService';
import AppInput from '../components/AppInput';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppButton from '../components/AppButton';
import Fonts from '../constants/fonts';

const ForgotPassword = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const formikRef = useRef<any>(null);

  // Load saved credentials when component mounts
  useFocusEffect(
    useCallback(() => {
      formikRef.current?.resetForm();
    }, [])
  );

  const initialValues = {
    email: ''
  };

  const fieldRefs = Object.keys(initialValues).reduce((acc: any, key) => {
    acc[key] = React.createRef<TextInput>();
    return acc;
  }, {} as Record<string, React.RefObject<TextInput>>);

  // Validation schema with Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}$/, 'Invalid email format')
      .required('Email is required'),
  });

  const forgotPasswordHandler = async (values: any) => {
    // Handle form submission
    Keyboard.dismiss();
    setLoading(true);
    try {
      let res = await forgotPassword(
        {
          'email': values.email,
        });
      if (res && res.success) {
        navigation.navigate('OtpVerification', {
          email: values.email,
          from: 'FORGOTPWD'
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
          <Text style={styles.header}>Forgot Password</Text>
        </View>

          <Formik
            innerRef={formikRef}
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              // Handle form submission
              forgotPasswordHandler(values);
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, touched, errors, setFieldValue }) => (
              <KeyboardAwareScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps="handled">
                <View style={styles.content}>
                  <View style={styles.InputContainer}>
                    <AppInput
                      label="Email"
                      value={values.email}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      placeholder="Email"
                      keyboardType="email-address"
                      icon="email"
                      error={errors.email}
                      touched={touched.email}
                    />
                  </View>
                  <AppButton
                    title="Submit"
                    style={{marginVertical: 15}}
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

export default ForgotPassword;

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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
    marginHorizontal: 20,
  },
  InputContainer: {
    width: '100%',
    marginVertical: 15,
  },
});
