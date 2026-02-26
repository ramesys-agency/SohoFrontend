import React from "react";
import { Text, View } from "react-native";

interface ProductHeaderProps {
  name: string;
  price: string;
  originalPrice: string;
  rating: number;
}

export default function ProductHeader({
  name,
  price,
  originalPrice,
  rating,
}: ProductHeaderProps) {
  return (
    <>
      {/* Name & Price */}
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1 mr-4">
          <Text
            className="text-3xl text-black leading-tight mb-2"
            style={{ fontFamily: "Classyvogue" }}
          >
            {name}
          </Text>
        </View>
        <View className="items-end">
          <Text
            className="text-2xl text-black font-semibold"
            style={{ fontFamily: "UrbanistBold" }}
          >
            {price}
          </Text>
          <Text
            className="text-lg text-gray-400 line-through"
            style={{ fontFamily: "Urbanist" }}
          >
            {originalPrice}
          </Text>
        </View>
      </View>

      {/* Star Rating */}
      {/* <View className="flex-row items-center mb-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <AntDesign
            key={i}
            name="star"
            size={16}
            color="#FFD700"
            className="mr-1"
          />
        ))}
      </View> */}
    </>
  );
}
