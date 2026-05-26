import React from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";

interface FeaturedSectionProps {
  title: string;
  description: string;
  images: any[];
  variant?: "large" | "collage" | "side" | "horizontal";
  onPress?: () => void;
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  title,
  description,
  images,
  variant = "large",
  onPress,
}) => {
  const renderImages = () => {
    switch (variant) {
      case "collage":
        return (
          <View className="flex-row mb-10">
            {/* Left side large image */}
            <View className="flex-1 mr-4">
              <Image
                source={images[0]}
                className="w-[160px] h-[260px] rounded-[2px]"
                resizeMode="cover"
              />
            </View>

            {/* Right side contents */}
            <View className="flex-1">
              <View>
                <View className="flex-row">
                  <View className="flex-1 mr-2 aspect-square">
                    {images[1] && (
                      <Image
                        source={images[1]}
                        className="w-[80px] h-[100px] rounded-[2px]"
                        resizeMode="cover"
                      />
                    )}
                  </View>
                  <View className="flex-1 aspect-square">
                    {images[2] && (
                      <Image
                        source={images[2]}
                        className="w-[80px] h-[100px] rounded-[2px]"
                        resizeMode="cover"
                      />
                    )}
                  </View>
                </View>

                <View className="mt-8">
                  <Image
                    source={require("../../../assets/images/arrow-down-right.png")}
                    className="w-5 h-5"
                    resizeMode="cover"
                  />
                  <Text
                    className="text-[20px] text-black leading-tight mt-4"
                    style={{ fontFamily: "Classyvogue" }}
                  >
                    {title}
                  </Text>
                  <Text className="text-gray-500 text-[10px] font-Urbanist mt-2 leading-relaxed">
                    {description}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        );
      case "side":
        return (
          <View className="flex-row items-center mb-6">
            <View className="flex-1 mr-4">
              <View className="mb-2 w-8 h-8">
                <Image
                  source={require("../../../assets/images/arrow-down-right.png")}
                  className="w-5 h-5"
                  resizeMode="cover"
                />
              </View>
              <Text
                className="text-[20px] text-black leading-tight"
                style={{ fontFamily: "Classyvogue" }}
              >
                {title}
              </Text>
              <Text className="text-gray-500 text-[12px] font-Urbanist mt-2 leading-relaxed">
                {description}
              </Text>
            </View>
            <View className="flex-1 h-80">
              <Image
                source={images[0]}
                className="w-full h-full rounded-[2px]"
                resizeMode="cover"
              />
            </View>
          </View>
        );
      case "horizontal":
        return (
          <View className="mb-8">
            <View className="h-64 rounded-[2px] overflow-hidden mb-4">
              <Image
                source={images[0]}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View className="px-1">
              <View className="mb-2 w-8 h-8">
                <Image
                  source={require("../../../assets/images/arrow-down-right.png")}
                  className="w-5 h-5"
                  resizeMode="cover"
                />
              </View>
              <Text
                className="text-[20px] text-black"
                style={{ fontFamily: "Classyvogue" }}
              >
                {title}
              </Text>
              <Text className="text-gray-500 text-[14px] font-Urbanist mt-1 leading-relaxed">
                {description}
              </Text>
            </View>
          </View>
        );
      default: // large
        return (
          <View className="mb-10">
            <View className="h-[450] rounded-[2px] overflow-hidden mb-4">
              <Image
                source={images[0]}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View className="px-1">
              <Text
                className="text-[30px] text-black"
                style={{ fontFamily: "Classyvogue" }}
              >
                {title}
              </Text>
              <Text className="text-gray-500 text-[14px] font-Urbanist mt-2 leading-relaxed">
                {description}
              </Text>
            </View>
          </View>
        );
    }
  };

  return (
    <TouchableOpacity activeOpacity={onPress ? 0.9 : 1} onPress={onPress}>
      {renderImages()}
    </TouchableOpacity>
  );
};

export default FeaturedSection;
