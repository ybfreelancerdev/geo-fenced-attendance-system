import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AppTabs from './AppTabs';
import EventDetails from '../screens/EventDetails';
import ContactUs from '../screens/ContactUs';
import EditProfile from '../screens/EditProfile';
import ChangePassword from '../screens/ChangePassword';
import PrivacyPolicy from '../screens/PrivacyPolicy';
import DeleteAccount from '../screens/DeleteAccount';
import CreateEvent from '../screens/CreateEvent';
import UserDetails from '../screens/UserDetails';
import ManageContact from '../screens/ManageContact';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator
      initialRouteName="Main">
      <Stack.Screen name="Main" component={AppTabs} options={{ headerShown: false }}/>
      <Stack.Screen name="EventDetails" component={EventDetails} options={{ headerShown: false }}/>
      <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }}/>
      <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false }}/>
      <Stack.Screen name="DeleteAccount" component={DeleteAccount} options={{ headerShown: false }}/>
      <Stack.Screen name="ContactUs" component={ContactUs} options={{ headerShown: false }}/>
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{ headerShown: false }}/>
      <Stack.Screen name="CreateEvent" component={CreateEvent} options={{ headerShown: false }}/>
      <Stack.Screen name="UserDetails" component={UserDetails} options={{ headerShown: false }}/>
      <Stack.Screen name="ManageContact" component={ManageContact} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}
