import ProductCard from "@/components/common/ProductCard";
import TopNavBar from "@/components/navbar/TopNavBar";
import { productApi } from "@/api/product.api";
import { placementApi, type Placement } from "@/api/placement.api";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView, View, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FeaturedSection from "@/components/home/FeaturedSection";
import HeroBanner from "@/components/home/HeroBanner";
import SectionHeader from "@/components/home/SectionHeader";

/** The home screen shows four promo sections, cycling through the four layouts. */
const PROMO_VARIANTS = ["large", "collage", "side", "horizontal"] as const;
const PROMO_LIMIT = 4;

/**
 * Best Sellers is curated when a HOME placement of that name exists. Until an
 * admin creates one, the grid falls back to the most-reviewed products so the
 * section is never empty.
 */
const BEST_SELLERS_FALLBACK = { sortBy: "popularity", limit: 2 } as const;

export default function HomeScreen() {
  const [refreshing, setRefreshing] = React.useState(false);

  const {
    data: placements = [],
    isLoading,
    refetch: refetchPlacements,
  } = useQuery({
    queryKey: ["home-placements"],
    queryFn: () => placementApi.getPlacements("HOME"),
  });

  const heroSlides = placements.filter((p) => p.section === "HERO");
  const sections = placements.filter((p) => p.section !== "HERO");

  // Best Sellers keeps its own product grid rather than a promo image, so it is
  // pulled out of the list before the remaining sections become promo cards.
  const bestSellers = sections.find((p) => /best\s*-?\s*sell/i.test(p.name));
  const promos = sections
    .filter((p) => p.id !== bestSellers?.id)
    .slice(0, PROMO_LIMIT);

  const {
    data: bestSellerProducts,
    isLoading: loadingBestSellers,
    refetch: refetchBestSellers,
  } = useQuery({
    queryKey: ["best-sellers-home", bestSellers?.id ?? "popular"],
    // A placement's curated products live on the placement, not on its
    // collection, so placementId is the only filter that finds them.
    queryFn: () =>
      productApi.getProducts(
        bestSellers
          ? { placementId: bestSellers.id, limit: 2 }
          : BEST_SELLERS_FALLBACK,
      ),
    enabled: !isLoading,
  });

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchPlacements(), refetchBestSellers()]);
    } catch (error) {
      console.error("Failed to refresh homepage data:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refetchPlacements, refetchBestSellers]);

  /** A placement either deep-links to one product or opens its own list. */
  const openPlacement = (placement: Placement) => {
    if (placement.productId) {
      router.push(`/product/${placement.productId}`);
      return;
    }

    router.push({
      pathname: "/(tabs)/home/shop/[category]",
      params: {
        category: placement.name,
        gender: "",
        collectionSlug: placement.slug,
        placementId: placement.id,
      },
    });
  };

  // Without a placement behind it there is no curated list to open, so the
  // header drops its "See All" rather than pushing an empty screen.
  const openBestSellers = bestSellers
    ? () => openPlacement(bestSellers)
    : undefined;

  const renderPromo = (placement: Placement, index: number) => {
    const variant = PROMO_VARIANTS[index % PROMO_VARIANTS.length];
    const onPress = () => openPlacement(placement);

    // The collage layout draws the cover plus the first two product images.
    const uris =
      variant === "collage"
        ? [placement.imageUrl, ...placement.previewImages]
        : [placement.imageUrl];

    const images = uris
      .filter((uri): uri is string => Boolean(uri))
      .map((uri) => ({ uri, onPress }));

    return (
      <FeaturedSection
        key={placement.id}
        title={placement.name}
        description={placement.description ?? ""}
        images={images}
        variant={variant}
        onPress={onPress}
      />
    );
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
            loading={isLoading}
            onSlidePress={openPlacement}
          />
        </View>

        <View className="py-6">
          <SectionHeader
            title={bestSellers?.name ?? "Best Sellers"}
            onSeeAllPress={openBestSellers}
          />
          <View className="flex-row flex-wrap justify-between px-4">
            {loadingBestSellers ? (
              <ActivityIndicator
                color="#000"
                style={{ marginTop: 20, flex: 1 }}
              />
            ) : (
              (bestSellerProducts?.products ?? bestSellerProducts ?? [])
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

        {isLoading ? (
          <ActivityIndicator color="#000" style={{ marginVertical: 40 }} />
        ) : (
          promos.map(renderPromo)
        )}

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
}
