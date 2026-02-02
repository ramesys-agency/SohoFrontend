import { Feather } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface HeroBannerProps {
  title: string;
  subtitle: string;
  description: string;
  image: any;
  onPress?: () => void;
}

const HeroBanner: React.FC<HeroBannerProps> = ({
  title,
  subtitle,
  description,
  image,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className="bg-[#F2F2F2] rounded-2xl mx-4 overflow-hidden flex-row items-center h-52"
    >
      <View className="flex-1 p-6">
        <Text
          className="text-4xl text-black leading-tight"
          style={{ fontFamily: "Classyvogue" }}
        >
          {title}
        </Text>
        <Text className="text-black text-sm font-Urbanist mt-1">
          {subtitle}
        </Text>
        <Text className="text-black text-sm font-Urbanist mb-4">
          {description}
        </Text>

        <View className="bg-black rounded-full px-4 py-2 self-start flex-row items-center">
          <Text className="text-white text-xs font-Urbanist mr-1">
            Shop Now
          </Text>
          <Feather name="chevrons-right" size={14} color="white" />
        </View>
      </View>
      <View className="flex-1 h-full">
        <Image source={image} className="w-full h-full" resizeMode="cover" />
      </View>
    </TouchableOpacity>
  );
};

export default HeroBanner;
