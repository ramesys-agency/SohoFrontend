import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const slides = [
  {
    id: 1,
    title: "Find Looks You love",
    description:
      "From timeless classics to trending pieces- Shop what fits the vibe.",
    image: require("../assets/images/walkthrough1.png"),
  },
  {
    id: 2,
    title: "First Purchase Special Offer",
    description: "Enjoy exclusive offer when you sign up today.",
    image: require("../assets/images/walkthrough2.png"),
  },
];

type AppState = "splash" | "loading" | "onboarding";

export default function AppEntry() {
  const router = useRouter();
  const [appState, setAppState] = useState<AppState>("splash");
  const [loadingDotIndex, setLoadingDotIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reanimated shared values
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    if (appState === "splash") {
      // Small delay before starting fade in to ensure component is fully grounded
      const startTimer = setTimeout(() => {
        opacity.value = withTiming(1, { duration: 800 });
        scale.value = withTiming(1, {
          duration: 800,
          easing: Easing.out(Easing.back(1.5)),
        });
      }, 100);

      // Total time on splash (including fade in)
      const exitTimer = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 400 }, (finished) => {
          if (finished) runOnJS(setAppState)("loading");
        });
      }, 2500);

      return () => {
        clearTimeout(startTimer);
        clearTimeout(exitTimer);
      };
    }

    if (appState === "loading") {
      // Ensure it starts hidden for the new transition
      opacity.value = 0;
      scale.value = 0.95;
      opacity.value = withTiming(1, { duration: 400 });
      scale.value = withTiming(1, { duration: 400 });

      const loadingTimer = setTimeout(() => {
        setAppState("onboarding");
      }, 3000);

      const dotInterval = setInterval(() => {
        setLoadingDotIndex((prev) => (prev + 1) % 4);
      }, 200); // Fast dots

      return () => {
        clearTimeout(loadingTimer);
        clearInterval(dotInterval);
      };
    }
  }, [appState]);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.replace("/(auth)/login");
    }
  };

  const handleSkip = () => {
    router.replace("/(auth)/login");
  };

  if (appState === "splash") {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Animated.View style={animatedStyle}>
          <Text
            style={{ fontFamily: "AlexBrush", fontSize: 100 }}
            className="text-black"
          >
            Soho
          </Text>
        </Animated.View>
      </View>
    );
  }

  if (appState === "loading") {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Animated.View style={animatedStyle} className="items-center">
          <Text className="text-6xl font-Classyvogue mb-10">Soho</Text>
          <View className="flex-row gap-3">
            {[0, 1, 2, 3].map((idx) => (
              <View
                key={idx}
                className={`w-2 h-2 rounded-full ${
                  idx === loadingDotIndex ? "bg-black" : "bg-[#E5E5E5]"
                }`}
              />
            ))}
          </View>
        </Animated.View>
      </View>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Image Container with rounded bottom */}
      <View className="h-[60%] bg-black overflow-hidden rounded-b-[40px]">
        <Image
          source={currentSlide.image}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      {/* Content Section */}
      <View className="flex-1 px-10 pt-10 items-center">
        {/* Pagination Dots */}
        <View className="flex-row gap-2 mb-10">
          {slides.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full ${
                index === currentIndex ? "w-8 bg-black" : "w-8 bg-[#E5E5E5]"
              }`}
            />
          ))}
        </View>

        <Text className="text-4xl font-Classyvogue text-center mb-4 leading-tight">
          {currentSlide.title}
        </Text>
        <Text className="text-[#999999] text-base font-Urbanist text-center mb-10">
          {currentSlide.description}
        </Text>

        {/* Footer Buttons */}
        <View className="mt-auto w-full flex-row justify-between items-center pb-8">
          <TouchableOpacity onPress={handleSkip}>
            <Text className="text-[#999999] text-base font-Urbanist underline">
              skip
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            className="bg-[#D9D9D9] px-10 py-3 rounded-xl"
          >
            <Text className="text-black text-base font-Urbanist-Bold">
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
