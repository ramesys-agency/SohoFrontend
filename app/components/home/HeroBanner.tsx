import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

interface HeroBannerProps {
  image: any;
  onPress?: () => void;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ image, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="bg-[#F2F2F2] rounded-2xl mx-4 overflow-hidden flex-row items-center h-52"
    >
      <View className="flex-1 h-full">
        <Image source={image} className="w-full h-full" resizeMode="cover" />
      </View>
    </TouchableOpacity>
  );
};

export default HeroBanner;
