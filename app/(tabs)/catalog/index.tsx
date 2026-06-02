import { categoryApi } from "@/api/category.api";
import { collectionApi } from "@/api/collection.api";
import BannerCarousel from "@/app/components/catalog/BannerCarousel";
import SubHeader from "@/app/components/navbar/SubHeader";
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
import CategoryCircle from "@/app/components/catalog/CategoryCircle";
import CategoryGridItem from "@/app/components/catalog/CategoryGridItem";

export default function CatalogScreen() {
  const [genderCategory, setGenderCategory] = useState("women");
  const [categories, setCategories] = useState<any[]>([]);
  const [gridCollections, setGridCollections] = useState<any[]>([]);
  const [rowCollections, setRowCollections] = useState<any[]>([]);
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

  const fetchCollections = async () => {
    try {
      const data = await collectionApi.getCollections({
        isActive: true,
        placementPage: genderCategory.toUpperCase(),
        placementIsActive: true,
      });

      if (Array.isArray(data)) {
        const formattedGridCollections: any[] = data
          .map(
            (collection: any) =>
              collection?.collectionPlacements?.[0]?.section ===
                "GRID_SECTION" && {
                id: collection.id,
                placementId: collection.collectionPlacements?.[0]?.id,
                name: collection.name,
                image: collection.collectionPlacements?.[0]?.imageUrl,
              },
          )
          .filter(Boolean);

        const formattedRowCollections: any[] = data
          .map(
            (collection: any) =>
              collection?.collectionPlacements?.[0]?.section ===
                "FEATURED_ROW" && {
                id: collection.id,
                placementId: collection.collectionPlacements?.[0]?.id,
                name: collection.name,
                image: collection.collectionPlacements?.[0]?.imageUrl,
              },
          )
          .filter(Boolean);

        setGridCollections(formattedGridCollections);
        setRowCollections(formattedRowCollections);
      } else {
        console.warn("Collections data is not an array:", data);
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchCategories(), fetchCollections()]);
    setRefreshing(false);
  }, [genderCategory]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCategories(), fetchCollections()]);
      setLoading(false);
    };
    loadData();
  }, [genderCategory]);

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
          {rowCollections.filter((collection) => collection).length > 0 && (
            <BannerCarousel
              banners={rowCollections.filter((collection) => collection)}
              onPress={(item) => {
                router.push({
                  pathname: "/(tabs)/catalog/shop/[category]",
                  params: {
                    category: (item.name || item.title || "").toLowerCase(),
                    gender: genderCategory,
                    collectionId: item.id,
                    placementId: item.placementId,
                  },
                });
              }}
            />
          )}

          {/* Collection Grid */}
          <View className="flex-row flex-wrap -mx-1">
            {gridCollections
              .filter((collection) => collection)
              .map((collection) => (
                <View key={collection.id} className="w-1/2 p-1">
                  <CategoryGridItem
                    name={collection.name}
                    image={collection.image}
                    onPress={() => {
                      router.push({
                        pathname: "/(tabs)/catalog/shop/[category]",
                        params: {
                          category: collection.name.toLowerCase(),
                          gender: genderCategory,
                          collectionId: collection.id,
                          placementId: collection.placementId,
                        },
                      });
                    }}
                  />
                </View>
              ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
