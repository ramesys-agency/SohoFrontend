import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthButton } from "../../../components/auth/AuthButton";
import { AuthInput } from "../../../components/auth/AuthInput";
import { IconSymbol } from "../../../components/ui/icon-symbol";

export default function ForgotPasswordEmail() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSendCode = () => {
    // In a real app, send OTP logic here
    router.push("/(auth)/forgot-password/verify");
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
          <Text className="text-4xl font-Classyvogue mb-2">
            Forgot Password
          </Text>
          <Text className="text-[#999999] text-sm font-Urbanist text-center px-10">
            Enter your email address below to receive a password reset code.
          </Text>
        </View>

        <View className="mb-8">
          <AuthInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <AuthButton
          title="Send Code"
          onPress={handleSendCode}
          className="mb-8"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
