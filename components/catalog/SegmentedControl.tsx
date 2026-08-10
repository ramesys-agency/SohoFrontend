import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type Segment = {
  label: string;
  value: string;
};

type Props = {
  segments: Segment[];
  value: string;
  onChange: (value: string) => void;
};

export default function SegmentedControl({ segments, value, onChange }: Props) {
  return (
    <View className="flex-row bg-[#F2F2F7] rounded-xl p-1">
      {segments.map((segment) => {
        const isActive = segment.value === value;

        return (
          <TouchableOpacity
            key={segment.value}
            onPress={() => onChange(segment.value)}
            activeOpacity={0.85}
            className={`flex-1 py-3 rounded-lg items-center justify-center
              ${isActive ? "bg-white shadow-sm" : ""}
            `}
          >
            <Text
              className={`text-base ${
                isActive ? "text-black font-semibold" : "text-gray-500"
              }`}
              style={{ fontFamily: "Urbanist" }}
            >
              {segment.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
