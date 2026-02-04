import { Feather } from "@expo/vector-icons";
import { NavigationContext } from "@react-navigation/native";
import React, { useContext } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface SubHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  hideSearch?: boolean;
  hideNotification?: boolean;
}

const SubHeader: React.FC<SubHeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  hideSearch = false,
  hideNotification = false,
}) => {
  // Safely access navigation context - it may not be available if not within NavigationContainer
  const navigation = useContext(NavigationContext);

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation?.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View className="bg-white px-4">
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
          {!hideSearch && (
            <TouchableOpacity activeOpacity={0.7}>
              <Feather name="search" size={26} color="black" />
            </TouchableOpacity>
          )}
          {!hideNotification && (
            <TouchableOpacity activeOpacity={0.7}>
              <Feather name="bell" size={26} color="black" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default SubHeader;
