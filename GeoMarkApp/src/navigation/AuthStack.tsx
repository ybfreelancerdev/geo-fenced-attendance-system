import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/Login';
import ForgotPassword from '../screens/ForgotPassword';
import OtpVerification from '../screens/OtpVerification';
import ResetPassword from '../screens/ResetPassword';
import Registration from '../screens/Registration';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="OtpVerification" component={OtpVerification} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
      <Stack.Screen name="Register" component={Registration} />
    </Stack.Navigator>
  );
}
