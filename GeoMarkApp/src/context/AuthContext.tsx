import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { roleSessionKey, tokenSessionKey } from '../constants';
import { useDispatch } from 'react-redux';
import { sessionLogin, sessionLogout } from '../store/authSlice';
import { stopGeolocation } from '../services/geolocationService';
import { disablePushNotifications } from '../services/fcmService';
import messaging from "@react-native-firebase/messaging";
import { removefcmToken } from '../services/apiService';

export const AuthContext = createContext({});
let externalLogout: () => void = () => {};

export const AuthProvider: React.FC = ({ children }: any) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // default false
  const [loading, setLoading] = useState<boolean>(true); // show loading while checking
  const dispatch = useDispatch();

  const login = async(token:any) => {
    try {
      await AsyncStorage.setItem(tokenSessionKey, token);
      dispatch(sessionLogin(token));
      setIsLoggedIn(true);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const logout = async () => {
    const storedRole = await AsyncStorage.getItem(roleSessionKey);
    const token = await messaging().getToken();
    if(storedRole === 'User') await removefcmToken({fcmToken: token});
    await stopGeolocation();
    await disablePushNotifications();
    await AsyncStorage.removeItem(tokenSessionKey);
    await AsyncStorage.removeItem(roleSessionKey);
    dispatch(sessionLogout());
    setIsLoggedIn(false);
    return true;
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Simulate async auth check
        const token = await AsyncStorage.getItem(tokenSessionKey);
        setIsLoggedIn(!!token);
        if(token) {
          dispatch(sessionLogin(token));
        }
      } catch (e) {
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

  externalLogout = logout;

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, loading  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
export const getLogout = () => externalLogout;
