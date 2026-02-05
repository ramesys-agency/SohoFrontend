import { Feather } from "@expo/vector-icons";
import React from "react";
import {
    Image,
    ImageSourcePropType,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface WishlistItemProps {
  image: ImageSourcePropType;
  name: string;
  size: string;
  price: string;
  onDelete: () => void;
}

const WishlistItem: React.FC<WishlistItemProps> = ({
  image,
  name,
  size,
  price,
  onDelete,
}) => {
  return (
    <View className="flex-row items-center bg-[#F3F3F3] mb-3 rounded-lg">
      {/* Product Image */}
      <View className="w-24 h-28 rounded-xl overflow-hidden bg-gray-200">
        <Image source={image} className="w-full h-full" resizeMode="cover" />
      </View>

      {/* Product Details */}
      <View className="flex-1 ml-3 justify-center">
        <Text
          className="text-lg text-black"
          style={{ fontFamily: "Classyvogue" }}
        >
          {name}
        </Text>
        <Text className="text-sm text-gray-500 mb-2">Size: {size}</Text>
        <Text className="text-base font-Urbanist-Bold text-black">{price}</Text>
      </View>

      {/* Delete Button */}
      <TouchableOpacity
        onPress={onDelete}
        className="w-8 h-8 items-center justify-center bg-white rounded-xl border border-gray-200 mr-3 mb-12 "
      >
        <Feather name="trash-2" size={14} color="#666" />
      </TouchableOpacity>
    </View>
  );
};

export default WishlistItem;
