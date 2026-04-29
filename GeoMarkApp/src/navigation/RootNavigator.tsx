import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import { AuthContext } from '../context/AuthContext';
import Loading from '../components/Loading';
import { Provider } from 'react-redux';
import store from '../store';

export default function RootNavigator() {
  const { isLoggedIn, loading }:any = useContext(AuthContext);

  if(loading) {
    return <Loading />; // Show loading spinner while checking login status
  }
  
  return (
    <Provider store={store}>
      <NavigationContainer>
        {isLoggedIn ? <AppStack /> : <AuthStack />}
      </NavigationContainer>
    </Provider>
  );
}
