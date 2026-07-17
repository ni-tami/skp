import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";

type IoniconsName = ComponentProps<typeof Ionicons>["name"];
export default function HomeButton({
  title,
  icon,
  route,
}: {
  title: string;
  icon: IoniconsName;
  route?: string;
}) {
  return (
    <Pressable
      className='h-32 flex-1 items-center justify-center rounded-2xl bg-white shadow-sm gap-2'
      onPress={() => {
        if (route) {
          router.push(route as any);
        }
      }}
    >
      <View className='w-12 h-12 items-center justify-center rounded-full bg-brand-tint'>
        <Ionicons name={icon} size={24} color="#007FFF" />
      </View>
      <Text className='text-base font-semibold text-black'>{title}</Text>
    </Pressable>
  )
};