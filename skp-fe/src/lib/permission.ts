import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

export async function requestForegroundLocationPermission(): Promise<boolean> {
  const result = await Location.requestForegroundPermissionsAsync();
  return result.granted;
}

export async function requestGeofencePermissions(): Promise<{
  foreground: boolean;
  background: boolean;
}> {
  const foregroundResult = await Location.requestForegroundPermissionsAsync();
  if (!foregroundResult.granted) {
    return { foreground: false, background: false };
  }

  const backgroundResult = await Location.requestBackgroundPermissionsAsync();
  return { foreground: true, background: backgroundResult.granted };
}

export async function ensureNotificationPermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  const requested = await Notifications.requestPermissionsAsync();
  if (!requested.granted) return false;

  return true;
}
