import ProductCard from "@/app/components/common/ProductCard";
import ReviewList, {
  RatingBreakdown,
  Review,
} from "@/app/components/product/ReviewList";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// Mock Data
const PRODUCT = {
  id: "1",
  name: "Rose Mist Luxe Long Kurta",
  price: "৳4,500",
  originalPrice: "৳5,500",
  rating: 4.8,
  description:
    "a lightweight, elegant look perfect for festive and refined everyday wear.",
  features: [
    "Length: Approx. knee-length",
    "Fit: Regular straight cut",
    "Fabric: Premium chiffon",
  ],
  images: [
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop", // Model
    "https://images.unsplash.com/photo-1585487000160-6ebcfceb00dc?q=80&w=800&auto=format&fit=crop", // Detail 1
    "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop", // Detail 2
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop", // Detail 3
  ],
  colors: ["#F0F0F0", "#3B4D61", "#BFA07A", "#E0C8B8"],
  sizes: ["XS", "S", "M", "L", "XL"],
};

const RELATED_PRODUCTS = [
  {
    id: "2",
    name: "Cotton Salwar",
    price: "৳2200",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb00dc?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Women Tops",
    price: "৳600",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=400&auto=format&fit=crop",
  },
];

const REVIEW_DATA: Review[] = [
  {
    id: "r1",
    user: {
      name: "Veronika",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    rating: 5,
    date: "just now",
    comment:
      "This is a beautiful Spring floral dress for your Spring look. Its elegance makes you ready for any occasion with subtle neckline.",
    sizeBought: "M",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop",
    ],
    likes: 124,
  },
  {
    id: "r2",
    user: {
      name: "James Doe",
    },
    rating: 4,
    date: "2 days ago",
    comment: "Great quality but a bit tight around the shoulders.",
    sizeBought: "L",
    likes: 12,
  },
  {
    id: "r3",
    user: {
      name: "Anonymous",
    },
    rating: 5,
    date: "1 week ago",
    // Empty comment and images to test empty state
  },
];

const RATING_BREAKDOWN: RatingBreakdown = {
  average: 4.5,
  totalCount: 104,
  counts: {
    1: 4, // reddish
    2: 6, // reddish
    3: 10, // green-ish
    4: 30, // green-ish
    5: 54, // green-ish
  },
};

const TABS = ["Details", "Shipping", "Reviews"];

