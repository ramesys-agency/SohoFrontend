import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export interface ColorOption {
  /** Display name, used as the selection key (e.g. "Red", "White") */
  name: string;
  /** CSS hex color value for the swatch (e.g. "#FF0000") */
  value: string;
}

interface ColorSelectorProps {
  colors: ColorOption[];
  selectedColor: string; // stores the color name
  onSelectColor: (colorName: string) => void;
}

export default function ColorSelector({
  colors,
  selectedColor,
  onSelectColor,
}: ColorSelectorProps) {
  return (
    <View className="mb-6">
      <Text
        className="text-lg text-black mb-3"
        style={{ fontFamily: "Urbanist" }}
      >
        Color
      </Text>
      <View className="flex-row gap-2">
        {colors.map((color) => (
          <TouchableOpacity
            key={color.name}
            onPress={() => onSelectColor(color.name)}
            className={`w-8 h-8 rounded-full items-center justify-center border border-black ${
              selectedColor === color.name ? "border-2 " : "border-1"
            }`}
            style={{ backgroundColor: color.value }}
          >
            {selectedColor === color.name && (
              <Feather
                name="check"
                size={16}
                color={
                  color.value === "#FFFFFF" || color.value === "#F0F0F0"
                    ? "black"
                    : "white"
                }
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
