import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SizeSelectorProps {
  sizes: { size: string; inStock: boolean }[];
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
        {sizes.map((item) => (
          <TouchableOpacity
            key={item.size}
            disabled={!item.inStock}
            onPress={() => onSelectSize(item.size)}
            className={`w-10 h-10 rounded-full items-center justify-center border relative overflow-hidden ${
              !item.inStock
                ? "border-gray-200 bg-gray-50 opacity-40"
                : selectedSize === item.size
                ? "bg-black border-black border-2"
                : "bg-gray-100 border-gray-200 border-1"
            }`}
          >
            <Text
              className={`text-base ${
                !item.inStock
                  ? "text-gray-400"
                  : selectedSize === item.size
                  ? "text-white"
                  : "text-black"
              }`}
              style={{ fontFamily: "Urbanist" }}
            >
              {item.size}
            </Text>
            {!item.inStock && (
              <View
                style={{
                  position: "absolute",
                  width: "140%",
                  height: 1.5,
                  backgroundColor: "#EF4444",
                  transform: [{ rotate: "45deg" }],
                }}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
