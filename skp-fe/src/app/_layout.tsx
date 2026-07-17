import { Stack } from "expo-router";
import { useFonts, DMSans_400Regular, DMSans_600SemiBold, DMSans_700Bold } from "@expo-google-fonts/dm-sans";
import { QueryClientProvider } from "@tanstack/react-query";
import "../../global.css";
import "../config/mapbox";
import "../lib/geofence-task";
import { useEffect, useState } from "react";
import { queryClient } from "@/lib/query-client";
import { requestForegroundLocationPermission } from "@/lib/permission";
import { getStoredSession } from "@/lib/token-storage";
import { useAuthStore } from "@/stores/auth-store";
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
      </Stack>
    </SafeAreaProvider>
  );
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    requestForegroundLocationPermission();
    getStoredSession()
      .then((session) => {
        if (session) useAuthStore.getState().setAuth(session.token, session.user);
      })
      .finally(() => setIsSessionLoading(false));
  }, []);

  if (!fontsLoaded || isSessionLoading) return null;

  const isLoggedIn = !!token;

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
		<Stack screenOptions={{ headerShown: false }}>
		  <Stack.Protected guard={isLoggedIn}>
		    <Stack.Screen name="index" />
		    <Stack.Screen name="(features)" />
		  </Stack.Protected>
		  <Stack.Protected guard={!isLoggedIn}>
		    <Stack.Screen name="(auth)" />
		  </Stack.Protected>
		</Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}