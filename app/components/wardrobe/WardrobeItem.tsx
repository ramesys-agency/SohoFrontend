import { IconSymbol } from "@/components/ui/icon-symbol";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface WardrobeItemProps {
  item: {
    id: string;
    title: string;
    price: number;
    size: string;
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
      {/* Product Image */}
      <TouchableOpacity onPress={onPress}>
        <Image
          source={{ uri: item.image }}
          className="w-20 h-24 rounded-md"
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* Details */}
      <View className="flex-1 ml-3 h-24 justify-between py-1">
        <View>
          <View className="flex-row justify-between items-start">
            <Text
              className="text-base font-Urbanist-Bold text-gray-900 flex-1 mr-2"
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <TouchableOpacity onPress={onRemove} className="p-1">
              <IconSymbol name="trash" size={16} color="#666" />
            </TouchableOpacity>
          </View>

          <Text className="text-gray-500 text-xs mt-1">Size: {item.size}</Text>
        </View>

        <View className="flex-row justify-between items-end">
          <Text className="text-base font-Urbanist-Bold">
            ৳{item.price * item.quantity}
          </Text>

          {/* Quantity Controls */}
          <View className="flex-row items-center bg-white rounded-md border border-gray-200">
            <TouchableOpacity
              onPress={onDecrement}
              className="p-1 px-2 border-r border-gray-200"
            >
              <IconSymbol name="minus" size={14} color="#000" />
            </TouchableOpacity>

            <Text className="px-3 text-sm font-Urbanist-Bold">
              {item.quantity}
            </Text>

            <TouchableOpacity
              onPress={onIncrement}
              className="p-1 px-2 border-l border-gray-200"
            >
              <IconSymbol name="plus" size={14} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
