import ProductCard from "@/components/common/ProductCard";
import TopNavBar from "@/components/navbar/TopNavBar";
import { productApi } from "@/api/product.api";
import { homePromoApi } from "@/api/homePromo.api";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  View,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FeaturedSection from "@/components/home/FeaturedSection";
import HeroBanner from "@/components/home/HeroBanner";
import SectionHeader from "@/components/home/SectionHeader";
import type { HeroSlide } from "@/api/homePromo.api";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = React.useState(false);

  const {
    data: heroSlides = [],
    isLoading: loadingHero,
    refetch: refetchHero,
  } = useQuery({
    queryKey: ["home-hero-slides"],
    queryFn: () => homePromoApi.getHeroSlides(),
  });

  const {
    data: bestSellers,
    isLoading: loadingBestSellers,
    refetch: refetchBestSellers,
  } = useQuery({
    queryKey: ["best-sellers-home"],
    queryFn: () =>
      productApi.getProducts({ collectionSlug: "best-sellers", limit: 2 }),
  });

  const {
    data: homePromos = [],
    isLoading: loadingPromos,
    refetch: refetchPromos,
  } = useQuery({
    queryKey: ["home-promos-list"],
    queryFn: () => homePromoApi.getPromos(),
  });

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchHero(), refetchBestSellers(), refetchPromos()]);
    } catch (error) {
      console.error("Failed to refresh homepage data:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refetchHero, refetchBestSellers, refetchPromos]);

  const renderPromos = () => {
    if (loadingPromos) {
      return <ActivityIndicator color="#000" style={{ marginVertical: 20 }} />;
    }

    return homePromos.map((promo, index) => {
      const variants = ["large", "collage", "side", "horizontal"] as const;
      const variant = variants[index % variants.length];

      const handlePromoPress = () => {
        if (promo.contentType === "PRODUCT" && promo.productId) {
          router.push(`/product/${promo.productId}`);
        } else if (promo.contentType === "COLLECTION" && promo.collectionId) {
          router.push({
            pathname: "/(tabs)/home/shop/[category]",
            params: {
              category: promo.title,
              gender: "",
              collectionId: promo.collectionId,
            },
          });
        }
      };

      let images: { uri: string; onPress?: () => void }[] = [];
      if (promo.imageUrl) {
        images.push({
          uri: promo.imageUrl,
          onPress: handlePromoPress,
        });
      }

      if (variant === "collage") {
        if (images.length === 0) {
          images.push({
            uri: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop",
            onPress: handlePromoPress,
          });
        }
      }

      return (
        <FeaturedSection
          key={promo.id}
          title={promo.title}
          description={promo.description}
          images={images}
          variant={variant}
          onPress={handlePromoPress}
        />
      );
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <TopNavBar />
      <ScrollView
        className="flex-1 mb-20"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="py-4">
          <SectionHeader
            title="See All"
            onSeeAllPress={() => router.push("/(tabs)/home/offers")}
          />
          <HeroBanner
            slides={heroSlides}
            loading={loadingHero}
            onSlidePress={(slide: HeroSlide) =>
              router.push({
                pathname: "/(tabs)/home/shop/[category]",
                params: {
                  category: slide.collectionName,
                  gender: "",
                  collectionSlug: slide.collectionSlug,
                  placementId: slide.placementId,
                },
              })
            }
          />
        </View>

        <View className="py-6">
          <SectionHeader
            title="Best Sellers"
            onSeeAllPress={() =>
              router.push({
                pathname: "/(tabs)/home/shop/[category]",
                params: {
                  category: "Best Sellers",
                  gender: "",
                  collectionSlug: "best-sellers",
                },
              })
            }
          />
          <View className="flex-row flex-wrap justify-between px-4">
            {loadingBestSellers ? (
              <ActivityIndicator
                color="#000"
                style={{ marginTop: 20, flex: 1 }}
              />
            ) : (
              (bestSellers?.products ?? bestSellers ?? [])
                .slice(0, 2)
                .map((product: any) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    variantId={product.variantId}
                    name={product.name}
                    image={product.primaryImage ?? ""}
                    price={String(product.price ?? "")}
                    rating={product.rating ?? 0}
                    isWishlisted={product.isWishlisted}
                  />
                ))
            )}
          </View>
        </View>

        {renderPromos()}

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
