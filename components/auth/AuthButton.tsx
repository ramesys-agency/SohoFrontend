import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  className?: string;
}

export function AuthButton({
  title,
  onPress,
  loading,
  className = "",
}: AuthButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      className={`bg-black rounded-xl py-4 items-center justify-center ${className} ${
        loading ? "opacity-70" : ""
      }`}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-white text-base font-Urbanist-Bold">{title}</Text>
      )}
    </TouchableOpacity>
  );
}
