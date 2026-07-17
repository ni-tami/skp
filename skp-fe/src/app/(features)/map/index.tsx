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
import distance from '@turf/distance';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocationStore } from '@/stores/location-store';
import { Link } from 'expo-router';
import { requestGeofencePermissions, ensureNotificationPermission } from '@/lib/permission';
import { startSafeZoneGeofencing, stopSafeZoneGeofencing } from '@/lib/geofence-task';
import { useAuthStore } from '@/stores/auth-store';

const RECIPIENT_NAME_PLACEHOLDER = 'Recipient';

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

  const role = useAuthStore((state) => state.user?.role);
  const safeZoneSubject =
    role === 'caregiver' ? RECIPIENT_NAME_PLACEHOLDER : 'You';
  const safeZoneVerb = role === 'caregiver' ? 'is' : 'are';
  const safeZonePossessive = role === 'caregiver' ? 'their' : 'your';

  console.log('role', role);
  

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

  const isOutsideSafeZone = useMemo(() => {
    if (!target || !currentPosition) return false;
    const distanceFromTarget = distance(
      [currentPosition.longitude, currentPosition.latitude],
      [target.longitude, target.latitude],
      { units: 'meters' },
    );
    return distanceFromTarget > radius;
  }, [target, currentPosition, radius]);

  const goToCurrentLocation = () => {
    if (!currentPosition) return;
    cameraRef.current?.setCamera({
      centerCoordinate: [currentPosition.longitude, currentPosition.latitude],
      zoomLevel: 17,
      animationDuration: 300,
    });
  };

  return (
    <View className='flex-1 bg-cloud'>
      <SafeAreaView edges={['top']} className='bg-brand rounded-b-[2.8rem] px-6 pb-10 pt-4 h-52'>
        <View className='absolute bottom-8 px-8'>
          <StyledText size={24} type={'title'} className='text-white'>
            Track Your Location
          </StyledText>
          <StyledText size={14} className='text-white/80 mt-1'>
            Stay updated on {safeZonePossessive} safe zone status
          </StyledText>
        </View>
      </SafeAreaView>
      <View className='flex flex-col gap-2 w-full h-[50rem] p-6 mt-4'>
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
                    style={{ fillColor: '#007FFF', fillOpacity: 0.2 }}
                  />
                  <LineLayer
                    id='safeZoneOutline'
                    style={{ lineColor: '#007FFF', lineWidth: 2 }}
                  />
                </ShapeSource>
              )}
            </MapView>
            <Pressable
              onPress={goToCurrentLocation}
              className='absolute bottom-4 right-4 items-center justify-center rounded-full bg-white w-11 h-11 shadow'
            >
              <Ionicons name='locate' size={22} color='#007FFF' />
            </Pressable>
          </View>
          <Link href='/map/viewer'>
            <View className='flex flex-row items-center justify-between rounded-b-xl bg-white w-full px-4 py-6'>
              <View className='flex flex-row items-center gap-2'>
                {isOutsideSafeZone && (
                  <View className='w-[24px] h-[24px] items-center justify-center rounded-full bg-danger-tint'>
                    <Ionicons name='warning' size={14} color='#D62828' />
                  </View>
                )}
                <StyledText size={16} className='font-semibold'>
                  {isOutsideSafeZone
                    ? `${safeZoneSubject} ${safeZoneVerb} outside the safe zone`
                    : `${safeZoneSubject} ${safeZoneVerb} still in the safe zone`}
                </StyledText>
              </View>
              <Ionicons
                name={'chevron-forward-outline'}
                size={20}
                color='#1E2430'
              />
            </View>
          </Link>
        </View>
        {role === 'caregiver' && (
          <Link href='/map/picker'>
            <View className='flex justify-between flex-row items-center rounded-xl bg-white w-full p-4'>
              <View className={'flex flex-row gap-2 items-center'}>
                <View className='w-[30px] h-[30px] items-center justify-center rounded-full bg-brand-tint'>
                  <Ionicons name={'location-sharp'} size={20} color='#007FFF' />
                </View>
                <StyledText size={16} className='font-semibold'>
                  Set safe zone
                </StyledText>
              </View>
              <Ionicons
                name={'chevron-forward-outline'}
                size={20}
                color='#1E2430'
              />
            </View>
          </Link>
        )}
        {target && radius && (
          <View className='flex flex-row items-center justify-end mt-2'>
            <StyledText size={16} className='font-semibold'>
              Notify me within {radius}m
            </StyledText>
            <Switch
              value={monitoring}
              onValueChange={handleToggleMonitoring}
              trackColor={{ false: '#DCE1E8', true: '#007FFF' }}
              thumbColor='#FFFFFF'
              ios_backgroundColor='#DCE1E8'
            />
          </View>
        )}
      </View>
    </View>
  );
}
