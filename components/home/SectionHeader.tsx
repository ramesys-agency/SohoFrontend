import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  onSeeAllPress?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  onSeeAllPress,
}) => {
  return (
    <View className="flex-row justify-between items-end mb-4 px-4">
      <Text
        className="text-4xl text-black"
        style={{ fontFamily: "Classyvogue" }}
      >
        {title}
      </Text>
      {onSeeAllPress && (
        <TouchableOpacity
          onPress={onSeeAllPress}
          className="flex-row items-center mb-2"
          activeOpacity={0.7}
        >
          <Text className="text-gray-400 text-sm font-Urbanist mr-1">
            See All
          </Text>
          <Feather name="chevrons-right" size={16} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SectionHeader;
