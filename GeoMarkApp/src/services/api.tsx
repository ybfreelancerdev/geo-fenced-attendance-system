// src/services/api.js
import axios from 'axios';
import store from '../store'; // your redux store
import { sessionLogout } from '../store/authSlice'; // action to log out user
import { Alert } from 'react-native';
import { getLogout } from '../context/AuthContext';

const api = axios.create({
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for attaching token
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for handling 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Alert.alert('Session expired', 'Please log in again.');
      // store.dispatch(sessionLogout());
      getLogout()();
    }
    return Promise.reject(error);
  }
);

export default api;
