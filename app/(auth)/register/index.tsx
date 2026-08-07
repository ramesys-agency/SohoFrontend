import { openLegalDocument } from "@/config/legal";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authApi } from "../../../api/auth.api";
import { AuthButton } from "../../../components/auth/AuthButton";
import { AuthInput } from "../../../components/auth/AuthInput";
import { SocialLogin } from "../../../components/auth/SocialLogin";
import { IconSymbol } from "../../../components/ui/icon-symbol";
import { useToastStore } from "../../../store/toastStore";

export default function RegisterStep1() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useToastStore((state) => state.showToast);

  const handleContinue = async () => {
    if (!email.trim()) {
      showToast({ message: "Please enter your email address.", type: "error" });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast({ message: "Please enter a valid email address.", type: "error" });
      return;
    }
    if (!termsAccepted) {
      showToast({
        message: "Please accept the Terms of Service and Privacy Policy.",
        type: "error",
      });
      return;
    }

    try {
      setIsLoading(true);
      await authApi.sendOtp({ email: email.trim().toLowerCase() });
      showToast({ message: "OTP sent successfully!", type: "success" });
      router.push({
        pathname: "/(auth)/register/verify",
        params: { email: email.trim().toLowerCase() },
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to send OTP. Please try again.";
      showToast({ message, type: "error" });
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

          {/*
            The checkbox and the two policy links are separate touch targets —
            nesting the links inside the row's TouchableOpacity would toggle the
            checkbox as well as open the document. App Review checks that a
            required consent actually leads to the documents it names.
          */}
          <View className="flex-row items-start mt-3">
            <TouchableOpacity
              onPress={() => setTermsAccepted(!termsAccepted)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              className={`w-4 h-4 mt-0.5 border rounded sm justify-center items-center mr-2 ${termsAccepted ? "bg-black border-black" : "border-[#CCCCCC]"}`}
            >
              {termsAccepted && (
                <IconSymbol
                  name="checkmark.circle.fill"
                  size={12}
                  color="white"
                />
              )}
            </TouchableOpacity>
            <Text className="text-[#999999] text-[12px] leading-[18px] font-Urbanist flex-1">
              By checking the box, you are agreeing to the{" "}
              <Text
                onPress={() => openLegalDocument("terms")}
                suppressHighlighting
                className="text-black font-Urbanist-Bold underline"
              >
                Terms of Service
              </Text>{" "}
              and{" "}
              <Text
                onPress={() => openLegalDocument("privacy")}
                suppressHighlighting
                className="text-black font-Urbanist-Bold underline"
              >
                Privacy Policy
              </Text>
              .
            </Text>
          </View>
        </View>

        <AuthButton
          title={isLoading ? "Sending OTP..." : "Create account"}
          onPress={handleContinue}
          disabled={!termsAccepted || isLoading}
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
