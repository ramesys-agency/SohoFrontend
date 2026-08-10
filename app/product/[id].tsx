import { cartApi } from "@/api/cart.api";
import { productApi } from "@/api/product.api";
import { wishlistApi } from "@/api/wishlist.api";
import ReviewList, { Review } from "@/components/product/ReviewList";
import { useToastStore } from "@/store/toastStore";
import { useAuthStore } from "@/store/authStore";
import { reviewApi } from "@/api/review.api";
import { Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Share,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import ColorSelector, { ColorOption } from "@/components/product/ColorSelector";
import DetailsTabContent from "@/components/product/DetailsTabContent";
import ProductBottomBar from "@/components/product/ProductBottomBar";
import ProductHeader from "@/components/product/ProductHeader";
import ProductImageCarousel from "@/components/product/ProductImageCarousel";
import ProductTabs from "@/components/product/ProductTabs";
import RelatedProducts from "@/components/product/RelatedProducts";
import ShippingTabContent from "@/components/product/ShippingTabContent";
import SizeSelector from "@/components/product/SizeSelector";

const { width } = Dimensions.get("window");

// ─── Static mock data (used while the API hasn't loaded) ─────────────────────

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop",
];

// ─── Dynamic Data (derived from API response) ────────────────────────────────

// ─── Screen ───────────────────────────────────────────────────────────────────

/**
 * Units a shopper can actually buy: `availableQty` already has other customers'
 * live checkout holds subtracted. Falls back to raw stock for responses from a
 * backend that predates reservations.
 */
const unitsLeft = (variant: any): number => variant?.availableQty ?? variant?.stockQty ?? 0;

