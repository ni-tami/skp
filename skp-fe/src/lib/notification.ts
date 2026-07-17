import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export const GEOFENCE_CHANNEL_ID = 'geofence';

const RATE_LIMIT_WINDOW_MS = 30_000;
const RATE_LIMIT_MAX = 2;
const recentTimestamps: number[] = [];

function canSendNotification(): boolean {
  const now = Date.now();
  while (recentTimestamps.length > 0 && now - recentTimestamps[0] > RATE_LIMIT_WINDOW_MS) {
    recentTimestamps.shift();
  }
  if (recentTimestamps.length >= RATE_LIMIT_MAX) return false;
  recentTimestamps.push(now);
  return true;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function setupNotificationChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(GEOFENCE_CHANNEL_ID, {
    name: 'Location alerts',
    importance: Notifications.AndroidImportance.HIGH,
  });
}

export async function sendExitNotification(): Promise<void> {
  if (!canSendNotification()) return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've left the safe zone!",
      body: `You're now outside the safe zone.`,
      sound: true,
      ...(Platform.OS === 'android' && { channelId: GEOFENCE_CHANNEL_ID }),
    },
    trigger: null,
  });
}

export async function sendApproachingEdgeNotification(): Promise<void> {
  if (!canSendNotification()) return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Getting close to the edge",
      body: "You're nearing the edge of the safe zone.",
      sound: true,
      ...(Platform.OS === 'android' && { channelId: GEOFENCE_CHANNEL_ID }),
    },
    trigger: null,
  });
}

export async function sendEnterNotification(): Promise<void> {
  if (!canSendNotification()) return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You're back in the safe zone",
      body: "You're now inside the safe zone.",
      sound: true,
      ...(Platform.OS === 'android' && { channelId: GEOFENCE_CHANNEL_ID }),
    },
    trigger: null,
  });
}
