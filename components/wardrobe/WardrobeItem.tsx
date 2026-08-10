import { IconSymbol } from "@/components/ui/icon-symbol";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface WardrobeItemProps {
  item: {
    id: string;
    title: string;
    price: number;
    size: string;
    color?: string;
    image: string;
    quantity: number;
  };
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
  onPress: () => void;
}

export default function WardrobeItem({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  onPress,
}: WardrobeItemProps) {
  return (
    <View className="flex-row items-center bg-[#F3F3F3] p-3 rounded-lg mb-3">
      {/* Clickable Area: Image + Text info */}
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className="flex-row items-center flex-1"
      >
        {/* Product Image */}
        <View className="w-20 h-24 rounded-md overflow-hidden bg-gray-200">
          <Image
            source={{ uri: item.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Details Text */}
        <View className="flex-1 ml-3 h-24 justify-between py-1">
          <View>
            <Text
              className="text-base font-Urbanist-Bold text-gray-900 mr-2"
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text className="text-gray-500 text-xs mt-1">
              Size: {item.size} {item.color ? `• Color: ${item.color}` : ""}
            </Text>
          </View>
          <Text className="text-base font-Urbanist-Bold text-black">
            ৳{(item.price * item.quantity).toLocaleString()}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Right Column: Independent Controls */}
      <View className="ml-2 h-24 justify-between items-end py-1">
        <TouchableOpacity onPress={onRemove} className="p-1">
          <IconSymbol name="trash" size={18} color="#666" />
        </TouchableOpacity>

        {/* Quantity Controls */}
        <View className="flex-row items-center bg-white rounded-md border border-gray-200 overflow-hidden">
          <TouchableOpacity
            onPress={onDecrement}
            className="p-1.5 px-2.5 border-r border-gray-200"
          >
            <IconSymbol name="minus" size={12} color="#000" />
          </TouchableOpacity>

          <Text className="px-3 text-sm font-Urbanist-Bold">
            {item.quantity}
          </Text>

          <TouchableOpacity
            onPress={onIncrement}
            className="p-1.5 px-2.5 border-l border-gray-200"
          >
            <IconSymbol name="plus" size={12} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
