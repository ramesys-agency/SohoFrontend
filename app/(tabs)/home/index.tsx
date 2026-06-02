import ProductCard from "@/app/components/common/ProductCard";
import TopNavBar from "@/app/components/navbar/TopNavBar";
import { productApi } from "@/api/product.api";
import { homePromoApi } from "@/api/homePromo.api";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FeaturedSection from "../../components/home/FeaturedSection";
import HeroBanner from "../../components/home/HeroBanner";
import SectionHeader from "../../components/home/SectionHeader";
import type { HeroSlide } from "@/api/homePromo.api";



const FEATURED_COLLECTIONS = [
  {
    title: "Women Fashionable Top",
    description:
      "This dress embodies sustainable fashion practices, woven from eco-friendly materials and produced with ethical craftsmanship.",
    variant: "large" as const,
    images: [
      {
        uri: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop",
      },
    ],
  },
  {
    title: "Fashionable Dress",
    description:
      "This dress embodies sustainable fashion practices, woven from eco-friendly materials and produced with ethical craftsmanship.",
    variant: "collage" as const,
    images: [
      {
        uri: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        uri: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop",
      },
      {
        uri: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop",
      },
    ],
  },
  {
    title: "Luxurious Gown",
    description:
      "This dress embodies sustainable fashion practices, woven from eco-friendly materials and produced with ethical craftsmanship.",
    variant: "side" as const,
    images: [
      {
        uri: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&auto=format&fit=crop",
      },
    ],
  },
  {
    title: "Fashionable Heals",
    description:
      "This dress embodies sustainable fashion practices, woven from eco-friendly materials and produced with ethical craftsmanship.",
    variant: "horizontal" as const,
    images: [
      {
        uri: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop",
      },
    ],
  },
];

export default function HomeScreen() {
  const { data: heroSlides = [], isLoading: loadingHero } = useQuery({
    queryKey: ["home-hero-slides"],
    queryFn: () => homePromoApi.getHeroSlides(),
  });

  const { data: bestSellers, isLoading: loadingBestSellers } = useQuery({
    queryKey: ["best-sellers-home"],
    queryFn: () => productApi.getProducts({ collectionSlug: "best-sellers", limit: 2 }),
  });

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <TopNavBar />
      <ScrollView className="flex-1 mb-20" showsVerticalScrollIndicator={false}>
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
              <ActivityIndicator color="#000" style={{ marginTop: 20, flex: 1 }} />
            ) : (
              (bestSellers?.products ?? bestSellers ?? []).slice(0, 2).map((product: any) => (
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

        {FEATURED_COLLECTIONS.map((section, index) => (
          <FeaturedSection
            key={index}
            title={section.title}
            description={section.description}
            images={section.images}
            variant={section.variant}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/home/shop/[category]",
                params: {
                  category: section.title,
                  gender: "",
                  collectionSlug: section.title.toLowerCase().replace(/\s+/g, "-"),
                },
              })
            }
          />
        ))}

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