export default function ProductDetailsScreen() {
  const { id, variantId } = useLocalSearchParams<{
    id: string;
    variantId?: string;
  }>();
  const router = useRouter();

  // ── React Query ──────────────────────────────────────────────────────────
  const queryClient = useQueryClient();
  const showToast = useToastStore((state) => state.showToast);

  const {
    data: product,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productApi.getProductById(id!),
    enabled: !!id,
  });

  // ── Local UI state ───────────────────────────────────────────────────────
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [activeTab, setActiveTab] = useState("Details");
  const [isFavorite, setIsFavorite] = useState(false);

  // ── Review state ─────────────────────────────────────────────────────────
  const { user, isAuthenticated } = useAuthStore();
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  // ── Derived variant helpers ──────────────────────────────────────────────
  // Unique color options from variants
  const colorOptions = useMemo<ColorOption[]>(() => {
    if (!product?.variants?.length) return [];
    const seen = new Set<string>();
    const options: ColorOption[] = [];
    for (const v of product.variants) {
      if (v.colorName && !seen.has(v.colorName)) {
        seen.add(v.colorName);
        // Check if there is any size of this color in stock
        const hasStock = product.variants
          .filter((varItem: any) => varItem.colorName === v.colorName)
          .some((varItem: any) => unitsLeft(varItem) > 0);
        options.push({
          name: v.colorName,
          hex: v.colorValue ?? v.colorName,
          inStock: hasStock,
        });
      }
    }
    return options;
  }, [product]);

  // Unique sizes with stock status for the currently-selected color
  const availableSizes = useMemo<{ size: string; inStock: boolean }[]>(() => {
    if (!product?.variants?.length) return [];
    const colorFilter = selectedColor || colorOptions[0]?.name;
    const matchingVariants = product.variants.filter((v: any) => v.colorName === colorFilter);
    
    const sizeMap = new Map<string, boolean>();
    for (const v of matchingVariants) {
      if (v.size) {
        const currentStock = unitsLeft(v);
        const exists = sizeMap.get(String(v.size));
        sizeMap.set(String(v.size), exists || currentStock > 0);
      }
    }
    
    const uniqueSizes = Array.from(sizeMap.entries()).map(([size, inStock]) => ({ size, inStock }));
    
    // Sort logic (XS, S, M, L, XL, XXL, XXXL, etc.)
    const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "4XL", "5XL"];
    return uniqueSizes.sort((a, b) => {
      const indexA = SIZE_ORDER.indexOf(a.size.toUpperCase());
      const indexB = SIZE_ORDER.indexOf(b.size.toUpperCase());
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.size.localeCompare(b.size, undefined, { numeric: true, sensitivity: 'base' });
    });
  }, [product, selectedColor, colorOptions]);

  // Initialise selections when product data arrives
  useEffect(() => {
    if (product && product.variants?.length) {
      if (!selectedColor) {
        let targetVariant = null;
        if (variantId) {
          targetVariant = product.variants.find((v: any) => v.id === variantId);
        }

        if (!targetVariant) {
          targetVariant = product.variants.find((v: any) => v.isDefault);
        }

        const colorToSet = targetVariant?.colorName ?? colorOptions[0]?.name;
        const sizeToSet = targetVariant?.size ?? "";

        if (colorToSet) {
          setSelectedColor(colorToSet);
        }
        if (sizeToSet) {
          setSelectedSize(String(sizeToSet));
        }
      } else if (availableSizes.length && !selectedSize) {
        const firstInStock = availableSizes.find(s => s.inStock);
        setSelectedSize(firstInStock ? firstInStock.size : availableSizes[0].size);
      }
    }
  }, [
    product,
    colorOptions,
    availableSizes,
    selectedColor,
    selectedSize,
    variantId,
  ]);

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

  // Reviews: map real API reviews and calculate rating breakdown
  const { reviews, ratingBreakdown } = useMemo(() => {
    const rawReviews = product?.reviews || [];

    if (rawReviews.length === 0) {
      return {
        reviews: [],
        ratingBreakdown: {
          average: 0,
          totalCount: 0,
          counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        },
      };
    }

    const mappedReviews: Review[] = rawReviews.map((r: any) => ({
      id: r.id,
      user: {
        name: r.user?.fullName || "Anonymous",
        avatar: r.user?.avatar,
      },
      rating: r.rating || 0,
      date: r.createdAt
        ? new Date(r.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "N/A",
      comment: r.comment || undefined,
      images: r.images || [],
      likes: 0,
    }));

    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sum = 0;

    rawReviews.forEach((r: any) => {
      const rating = Math.min(Math.max(Math.round(r.rating || 0), 1), 5);
      counts[rating as keyof typeof counts] += 1;
      sum += r.rating || 0;
    });

    const average = sum / rawReviews.length;

    return {
      reviews: mappedReviews,
      ratingBreakdown: {
        average: Number(average.toFixed(1)),
        totalCount: rawReviews.length,
        counts,
      },
    };
  }, [product?.reviews]);

  const hasReviewed = useMemo(() => {
    if (!isAuthenticated || !user || !product?.reviews) return false;
    return product.reviews.some((r: any) => r.userId === user.id);
  }, [isAuthenticated, user, product?.reviews]);

  const addReviewMutation = useMutation({
    mutationFn: () =>
      reviewApi.addReview(id!, {
        rating: reviewRating,
        comment: reviewComment,
      }),
    onSuccess: () => {
      showToast({ message: "Review posted successfully!", type: "success" });
      setIsWritingReview(false);
      setReviewRating(0);
      setReviewComment("");
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
    onError: (error: any) => {
      showToast({
        message:
          error?.response?.data?.message ||
          error.message ||
          "Failed to post review.",
        type: "error",
      });
    },
  });

  const handleSubmitReview = () => {
    if (reviewRating === 0) {
      showToast({ message: "Please select a rating", type: "error" });
      return;
    }
    addReviewMutation.mutate();
  };

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
    const sizeFilter = selectedSize || availableSizes[0]?.size;
    return (
      product.variants.find(
        (v: any) => v.colorName === colorFilter && v.size === sizeFilter,
      ) ??
      product.variants.find((v: any) => v.colorName === colorFilter) ??
      product.variants[0]
    );
  }, [product, selectedColor, selectedSize, colorOptions, availableSizes]);

  // Check if all available sizes for the selected color are disabled (out of stock)
  const isButtonsDisabled = useMemo(() => {
    if (availableSizes && availableSizes.length > 0) {
      return availableSizes.every((s) => !s.inStock);
    }
    // Fallback if no sizes are defined but variants exist
    if (selectedVariant) {
      return unitsLeft(selectedVariant) <= 0;
    }
    return false;
  }, [availableSizes, selectedVariant]);

  // Sync local isFavorite state with the currently selected variant
  useEffect(() => {
    if (selectedVariant) {
      const wishlisted = selectedVariant.isWishlisted;
      setIsFavorite(wishlisted === true || wishlisted === "true");
    }
  }, [selectedVariant]);

  const displayPrice = selectedVariant?.basePrice
    ? `৳${selectedVariant.basePrice}`
    : "";
  const displayOriginalPrice = selectedVariant?.originalPrice
    ? `৳${selectedVariant.originalPrice}`
    : "";

  const addToCartMutation = useMutation({
    mutationFn: () => cartApi.addToCart(selectedVariant?.id || id),
    onSuccess: () => {
      showToast({ message: "Product added to wardrobe", type: "success" });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
    onError: (error: any) => {
      showToast({
        message: error?.response?.data?.error || "Failed to add to wardrobe.",
        type: "error",
      });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: () => cartApi.removeFromCart(selectedVariant?.id || id),
    onSuccess: () => {
      showToast({ message: "Product removed from wardrobe", type: "success" });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["product", id] });
    },
    onError: (error: any) => {
      showToast({
        message:
          error?.response?.data?.error || "Failed to remove from wardrobe.",
        type: "error",
      });
    },
  });

  const handleAddToCart = () => {
    if (!addToCartMutation.isPending) {
      addToCartMutation.mutate();
    }
  };

  const handleShopNow = () => {
    if (!selectedVariant) return;
    router.push({
      pathname: "/checkout/address",
      params: {
        _ctx: "checkout",
        // Carried through checkout so bailing out can return here — the
        // buy-now flow has no cart to fall back to.
        buyNowProductId: id,
        buyNowVariantId: selectedVariant.id,
        buyNowProductName: product?.name || "",
        buyNowVariantName: [selectedVariant.colorName, selectedVariant.size]
          .filter(Boolean)
          .join(" / "),
        buyNowPrice: selectedVariant.basePrice || "0",
      },
    });
  };

  const handleRemoveFromCart = () => {
    if (!removeFromCartMutation.isPending) {
      removeFromCartMutation.mutate();
    }
  };

  const toggleWishlistMutation = useMutation({
    mutationFn: () => wishlistApi.toggleWishlist(selectedVariant?.id || id),
    onMutate: () => {
      // Optimistic update
      setIsFavorite((prev) => !prev);
    },
    onError: () => {
      // Revert on error
      setIsFavorite((prev) => !prev);
      showToast({
        message: "Failed to update wishlist.",
        type: "error",
      });
    },
    onSuccess: () => {
      // Invalidating queries to refresh fetched product lists
      queryClient.invalidateQueries({ queryKey: ["product", id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  const handleToggleWishlist = () => {
    if (!toggleWishlistMutation.isPending) {
      toggleWishlistMutation.mutate();
    }
  };

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
          <View>
            <ReviewList reviews={reviews} ratingBreakdown={ratingBreakdown} />
            {isAuthenticated && !hasReviewed && !isWritingReview && (
              <TouchableOpacity
                className="bg-black py-3 rounded-full mt-6 flex-row items-center justify-center mb-4"
                onPress={() => setIsWritingReview(true)}
              >
                <MaterialIcons name="edit" size={20} color="white" />
                <Text className="text-white font-Urbanist-Bold text-base ml-2">
                  Write a Review
                </Text>
              </TouchableOpacity>
            )}
            {isAuthenticated && !hasReviewed && isWritingReview && (
              <View className="mt-6 mb-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <Text className="text-lg font-Urbanist-Bold text-black mb-3">
                  Write Your Review
                </Text>
                <View className="flex-row items-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setReviewRating(star)}
                    >
                      <AntDesign
                        name="star"
                        size={32}
                        color={star <= reviewRating ? "#FFD700" : "#E5E7EB"}
                        className="mr-2"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                <TextInput
                  className="bg-white px-4 py-3 rounded-xl border border-gray-200 text-black font-Urbanist min-h-[100px] mb-4"
                  placeholder="Share your experience with this product..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  textAlignVertical="top"
                  value={reviewComment}
                  onChangeText={setReviewComment}
                />
                <View className="flex-row justify-end space-x-3">
                  <TouchableOpacity
                    className="py-3 px-6 rounded-full"
                    onPress={() => setIsWritingReview(false)}
                    disabled={addReviewMutation.isPending}
                  >
                    <Text className="text-gray-500 font-Urbanist-Bold text-base">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-black py-3 px-6 rounded-full"
                    onPress={handleSubmitReview}
                    disabled={addReviewMutation.isPending}
                  >
                    {addReviewMutation.isPending ? (
                      <ActivityIndicator color="white" size="small" />
                    ) : (
                      <Text className="text-white font-Urbanist-Bold text-base">
                        Submit Review
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out ${product?.name} on Soho!`,
        title: product?.name || "Product",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error: any) {
      console.error("Error sharing product:", error.message);
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
      <View className="flex-1 bg-white">
        <Stack.Screen options={{ headerShown: false }} />
        <SafeAreaView edges={["top"]}>
          <View className="px-4 py-2">
            <TouchableOpacity
              className="w-10 h-10 bg-[#F2F2F2] rounded-full items-center justify-center"
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={22} color="black" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        <View className="flex-1 items-center justify-center px-8">
          <View className="w-16 h-16 bg-[#F2F2F2] rounded-full items-center justify-center mb-5">
            <Ionicons name="alert-circle-outline" size={34} color="#000" />
          </View>
          <Text className="text-xl font-Classyvogue text-black mb-2 text-center">
            Something went wrong
          </Text>
          <Text className="text-sm font-Urbanist text-[#999999] text-center mb-8">
            We couldn't load this product. Check your connection and try again.
          </Text>
          <TouchableOpacity
            className="bg-black px-8 py-3.5 rounded-xl"
            onPress={() => refetch()}
          >
            <Text className="text-white font-Urbanist-Bold text-sm">
              Try again
            </Text>
          </TouchableOpacity>
        </View>
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
          <View className="px-4 py-2 flex-row justify-between items-center">
            <TouchableOpacity
              className="w-10 h-10 bg-white/70 rounded-full items-center justify-center"
              activeOpacity={0.7}
              onPress={() => router.back()}
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
        refreshControl={
          <RefreshControl
            refreshing={isLoading || isRefetching}
            onRefresh={refetch}
          />
        }
      >
        <View>
          <ProductImageCarousel
            images={images}
            activeImageIndex={activeImageIndex}
            imageHeight={IMAGE_HEIGHT}
            headerStyle={headerStyle}
            onScroll={onImageScroll}
          />

          {/* Action Buttons (Wishlist & Share) */}
          <View className="absolute bottom-16 right-4 flex-row gap-2 z-10">
            <TouchableOpacity
              className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
              activeOpacity={0.8}
              onPress={handleToggleWishlist}
            >
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={22}
                color={isFavorite ? "#DB0034" : "black"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
              activeOpacity={0.8}
              onPress={handleShare}
            >
              <MaterialIcons name="share" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>

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
        onShopNow={handleShopNow}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        isAddedToCart={
          selectedVariant?.isAddedToCart === true ||
          selectedVariant?.isAddedToCart === "true"
        }
        isAdding={addToCartMutation.isPending}
        isRemoving={removeFromCartMutation.isPending}
        isShoppingNow={false}
        isDisabled={isButtonsDisabled}
      />
    </View>
  );
}
