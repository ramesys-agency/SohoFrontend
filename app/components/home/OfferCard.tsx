import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ImageBackground, Text, TouchableOpacity } from "react-native";

export interface OfferItem {
  id: string;
  title: string;
  subtitle: string;
  discount: string;
  image: { uri: string };
}

interface OfferCardProps {
  item: OfferItem;
}

export const OfferCard = ({ item }: OfferCardProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      className="mb-6 rounded-3xl overflow-hidden shadow-lg"
      style={{ height: 400 }}
    >
      <ImageBackground
        source={item.image}
        className="w-full h-full justify-end"
      >
        <LinearGradient
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
          <Text className="text-white text-3xl font-bold">{item.discount}</Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};
