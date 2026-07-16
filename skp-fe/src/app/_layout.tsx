import { Stack } from "expo-router";
import { useFonts, DMSans_400Regular, DMSans_600SemiBold, DMSans_700Bold } from "@expo-google-fonts/dm-sans";
import * as Location from "expo-location";
import "../../global.css";
import "../config/mapbox";
import { useEffect } from "react";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  useEffect(() => {
    Location.requestForegroundPermissionsAsync();
  }, []);

  if (!fontsLoaded) return null;

  return <Stack />;
}