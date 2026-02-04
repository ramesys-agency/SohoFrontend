import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const BANNER_WIDTH = width - 32; // Screen width minus padding

interface BannerItem {
  id: string;
  title: string;
  subtitle: string;
  discount: string;
  image: string;
}

interface BannerCarouselProps {
  banners: BannerItem[];
}

const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setActiveIndex(roundIndex);
  };

  const renderItem = ({ item }: { item: BannerItem }) => (
    <View
      style={{ width: BANNER_WIDTH }}
      className="h-60 rounded-2xl overflow-hidden mr-4"
    >
      <ImageBackground
        source={{ uri: item.image }}
        className="w-full h-full justify-center px-6"
        resizeMode="cover"
      >
        <View className="bg-black/10 absolute inset-0" />
        <Text
          className="text-white text-3xl mb-1"
          style={{ fontFamily: "Classyvogue" }}
        >
          {item.title}
        </Text>
        <Text
          className="text-white text-base mb-4 opacity-90"
          style={{ fontFamily: "Urbanist" }}
        >
          {item.subtitle}
        </Text>
        <Text
          className="text-white text-4xl font-bold"
          style={{ fontFamily: "Urbanist" }}
        >
          {item.discount}
        </Text>
      </ImageBackground>
    </View>
  );

  return (
    <View className="my-6">
      <FlatList
        ref={flatListRef}
        data={banners}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        snapToInterval={BANNER_WIDTH + 16} // interval includes margin
        decelerationRate="fast"
      />

      {/* Pagination Dots */}
      <View className="flex-row justify-center mt-4 gap-x-2">
        {banners.map((_, index) => (
          <View
            key={index}
            className={`h-2 rounded-full ${
              activeIndex === index ? "w-8 bg-gray-400" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </View>
    </View>
  );
};

export default BannerCarousel;
