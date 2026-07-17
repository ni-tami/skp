import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FloatingButtonProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function FloatingButton({ onPress, icon = "add" }: FloatingButtonProps) {
  const insets = useSafeAreaInsets();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="absolute mb-4 right-4 bg-blue-600 w-14 h-14 rounded-full items-center justify-center shadow-lg shadow-black active:bg-blue-700 active:scale-95"
      style={{
        bottom: insets.bottom,
        elevation: 5,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.5,
      }}
    >
      <Ionicons name={icon} size={30} color="white" />
    </Pressable>
  );
}