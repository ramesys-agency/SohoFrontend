import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Toast } from "../components/ui/Toast";
import "../global.css";
import { useAuthStore } from "../store/authStore";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Classyvogue: require("../assets/fonts/Classyvogueregular.ttf"),
    Urbanist: require("../assets/fonts/Urbanist-Regular.ttf"),
    "Urbanist-Thin": require("../assets/fonts/Urbanist-Thin.ttf"),
    "Urbanist-ExtraLight": require("../assets/fonts/Urbanist-ExtraLight.ttf"),
    "Urbanist-Light": require("../assets/fonts/Urbanist-Light.ttf"),
    "Urbanist-Medium": require("../assets/fonts/Urbanist-Medium.ttf"),
    "Urbanist-SemiBold": require("../assets/fonts/Urbanist-SemiBold.ttf"),
    "Urbanist-Bold": require("../assets/fonts/Urbanist-Bold.ttf"),
    AlexBrush: require("../assets/fonts/AlexBrush-Regular.ttf"),
  });

  const { hydrate, isAuthenticated, isLoading: isAuthLoading } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const isNavigationReady = loaded || error;
  const isAppReady = isNavigationReady && !isAuthLoading;

  useEffect(() => {
    if (isAppReady) {
      SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  useEffect(() => {
    if (!isAppReady) return;

    // Cast segments to string[] to avoid strict type mismatch with 'index' or checking length
    const currentSegments = segments as string[];
    const inAuthGroup = currentSegments[0] === "(auth)";
    const inTabsGroup = currentSegments[0] === "(tabs)";
    const isIndex =
      currentSegments.length === 0 ||
      (currentSegments.length === 1 && currentSegments[0] === "index");

    if (isAuthenticated) {
      // If user is authenticated and trying to access auth screens or onboarding, redirect to home
      if (inAuthGroup || isIndex) {
        router.replace("/(tabs)/home");
      }
    } else {
      // If user is not authenticated and trying to access protected tabs, redirect to login
      if (inTabsGroup) {
        router.replace("/(auth)/login");
      }
    }
  }, [isAuthenticated, segments, isAppReady, router]);

  if (!isAppReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <StatusBar style="dark" />
        <Toast />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
