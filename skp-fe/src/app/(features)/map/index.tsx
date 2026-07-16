import { View } from 'react-native';
import StyledText from '@/components/ui/StyledText';
import { Camera, LocationPuck, MapView, UserLocation } from '@rnmapbox/maps';
import { useRef } from 'react';
import { useLocationStore } from '@/stores/location-store';

export default function MapScreen() {
  const currentPosition = useLocationStore((state) => state.currentPosition);
  const setCurrentPosition = useLocationStore(
    (state) => state.setCurrentPosition,
  );
  const target = useLocationStore((state) => state.targetLocation);
  const distance = useLocationStore((state) => state.distance);

  const cameraRef = useRef<Camera>(null);

  return (
    <View className='flex-1 bg-[#F6F6F6] p-4'>
      <View className='flex flex-col gap-2 w-full h-[26rem]'>
        <StyledText size={24} type={'title'} className='mb-4'>
          Track Your Location
        </StyledText>
        <StyledText size={18} type={'title'}>
          Safe Zone
        </StyledText>
        <View className='flex-1 flex-col w-full'>
          <MapView className='flex-1 rounded-t-xl overflow-hidden'>
            <Camera
              ref={cameraRef}
              defaultSettings={{ zoomLevel: 17 }}
              zoomLevel={17}
              animationDuration={300}
              centerCoordinate={
                target
                  ? [target.longitude, target.latitude]
                  : currentPosition
                    ? [currentPosition.longitude, currentPosition.latitude]
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
          </MapView>
          <View className='flex flex-row items-center justify-start rounded-b-xl bg-white w-full py-6 px-4'>
            <StyledText size={14} className='font-semibold'>
              Prabowo is still in the safe zone
            </StyledText>
          </View>
        </View>
        <View className='flex justify-between flex-row items-center rounded-xl bg-white w-full py-6 px-4 my-2'>
          <StyledText size={14} className='font-semibold'>
            Set your safe zone
          </StyledText>
        </View>
      </View>
    </View>
  );
}
