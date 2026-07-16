import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { sendExitNotification } from '@/lib/notification';

export const SAFE_ZONE_GEOFENCE_TASK = 'safe-zone-geofence-task';

TaskManager.defineTask(SAFE_ZONE_GEOFENCE_TASK, async ({ data, error }) => {
  if (error) {
    console.warn('Geofencing task error', error);
    return;
  }

  const { eventType } = data as { eventType: Location.GeofencingEventType };
  if (eventType === Location.GeofencingEventType.Exit) {
    await sendExitNotification();
  }
});

export async function startSafeZoneGeofencing(
  region: { latitude: number; longitude: number },
  radius: number,
): Promise<void> {
  await Location.startGeofencingAsync(SAFE_ZONE_GEOFENCE_TASK, [
    {
      identifier: 'safe-zone',
      latitude: region.latitude,
      longitude: region.longitude,
      radius,
      notifyOnEnter: true,
      notifyOnExit: true,
    },
  ]);
}

export async function stopSafeZoneGeofencing(): Promise<void> {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(
    SAFE_ZONE_GEOFENCE_TASK,
  );
  if (!isRegistered) return;
  await Location.stopGeofencingAsync(SAFE_ZONE_GEOFENCE_TASK);
}
