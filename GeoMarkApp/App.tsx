import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { CustomToast } from './src/services/CustomToast';
import { Provider } from 'react-redux';
import store from './src/store';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <Provider store={store}>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
        </Provider>
        <Toast
          config={{
            custom: (props) => <CustomToast {...props} />,
          }} />
    </GestureHandlerRootView>
  );
}