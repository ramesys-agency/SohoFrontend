import { Feather } from "@expo/vector-icons";
import React from "react";
import {
    ActivityIndicator,
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
  onAddToCart: () => void;
  isAddingToCart?: boolean;
  isInCart?: boolean;
  onPress?: () => void;
}

const WishlistItem: React.FC<WishlistItemProps> = ({
  image,
  name,
  size,
  price,
  onDelete,
  onAddToCart,
  isAddingToCart = false,
  isInCart = false,
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

      {/* Action Buttons */}
      <View className="flex-row items-center gap-2 mr-3">
        {/* Add to Cart Button */}
        <TouchableOpacity
          onPress={onAddToCart}
          disabled={isAddingToCart || isInCart}
          className={`w-10 h-10 items-center justify-center rounded-xl shadow-sm ${
            isInCart ? "bg-white border border-gray-200" : "bg-black"
          }`}
        >
          {isAddingToCart ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : isInCart ? (
            <Feather name="archive" size={16} color="#000" />
          ) : (
            <Feather name="shopping-cart" size={16} color="#fff" />
          )}
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity
          onPress={onDelete}
          className="w-10 h-10 items-center justify-center bg-white rounded-xl border border-gray-200 shadow-sm"
        >
          <Feather name="trash-2" size={16} color="#DB0034" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WishlistItem;