export default function ProductDetailsScreen() {
  // const { id } = useLocalSearchParams(); // mock data used for now
  const router = useRouter();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(PRODUCT.colors[3]); // Default selected
  const [selectedSize, setSelectedSize] = useState("M");
  const [activeTab, setActiveTab] = useState("Details");

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveImageIndex(Math.round(index));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "Details":
        return (
          <View className="mt-4">
            <Text
              className="text-base text-gray-800 leading-6 mb-4"
              style={{ fontFamily: "Urbanist" }}
            >
              {PRODUCT.description}
            </Text>

            {PRODUCT.features.map((feature, index) => (
              <View key={index} className="flex-row items-center mb-2">
                <View className="w-4 h-[1px] bg-black mr-2" />
                <Text
                  className="text-base text-black"
                  style={{ fontFamily: "Urbanist" }}
                >
                  {feature}
                </Text>
              </View>
            ))}
            <View className="mt-6">
              <Text
                className="text-base font-semibold mb-2"
                style={{ fontFamily: "UrbanistBold" }}
              >
                Eco-Friendly Fashion
              </Text>
              <Text
                className="text-base text-gray-600 leading-6"
                style={{ fontFamily: "Urbanist" }}
              >
                This dress embodies sustainable fashion practices, woven from
                eco-friendly materials and produced with ethical craftsmanship.
              </Text>
            </View>
          </View>
        );
      case "Shipping":
        return (
          <View className="mt-4">
            <View className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
              <View className="flex-row items-center justify-between">
                <Text
                  className="text-gray-400 text-sm"
                  style={{ fontFamily: "Urbanist" }}
                >
                  Delivery & service for
                </Text>
                <TouchableOpacity>
                  <Text
                    className="text-black font-semibold text-sm"
                    style={{ fontFamily: "UrbanistBold" }}
                  >
                    Change
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="mt-2">
                <Text
                  className="text-gray-400 text-base"
                  style={{ fontFamily: "Urbanist" }}
                >
                  560158 (Gayathri P)
                </Text>
              </View>
            </View>

            <View className="flex-row items-center mb-3">
              <Feather name="box" size={20} color="black" />
              <Text
                className="ml-3 text-base text-black"
                style={{ fontFamily: "Urbanist" }}
              >
                Get it by Mon, 30 Nov
              </Text>
            </View>
            <View className="flex-row items-center mb-3">
              <MaterialIcons name="payments" size={20} color="black" />
              <Text
                className="ml-3 text-base text-black"
                style={{ fontFamily: "Urbanist" }}
              >
                Cash on Delivery available
              </Text>
            </View>
            <View className="flex-row items-center mb-3">
              <MaterialIcons name="compare-arrows" size={20} color="black" />
              <Text
                className="ml-3 text-base text-black"
                style={{ fontFamily: "Urbanist" }}
              >
                Hassle free 10 days Return & Exchange
              </Text>
            </View>
          </View>
        );
      case "Reviews":
        return (
          <ReviewList
            reviews={REVIEW_DATA}
            ratingBreakdown={RATING_BREAKDOWN}
          />
        );
      default:
        return null;
    }
  };

  const IMAGE_HEIGHT = width * 1.3;

  const headerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [-IMAGE_HEIGHT, 0, IMAGE_HEIGHT],
            [-IMAGE_HEIGHT / 2, 0, IMAGE_HEIGHT * 0.75],
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [-IMAGE_HEIGHT, 0, IMAGE_HEIGHT],
            [2, 1, 1],
          ),
        },
      ],
    };
  });

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Sticky Header with Back Button (Always on top) */}
      <View className="absolute top-0 left-0 right-0 z-20">
        <SafeAreaView edges={["top"]} className="bg-transparent">
          <View className="px-4 py-2">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-white/20 items-center justify-center backdrop-blur-md"
            >
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <Animated.ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Animated Header Image Container */}
        <Animated.View style={[{ height: IMAGE_HEIGHT }, headerStyle]}>
          <FlatList
            data={PRODUCT.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <Image
                source={{ uri: item }}
                style={{ width, height: IMAGE_HEIGHT }}
                resizeMode="cover"
              />
            )}
          />
          {/* Pagination Indicators - Inside Header */}
          <View className="absolute bottom-16 left-4 flex-row gap-2">
            {PRODUCT.images.map((_, index) => (
              <View
                key={index}
                className={`h-2 w-2 rounded-full  ${
                  activeImageIndex === index
                    ? "scale-[1.5] bg-white"
                    : "bg-white/50"
                }`}
              />
            ))}
          </View>

          {/* Action Buttons - Inside Header */}
          <View className="absolute bottom-16 right-4 flex-row gap-2">
            <TouchableOpacity className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm">
              <AntDesign name="heart" size={18} color="#DB0034" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm">
              <MaterialIcons name="share" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Content Overlay - Moves naturally with scroll */}
        <View className="bg-white -mt-6 rounded-t-3xl px-5 pt-8 min-h-screen shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
          {/* Main Drag Handle or Visual Indicator */}
          <View className="self-center w-12 h-1 bg-gray-300 rounded-full mb-6 opacity-50" />

          {/* Tabs Header */}
          <View className="flex-row justify-evenly border-b border-gray-200 mb-6">
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`mr-8 pb-3 ${
                  activeTab === tab ? "border-b-2 border-black" : ""
                }`}
              >
                <Text
                  className={`text-lg transition-all ${
                    activeTab === tab
                      ? "text-black font-semibold"
                      : "text-black"
                  }`}
                  style={{
                    fontFamily: activeTab === tab ? "UrbanistBold" : "Urbanist",
                  }}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === "Details" && (
            <>
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1 mr-4">
                  <Text
                    className="text-3xl text-black leading-tight mb-2"
                    style={{ fontFamily: "Classyvogue" }}
                  >
                    {PRODUCT.name}
                  </Text>
                </View>
                <View className="items-end">
                  <Text
                    className="text-lg text-gray-400 line-through"
                    style={{ fontFamily: "Urbanist" }}
                  >
                    {PRODUCT.originalPrice}
                  </Text>
                  <Text
                    className="text-2xl text-black font-semibold"
                    style={{ fontFamily: "UrbanistBold" }}
                  >
                    {PRODUCT.price}
                  </Text>
                </View>
              </View>

              {/* Rating */}
              <View className="flex-row items-center mb-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <AntDesign
                    key={i}
                    name="star"
                    size={16}
                    color="#FFD700"
                    className="mr-1"
                  />
                ))}
              </View>

              {/* Color Selection */}
              <View className="mb-6">
                <Text
                  className="text-lg text-black mb-3"
                  style={{ fontFamily: "Urbanist" }}
                >
                  Color
                </Text>
                <View className="flex-row gap-2">
                  {PRODUCT.colors.map((color) => (
                    <TouchableOpacity
                      key={color}
                      onPress={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full items-center justify-center border ${
                        selectedColor === color
                          ? "border-black"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {selectedColor === color && (
                        <Feather
                          name="check"
                          size={16}
                          color={color === "#F0F0F0" ? "black" : "white"}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Size Selection */}
              <View className="mb-8">
                <Text
                  className="text-lg text-black mb-3"
                  style={{ fontFamily: "Urbanist" }}
                >
                  Size
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {PRODUCT.sizes.map((size) => (
                    <TouchableOpacity
                      key={size}
                      onPress={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-full items-center justify-center border ${
                        selectedSize === size
                          ? "bg-black border-black"
                          : "bg-gray-100 border-gray-100"
                      }`}
                    >
                      <Text
                        className={`text-base ${
                          selectedSize === size ? "text-white" : "text-black"
                        }`}
                        style={{ fontFamily: "Urbanist" }}
                      >
                        {size}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </>
          )}

          {/* Render Tab Specific Content */}
          {renderTabContent()}

          {/* Popular with your order */}
          {activeTab === "Details" && (
            <View className="mt-8 mb-4">
              <Text
                className="text-xl text-black font-semibold mb-1"
                style={{ fontFamily: "UrbanistBold" }}
              >
                Popular with your order
              </Text>
              <Text
                className="text-gray-500 mb-4"
                style={{ fontFamily: "Urbanist" }}
              >
                People also bought these
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="-mx-5 px-5"
              >
                {RELATED_PRODUCTS.map((item) => (
                  <View key={item.id} className="w-40 mr-4">
                    <ProductCard {...item} />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </Animated.ScrollView>

      {/* Sticky Bottom Actions */}
      <View className="absolute bottom-0 left-0 right-0 px-6 py-3 bg-white border-t border-gray-100 flex-row items-center gap-3 pb-8 z-30">
        <TouchableOpacity
          className="flex-1 py-4 rounded-lg bg-white border border-gray-300 items-center justify-center flex-row"
          activeOpacity={0.6}
          onPress={() => {
            // Handle Shop Now
          }}
        >
          <Feather
            name="shopping-bag"
            size={20}
            color="black"
            className="mr-2"
          />
          <Text
            className="text-black font-semibold text-md"
            style={{ fontFamily: "UrbanistBold" }}
          >
            Shop Now
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 py-4 rounded-lg bg-black items-center justify-center flex-row"
          activeOpacity={0.8}
          onPress={() => {
            // Handle Add to Cart
          }}
        >
          <Feather name="plus" size={20} color="white" className="mr-2" />
          <Text
            className="text-white font-semibold text-md"
            style={{ fontFamily: "UrbanistBold" }}
          >
            Add to Wardrobe
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
