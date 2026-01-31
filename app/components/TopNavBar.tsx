import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface TopNavBarProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  showCategorySelector?: boolean;
}

const TopNavBar: React.FC<TopNavBarProps> = ({
  title = "Catalog",
  showBackButton = false,
  onBackPress,
}) => {
  const navigation = useNavigation<any>();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View className="bg-white px-4 pb-2">
      {/* Top Header */}
      <View className="flex-row justify-between items-center py-4">
        <View className="flex-row items-center flex-1">
          {showBackButton && (
            <TouchableOpacity
              onPress={handleBackPress}
              className="mr-3 w-9 h-9 items-center justify-center bg-[#F2F2F7] rounded-full -ml-1"
              activeOpacity={0.7}
            >
              <Feather name="chevron-left" size={20} color="black" />
            </TouchableOpacity>
          )}
          <Text
            className="text-4xl text-black tracking-tight"
            numberOfLines={1}
            style={{ fontFamily: "Classyvogue" }}
          >
            {title}
          </Text>
        </View>

        <View className="flex-row gap-x-5">
          <TouchableOpacity activeOpacity={0.7}>
            <Feather name="search" size={26} color="black" />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}>
            <Feather name="bell" size={26} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TopNavBar;
