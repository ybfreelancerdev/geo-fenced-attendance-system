import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid, Platform } from "react-native";

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS === "android") {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    return true;
  }

  const authStatus = await messaging().requestPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
};