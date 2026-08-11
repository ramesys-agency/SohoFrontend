import React from "react";
import { ImageBackground, TouchableOpacity } from "react-native";

export interface OfferItem {
  id: string;
  title: string;
  subtitle: string;
  discount: string;
  image: { uri: string };
}

interface OfferCardProps {
  item: OfferItem;
  onPress?: () => void;
}

export default function OfferCard({ item, onPress }: OfferCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      className="mb-6 rounded-3xl overflow-hidden shadow-lg"
      style={{ height: 400 }}
    >
      <ImageBackground
        source={item.image}
        className="w-full h-full object-cover justify-end"
      >
        {/* <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          className="p-6 h-1/2 justify-end"
        >
          <Text
            className="text-white text-4xl mb-2"
            style={{ fontFamily: "Classyvogue" }}
          >
            {item.title}
          </Text>
          <Text className="text-white text-lg font-Urbanist mb-1">
            {item.subtitle}
          </Text>
          <Text className="text-white text-3xl font-Urbanist-Bold">
            {item.discount}
          </Text>
        </LinearGradient> */}
      </ImageBackground>
    </TouchableOpacity>
  );
}
