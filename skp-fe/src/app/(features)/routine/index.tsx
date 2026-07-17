import { View } from "react-native";
import HomeButton from "../../../components/home/HomeButton";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-white p-4 pt-5">
      <View className="flex-row gap-4">
        <HomeButton title="Giver" icon="alarm-outline" route="/routine/caregiver" />
        <HomeButton title="Recipient" icon="location-sharp" route="/routine/carerecipient/entries" />
      </View>
    </View>
  );
}