import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authApi } from "../../../api/auth.api";
import { AuthButton } from "../../../components/auth/AuthButton";
import { IconSymbol } from "../../../components/ui/icon-symbol";

export default function VerifyOTP() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(266); // 4:26 in seconds
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}s`;
  };

  const handleContinue = async () => {
    if (otp.length < 6) {
      Alert.alert("Error", "Please enter the 6-digit OTP.");
      return;
    }

    try {
      setIsLoading(true);
      await authApi.verifyOtp({ email: email ?? "", otp });
      router.push({
        pathname: "/(auth)/register/details",
        params: { email },
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Invalid OTP. Please try again.";
      Alert.alert("Error", message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    try {
      setIsResending(true);
      await authApi.sendOtp({ email: email ?? "" });
      setOtp("");
      setTimer(266);
    } catch (error: any) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Failed to resend OTP. Please try again.";
      Alert.alert("Error", message);
    } finally {
      setIsResending(false);
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
          className="w-10 h-10 bg-[#F2F2F2] rounded-full items-center justify-center mb-10"
        >
          <IconSymbol name="chevron.left" size={20} color="#000000" />
        </TouchableOpacity>

        <View className="items-center mb-10">
          <Text className="text-4xl font-Classyvogue mb-4 text-center">
            Verify email address
          </Text>
          <Text className="text-[#999999] text-sm font-Urbanist text-center">
            Enter the{" "}
            <Text className="text-black font-Urbanist-Bold">6 digits OTP</Text>{" "}
            code sent to{"\n"}your email address
          </Text>
          <Text className="text-black font-Urbanist-Bold text-sm text-center mt-1">
            {email || "m**********@gmail.com"}
          </Text>
        </View>

        <View className="mb-10">
          <TextInput
            ref={inputRef}
            value={otp}
            onChangeText={(text) => {
              if (text.length <= 6) setOtp(text);
            }}
            keyboardType="number-pad"
            style={{ position: "absolute", opacity: 0, height: 0, width: 0 }}
            autoFocus
          />
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => inputRef.current?.focus()}
            className="flex-row justify-between px-2"
          >
            {[0, 1, 2, 3, 4, 5].map((index) => {
              const digit = otp[index];
              const isFocused =
                otp.length === index || (otp.length === 6 && index === 5);
              return (
                <View
                  key={index}
                  className={`w-12 h-14 bg-[#F2F2F2] rounded-xl items-center justify-center border-2 ${
                    isFocused ? "border-[#0055D4]" : "border-transparent"
                  }`}
                >
                  <Text className="text-xl font-Urbanist-Bold">
                    {digit || ""}
                  </Text>
                </View>
              );
            })}
          </TouchableOpacity>
        </View>

        <View className="items-center mb-10">
          <Text className="text-[#999999] text-sm font-Urbanist mb-6">
            Code expires in{" "}
            <Text className="text-black font-Urbanist-Bold">
              {formatTime(timer)}
            </Text>
          </Text>

          <View className="flex-row">
            <Text className="text-[#999999] text-sm font-Urbanist">
              Didn&apos;t get code?{" "}
            </Text>
            <TouchableOpacity
              onPress={handleResend}
              disabled={timer > 0 || isResending}
            >
              <Text
                className={`text-sm font-Urbanist-Bold ${timer > 0 || isResending ? "text-[#999999]" : "text-black"}`}
              >
                {isResending ? "Sending..." : "Resend code"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <AuthButton
          title={isLoading ? "Verifying..." : "Continue"}
          onPress={handleContinue}
          disabled={isLoading}
          className="mt-auto mb-10"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
