import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
}

export default function SizeSelector({
  sizes,
  selectedSize,
  onSelectSize,
}: SizeSelectorProps) {
  return (
    <View className="mb-8">
      <Text
        className="text-lg text-black mb-3"
        style={{ fontFamily: "Urbanist" }}
      >
        Size
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {sizes.map((size) => (
          <TouchableOpacity
            key={size}
            onPress={() => onSelectSize(size)}
            className={`w-10 h-10 rounded-full items-center justify-center border border-black ${
              selectedSize === size
                ? "bg-black border-2"
                : "bg-gray-100 border-1"
            }`}
          >
            <Text
              className={`text-base ${
                selectedSize === size ? "text-white" : "text-black"
              }`}
              style={{ fontFamily: "Urbanist" }}
            >
              {size}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
