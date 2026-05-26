import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export interface ColorOption {
  /** Display name, used as the selection key (e.g. "Red", "White") */
  name: string;
  /** CSS hex color value for the swatch (e.g. "#FF0000") */
  value: string;
  /** Whether the color has any stock available */
  inStock?: boolean;
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
            disabled={false}
            onPress={() => onSelectColor(color.name)}
            className={`w-8 h-8 rounded-full items-center justify-center border relative overflow-hidden ${
              selectedColor === color.name ? "border-2 border-black" : "border-gray-300"
            }`}
            style={{ backgroundColor: color.value, opacity: color.inStock === false ? 0.4 : 1 }}
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
            {color.inStock === false && (
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
