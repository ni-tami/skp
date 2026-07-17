import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeButton from "../components/home/HomeButton";
import StyledText from "@/components/ui/StyledText";
import { useAuthStore } from "@/stores/auth-store";
import { clearStoredSession } from "@/lib/token-storage";
import { useEffect } from "react";
import { useLocationStore } from "@/stores/location-store";
import { requestGeofencePermissions } from "@/lib/permission";
import { startSafeZoneGeofencing } from "@/lib/geofence-task";
import { sendExitNotification } from "@/lib/notification";
import distance from "@turf/distance";

const todayLabel = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export default function HomeScreen() {
  const displayName = useAuthStore((state) => state.user?.display_name);
  const target = useLocationStore((state) => state.targetLocation);
  const radius = useLocationStore((state) => state.radius);
  const currentPosition = useLocationStore((state) => state.currentPosition);
  const monitoring = useLocationStore((state) => state.monitoring);
  const setMonitoring = useLocationStore((state) => state.setMonitoring);

  useEffect(() => {
    if (!target || !radius || monitoring) return;
    requestGeofencePermissions().then((permissions) => {
      if (!permissions.foreground || !permissions.background) return;
      setMonitoring(true);
      startSafeZoneGeofencing(target, radius);
      if (currentPosition) {
        const dist = distance(
          [currentPosition.longitude, currentPosition.latitude],
          [target.longitude, target.latitude],
          { units: 'meters' },
        );
        if (dist > radius) sendExitNotification();
      }
    });
  }, []);

  const handleLogout = async () => {
    await clearStoredSession();
    useAuthStore.getState().clearAuth();
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView edges={["top"]} className="bg-brand rounded-b-[2.8rem] px-6 pb-10 pt-4 h-64">
        <Pressable
          onPress={handleLogout}
          className="absolute top-24 right-6 items-center justify-center rounded-full bg-[#0A1F44]/20 w-10 h-10"
        >
          <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
        </Pressable>
        <View className="absolute bottom-8 px-8">
          <StyledText size={16} className="text-white font-semibold mb-1">
            {todayLabel}
          </StyledText>
          <StyledText size={24} type={"title"} className="text-white">
            Hi, {displayName}
          </StyledText>
        </View>
      </SafeAreaView>

      <View className="p-4">
        <View className="flex-row gap-4">
          <HomeButton title="Routine" icon="alarm-outline" route="/routine" />
          <HomeButton title="Maps" icon="location-sharp" route="/map" />
        </View>

        <View className="mt-4 flex-row gap-4">
          <HomeButton title="Games" icon="game-controller" />
          <HomeButton title="Notes" icon="pencil-sharp" />
        </View>
      </View>
    </View>
  );
}