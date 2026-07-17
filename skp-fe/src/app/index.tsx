import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import HomeButton from "../components/home/HomeButton";
import StyledText from "@/components/ui/StyledText";
import { useAuthStore } from "@/stores/auth-store";
import { clearStoredSession } from "@/lib/token-storage";
import { connectionQueryOpt } from "@/services/queryOptions/connectQueryOpt";
import { geofenceQueryOpt } from "@/services/queryOptions/locationQueryOpt";

const todayLabel = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export default function HomeScreen() {
  const displayName = useAuthStore((state) => state.user?.display_name);
  const role = useAuthStore((state) => state.user?.role);

  const { data: connections } = useQuery(connectionQueryOpt());
  const { data: geofence } = useQuery(geofenceQueryOpt());

  const connection = connections?.[0];
  const partner =
    role === "caregiver" ? connection?.recipient : connection?.caregiver;
  const partnerLabel = role === "caregiver" ? "Care recipient" : "Caregiver";

  const hasSafeZone =
    !!geofence &&
    geofence.home_lat !== 0 &&
    geofence.home_lng !== 0 &&
    geofence.home_radius_in_m > 1;

  const handleLogout = async () => {
    await clearStoredSession();
    useAuthStore.getState().clearAuth();
  };

  return (
    <View className="flex-1 bg-cloud">
      <SafeAreaView
        edges={["top"]}
        className="bg-brand rounded-b-[2.8rem] px-6 pb-10 pt-4 h-64"
      >
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

      <View className="p-4 -mt-8 gap-4">
        <View className="flex-row gap-3">
          <View className="flex-1 rounded-2xl bg-white p-4 shadow-sm">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-8 h-8 items-center justify-center rounded-full bg-brand-tint">
                <Ionicons name="people" size={16} color="#007FFF" />
              </View>
              <StyledText size={12} className="text-gray-500">
                {partnerLabel}
              </StyledText>
            </View>
            <StyledText size={16} className="font-semibold">
              {partner?.display_name ?? "Not linked"}
            </StyledText>
          </View>

          <View className="flex-1 rounded-2xl bg-white p-4 shadow-sm">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="w-8 h-8 items-center justify-center rounded-full bg-brand-tint">
                <Ionicons name="shield-checkmark" size={16} color="#007FFF" />
              </View>
              <StyledText size={12} className="text-gray-500">
                Safe zone
              </StyledText>
            </View>
            <StyledText size={16} className="font-semibold">
              {hasSafeZone ? `${geofence.home_radius_in_m}m radius` : "Not set"}
            </StyledText>
          </View>
        </View>

        <View>
          <StyledText size={16} type={"title"} className="mb-3">
            Quick actions
          </StyledText>
          <View className="flex-row gap-4">
            <HomeButton title="Routine" icon="alarm-outline" route="/routine" />
            <HomeButton title="Maps" icon="location-sharp" route="/map" />
          </View>
        </View>
      </View>
    </View>
  );
}
