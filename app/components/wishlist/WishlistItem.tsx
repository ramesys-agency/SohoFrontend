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
  onPress?: () => void;
}

const WishlistItem: React.FC<WishlistItemProps> = ({
  image,
  name,
  size,
  price,
  onDelete,
  onPress,
}) => {
  return (
    <View className="flex-row items-center bg-[#F3F3F3] mb-3 rounded-lg overflow-hidden">
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className="flex-1 flex-row items-center"
      >
        {/* Product Image */}
        <View className="w-24 h-28 bg-gray-200">
          <Image source={image} className="w-full h-full" resizeMode="cover" />
        </View>

        {/* Product Details */}
        <View className="flex-1 ml-3 justify-center py-2">
          <Text
            className="text-lg text-black"
            style={{ fontFamily: "Classyvogue" }}
          >
            {name}
          </Text>
          <Text className="text-sm text-gray-500 mb-2">Size: {size}</Text>
          <Text className="text-base font-Urbanist-Bold text-black">{price}</Text>
        </View>
      </TouchableOpacity>

      {/* Delete Button */}
      <TouchableOpacity
        onPress={onDelete}
        className="w-10 h-10 items-center justify-center bg-white rounded-xl border border-gray-200 mr-3 shadow-sm"
      >
        <Feather name="trash-2" size={16} color="#DB0034" />
      </TouchableOpacity>
    </View>
  );
};

export default WishlistItem;
