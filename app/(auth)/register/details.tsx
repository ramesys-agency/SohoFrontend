import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthButton } from "../../../components/auth/AuthButton";
import { AuthInput } from "../../../components/auth/AuthInput";
import { IconSymbol } from "../../../components/ui/icon-symbol";

export default function RegisterStep2() {
  const router = useRouter();
  const [fullName, setFullName] = useState("Milan Sarker");
  const [phone, setPhone] = useState("01712345678");
  const [password, setPassword] = useState("..........");
  const [confirmPassword, setConfirmPassword] = useState("..........");

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
            Start shopping form soho.
          </Text>
        </View>

        <View className="mb-6">
          <AuthInput
            label="Full name"
            value={fullName}
            onChangeText={setFullName}
          />

          <View className="mb-4">
            <View className="bg-[#F2F2F2] rounded-xl px-4 py-3">
              <Text className="text-[#999999] text-xs font-Urbanist mb-1">
                Phone number
              </Text>
              <View className="flex-row items-center">
                <TouchableOpacity className="flex-row items-center mr-3 border-r border-[#CCCCCC] pr-3">
                  <View className="w-6 h-4 bg-green-700 mr-1" />
                  {/* BD Flag placeholder */}
                  <IconSymbol
                    name="chevron.right"
                    size={12}
                    color="#999999"
                    style={{ transform: [{ rotate: "90deg" }] }}
                  />
                </TouchableOpacity>
                <Text className="text-[#000000] text-base font-Urbanist-Medium">
                  01712345678
                </Text>
              </View>
            </View>
          </View>

          <AuthInput
            label="Create password"
            value={password}
            onChangeText={setPassword}
            isPassword
            error="Password must be at least 8 characters"
          />

          <AuthInput
            label="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            isPassword
          />
        </View>

        <AuthButton
          title="Continue"
          onPress={() => {
            router.push("/(auth)/register/verify");
          }}
          className="mt-4 mb-10"
        />
      </ScrollView>
    </SafeAreaView>
  );
}
