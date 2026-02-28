import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authApi } from "../../../api/auth.api";
import { AuthButton } from "../../../components/auth/AuthButton";
import { AuthInput } from "../../../components/auth/AuthInput";
import { IconSymbol } from "../../../components/ui/icon-symbol";

export default function ForgotPasswordEmail() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }

    try {
      setIsLoading(true);
      const result = await authApi.forgotPassword({ email });

      // Backend returns a resetLink containing the token
      // e.g. http://frontend/reset-password?token=<jwt>
      const resetLink: string = result?.resetLink ?? "";
      const token = resetLink.includes("?token=")
        ? resetLink.split("?token=")[1]
        : "";

      Alert.alert(
        "Check your email",
        result?.message ?? "A password reset link has been sent to your email.",
        [
          {
            text: "Continue",
            onPress: () => {
              router.push({
                pathname: "/(auth)/forgot-password/reset",
                params: { token },
              });
            },
          },
        ],
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      Alert.alert("Error", message);
    } finally {
      setIsLoading(false);
    }
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
            Enter your email address below to receive a password reset link.
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
          title={isLoading ? "Sending..." : "Send Reset Link"}
          onPress={handleSendCode}
          className="mb-8"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
