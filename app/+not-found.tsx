import { Feather } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "@/store/authStore";

/**
 * Rendered by expo-router whenever a pushed path has no matching route.
 * Keeps the shopper inside the app instead of showing the default
 * "Unmatched Route" developer screen.
 */
export default function NotFoundScreen() {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const goHome = () => {
    router.replace(isAuthenticated ? "/(tabs)/home" : "/(auth)/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      {/* Minimal header — just a way back, no search/notification actions */}
      <View className="px-4 py-4">
        {router.canGoBack() && (
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-9 h-9 items-center justify-center bg-[#F2F2F7] rounded-full"
            activeOpacity={0.7}
          >
            <Feather name="chevron-left" size={20} color="black" />
          </TouchableOpacity>
        )}
      </View>

      <View className="flex-1 justify-center items-center px-8">
        <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-6">
          <Feather name="compass" size={38} color="#9CA3AF" />
        </View>

        <Text
          className="text-5xl text-black tracking-tight text-center"
          style={{ fontFamily: "Classyvogue" }}
        >
          Page Not Found
        </Text>

        <Text
          className="text-gray-500 text-center mt-3 leading-6"
          style={{ fontFamily: "Urbanist" }}
        >
          We couldn&apos;t find the page you were looking for. It may have been
          moved, or the link is no longer valid.
        </Text>

        {!!pathname && (
          <View className="mt-5 px-4 py-2 bg-[#F2F2F7] rounded-full max-w-full">
            <Text
              className="text-gray-400 text-xs"
              numberOfLines={1}
              style={{ fontFamily: "Urbanist-Medium" }}
            >
              {pathname}
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={goHome}
          activeOpacity={0.85}
          className="bg-black px-10 py-4 rounded-full mt-9"
        >
          <Text
            className="text-white text-base"
            style={{ fontFamily: "Urbanist-Bold" }}
          >
            Back to Home
          </Text>
        </TouchableOpacity>

        {router.canGoBack() && (
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            className="mt-4 px-6 py-2"
          >
            <Text
              className="text-gray-500 text-base"
              style={{ fontFamily: "Urbanist-SemiBold" }}
            >
              Go back
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}
