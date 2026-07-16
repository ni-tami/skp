import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import {
  sendApproachingEdgeNotification,
  sendExitNotification,
} from '@/lib/notification';

export const SAFE_ZONE_GEOFENCE_TASK = 'safe-zone-geofence-task';

const SAFE_ZONE_REGION_ID = 'safe-zone';
const WARNING_REGION_ID = 'safe-zone-warning';

const MAX_WARNING_BUFFER_METERS = 30;
const WARNING_BUFFER_FRACTION = 0.5;

TaskManager.defineTask(SAFE_ZONE_GEOFENCE_TASK, async ({ data, error }) => {
  if (error) {
    console.warn('Geofencing task error', error);
    return;
  }

  const { eventType, region } = data as {
    eventType: Location.GeofencingEventType;
    region: Location.LocationRegion;
  };

  if (eventType !== Location.GeofencingEventType.Exit) return;

  if (region.identifier === WARNING_REGION_ID) {
    await sendApproachingEdgeNotification();
  } else if (region.identifier === SAFE_ZONE_REGION_ID) {
    await sendExitNotification();
  }
});

export async function startSafeZoneGeofencing(
  region: { latitude: number; longitude: number },
  radius: number,
): Promise<void> {
  const regions: Location.LocationRegion[] = [
    {
      identifier: SAFE_ZONE_REGION_ID,
      latitude: region.latitude,
      longitude: region.longitude,
      radius,
      notifyOnEnter: true,
      notifyOnExit: true,
    },
  ];

  const warningBuffer = Math.min(
    MAX_WARNING_BUFFER_METERS,
    radius * WARNING_BUFFER_FRACTION,
  );
  const warningRadius = radius - warningBuffer;
  if (warningRadius > 0) {
    regions.push({
      identifier: WARNING_REGION_ID,
      latitude: region.latitude,
      longitude: region.longitude,
      radius: warningRadius,
      notifyOnEnter: false,
      notifyOnExit: true,
    });
  }

  await Location.startGeofencingAsync(SAFE_ZONE_GEOFENCE_TASK, regions);
}

export async function stopSafeZoneGeofencing(): Promise<void> {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(
    SAFE_ZONE_GEOFENCE_TASK,
  );
  if (!isRegistered) return;
  await Location.stopGeofencingAsync(SAFE_ZONE_GEOFENCE_TASK);
}
