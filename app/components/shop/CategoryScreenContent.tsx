import { categoryApi } from "@/api/category.api";
import { productApi } from "@/api/product.api";
import ProductCard from "@/app/components/common/ProductCard";
import SubHeader from "@/app/components/navbar/SubHeader";
import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function CategoryScreenContent() {
  const { category, gender, collectionId, collectionSlug, categoryId } =
    useLocalSearchParams<{
      category?: string;
      gender?: string;
      collectionId?: string;
      collectionSlug?: string;
      categoryId?: string;
    }>();
  const categoryName = typeof category === "string" ? category : "Clothing";
  const genderName = typeof gender === "string" ? gender : undefined;

  // Format the category name for display (capitalize first letter)
  const displayTitle =
    categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  const displayGender = genderName
    ? genderName.charAt(0).toUpperCase() + genderName.slice(1)
    : "All";

  // Build query params — only one of collectionId | collectionSlug | categoryId
  // is included at a time.
  const queryParams = React.useMemo(() => {
    const params: Record<string, any> = { isPublished: true };

    if (collectionId) {
      params.collectionId = collectionId;
    } else if (collectionSlug) {
      params.collectionSlug = collectionSlug;
    } else if (categoryId) {
      params.categoryId = categoryId;
    }

    return params;
  }, [collectionId, collectionSlug, categoryId]);

  // Identifier-only params for the page-title API (no isPublished / gender)
  const titleParams = React.useMemo(() => {
    const params: Record<string, any> = {};
    if (collectionId) {
      params.collectionId = collectionId;
    } else if (collectionSlug) {
      params.collectionSlug = collectionSlug;
    } else if (categoryId) {
      params.categoryId = categoryId;
    }
    return params;
  }, [collectionId, collectionSlug, categoryId]);

  const {
    data: pageTitleData,
    refetch: refetchTitle,
    isRefetching: isRefetchingTitle,
  } = useQuery({
    queryKey: ["pageTitle", titleParams],
    queryFn: () => categoryApi.getPageTitle(titleParams),
    enabled: !!(collectionId || collectionSlug || categoryId),
  });

  const {
    data: productsData,
    isLoading,
    isError,
    refetch: refetchProducts,
    isRefetching: isRefetchingProducts,
  } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: () => productApi.getProducts(queryParams),
  });

  const isRefetching = isRefetchingTitle || isRefetchingProducts;

  const onRefresh = React.useCallback(() => {
    refetchTitle();
    refetchProducts();
  }, [refetchTitle, refetchProducts]);

  const products = productsData?.products ?? productsData ?? [];

  const renderHeader = () => (
    <View>
      <SubHeader
        title={pageTitleData?.name ?? displayTitle ?? "Soho"}
        showBackButton={true}
      />

      <View className="px-4 pb-4">
        <TouchableOpacity
          className="border border-gray-200 rounded-lg px-6 py-2 self-start"
          activeOpacity={0.7}
        >
          <Text
            className="text-base text-black"
            style={{ fontFamily: "Urbanist" }}
          >
            {displayGender}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyComponent = () => {
    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center py-16">
          <ActivityIndicator size="large" color="#000" />
        </View>
      );
    }

    if (isError) {
      return (
        <View className="flex-1 items-center justify-center py-16">
          <Text style={{ fontFamily: "Urbanist" }} className="text-red-500">
            Failed to load products. Please try again.
          </Text>
        </View>
      );
    }

    if (products.length === 0) {
      return (
        <View className="flex-1 items-center justify-center py-16">
          <Text style={{ fontFamily: "Urbanist" }} className="text-gray-500">
            No products found.
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView className="flex-1 bg-white pb-28" edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            id={item.id}
            variantId={item.variantId}
            isWishlisted={item.isWishlisted}
            name={item.name}
            image={item.primaryImage}
            price={item.price}
            rating={item.rating}
          />
        )}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}
