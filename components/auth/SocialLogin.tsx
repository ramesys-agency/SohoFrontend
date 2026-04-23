import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { IconSymbol } from "../ui/icon-symbol";

export function SocialLogin() {
  return (
    <View className="items-center mt-8">
      <Text className="text-[#999999] text-sm font-Urbanist mb-6">Or</Text>
      <View className="flex-row justify-center gap-x-4">
        <TouchableOpacity className="w-14 h-14 bg-[#F2F2F2] rounded-xl items-center justify-center">
          <IconSymbol name="apple.logo" size={24} color="#000000" />
        </TouchableOpacity>
        <TouchableOpacity className="w-14 h-14 bg-[#F2F2F2] rounded-xl items-center justify-center">
          <IconSymbol name="google.logo" size={24} color="#000000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
