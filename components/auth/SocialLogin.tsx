import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { IconSymbol } from "../ui/icon-symbol";
// import { GoogleSignin } from "@react-native-google-signin/google-signin";
// import * as AppleAuthentication from "expo-apple-authentication";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { authApi } from "../../api/auth.api";

export function SocialLogin() {
  const { login } = useAuthStore();
  const showToast = useToastStore((state) => state.showToast);

  useEffect(() => {
    // Initialize GoogleSignin
    // GoogleSignin.configure({
    //   webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || "",
    //   iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || "",
    //   scopes: ["email", "profile"],
    // });
  }, []);

  const handleAppleSignIn = async () => {
    /*
    try {
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (!isAvailable) {
        showToast({ message: "Apple Sign-In is not available on this device", type: "error" });
        return;
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error("No identity token received from Apple");
      }

      // Extract optional name if provided (only provided on first login)
      const firstName = credential.fullName?.givenName || undefined;
      const lastName = credential.fullName?.familyName || undefined;

      const result = await authApi.appleLogin({
        identityToken: credential.identityToken,
        firstName,
        lastName,
      });

      const { user, accessToken, refreshToken } = result;
      await login(user, accessToken, refreshToken);
      showToast({ message: "Apple login successful!", type: "success" });
    } catch (error: any) {
      if (error.code === "ERR_REQUEST_CANCELED") {
        // user cancelled the sign-in flow
        return;
      }
      console.error("Apple Sign-In Error:", error);
      showToast({ 
        message: error.message || "Apple sign in failed.", 
        type: "error" 
      });
    }
    */
  };

  const handleGoogleSignIn = async () => {
    /*
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken;

      if (!idToken) {
        throw new Error("No ID token received from Google");
      }

      // Send the idToken to our backend
      const result = await authApi.googleLogin(idToken);
      
      const { user, accessToken, refreshToken } = result;
      await login(user, accessToken, refreshToken);
      showToast({ message: "Google login successful!", type: "success" });
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      showToast({ 
        message: error.message || "Google sign in failed.", 
        type: "error" 
      });
    }
    */
  };

  return (
    <View className="items-center mt-8">
      <Text className="text-[#999999] text-sm font-Urbanist mb-6">Or</Text>
      <View className="flex-row justify-center gap-x-4">
        <TouchableOpacity 
          className="w-14 h-14 bg-[#F2F2F2] rounded-xl items-center justify-center"
          onPress={handleAppleSignIn}
        >
          <IconSymbol name="apple.logo" size={24} color="#000000" />
        </TouchableOpacity>
        <TouchableOpacity 
          className="w-14 h-14 bg-[#F2F2F2] rounded-xl items-center justify-center"
          onPress={handleGoogleSignIn}
        >
          <IconSymbol name="google.logo" size={24} color="#000000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
