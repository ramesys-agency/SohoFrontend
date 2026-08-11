import { categoryApi } from "@/api/category.api";
import {
  placementApi,
  type Placement,
  type PlacementPage,
} from "@/api/placement.api";
import BannerCarousel from "@/components/catalog/BannerCarousel";
import SubHeader from "@/components/navbar/SubHeader";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CategoryCircle from "@/components/catalog/CategoryCircle";
import CategoryGridItem from "@/components/catalog/CategoryGridItem";

export default function CatalogScreen() {
  const [genderCategory, setGenderCategory] = useState("women");
  const [categories, setCategories] = useState<any[]>([]);
  const [gridPlacements, setGridPlacements] = useState<Placement[]>([]);
  const [bannerPlacements, setBannerPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const segments = [
    { label: "Women", value: "women" },
    { label: "Men", value: "men" },
    { label: "Kids", value: "kids" },
  ];

  const fetchCategories = async () => {
    try {
      const data = await categoryApi.getCategories({
        isActive: true,
        gender: genderCategory.toUpperCase(),
      });

      if (Array.isArray(data)) {
        const formattedCategories: any[] = data.map((category: any) => ({
          id: category.id,
          name: category.name,
          image: category.imageUrl,
        }));
        setCategories(formattedCategories);
      } else {
        console.warn("Categories data is not an array:", data);
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const fetchPlacements = async () => {
    try {
      const data = await placementApi.getPlacements(
        genderCategory.toUpperCase() as PlacementPage,
      );

      // Banners span HERO and FEATURED_ROW; everything else fills the grid.
      setBannerPlacements(
        data.filter((p) => p.section === "HERO" || p.section === "FEATURED_ROW"),
      );
      setGridPlacements(data.filter((p) => p.section === "GRID_SECTION"));
    } catch (error) {
      console.error("Error fetching placements:", error);
      setBannerPlacements([]);
      setGridPlacements([]);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchCategories(), fetchPlacements()]);
    setRefreshing(false);
  }, [genderCategory]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCategories(), fetchPlacements()]);
      setLoading(false);
    };
    loadData();
  }, [genderCategory]);

  /** Each card carries its own name, handle and curated product list. */
  const openPlacement = (placement: Placement) => {
    if (placement.productId) {
      router.push(`/product/${placement.productId}`);
      return;
    }

    router.push({
      pathname: "/(tabs)/catalog/shop/[category]",
      params: {
        category: placement.name,
        gender: genderCategory,
        collectionSlug: placement.slug,
        placementId: placement.id,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white pb-28" edges={["top"]}>
      <View>
        <SubHeader title="Catalog" />
        <SegmentedControl
          style={{ marginHorizontal: 16, marginBottom: 10, height: 40 }}
          backgroundColor="#F3F3F3"
          tintColor="#000000"
          activeFontStyle={{
            color: "#FFFFFF",
            fontWeight: "600",
            fontFamily: "Urbanist-Medium",
          }}
          fontStyle={{ color: "#000000", fontFamily: "Urbanist-Medium" }}
          values={segments.map((s) => s.label)}
          selectedIndex={segments.findIndex((s) => s.value === genderCategory)}
          onChange={(event) => {
            setGenderCategory(
              segments[event.nativeEvent.selectedSegmentIndex].value,
            );
          }}
        />
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4 pt-2"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Horizontal Categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="py-4"
          >
            {categories.map((item) => (
              <CategoryCircle
                key={item.id}
                name={item.name}
                image={item.image}
                onPress={() => {
                  router.push({
                    pathname: "/(tabs)/catalog/shop/[category]",
                    params: {
                      category: item.name.toLowerCase(),
                      gender: genderCategory,
                      categoryId: item.id,
                    },
                  });
                }}
              />
            ))}
          </ScrollView>

          {/* Promotional Banner */}
          {bannerPlacements.length > 0 && (
            <BannerCarousel
              banners={bannerPlacements.map((placement) => ({
                id: placement.id,
                name: placement.name,
                image: placement.imageUrl,
                placement,
              }))}
              onPress={(item) => openPlacement(item.placement)}
            />
          )}

          {/* Placement Grid */}
          <View className="flex-row flex-wrap -mx-1">
            {gridPlacements.map((placement) => (
              <View key={placement.id} className="w-1/2 p-1">
                <CategoryGridItem
                  name={placement.name}
                  image={placement.imageUrl}
                  onPress={() => openPlacement(placement)}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
