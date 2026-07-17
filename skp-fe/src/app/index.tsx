import { Pressable, View } from "react-native";
import HomeButton from "../components/home/HomeButton";
import StyledText from "@/components/ui/StyledText";
import { useAuthStore } from "@/stores/auth-store";
import { clearStoredSession } from "@/lib/token-storage";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row gap-4">
        <HomeButton title="Routine" icon="alarm-outline" route="/routine" />
        <HomeButton title="Maps" icon="location-sharp" route="/map" />
      </View>

      <View className="mt-4 flex-row gap-4">
        <HomeButton title="Games" icon="game-controller" />
        <HomeButton title="Notes" icon="pencil-sharp" />
      </View>

      {/* TEMP: remove before shipping */}
      <Pressable
        onPress={async () => {
          useAuthStore.getState().clearAuth();
          await clearStoredSession();
        }}
        className="mt-8 items-center rounded-xl border border-danger p-3"
      >
        <StyledText size={14} className="text-danger font-semibold">
          [TEMP] Remove token
        </StyledText>
      </Pressable>
    </View>
  );
}