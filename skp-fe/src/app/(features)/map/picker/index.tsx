import { View, Pressable, Alert } from 'react-native';
import { useMemo, useRef, useState } from 'react';
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
import Slider from '@react-native-community/slider';
import {
  MAX_SAFE_ZONE_RADIUS,
  MIN_SAFE_ZONE_RADIUS,
  useLocationStore,
} from '@/stores/location-store';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/ui/Button';
import StyledText from '@/components/ui/StyledText';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { setGeofenceMutationOpt } from '@/services/queryOptions/locationQueryOpt';
import { connectionQueryOpt } from '@/services/queryOptions/connectQueryOpt';

interface LocationStepProps {
  pickedName: string;
  pickedAddress: string;
  pickedCoordinate: unknown;
  onContinue: () => void;
}

function LocationStep({
  pickedName,
  pickedAddress,
  pickedCoordinate,
  onContinue,
}: LocationStepProps) {
  return (
    <>
      <StyledText size={18} type='title'>
        {pickedName}
      </StyledText>
      <StyledText size={12} className='text-slate mb-4'>
        {pickedAddress}
      </StyledText>
      <Button
        onPress={onContinue}
        disabled={!pickedCoordinate}
        className='rounded-xl p-4 items-center'
        block
      >
        <StyledText size={16} type='title' className='text-white'>
          Set target location
        </StyledText>
      </Button>
    </>
  );
}

interface RadiusStepProps {
  radius: number;
  setRadius: (radius: number) => void;
  pickedCoordinate: unknown;
  onConfirm: () => void;
}

function RadiusStep({
  radius,
  setRadius,
  pickedCoordinate,
  onConfirm,
}: RadiusStepProps) {
  return (
    <>
      <StyledText size={18} type='title'>
        Set safe zone radius
      </StyledText>
      <View className='flex flex-row items-center justify-between mb-4'>
        <StyledText size={14} className='font-semibold'>
          Safe zone radius
        </StyledText>
        <StyledText size={14} className='text-brand font-semibold'>
          {Math.round(radius)} m
        </StyledText>
      </View>
      <Slider
        minimumValue={MIN_SAFE_ZONE_RADIUS}
        maximumValue={MAX_SAFE_ZONE_RADIUS}
        step={5}
        value={radius}
        onValueChange={setRadius}
        minimumTrackTintColor='#007FFF'
        maximumTrackTintColor='#DCE1E8'
        thumbTintColor='#007FFF'
      />
      <Button
        onPress={onConfirm}
        disabled={!pickedCoordinate}
        className='rounded-xl p-4 items-center mt-4'
        block
      >
        <StyledText size={16} type='title' className='text-white'>
          Confirm safe zone
        </StyledText>
      </Button>
    </>
  );
}

export default function MapPicker() {
  const currentPosition = useLocationStore((state) => state.currentPosition);
  const setCurrentPosition = useLocationStore(
    (state) => state.setCurrentPosition,
  );
  const setTargetLocation = useLocationStore((state) => state.setTargetLocation);
  const target = useLocationStore((state) => state.targetLocation);
  const radius = useLocationStore((state) => state.radius);
  const setRadius = useLocationStore((state) => state.setRadius);

  const cameraRef = useRef<Camera>(null);
  const mapRef = useRef<MapView>(null);
  const settleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const initialCenter = target ?? currentPosition;
  const [pickedCoordinate, setPickedCoordinate] = useState<{
    latitude: number;
    longitude: number;
  } | null>(initialCenter);
  const [step, setStep] = useState<'location' | 'radius'>('location');

  const goToCurrentLocation = () => {
    if (!currentPosition) return;
    cameraRef.current?.setCamera({
      centerCoordinate: [currentPosition.longitude, currentPosition.latitude],
      zoomLevel: 17,
      animationDuration: 300,
    });
  };

  const syncPickedCoordinateFromMap = async () => {
    const center = await mapRef.current?.getCenter();
    if (!center) return;
    const [longitude, latitude] = center;
    setPickedCoordinate({ latitude, longitude });
  };

  const handleTouchEnd = () => {
    if (settleTimeout.current) clearTimeout(settleTimeout.current);
    settleTimeout.current = setTimeout(syncPickedCoordinateFromMap, 300);
  };

  const safeZoneCircle = useMemo(() => {
    if (!pickedCoordinate) return null;
    return circle(
      [pickedCoordinate.longitude, pickedCoordinate.latitude],
      radius,
      { units: 'meters', steps: 64 },
    );
  }, [pickedCoordinate, radius]);

  const pickedName = pickedCoordinate ? 'Selected location' : 'Unknown location';
  const pickedAddress = pickedCoordinate
    ? `${pickedCoordinate.latitude.toFixed(6)}, ${pickedCoordinate.longitude.toFixed(6)}`
    : '';

  const handleContinueToRadius = () => {
    if (!pickedCoordinate) return;
    setStep('radius');
  };

  const { data: connections } = useQuery(connectionQueryOpt());
  const setGeofence = useMutation(setGeofenceMutationOpt());
  const queryClient = useQueryClient();

  const handleConfirmSafeZone = () => {
    if (!pickedCoordinate) return;

    const recipientId = connections?.[0]?.recipient_id;
    if (!recipientId) {
      Alert.alert('No linked recipient', 'Link a care recipient before setting a safe zone.');
      return;
    }

    setGeofence.mutate(
      {
        recipient_id: recipientId,
        home_lat: pickedCoordinate.latitude,
        home_lng: pickedCoordinate.longitude,
        home_radius_in_m: Math.round(radius),
      },
      {
        onSuccess: () => {
          setTargetLocation({ ...pickedCoordinate, name: pickedName });
          queryClient.invalidateQueries({ queryKey: ['locationApi', 'geofence'] });
          router.back();
        },
        onError: (err) => {
          Alert.alert('Could not save safe zone', err.response?.data?.message ?? 'Please try again.');
        },
      },
    );
  };

  return (
    <View className='flex-1 relative'>
      <Stack.Screen options={{ headerShown: false }} />
      <MapView
        ref={mapRef}
        className='flex w-full h-full'
        onTouchEnd={handleTouchEnd}
      >
        <Camera
          ref={cameraRef}
          defaultSettings={{
            zoomLevel: 17,
            centerCoordinate: initialCenter
              ? [initialCenter.longitude, initialCenter.latitude]
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
      <View
        pointerEvents='none'
        className='absolute top-0 left-0 right-0 bottom-0 items-center justify-center'
      >
        <Ionicons
          name='location-sharp'
          size={40}
          color='#007FFF'
          className='mb-[40px]'
        />
      </View>
      <Pressable
        onPress={goToCurrentLocation}
        className='absolute bottom-[18rem] right-8 items-center justify-center rounded-full bg-white w-11 h-11 shadow'
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
      <View className='absolute bottom-8 left-0 right-0 items-center'>
        <View className='flex gap-2 justify-end bg-white w-[90vw] h-fit p-8 rounded-3xl shadow'>
          {step === 'location' ? (
            <LocationStep
              pickedName={pickedName}
              pickedAddress={pickedAddress}
              pickedCoordinate={pickedCoordinate}
              onContinue={handleContinueToRadius}
            />
          ) : (
            <RadiusStep
              radius={radius}
              setRadius={setRadius}
              pickedCoordinate={pickedCoordinate}
              onConfirm={handleConfirmSafeZone}
            />
          )}
        </View>
      </View>
    </View>
  );
}
