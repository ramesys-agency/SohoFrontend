import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { authApi } from "../../api/auth.api";
import { AuthButton } from "../../components/auth/AuthButton";
import { AuthInput } from "../../components/auth/AuthInput";
import { SocialLogin } from "../../components/auth/SocialLogin";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { login, isLoading: isAuthLoading } = useAuthStore();
  const showToast = useToastStore((state) => state.showToast);

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      const { user, accessToken, refreshToken } = data;
      await login(user, accessToken, refreshToken);
      // showToast({ message: "Login successful!", type: "success" });
      // Navigation is handled by the protected layout effect automatically
    },
    onError: (error: any) => {
      console.error("Login failed:", error.response?.data || error.message);
      showToast({
        message:
          error?.response?.data?.error ||
          "Something went wrong. Please try again.",
        type: "error",
      });
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
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
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthInput
                label="Email"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <AuthInput
                label="Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                isPassword
                error={errors.password?.message}
              />
            )}
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

        <AuthButton
          title={
            loginMutation.isPending || isAuthLoading ? "Logging in..." : "Login"
          }
          onPress={handleSubmit(onSubmit)}
          className="mb-6"
        />

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
