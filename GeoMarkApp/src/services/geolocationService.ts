import BackgroundGeolocation, {
  GeofenceEvent,
  State,
  Config,
} from "react-native-background-geolocation";
import { markAttendance } from "./apiService";
import { showCustom } from "./MessageService";

let isInitialized = false;
let triggeredEvents: Record<string, boolean> = {}; // prevent duplicate calls

export const initGeolocation = async (): Promise<void> => {
  if (isInitialized) return;

  // Geofence Event Listener
  BackgroundGeolocation.onGeofence(async (event: GeofenceEvent) => {
    console.log("📍 Geofence event:", event);

    if (event.action === "ENTER") {
      const eventId = event?.extras?.eventId;

      if (!eventId) return;

      // Prevent duplicate API calls
      if (triggeredEvents[eventId]) {
        console.log("⚠️ Already triggered for event:", eventId);
        return;
      }

      triggeredEvents[eventId] = true;

      try {
        const res = await markAttendance(eventId);

        if (res && res?.success) {
          showCustom("Attendance Marked");
          // 🧹 Remove geofence after success
          await BackgroundGeolocation.removeGeofence(event.identifier);
        } else {
          console.log("⚠️ API failed:", res?.message);
        }
      } catch (error) {
        console.log("❌ Attendance error:", error);
      }
    }
  });

  const config: Config = {
    geolocation: {
      desiredAccuracy: BackgroundGeolocation.DesiredAccuracy.High,
      distanceFilter: 10,
      showsBackgroundLocationIndicator: true,
      pausesLocationUpdatesAutomatically: false,
    },
    app: {
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true
    },
    logger: {
      debug: true,
      logLevel: BackgroundGeolocation.LogLevel.Verbose,
    }
  };

  const state: State = await BackgroundGeolocation.ready(config);

  console.log("✅ BG Geo Ready:", state.enabled);

  if (!state.enabled) {
    await BackgroundGeolocation.start();
  }

  isInitialized = true;
};

export const addGeofence = async ({
  eventId,
  latitude,
  longitude,
  radius
}:any): Promise<void> => {
  await BackgroundGeolocation.addGeofence({
    identifier: `event-${eventId}`,
    radius: radius,
    latitude: latitude,
    longitude: longitude,

    notifyOnEntry: true,
    notifyOnExit: false,

    extras: {
      type: "attendance",
      eventId: eventId
    },
  });

  console.log("✅ Geofence added");
};

export const stopGeolocation = async (): Promise<void> => {
  try {
    // Remove all geofences
    await BackgroundGeolocation.removeGeofences();

    // Stop tracking
    await BackgroundGeolocation.stop();

    console.log("Geolocation stopped & geofences removed");
  } catch (error) {
    console.log("Error stopping geolocation:", error);
  }
};