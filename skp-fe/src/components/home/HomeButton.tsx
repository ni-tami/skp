import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import { ComponentProps } from "react";
import { Pressable, Text } from "react-native";

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
      className='h-36 flex-1 items-center justify-center rounded-2xl shadow-slate-400 color-white'
      onPress={() => {
        if (route) {
          router.push(route as any);
        }
      }}
    >
      <Ionicons name={icon} size={28} color="black" />
      <Text className='text-lg font-semibold text-black'>{title}</Text>
    </Pressable>
  )
};