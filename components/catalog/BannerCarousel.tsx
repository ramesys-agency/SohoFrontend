import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const BANNER_WIDTH = width - 32; // Screen width minus padding

interface BannerItem {
  id: string;
  name?: string;
  title?: string;
  subtitle?: string;
  discount?: string;
  image: string | null;
}

/** Generic over the item so callers can hang their own payload off each banner
 *  (the placement it was built from) and get it back typed in onPress. */
interface BannerProps<T extends BannerItem> {
  banners: T[];
  onPress?: (item: T) => void;
}

function BannerCarousel<T extends BannerItem>({ banners, onPress }: BannerProps<T>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setActiveIndex(roundIndex);
  };

  const renderItem = ({ item }: { item: T }) => {
    return (
      <View
        style={{ width: BANNER_WIDTH }}
        className="h-60 rounded-2xl overflow-hidden mr-4"
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => onPress && onPress(item)}
          className="flex-1"
        >
          <ImageBackground
            source={{ uri: item.image ?? "" }}
            className="w-full h-full justify-center px-6"
            resizeMode="cover"
          >
            <View className="bg-black/10 absolute inset-0" />
            {/* {displayTitle && (
              <Text
                className="text-white text-3xl mb-1"
                style={{ fontFamily: "Classyvogue" }}
              >
                {displayTitle}
              </Text>
            )} */}
            {item.subtitle && (
              <Text
                className="text-white text-base mb-4 opacity-90"
                style={{ fontFamily: "Urbanist" }}
              >
                {item.subtitle}
              </Text>
            )}
            {item.discount && (
              <Text
                className="text-white text-4xl font-Urbanist-Bold"
                style={{ fontFamily: "Urbanist" }}
              >
                {item.discount}
              </Text>
            )}
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  };

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
        {banners?.map((item, index) => (
          <View
            key={item.id}
            className={`h-2 rounded-full w-2 ${
              activeIndex === index ? "w-8 bg-gray-400" : "bg-gray-300"
            }`}
          />
        ))}
      </View>
    </View>
  );
}

export default BannerCarousel;
