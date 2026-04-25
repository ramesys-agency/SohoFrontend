import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthButton } from "../../../components/auth/AuthButton";
import { AuthInput } from "../../../components/auth/AuthInput";
import { SocialLogin } from "../../../components/auth/SocialLogin";
import { IconSymbol } from "../../../components/ui/icon-symbol";

export default function RegisterStep1() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleContinue = () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }
    if (!termsAccepted) {
      Alert.alert("Error", "Please accept the terms and conditions.");
      return;
    }
    Alert.alert("Success", "OTP sent to email successfully.", [
      {
        text: "OK",
        onPress: () => {
          router.push({
            pathname: "/(auth)/register/verify",
            params: { email },
          });
        },
      },
    ]);
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
            Create an account
          </Text>
          <Text className="text-[#999999] text-sm font-Urbanist text-center px-10">
            Enter your personal details below to create an account now.
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

          <TouchableOpacity
            onPress={() => setTermsAccepted(!termsAccepted)}
            className="flex-row items-center mt-2"
          >
            <View
              className={`w-4 h-4 border rounded sm justify-center items-center mr-2 ${termsAccepted ? "bg-black border-black" : "border-[#CCCCCC]"}`}
            >
              {termsAccepted && (
                <IconSymbol
                  name="checkmark.circle.fill"
                  size={12}
                  color="white"
                />
              )}
            </View>
            <Text className="text-[#999999] text-[10px] font-Urbanist flex-1">
              By checking the box, you are agreeing to the{"\n"}Terms and
              conditions
            </Text>
          </TouchableOpacity>
        </View>

        <AuthButton
          title="Create account"
          onPress={handleContinue}
          disabled={!termsAccepted}
          className="mb-8"
        />

        <SocialLogin />

        <View className="mt-auto pb-10 flex-row justify-center">
          <Text className="text-[#999999] text-sm font-Urbanist">
            Already have an account?{" "}
          </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text className="text-black text-sm font-Urbanist-Bold">
                Log in
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
