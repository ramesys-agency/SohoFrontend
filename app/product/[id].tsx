import { productApi } from "@/api/product.api";
import ReviewList, {
  RatingBreakdown,
  Review,
} from "@/app/components/product/ReviewList";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import ColorSelector, { ColorOption } from "./components/ColorSelector";
import DetailsTabContent from "./components/DetailsTabContent";
import ProductBottomBar from "./components/ProductBottomBar";
import ProductHeader from "./components/ProductHeader";
import ProductImageCarousel from "./components/ProductImageCarousel";
import ProductTabs from "./components/ProductTabs";
import RelatedProducts from "./components/RelatedProducts";
import ShippingTabContent from "./components/ShippingTabContent";
import SizeSelector from "./components/SizeSelector";

const { width } = Dimensions.get("window");

// ─── Static mock data (used while the API hasn't loaded) ─────────────────────

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
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
    ],
    likes: 124,
  },
  {
    id: "r2",
    user: { name: "James Doe" },
    rating: 4,
    date: "2 days ago",
    comment: "Great quality but a bit tight around the shoulders.",
    sizeBought: "L",
    likes: 12,
  },
  {
    id: "r3",
    user: { name: "Anonymous" },
    rating: 5,
    date: "1 week ago",
  },
];

const RATING_BREAKDOWN: RatingBreakdown = {
  average: 4.5,
  totalCount: 104,
  counts: { 1: 4, 2: 6, 3: 10, 4: 30, 5: 54 },
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // ── React Query ──────────────────────────────────────────────────────────
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productApi.getProductById(id!),
    enabled: !!id,
  });

  console.log("product", JSON.stringify(product));

  // ── Local UI state ───────────────────────────────────────────────────────
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [activeTab, setActiveTab] = useState("Details");

  // ── Derived variant helpers ──────────────────────────────────────────────
  // Unique color options from variants
  const colorOptions = useMemo<ColorOption[]>(() => {
    if (!product?.variants?.length) return [];
    const seen = new Set<string>();
    const options: ColorOption[] = [];
    for (const v of product.variants) {
      if (v.colorName && !seen.has(v.colorName)) {
        seen.add(v.colorName);
        options.push({ name: v.colorName, value: v.colorValue ?? v.colorName });
      }
    }
    return options;
  }, [product]);

  // Unique sizes for the currently-selected color
  const availableSizes = useMemo<string[]>(() => {
    if (!product?.variants?.length) return [];
    const colorFilter = selectedColor || colorOptions[0]?.name;
    const sizes = product.variants
      .filter((v: any) => v.colorName === colorFilter)
      .map((v: any) => String(v.size))
      .filter((s: string) => s.length > 0);
    return [...new Set<string>(sizes)];
  }, [product, selectedColor, colorOptions]);

  // Initialise selections when product data arrives
  React.useEffect(() => {
    if (product) {
      if (colorOptions.length && !selectedColor) {
        // Default to the variant marked isDefault, or fall back to the first color
        const defaultVariant = product.variants?.find((v: any) => v.isDefault);
        setSelectedColor(defaultVariant?.colorName ?? colorOptions[0].name);
      }
      if (availableSizes.length && !selectedSize) {
        setSelectedSize(availableSizes[0]);
      }
    }
  }, [product, colorOptions, availableSizes, selectedColor, selectedSize]);

  // ── Animation ────────────────────────────────────────────────────────────
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const onImageScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveImageIndex(Math.round(index));
  };

  const IMAGE_HEIGHT = width * 1.3;

  const headerStyle = useAnimatedStyle(() => ({
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
  }));

  // ── Derived data from API response ───────────────────────────────────────
  // Images: show images for the currently-selected color, ordered by displayOrder.
  const images: string[] = useMemo(() => {
    if (!product?.variants?.length) return FALLBACK_IMAGES;
    const colorFilter = selectedColor || colorOptions[0]?.name;
    const matchingVariant = product.variants.find(
      (v: any) => v.colorName === colorFilter,
    );
    const variantImages: string[] =
      matchingVariant?.images
        ?.slice()
        .sort((a: any, b: any) => a.displayOrder - b.displayOrder)
        .map((img: any) => img.imageUrl) ?? [];
    return variantImages.length ? variantImages : FALLBACK_IMAGES;
  }, [product, selectedColor, colorOptions]);

  // Price: from the matching variant for the selected color+size
  const selectedVariant = useMemo(() => {
    if (!product?.variants?.length) return null;
    const colorFilter = selectedColor || colorOptions[0]?.name;
    const sizeFilter = selectedSize || availableSizes[0];
    return (
      product.variants.find(
        (v: any) => v.colorName === colorFilter && v.size === sizeFilter,
      ) ??
      product.variants.find((v: any) => v.colorName === colorFilter) ??
      product.variants[0]
    );
  }, [product, selectedColor, selectedSize, colorOptions, availableSizes]);

  const displayPrice = selectedVariant?.basePrice
    ? `৳${selectedVariant.basePrice}`
    : "";
  const displayOriginalPrice = selectedVariant?.originalPrice
    ? `৳${selectedVariant.originalPrice}`
    : "";

  const renderTabContent = () => {
    switch (activeTab) {
      case "Details":
        return (
          <DetailsTabContent
            description={product?.description ?? ""}
            features={product?.attributes ?? []}
          />
        );
      case "Shipping":
        return <ShippingTabContent />;
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

  // ── Loading state ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Stack.Screen options={{ headerShown: false }} />
        <ActivityIndicator size="large" color="#000" />
        <Text
          className="mt-4 text-gray-500 text-base"
          style={{ fontFamily: "Urbanist" }}
        >
          Loading product…
        </Text>
      </View>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (isError) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-8">
        <Stack.Screen options={{ headerShown: false }} />
        <Text
          className="text-red-500 text-base text-center"
          style={{ fontFamily: "Urbanist" }}
        >
          Failed to load product details. Please try again.
        </Text>
      </View>
    );
  }

  // ── Main render ──────────────────────────────────────────────────────────
  return (
    <View className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      {/* Sticky Back Button */}
      <View className="absolute top-0 left-0 right-0 z-20">
        <SafeAreaView edges={["top"]} className="bg-transparent">
          <View className="px-4 py-2">
            <Ionicons
              name="arrow-back"
              size={24}
              color="black"
              onPress={() => router.back()}
            />
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
        {/* Hero Image Carousel */}
        <ProductImageCarousel
          images={images}
          activeImageIndex={activeImageIndex}
          imageHeight={IMAGE_HEIGHT}
          headerStyle={headerStyle}
          onScroll={onImageScroll}
        />

        {/* Scrollable Content Sheet */}
        <View className="bg-white -mt-6 rounded-t-3xl px-5 pt-8 min-h-screen shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
          {/* Drag Handle */}
          <View className="self-center w-12 h-1 bg-gray-300 rounded-full mb-6 opacity-50" />

          {/* Tab Bar */}
          <ProductTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Details-only sections */}
          {activeTab === "Details" && (
            <>
              <ProductHeader
                name={product?.name ?? ""}
                price={displayPrice}
                originalPrice={displayOriginalPrice}
                rating={product?.rating ?? 0}
              />

              {colorOptions.length > 0 && (
                <View>
                  <ColorSelector
                    colors={colorOptions}
                    selectedColor={selectedColor}
                    onSelectColor={(colorName) => {
                      setSelectedColor(colorName);
                      // Reset size & image index when color changes
                      setSelectedSize("");
                      setActiveImageIndex(0);
                    }}
                  />
                </View>
              )}

              {availableSizes.length > 0 && (
                <View>
                  <SizeSelector
                    sizes={availableSizes}
                    selectedSize={selectedSize}
                    onSelectSize={setSelectedSize}
                  />
                </View>
              )}
            </>
          )}

          {/* Tab-specific body */}
          {renderTabContent()}

          {/* Related products (Details tab only) */}
          {activeTab === "Details" && product?.relatedProducts?.length > 0 && (
            <RelatedProducts products={product.relatedProducts} />
          )}
        </View>
      </Animated.ScrollView>

      {/* Sticky Bottom Action Bar */}
      <ProductBottomBar
        onShopNow={() => {
          /* Handle Shop Now */
        }}
        onAddToCart={() => {
          /* Handle Add to Cart */
        }}
      />
    </View>
  );
}
