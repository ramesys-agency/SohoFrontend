import React, { useState } from "react";
import {
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
} from "react-native";
import { IconSymbol } from "../ui/icon-symbol";

interface AuthInputProps extends TextInputProps {
  label: string;
  isPassword?: boolean;
  error?: string;
}

export function AuthInput({
  label,
  isPassword,
  error,
  ...props
}: AuthInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View className="mb-4">
      <View
        className={`bg-[#F2F2F2] rounded-xl px-4 py-3 border ${
          isFocused ? "border-[#0055D4]" : "border-transparent"
        }`}
      >
        <Text className="text-[#999999] text-xs font-Urbanist mb-1">
          {label}
        </Text>
        <View className="flex-row items-center">
          <TextInput
            {...props}
            secureTextEntry={isPassword && !isPasswordVisible}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className="flex-1 text-[#000000] text-base font-Urbanist-Medium p-0"
            placeholderTextColor="#999999"
          />
          {isPassword && (
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <IconSymbol name="eye" size={20} color="#000000" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {error && (
        <View className="flex-row items-center mt-1">
          <IconSymbol
            name="exclamationmark.circle.fill"
            size={14}
            color="#FF0000"
          />
          <Text className="text-[#999999] text-xs font-Urbanist ml-1">
            {error}
          </Text>
        </View>
      )}
    </View>
  );
}
