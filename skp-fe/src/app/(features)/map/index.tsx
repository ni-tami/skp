import { Alert, Pressable, Switch, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StyledText from '@/components/ui/StyledText';
import {
  Camera,
  FillLayer,
  LineLayer,
  LocationPuck,
  MapView,
  ShapeSource,
  UserLocation,
} from '@rnmapbox/maps';
import { useEffect, useMemo, useRef } from 'react';
import circle from '@turf/circle';
import { useLocationStore } from '@/stores/location-store';
import { Link } from 'expo-router';
import { requestGeofencePermissions, ensureNotificationPermission } from '@/lib/permission';
import { startSafeZoneGeofencing, stopSafeZoneGeofencing } from '@/lib/geofence-task';

async function ensureMonitoringPermissions(): Promise<boolean> {
  const permissions = await requestGeofencePermissions();

  if (!permissions.foreground) {
    Alert.alert("Permission needed", "Location access is required to monitor safe zone.");
    return false;
  }
  if (!permissions.background) {
    Alert.alert(
      "Background access needed",
      "Choose \"Always Allow\" in Settings so monitoring still works when the app is closed."
    );
    return false;
  }
  if (!(await ensureNotificationPermission())) {
    Alert.alert("Notifications disabled", "Enable notifications to get safe zone alert.");
    return false;
  }

  return true;
}

export default function MapScreen() {
  const currentPosition = useLocationStore((state) => state.currentPosition);
  const setCurrentPosition = useLocationStore(
    (state) => state.setCurrentPosition,
  );
  const target = useLocationStore((state) => state.targetLocation);
  const radius = useLocationStore((state) => state.radius);
  const monitoring = useLocationStore((state) => state.monitoring);
  const setMonitoring = useLocationStore((state) => state.setMonitoring);

  const handleToggleMonitoring = async (value: boolean) => {
    if (!value) {
      await stopSafeZoneGeofencing();
      setMonitoring(false);
      return;
    }

    if (!target || !radius) {
      Alert.alert("No safe zone set", "Set a safe zone before enabling monitoring.");
      return;
    }

    const granted = await ensureMonitoringPermissions().catch(() => false);
    setMonitoring(granted);
  };

  useEffect(() => {
    if (!monitoring || !target) return;
    startSafeZoneGeofencing(target, radius);
  }, [monitoring, target, radius]);

  const cameraRef = useRef<Camera>(null);

  const displayPosition = target ?? currentPosition;

  const safeZoneCircle = useMemo(() => {
    if (!target) return null;
    return circle([target.longitude, target.latitude], radius, {
      units: 'meters',
      steps: 64,
    });
  }, [target, radius]);

  const goToCurrentLocation = () => {
    if (!currentPosition) return;
    cameraRef.current?.setCamera({
      centerCoordinate: [currentPosition.longitude, currentPosition.latitude],
      zoomLevel: 17,
      animationDuration: 300,
    });
  };

  return (
    <View className='flex-1 bg-[#F6F6F6] p-6'>
      <View className='flex flex-col gap-2 w-full h-[50rem]'>
        <StyledText size={24} type={'title'} className='my-4'>
          Track Your Location
        </StyledText>
        <StyledText size={18} type={'title'}>
          Safe Zone
        </StyledText>
        <View className='flex-1 flex-col w-full'>
          <View className='flex-1 relative'>
            <MapView className='flex-1 rounded-t-xl overflow-hidden'>
              <Camera
                ref={cameraRef}
                defaultSettings={{ zoomLevel: 17 }}
                zoomLevel={17}
                animationDuration={300}
                centerCoordinate={
                  displayPosition
                    ? [displayPosition.longitude, displayPosition.latitude]
                    : undefined
                }
              />
              <UserLocation
                visible={false}
                onUpdate={(location) =>
                  setCurrentPosition({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  })
                }
              />
              <LocationPuck
                puckBearingEnabled
                puckBearing='heading'
                pulsing='default'
              />
              {safeZoneCircle && (
                <ShapeSource id='safeZoneSource' shape={safeZoneCircle}>
                  <FillLayer
                    id='safeZoneFill'
                    style={{ fillColor: '#208AEF', fillOpacity: 0.2 }}
                  />
                  <LineLayer
                    id='safeZoneOutline'
                    style={{ lineColor: '#208AEF', lineWidth: 2 }}
                  />
                </ShapeSource>
              )}
            </MapView>
            <Pressable
              onPress={goToCurrentLocation}
              className='absolute bottom-4 right-4 items-center justify-center rounded-full bg-white w-11 h-11 shadow'
            >
              <Ionicons name='locate' size={22} color='#208AEF' />
            </Pressable>
          </View>
          <Link href='/map/viewer'>
            <View className='flex flex-row items-center justify-between rounded-b-xl bg-white w-full px-4 py-6'>
              <StyledText size={16} className='font-semibold'>
                You are still in the safe zone
              </StyledText>
              <Ionicons
                name={'chevron-forward-outline'}
                size={20}
                color='#242424'
              />
            </View>
          </Link>
        </View>
        <Link href='/map/picker'>
          <View className='flex justify-between flex-row items-center rounded-xl bg-white w-full p-4'>
            <View className={'flex flex-row gap-2 items-center'}>
              <View className='w-[30px] h-[30px] items-center justify-center rounded-full bg-[#F2F7EB]'>
                <Ionicons name={'location-sharp'} size={20} color='#71975D' />
              </View>
              <StyledText size={16} className='font-semibold'>
                Set your safe zone
              </StyledText>
            </View>
            <Ionicons
              name={'chevron-forward-outline'}
              size={20}
              color='#242424'
            />
          </View>
        </Link>
        {target && radius && (
          <View className='flex flex-row items-center justify-start mt-2'>
            <StyledText size={16} className='font-semibold'>
              Notify me within {radius}m
            </StyledText>
            <Switch value={monitoring} onValueChange={handleToggleMonitoring} />
          </View>
        )}
      </View>
    </View>
  );
}
