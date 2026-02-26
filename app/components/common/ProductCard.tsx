import { AntDesign, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: string;
  rating: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  image,
  price,
  rating,
}) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push(`/product/${id}`)}
      className="flex-1 m-2 mb-4"
    >
      <View className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2 bg-gray-100">
        <Image
          source={{ uri: image }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <TouchableOpacity
          className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full items-center justify-center shadow-sm"
          activeOpacity={0.7}
        >
          <Feather name="heart" size={16} color="black" />
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between items-center">
        <Text
          className="text-base text-black flex-1 mr-2"
          numberOfLines={1}
          style={{ fontFamily: "Urbanist" }}
        >
          {name}
        </Text>
        <View className="flex-row items-center">
          <Text
            className="text-xs text-black font-Urbanist-Bold mr-1"
            style={{ fontFamily: "Urbanist" }}
          >
            {rating}
          </Text>
          <AntDesign name="star" size={12} color="#FFD700" />
        </View>
      </View>

      <View className="flex-row justify-between items-center">
        <Text
          className="text-lg text-black font-Urbanist-Bold mt-1"
          numberOfLines={1}
        >
          Price
        </Text>
        <Text className="text-lg text-black font-Urbanist-Bold">৳ {price}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
