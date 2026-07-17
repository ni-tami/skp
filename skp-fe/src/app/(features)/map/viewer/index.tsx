import { View, Pressable } from 'react-native';
import { useMemo, useRef } from 'react';
import { router, Stack } from 'expo-router';
import {
  Camera,
  FillLayer,
  LineLayer,
  LocationPuck,
  MapView,
  ShapeSource,
  UserLocation,
} from '@rnmapbox/maps';
import circle from '@turf/circle';
import { useLocationStore } from '@/stores/location-store';
import { Ionicons } from '@expo/vector-icons';

export default function MapViewer() {
  const currentPosition = useLocationStore((state) => state.currentPosition);
  const setCurrentPosition = useLocationStore(
    (state) => state.setCurrentPosition,
  );
  const target = useLocationStore((state) => state.targetLocation);
  const radius = useLocationStore((state) => state.radius);

  const cameraRef = useRef<Camera>(null);

  const hasSafeZone = !!target && !!radius;
  const displayPosition = hasSafeZone ? target : currentPosition;

  const safeZoneCircle = useMemo(() => {
    if (!hasSafeZone) return null;
    return circle([target!.longitude, target!.latitude], radius, {
      units: 'meters',
      steps: 64,
    });
  }, [hasSafeZone, target, radius]);

  const goToDisplayPosition = () => {
    if (!displayPosition) return;
    cameraRef.current?.setCamera({
      centerCoordinate: [displayPosition.longitude, displayPosition.latitude],
      zoomLevel: 17,
      animationDuration: 300,
    });
  };

  return (
    <View className='flex-1 relative'>
      <Stack.Screen options={{ headerShown: false }} />
      <MapView className='flex w-full h-full'>
        <Camera
          ref={cameraRef}
          defaultSettings={{
            zoomLevel: 17,
            centerCoordinate: displayPosition
              ? [displayPosition.longitude, displayPosition.latitude]
              : undefined,
          }}
          animationDuration={300}
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
        onPress={goToDisplayPosition}
        className='absolute bottom-[5rem] right-8 items-center justify-center rounded-full bg-white w-11 h-11 shadow'
      >
        <Ionicons name='locate' size={22} color='#007FFF' />
      </Pressable>
      <View className='absolute top-[5rem] left-8'>
        <Pressable
          onPress={() => {
            router.back();
          }}
          className='w-[35px] h-[35px] items-center justify-center rounded-full bg-white shadow-lg'
        >
          <Ionicons name={'chevron-back-sharp'} size={16} color='#1E2430' />
        </Pressable>
      </View>
    </View>
  );
}
