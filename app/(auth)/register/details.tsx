import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authApi } from "../../../api/auth.api";
import { AuthButton } from "../../../components/auth/AuthButton";
import { AuthInput } from "../../../components/auth/AuthInput";
import { IconSymbol } from "../../../components/ui/icon-symbol";
import { useAuthStore } from "../../../store/authStore";

export default function RegisterStep2() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const login = useAuthStore((s) => s.login);

  const handleRegister = async () => {
    if (!fullName.trim()) {
      Alert.alert("Error", "Please enter your full name.");
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      Alert.alert("Error", "Please enter a valid phone number.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      const result = await authApi.register({
        email: email ?? "",
        password,
        fullName,
        phone,
      });

      const user = {
        id: result.user.id,
        email: result.user.email,
        name: result.user.fullName,
        role: result.user.role,
      };

      await login(user, result.accessToken, result.refreshToken);

      router.replace("/(tabs)");
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Registration failed. Please try again.";
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
          className="w-10 h-10 bg-[#F2F2F2] rounded-full items-center justify-center mb-6"
        >
          <IconSymbol name="chevron.left" size={20} color="#000000" />
        </TouchableOpacity>

        <View className="mb-8">
          <Text className="text-4xl font-Classyvogue mb-2">
            Create your soho account
          </Text>
          <Text className="text-[#999999] text-sm font-Urbanist">
            Start shopping from soho.
          </Text>
        </View>

        <View className="mb-6">
          <AuthInput
            label="Full name"
            value={fullName}
            onChangeText={setFullName}
          />

          <AuthInput
            label="Phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <AuthInput
            label="Create password"
            value={password}
            onChangeText={setPassword}
            isPassword
            error={
              password.length > 0 && password.length < 8
                ? "Password must be at least 8 characters"
                : undefined
            }
          />

          <AuthInput
            label="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            isPassword
            error={
              confirmPassword.length > 0 && password !== confirmPassword
                ? "Passwords do not match"
                : undefined
            }
          />
        </View>

        <AuthButton
          title={isLoading ? "Creating account..." : "Continue"}
          onPress={handleRegister}
          className="mt-4 mb-10"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
