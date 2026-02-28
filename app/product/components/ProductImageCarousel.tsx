import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from "react-native";
import Animated from "react-native-reanimated";

const { width } = Dimensions.get("window");

interface ProductImageCarouselProps {
  images: string[];
  activeImageIndex: number;
  imageHeight: number;
  headerStyle: object;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export default function ProductImageCarousel({
  images,
  activeImageIndex,
  imageHeight,
  headerStyle,
  onScroll,
}: ProductImageCarouselProps) {
  return (
    <Animated.View style={[{ height: imageHeight }, headerStyle]}>
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{ width, height: imageHeight }}
            resizeMode="cover"
          />
        )}
      />

      {/* Pagination Dots */}
      <View className="absolute bottom-16 left-4 flex-row gap-2">
        {images.map((_, index) => (
          <View
            key={index}
            className={`h-2 w-2 rounded-full ${
              activeImageIndex === index
                ? "scale-[1.5] bg-white"
                : "bg-white/50"
            }`}
          />
        ))}
      </View>
    </Animated.View>
  );
}
