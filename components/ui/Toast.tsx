import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ToastType, useToastStore } from "../../store/toastStore";

export const Toast = () => {
  const { isVisible, message, type, duration, hideToast } = useToastStore();
  const insets = useSafeAreaInsets();

  // Start the toast off-screen
  const translateY = useSharedValue(-150);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      // Show toast
      translateY.value = withTiming(insets.top > 0 ? insets.top + 10 : 40, {
        duration: 500,
      });
      opacity.value = withTiming(1, { duration: 300 });

      // Auto-hide toast
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      // Hide toast
      translateY.value = withTiming(-150, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [isVisible, duration, hideToast, insets.top, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const iconColors: Record<ToastType, string> = {
    success: "#FFFFFF",
    error: "#FCA5A5",
    info: "#93C5FD",
    warning: "#FCD34D",
  };

  const icons: Record<ToastType, keyof typeof Ionicons.glyphMap> = {
    success: "checkmark-circle-outline",
    error: "close-circle-outline",
    info: "information-circle-outline",
    warning: "warning-outline",
  };

  return (
    <Animated.View
      pointerEvents={isVisible ? "auto" : "none"}
      style={[
        animatedStyle,
        { position: "absolute", top: 0, left: 16, right: 16, zIndex: 9999 },
      ]}
    >
      <View className="flex-row items-center p-4 rounded-xl bg-[#1A1A1A] shadow-lg">
        <Ionicons name={icons[type]} size={24} color={iconColors[type]} />
        <Text className="flex-1 ml-3 text-white font-Urbanist-SemiBold text-base">
          {message}
        </Text>
        <TouchableOpacity onPress={hideToast} className="p-1">
          <Ionicons name="close" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};
