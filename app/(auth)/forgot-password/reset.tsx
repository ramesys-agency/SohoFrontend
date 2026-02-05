import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthButton } from "../../../components/auth/AuthButton";
import { AuthInput } from "../../../components/auth/AuthInput";
import { IconSymbol } from "../../../components/ui/icon-symbol";

export default function ForgotPasswordReset() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleReset = () => {
    // In a real app, reset password logic here
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: 40,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-[#F2F2F2] rounded-full items-center justify-center mb-8"
        >
          <IconSymbol name="chevron.left" size={20} color="#000000" />
        </TouchableOpacity>

        <View className="items-center mb-10">
          <Text className="text-4xl font-Classyvogue mb-2">Reset Password</Text>
          <Text className="text-[#999999] text-sm font-Urbanist text-center px-10">
            Enter your new password below.
          </Text>
        </View>

        <View className="mb-8">
          <AuthInput
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            isPassword
          />
          <AuthInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            isPassword
          />
        </View>

        <AuthButton
          title="Reset Password"
          onPress={handleReset}
          className="mb-8"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
