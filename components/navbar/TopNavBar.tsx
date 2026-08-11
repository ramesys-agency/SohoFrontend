import { notificationApi } from "@/api/notification.api";
import Logo from "@/components/ui/Logo";
import { useAuthStore } from "@/store/authStore";
import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface TopNavBarProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

const TopNavBar: React.FC<TopNavBarProps> = ({
  title,
  showBackButton,
  onBackPress,
}) => {
  const router = useRouter();
  const isSubPage = showBackButton || title;
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: notificationApi.getUnreadCount,
    enabled: isAuthenticated,
    refetchInterval: 60000,
  });
  const hasUnread = unreadCount > 0;

  if (isSubPage) {
    return (
      <View className="bg-white px-4 pb-2">
        <View className="flex-row justify-between items-center pt-4">
          <View className="w-10">
            {showBackButton && (
              <TouchableOpacity
                onPress={onBackPress}
                className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
              >
                <Feather name="chevron-left" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>

          <View className="flex-1 items-center">
            <Text
              className="text-4xl text-black"
              style={{ fontFamily: "Classyvogue" }}
            >
              {title}
            </Text>
          </View>

          <View className="flex-row gap-x-5 w-10 justify-end">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/search")}
            >
              <Feather name="search" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              className="relative"
              onPress={() => router.push("/notifications")}
            >
              <Feather name="bell" size={24} color="black" />
              {hasUnread && (
                <View className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Original Home Page Layout
  return (
    <View className="bg-white px-4 pb-2">
      <View className="flex-row justify-end items-center pt-4 pr-1">
        <View className="flex-row gap-x-5">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/search")}
          >
            <Feather name="search" size={26} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            className="relative"
            onPress={() => router.push("/notifications")}
          >
            <Feather name="bell" size={26} color="black" />
            {hasUnread && (
              <View className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View className="items-center -mt-1 pb-2">
        <Logo width={200} />
      </View>
    </View>
  );
};

export default TopNavBar;
