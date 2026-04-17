import { collectionApi } from "@/api/collection.api";
import { productApi } from "@/api/product.api";
import ProductCard from "@/app/components/common/ProductCard";
import TopNavBar from "@/app/components/navbar/TopNavBar";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FeaturedSection from "../../components/home/FeaturedSection";
import HeroBanner from "../../components/home/HeroBanner";
import SectionHeader from "../../components/home/SectionHeader";

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
  const [homeBanner, setHomeBanner] = useState<any>(null);
  const [bestSellerProducts, setBestSellerProducts] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchCollections(), fetchBestSellerProducts()]);
    setRefreshing(false);
  }, []);

  const fetchCollections = async () => {
    try {
      const data = await collectionApi.getCollections({
        isActive: true,
        // isBanner: true,
        placementPage: "HOME",
        placementSection: "TOP_BANNER",
        placementIsActive: true,
      });
      setHomeBanner(data);
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  const fetchBestSellerProducts = async () => {
    try {
      const data = await productApi.getProducts({
        isPublished: true,
        collectionSlug: "best-sellers",
        limit: 2,
        page: 1,
      });
      setBestSellerProducts(data);
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  useEffect(() => {
    fetchCollections();
    fetchBestSellerProducts();
  }, []);

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

          {homeBanner && (
            <HeroBanner
              image={{ uri: homeBanner[0].collectionPlacements[0].imageUrl }}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/home/shop/[category]",
                  params: {
                    category: "Something",
                    gender: "",
                    collectionId:
                      homeBanner[0].collectionPlacements[0].collection.id,
                  },
                })
              }
            />
          )}
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
            {bestSellerProducts &&
              bestSellerProducts.products.map((product: any) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  variantId={product.variantId}
                  isWishlisted={product.isWishlisted}
                  name={product.name}
                  image={product.primaryImage}
                  price={product.price}
                  rating={product.rating}
                />
              ))}
          </View>
        </View>

        {FEATURED_COLLECTIONS.map((section, index) => (
          <FeaturedSection
            key={index}
            title={section.title}
            description={section.description}
            images={section.images}
            variant={section.variant}
          />
        ))}

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
