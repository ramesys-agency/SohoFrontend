import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function AuthButton({
  title,
  onPress,
  loading,
  disabled,
  className = "",
}: AuthButtonProps) {
  const isDisabled = loading || disabled;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={`bg-black rounded-xl py-4 items-center justify-center ${className} ${
        isDisabled ? "opacity-50" : ""
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
