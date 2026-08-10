import { productApi } from "@/api/product.api";
import ProductCard from "@/components/common/ProductCard";
import FilterModal from "@/components/search/FilterModal";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filters, setFilters] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchResults = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await productApi.searchProducts(query, 10);
      // API may return { products: [...] } or an array directly
      const products = Array.isArray(data)
        ? data
        : (data?.products ?? data?.items ?? []);
      setResults(products);
    } catch {
      setError("Failed to load results. Please try again.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchResults(searchQuery);
    setRefreshing(false);
  }, [fetchResults, searchQuery]);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      fetchResults(searchQuery);
    }, 400);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchQuery, fetchResults]);

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
  };

  // Apply client-side filters on top of API results
  const filteredResults = filters
    ? results.filter((p) => {
        if (filters.size && p.size !== filters.size) return false;
        if (filters.color && p.color !== filters.color) return false;
        if (
          filters.category &&
          filters.category !== "Custom" &&
          p.category !== filters.category
        )
          return false;
        if (
          filters.brand &&
          filters.brand !== "Custom" &&
          p.brand !== filters.brand
        )
          return false;
        return true;
      })
    : results;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header with Search Bar */}
      <View className="px-4 py-4 flex-row items-center gap-x-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center bg-gray-100 rounded-full"
        >
          <Feather name="chevron-left" size={24} color="black" />
        </TouchableOpacity>

        <View className="flex-1 flex-row items-center bg-[#F2F2F7] rounded-xl px-4 py-2">
          <TextInput
            className="flex-1 text-base h-10"
            placeholder="Search your product"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            returnKeyType="search"
            style={{ fontFamily: "Urbanist" }}
          />
          {isLoading ? (
            <ActivityIndicator size="small" color="#666" />
          ) : (
            <TouchableOpacity onPress={() => setIsFilterVisible(true)}>
              <Feather name="sliders" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results Header */}
      {filteredResults.length > 0 && (
        <View className="px-4 pb-4">
          <Text
            className="text-2xl"
            style={{ fontFamily: "Urbanist-SemiBold" }}
          >
            {searchQuery ? `Results for "${searchQuery}"` : "Filtered Products"}
          </Text>
          <Text className="text-gray-400" style={{ fontFamily: "Urbanist" }}>
            {filteredResults.length} results found
          </Text>
        </View>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <View className="items-center justify-center py-10 px-8">
          <Feather name="alert-circle" size={40} color="#F44336" />
          <Text
            className="mt-3 text-base text-red-500 text-center"
            style={{ fontFamily: "Urbanist-Medium" }}
          >
            {error}
          </Text>
        </View>
      )}

      {/* Results List */}
      {!error && (
        <FlatList
          data={filteredResults}
          keyExtractor={(item, index) => item.id ?? String(index)}
          renderItem={({ item }) => (
            <ProductCard
              id={item.id}
              name={item.name}
              variantId={item.variantId}
              isWishlisted={item.isWishlisted ?? false}
              image={
                item.primaryImage ||
                "https://dummyimage.com/600x800/cccccc/000000&text=No+Image"
              }
              price={item.price ?? item.basePrice ?? "0"}
              rating={item.averageRating ?? item.rating ?? 0}
            />
          )}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            isLoading ? null : searchQuery || filters ? (
              <View className="items-center justify-center py-20">
                <Feather name="search" size={64} color="#E5E5E5" />
                <Text
                  className="mt-4 text-xl text-gray-400"
                  style={{ fontFamily: "Urbanist-Medium" }}
                >
                  No products found
                </Text>
              </View>
            ) : (
              <View className="items-center justify-center py-20">
                <Feather name="search" size={64} color="#E5E5E5" />
                <Text
                  className="mt-4 text-xl text-gray-400"
                  style={{ fontFamily: "Urbanist-Medium" }}
                >
                  Search your products
                </Text>
              </View>
            )
          }
        />
      )}

      <FilterModal
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={handleApplyFilters}
      />
    </SafeAreaView>
  );
}
