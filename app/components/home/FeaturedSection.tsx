import { Image as ExpoImage } from "expo-image";
import React from "react";
import { Image, Text, View } from "react-native";

interface FeaturedSectionProps {
  title: string;
  description: string;
  images: any[];
  variant?: "large" | "collage" | "side" | "horizontal";
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  title,
  description,
  images,
  variant = "large",
}) => {
  const renderImages = () => {
    switch (variant) {
      case "collage":
        return (
          <View className="mb-10">
            <View className="flex-row h-72 mb-4">
              <View className="flex-[2] mr-2">
                <Image
                  source={images[0]}
                  className="w-full h-full rounded-2xl"
                  resizeMode="cover"
                />
              </View>
              <View className="flex-1">
                {images[1] && (
                  <View className="flex-1 mb-2">
                    <Image
                      source={images[1]}
                      className="w-full h-full rounded-2xl"
                      resizeMode="cover"
                    />
                  </View>
                )}
                {images[2] && (
                  <View className="flex-1">
                    <Image
                      source={images[2]}
                      className="w-full h-full rounded-2xl"
                      resizeMode="cover"
                    />
                  </View>
                )}
              </View>
            </View>
            <View className="px-1">
              <Text
                className="text-3xl text-black"
                style={{ fontFamily: "Classyvogue" }}
              >
                {title}
              </Text>
              <Text className="text-gray-500 text-xs font-Urbanist mt-2 leading-relaxed">
                {description}
              </Text>
            </View>
          </View>
        );
      case "side":
        return (
          <View className="flex-row items-center mb-6">
            <View className="flex-1 mr-4">
              <View className="mb-2 w-8 h-8">
                <ExpoImage
                  source={require("../../../assets/images/ArrowDown.svg")}
                  className="w-full h-full"
                  contentFit="contain"
                  style={{ transform: [{ rotate: "45deg" }] }}
                />
              </View>
              <Text
                className="text-3xl text-black leading-tight"
                style={{ fontFamily: "Classyvogue" }}
              >
                {title}
              </Text>
              <Text className="text-gray-500 text-xs font-Urbanist mt-2 leading-relaxed">
                {description}
              </Text>
            </View>
            <View className="flex-1 h-80">
              <Image
                source={images[0]}
                className="w-full h-full rounded-2xl"
                resizeMode="cover"
              />
            </View>
          </View>
        );
      case "horizontal":
        return (
          <View className="mb-8">
            <View className="h-64 rounded-2xl overflow-hidden mb-4">
              <Image
                source={images[0]}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View className="px-1">
              <View className="mb-2 w-8 h-8">
                <ExpoImage
                  source={require("../../../assets/images/ArrowDown.svg")}
                  className="w-full h-full"
                  contentFit="contain"
                />
              </View>
              <Text
                className="text-3xl text-black"
                style={{ fontFamily: "Classyvogue" }}
              >
                {title}
              </Text>
              <Text className="text-gray-500 text-xs font-Urbanist mt-1 leading-relaxed">
                {description}
              </Text>
            </View>
          </View>
        );
      default: // large
        return (
          <View className="mb-10">
            <View className="h-[450] rounded-2xl overflow-hidden mb-4">
              <Image
                source={images[0]}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View className="px-1">
              <Text
                className="text-4xl text-black"
                style={{ fontFamily: "Classyvogue" }}
              >
                {title}
              </Text>
              <Text className="text-gray-500 text-sm font-Urbanist mt-2 leading-relaxed">
                {description}
              </Text>
            </View>
          </View>
        );
    }
  };

  return <View className="px-4">{renderImages()}</View>;
};

export default FeaturedSection;
