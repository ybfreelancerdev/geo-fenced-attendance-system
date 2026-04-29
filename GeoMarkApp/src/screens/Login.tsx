import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Keyboard, Image, Dimensions, StatusBar } from 'react-native';
import Loader from '../components/Loader';
import * as colors from '../styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { _LOGO, roleSessionKey } from '../constants';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useFocusEffect } from '@react-navigation/native';
import { showCustom } from '../services/MessageService';
import { userLogin } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppInput from '../components/AppInput';
import fonts from '../constants/fonts';
import AppButton from '../components/AppButton';

export default function Login({ navigation }: any) {
  const { login, logout, isLoggedIn }: any = useAuth();
  const [loading, setLoading] = useState(false);
  const formikRef = useRef<any>(null);
  const scrollRef = useRef<KeyboardAwareScrollView>(null);

  // Load saved credentials when component mounts
  useFocusEffect(
    useCallback(() => {
      formikRef.current?.resetForm();
    }, [])
  );

  const initialValues = {
    email: '',
    password: '',
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

    password: Yup.string()
      .min(6, 'Password must be at least 6 digits')
      .required('Password is required')
  });

  const loginHandler = async (values: any) => {
    // Handle form submission
    Keyboard.dismiss();
    setLoading(true);
    try {
      let res = await userLogin(
        {
          'email': values.email,
          'password': values.password,
        });
      if (res && res.success) {
        await AsyncStorage.setItem(roleSessionKey, res.data.role);
        login(res.data.token);
      } else {
        logout();
        showCustom(res.message);
      }
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{flex:1, backgroundColor: '#fff'}}>
      <StatusBar barStyle={"dark-content"} />
      <View style={styles.imgBack}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Formik
            innerRef={formikRef}
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              // Handle form submission
              loginHandler(values);
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values, touched, errors, setFieldValue }) => (
              <KeyboardAwareScrollView
                ref={scrollRef}
                contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}
                keyboardShouldPersistTaps="handled"
                extraScrollHeight={0}
                enableOnAndroid>
                <View style={{ flexDirection: 'row' }}>
                  <Image style={{ height: '200' }} source={_LOGO} resizeMode='contain' />
                </View>
                <View style={styles.loginContainer}>
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

                  <AppButton
                    title="Login"
                    style={{marginVertical: 15}}
                    onPress={handleSubmit}
                    loading={loading}
                  />
                  <TouchableOpacity activeOpacity={0.5} style={{ marginTop: 40 }}
                    onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={styles.forgot_password_text}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAwareScrollView>
            )}
          </Formik>
          <View style={styles.btnContainer}>
            <AppButton
              title="Create Account"
              style={{marginVertical: 15}}
              onPress={() => navigation.navigate('Register')}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imgBack: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff'
  },
  loginContainer: {
    width: '100%',
    // marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 20
  },
  InputContainer: {
    width: '100%',
    marginVertical: 10,
  },
  forgot_password_text: {
    color: colors.APP_COLOR,
    fontFamily: fonts.name.semibold,
    fontSize: fonts.size._15px,
    textDecorationLine: 'underline'
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'center',
    bottom: 0,
    flex: 1,
    width: '100%',
    paddingHorizontal: 20
  },
});
