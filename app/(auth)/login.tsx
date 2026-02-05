import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthButton } from "../../components/auth/AuthButton";
import { AuthInput } from "../../components/auth/AuthInput";
import { SocialLogin } from "../../components/auth/SocialLogin";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("milansarker4321@gmail.com");
  const [password, setPassword] = useState("Nothing");

  const handleLogin = () => {
    // Navigate to home tabs
    router.replace("/(tabs)/home");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingTop: 60,
        }}
      >
        <View className="items-center mb-10">
          <Text className="text-4xl font-Classyvogue mb-2">Login</Text>
          <Text className="text-[#999999] text-sm font-Urbanist text-center px-10">
            Enter your personal details below to proceed
          </Text>
        </View>

        <View className="mb-6">
          <AuthInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <AuthInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            isPassword
          />
          <TouchableOpacity
            onPress={() => router.push("/(auth)/forgot-password")}
            className="self-end"
          >
            <Text className="text-[#999999] text-xs font-Urbanist">
              Forgotten your password?
            </Text>
          </TouchableOpacity>
        </View>

        <AuthButton title="Login" onPress={handleLogin} className="mb-6" />

        <View className="flex-row justify-center">
          <Text className="text-[#999999] text-sm font-Urbanist">
            Don&apos;t have an account?{" "}
          </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text className="text-black text-sm font-Urbanist-Bold">
                Sign up
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View className="mt-auto pb-10">
          <SocialLogin />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
