import { Feather, FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: string;
    image: any;
    rating: number;
  };
  onPress?: () => void;
  onFavoritePress?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onFavoritePress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="w-[48%] mb-6"
    >
      <View className="relative bg-[#F2F2F2] rounded-2xl overflow-hidden aspect-[3/4]">
        <Image
          source={product.image}
          className="w-full h-full"
          resizeMode="cover"
        />
        <TouchableOpacity
          onPress={onFavoritePress}
          className="absolute top-3 right-3 bg-white w-8 h-8 rounded-full items-center justify-center shadow-sm"
          activeOpacity={0.7}
        >
          <Feather name="heart" size={18} color="black" />
        </TouchableOpacity>
      </View>
      <View className="mt-2">
        <View className="flex-row justify-between items-center">
          <Text
            className="text-sm font-Urbanist text-gray-500 flex-1 mr-2"
            numberOfLines={1}
          >
            {product.name}
          </Text>
          <View className="flex-row items-center">
            <Text className="text-xs font-Urbanist text-black mr-1">
              {product.rating}
            </Text>
            <FontAwesome name="star" size={12} color="#FBBF24" />
          </View>
        </View>
        <View className="flex-row justify-between items-center mt-1">
          <Text className="text-sm font-Urbanist text-gray-800">Price</Text>
          <Text
            className="text-lg text-black"
            style={{ fontFamily: "Classyvogue" }}
          >
            ৳{product.price}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;
