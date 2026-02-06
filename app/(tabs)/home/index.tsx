import TopNavBar from "@/app/components/navbar/TopNavBar";
import { router } from "expo-router";
import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FeaturedSection from "../../components/home/FeaturedSection";
import HeroBanner from "../../components/home/HeroBanner";
import ProductCard from "../../components/home/ProductCard";
import SectionHeader from "../../components/home/SectionHeader";

const HERO_IMAGE = {
  uri: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=800&auto=format&fit=crop",
};

const PRODUCTS = [
  {
    id: "1",
    name: "Cotton Salwar",
    price: "2200",
    rating: 4.5,
    image: {
      uri: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop",
    },
  },
  {
    id: "2",
    name: "Women Tops",
    price: "600",
    rating: 4.5,
    image: {
      uri: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    },
  },
];

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
            title="50-40% OFF"
            subtitle="Now in Mega Sells"
            description="Available in Our Shop"
            image={HERO_IMAGE}
            onPress={() => router.push("/shop/Mega Sells")}
          />
        </View>

        <View className="py-6">
          <SectionHeader
            title="Best Sellers"
            onSeeAllPress={() => router.push("/shop/Best Sellers")}
          />
          <View className="flex-row flex-wrap justify-between px-4">
            {PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() => router.push(`/product/${product.id}`)}
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
