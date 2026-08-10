import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { logisticsApi } from "../../../api/logistics.api";
import { userApi } from "../../../api/user.api";
import { IconSymbol } from "../../../components/ui/icon-symbol";
import SubHeader from "@/components/navbar/SubHeader";

export default function RegionScreen() {
  const queryClient = useQueryClient();

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: userApi.getProfile,
  });

  const { data: divisions, isLoading: divisionsLoading } = useQuery({
    queryKey: ["divisions"],
    queryFn: logisticsApi.getDivisions,
  });

  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      router.back();
    },
    onError: (error) => {
      console.error("Failed to update region:", error);
    },
  });

  const handleSelectRegion = (regionName: string) => {
    updateProfileMutation.mutate({ region: regionName });
  };

  const isLoading = profileLoading || divisionsLoading || updateProfileMutation.isPending;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader title="Select Region" hideSearch hideNotification />
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View className="flex-1 items-center justify-center py-10">
            <ActivityIndicator color="#000" />
          </View>
        ) : (
          <View className="flex-col gap-2 pb-10">
            {divisions?.map((division: any) => (
              <TouchableOpacity
                key={division.id}
                onPress={() => handleSelectRegion(division.name)}
                className="bg-[#F3F3F3] h-16 px-4 rounded-lg flex-row items-center justify-between"
              >
                <Text className="text-black text-[16px] font-Urbanist">
                  {division.name}
                </Text>
                {profileData?.region === division.name && (
                  <IconSymbol name="checkmark.circle.fill" size={24} color="#000" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
