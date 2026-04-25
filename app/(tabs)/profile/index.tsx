import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { userApi } from "../../../api/user.api";
import { IconSymbol } from "../../../components/ui/icon-symbol";
import { useAuthStore } from "../../../store/authStore";
import SubHeader from "../../components/navbar/SubHeader";

export default function ProfileScreen() {
  const { logout } = useAuthStore();
  const [loggingOut, setLoggingOut] = useState(false);

  const {
    data: profileData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: userApi.getProfile,
  });

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  // const [isDarkTheme, setIsDarkTheme] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader title="Account" hideSearch hideNotification />
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        {/* Profile Card */}
        <View className="bg-gray-100 min-h-[7rem] p-3 rounded-xl flex-row items-center mb-6">
          {isLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator color="#000" />
            </View>
          ) : (
            <>
              {profileData?.avatar ? (
                <Image
                  source={{ uri: profileData.avatar }}
                  className="w-20 h-20 rounded-xl mr-4"
                />
              ) : (
                <View className="w-20 h-20 rounded-xl mr-4 bg-gray-200 items-center justify-center">
                  <IconSymbol name="person.fill" size={40} color="#9CA3AF" />
                </View>
              )}
              <View className="flex-1">
                <Text className="text-lg font-Urbanist-Bold text-black">
                  {profileData?.fullName || "User"}
                </Text>
                <Text className="text-gray-500 text-sm font-Urbanist">
                  {profileData?.email || "No email available"}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/profile/edit-profile")}
              >
                <IconSymbol name="pencil" size={20} color="#000" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Menu Items */}
        <View className="flex-col gap-2 mb-6">
          <MenuItem
            icon="list.bullet"
            label="My orders"
            onPress={() => router.push("/profile/orders")}
          />
          {/* <MenuItem
            icon="arrow.counterclockwise"
            label="Returns"
            onPress={() => {}}
          /> */}
          {/* Note: 'house.fill' maps to 'home' (filled) in our icon set, which is close enough for Address */}
          <MenuItem
            icon="house.fill"
            label="Addresses"
            onPress={() => router.push("/profile/addresses")}
          />
          {/* <MenuItem icon="creditcard" label="Payment" onPress={() => {}} /> */}
          <MenuItem icon="map" label="Region" onPress={() => {}} />
          <MenuItem
            icon="bell"
            label="Notification"
            onPress={() => router.push("/notifications")}
          />
        </View>

        {/* Dark Theme */}
        {/* <View className="bg-gray-100 p-4 rounded-2xl flex-row items-center justify-between mb-8">
          <View className="flex-row items-center">
            <View className="w-8 items-center mr-3">
              <IconSymbol name="moon" size={22} color="#000" />
            </View>
            <Text className="text-black font-Urbanist-Bold text-base">Dark theme</Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#000" }}
            thumbColor={"#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => setIsDarkTheme((prev) => !prev)}
            value={isDarkTheme}
          />
        </View> */}

        {/* Log out */}
        <TouchableOpacity
          className="flex-row items-center justify-center mb-10"
          onPress={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? (
            <ActivityIndicator color="#dc2626" />
          ) : (
            <>
              <IconSymbol
                name="rectangle.portrait.and.arrow.right"
                size={24}
                color="#dc2626"
              />
              <Text className="text-red-600 text-lg ml-2 font-Urbanist">
                Log out
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-[#F3F3F3] h-20 p-4 rounded-lg flex-row items-center justify-between"
    >
      <View className="flex-row items-center">
        <View className="w-8 items-center mr-3">
          <IconSymbol name={icon} size={22} color="#000" />
        </View>
        <Text className="text-black text-[16px] font-Urbanist">{label}</Text>
      </View>
      <IconSymbol name="chevron.right" size={20} color="#000" />
    </TouchableOpacity>
  );
}
