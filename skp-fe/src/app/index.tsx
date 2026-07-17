import { getIsCaregiver } from "@/utils/user";
import { View } from "react-native";
import HomeButton from "../components/home/HomeButton";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-white p-4 pt-5">
      <View className="flex-row gap-4">
        <HomeButton title="Routine" icon="alarm-outline" route={`${getIsCaregiver()? "/routine/caregiver" : "/routine/schedule"}`} />
        <HomeButton title="Maps" icon="location-sharp" route="/map" />
      </View>

      <View className="mt-4 flex-row gap-4">
        <HomeButton title="Games" icon="game-controller" />
        <HomeButton title="Notes" icon="pencil-sharp" />
      </View>
    </View>
  );
}