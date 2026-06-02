import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import type { HeroSlide } from "../../../api/homePromo.api";

const { width } = Dimensions.get("window");
const SLIDE_WIDTH = width - 32; // mx-4 on each side

interface HeroBannerProps {
  slides: HeroSlide[];
  loading?: boolean;
  onSlidePress?: (slide: HeroSlide) => void;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ slides, loading, onSlidePress }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  // Auto-scroll every 4 seconds when there are multiple slides
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      const next = (activeIndex + 1) % slides.length;
      scrollRef.current?.scrollTo({ x: next * SLIDE_WIDTH, animated: true });
      setActiveIndex(next);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeIndex, slides.length]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SLIDE_WIDTH);
    setActiveIndex(index);
  };

  if (loading) {
    return (
      <View
        className="bg-[#F2F2F2] rounded-2xl mx-4 overflow-hidden items-center justify-center"
        style={{ height: 208 }}
      >
        <ActivityIndicator color="#000" />
      </View>
    );
  }

  if (!slides.length) {
    return (
      <View
        className="bg-[#F2F2F2] rounded-2xl mx-4 overflow-hidden"
        style={{ height: 208 }}
      />
    );
  }

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        scrollEventThrottle={16}
        style={{ width: SLIDE_WIDTH, marginHorizontal: 16, borderRadius: 16, overflow: "hidden" }}
      >
        {slides.map((slide) => (
          <TouchableOpacity
            key={slide.placementId}
            activeOpacity={0.9}
            onPress={() => onSlidePress?.(slide)}
            style={{ width: SLIDE_WIDTH, height: 208 }}
          >
            <Image
              source={{ uri: slide.imageUrl }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Dot indicators — only when more than one slide */}
      {slides.length > 1 && (
        <View className="flex-row justify-center mt-3 gap-1.5">
          {slides.map((_, i) => (
            <View
              key={i}
              className={`rounded-full ${i === activeIndex ? "bg-black w-4 h-1.5" : "bg-[#CCCCCC] w-1.5 h-1.5"}`}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default HeroBanner;
