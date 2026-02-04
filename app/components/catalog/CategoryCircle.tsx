import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface CategoryCircleProps {
  name: string;
  image: string;
  onPress?: () => void;
}

const CategoryCircle: React.FC<CategoryCircleProps> = ({
  name,
  image,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="items-center mr-6"
    >
      <View className="w-16 h-16 rounded-full overflow-hidden mb-2 bg-gray-100 border border-gray-100">
        <Image
          source={{ uri: image }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
      <Text
        className="text-xs text-gray-700"
        style={{ fontFamily: "Urbanist" }}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryCircle;
