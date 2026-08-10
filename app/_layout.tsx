import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Stack, useRootNavigationState, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { Toast } from "../components/ui/Toast";
import "../global.css";
import { notificationApi } from "../api/notification.api";
import { useAuthStore } from "../store/authStore";
import { API_URL } from "../config/env";
import { registerForPushNotifications } from "../utils/registerForPushNotifications";

// Show notifications as banners while the app is in the foreground.
// `shouldShowBanner` / `shouldShowList` replaced the old `shouldShowAlert`,
// which SDK 54 warns about — banner is the heads-up, list is the tray.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

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
  const navigationState = useRootNavigationState();
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    hydrate();
    console.log("API_URL:", API_URL);
  }, [hydrate]);

  // Register push token when user logs in, remove listeners on logout
  useEffect(() => {
    if (!isAuthenticated) {
      notificationListener.current?.remove();
      responseListener.current?.remove();
      return;
    }

    registerForPushNotifications().then((token) => {
      if (!token) return;
      const platform = Platform.OS === "ios" ? "ios" : "android";
      notificationApi.registerPushToken(token, platform).catch(() => {});
    });

    // Listen for notifications received while app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(() => {});

    // Handle tap on a notification — navigate to the relevant screen
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as Record<string, unknown>;
      const screen = data?.screen as string | undefined;
      if (screen === "orders") {
        router.push("/(tabs)/orders" as never);
      } else if (screen === "notifications") {
        router.push("/notifications" as never);
      } else if (screen === "collection") {
        const slug = data?.slug as string | undefined;
        const id = data?.id as string | undefined;
        if (slug) {
          router.push(
            (`/(tabs)/catalog/shop/${slug}` +
              (id ? `?collectionId=${id}&collectionSlug=${slug}` : "")) as never
          );
        }
      } else if (screen === "product") {
        const id = data?.id as string | undefined;
        if (id) {
          router.push(`/product/${id}` as never);
        }
      }
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [isAuthenticated, router]);

  const isAppReady = (loaded || !!error) && !isAuthLoading;

  useEffect(() => {
    if (isAppReady) {
      SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  useEffect(() => {
    if (!isAppReady) return;
    if (!navigationState?.key) return; // navigator not mounted yet

    const currentSegments = segments as string[];
    const inAuthGroup = currentSegments[0] === "(auth)";
    const inTabsGroup = currentSegments[0] === "(tabs)";
    const isIndex =
      currentSegments.length === 0 ||
      (currentSegments.length === 1 && currentSegments[0] === "index");

    if (isAuthenticated) {
      if (inAuthGroup || isIndex) {
        router.replace("/(tabs)/home");
      }
    } else {
      if (inTabsGroup) {
        router.replace("/(auth)/login");
      }
    }
  }, [isAuthenticated, segments, isAppReady, router, navigationState?.key]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
          <Stack.Screen name="notifications" />
          <Stack.Screen name="search" />
          <Stack.Screen name="product/[id]" />
          <Stack.Screen name="checkout" />
        </Stack>
        <StatusBar style="dark" />
        <Toast />
      </SafeAreaProvider>
    </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
