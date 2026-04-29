import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, StatusBar } from 'react-native';
import * as colors from "../styles/colors";
import { showCustom } from '../services/MessageService';
import { resetPassword } from '../services/apiService';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as Yup from 'yup';
import { Formik } from 'formik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import fonts from '../constants/fonts';

const ResetPassword = ({ navigation, route }: any) => {
  const { email } = route.params;
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const formikRef = useRef<any>(null);

  const initialValues = {
    password: '',
    confirmPassword: '',
  };

  // Validation schema with Yup
  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, 'Password must be at least 6 digits')
      .required('Password is required'),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords not matched')
      .required('Confirm Password is required'),
  });

  const newPasswordHandler = async (values: any) => {
    setLoading(true);
    // Handle form submission
    Keyboard.dismiss();
    try {
      let res = await resetPassword(
        {
          'email': email,
          'newPassword': values.password
        });
      if (res && res.success) {
        showCustom(res.message);
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
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
          <Text style={styles.header}>Reset Password</Text>
        </View>
        <Formik
          innerRef={formikRef}
          enableReinitialize={true}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            // Handle form submission
            newPasswordHandler(values);
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, touched, errors, setFieldValue }) => (
            <KeyboardAwareScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
              <View style={styles.content}>
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
                <TouchableOpacity activeOpacity={0.5} style={{ marginTop: 40 }}
                  onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Login' }] })}>
                  <Text style={styles.BacktoLogin_text}>Back to Login?</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAwareScrollView>
          )}
        </Formik>
      </View>
    </SafeAreaView>
  );
};

export default ResetPassword;

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
  BacktoLogin_text: {
    color: colors.APP_COLOR,
    fontFamily: fonts.name.semibold,
    fontSize: fonts.size._15px,
    textDecorationLine: 'underline'
  },
});
