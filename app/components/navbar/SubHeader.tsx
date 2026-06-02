import { notificationApi } from "@/api/notification.api";
import { useAuthStore } from "@/store/authStore";
import { Feather } from "@expo/vector-icons";
import { NavigationContext } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SubHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  hideSearch?: boolean;
  hideNotification?: boolean;
}

const SubHeader: React.FC<SubHeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  hideSearch = false,
  hideNotification = false,
}) => {
  const navigation = useContext(NavigationContext);
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: notificationApi.getUnreadCount,
    enabled: isAuthenticated && !hideNotification,
    refetchInterval: 60000,
  });

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation?.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View className="bg-white px-4">
      <View className="flex-row justify-between items-center py-4">
        <View className="flex-row items-center flex-1">
          {showBackButton && (
            <TouchableOpacity
              onPress={handleBackPress}
              className="mr-3 w-9 h-9 items-center justify-center bg-[#F2F2F7] rounded-full -ml-1"
              activeOpacity={0.7}
            >
              <Feather name="chevron-left" size={20} color="black" />
            </TouchableOpacity>
          )}
          <Text
            className="text-4xl text-black tracking-tight w-[80%]"
            numberOfLines={1}
            style={{ fontFamily: "Classyvogue" }}
          >
            {title}
          </Text>
        </View>

        <View className="flex-row gap-x-5">
          {!hideSearch && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/search")}
            >
              <Feather name="search" size={26} color="black" />
            </TouchableOpacity>
          )}
          {!hideNotification && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/notifications")}
            >
              <Feather name="bell" size={26} color="black" />
              {unreadCount > 0 && (
                <View className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 items-center justify-center">
                  <Text
                    className="text-white text-[10px]"
                    style={{ fontFamily: "Urbanist-Bold" }}
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default SubHeader;
