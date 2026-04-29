import messaging from "@react-native-firebase/messaging";
import notifee, { AndroidImportance } from "@notifee/react-native";

export const getFcmToken = async (): Promise<string | null> => {
  const token = await messaging().getToken();
  console.log("FCM Token:", token);
  return token;
};

// Create Notification Channel (Android)
const createChannel = async () => {
  await notifee.createChannel({
    id: "default",
    name: "Default Channel",
    importance: AndroidImportance.HIGH,
  });
};

// Show Local Notification
export const showLocalNotification = async (remoteMessage: any) => {
  await createChannel();

  await notifee.displayNotification({
    title: remoteMessage.notification?.title || "Notification",
    body: remoteMessage.notification?.body || "",
    android: {
      channelId: "default",
      smallIcon: "ic_launcher", // ⚠️ make sure this exists
      pressAction: {
        id: "default",
      },
    },
  });
};

// Foreground Listener
export const listenToNotifications = () => {
  messaging().onMessage(async remoteMessage => {
    console.log("Notification received:", remoteMessage);

    // Show notification instead of Alert
    await showLocalNotification(remoteMessage);
  });
};

export const disablePushNotifications = async () => {
  try {
    // Delete FCM token
    await messaging().deleteToken();

    console.log("Push notifications disabled");
  } catch (error) {
    console.log("Push disable error:", error);
  }
};