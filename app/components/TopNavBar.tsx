import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface TopNavBarProps {
  title?: string;
}

const TopNavBar: React.FC<TopNavBarProps> = ({ title }) => {
  return (
    <View className="bg-white px-4 pb-2">
      <View className="flex-row justify-end items-center pt-4 pr-1">
        <View className="flex-row gap-x-5">
          <TouchableOpacity activeOpacity={0.7}>
            <Feather name="search" size={26} color="black" />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} className="relative">
            <Feather name="bell" size={26} color="black" />
            <View className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="items-center -mt-4">
        <Text
          className="text-8xl text-black"
          style={{ fontFamily: "Classyvogue" }}
        >
          {title || "Soho"}
        </Text>
      </View>
    </View>
  );
};

export default TopNavBar;
