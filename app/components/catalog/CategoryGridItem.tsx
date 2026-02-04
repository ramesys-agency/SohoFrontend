import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface CategoryGridItemProps {
  name: string;
  image: string;
  onPress?: () => void;
}

const CategoryGridItem: React.FC<CategoryGridItemProps> = ({
  name,
  image,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="flex-1 m-1 mb-4"
    >
      <View className="aspect-[3/4] rounded-xl overflow-hidden mb-2 bg-gray-100 shadow-sm border border-gray-100">
        <Image
          source={{ uri: image }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
      <Text
        className="text-lg text-black ml-1"
        style={{ fontFamily: "Classyvogue" }}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryGridItem;
