import { productApi, type SearchFacets, type SearchParams } from "@/api/product.api";
import ProductCard from "@/components/common/ProductCard";
import FilterModal, {
  type SearchFilters,
  countActiveFilters,
  EMPTY_FILTERS,
} from "@/components/search/FilterModal";
import { recentSearches } from "@/store/recentSearches";
import { Feather } from "@expo/vector-icons";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PAGE_SIZE = 20;

const SORT_OPTIONS: { label: string; value: SearchParams["sortBy"] }[] = [
  { label: "Best match", value: "relevance" },
  { label: "New in", value: "newest" },
  { label: "Price ↑", value: "price_asc" },
  { label: "Price ↓", value: "price_desc" },
  { label: "Top rated", value: "rating" },
];

export default function SearchScreen() {
  const router = useRouter();

  // What the shopper is typing, and the term the results actually reflect.
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>(EMPTY_FILTERS);
  const [sortBy, setSortBy] = useState<SearchParams["sortBy"]>("relevance");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    recentSearches.list().then(setRecent);
  }, []);

  // Typing settles before it costs a request; submitting skips the wait.
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setSubmittedQuery(searchQuery.trim()), 350);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchQuery]);

  const activeFilterCount = countActiveFilters(filters);
  const hasCriteria = Boolean(submittedQuery) || activeFilterCount > 0;

  const params = useMemo<SearchParams>(() => {
    const next: SearchParams = { limit: PAGE_SIZE };
    if (submittedQuery) next.q = submittedQuery;
    if (filters.categoryId) next.categoryId = filters.categoryId;
    if (filters.gender) next.gender = filters.gender;
    if (filters.sizes.length > 0) next.size = filters.sizes.join(",");
    if (filters.colors.length > 0) next.color = filters.colors.join(",");
    if (filters.minPrice !== null) next.minPrice = filters.minPrice;
    if (filters.maxPrice !== null) next.maxPrice = filters.maxPrice;
    if (filters.inStockOnly) next.inStock = true;
    if (sortBy && sortBy !== "relevance") next.sortBy = sortBy;
    return next;
  }, [submittedQuery, filters, sortBy]);

  // React Query keys the results by the exact search, so a slow response for an
  // old query can never land on top of a newer one.
  const {
    data,
    isLoading,
    isError,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    // Runs even with nothing typed: that request comes back empty except for
    // the facets, which is what the filter sheet opens with.
    queryKey: ["product-search", params],
    initialPageParam: 1,
    queryFn: ({ pageParam, signal }) =>
      productApi.searchProducts({ ...params, page: pageParam }, { signal }),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
  });

  const pages = data?.pages ?? [];
  const results = pages.flatMap((page) => page.products);
  const total = pages[0]?.pagination.total ?? 0;
  const widened = pages[0]?.widened ?? false;
  const facets: SearchFacets | undefined = pages[0]?.facets;

  // A search only counts as one worth remembering once it has been run.
  useEffect(() => {
    if (!submittedQuery) return;
    recentSearches.add(submittedQuery).then(setRecent);
  }, [submittedQuery]);

  const runSearch = useCallback((term: string) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setSearchQuery(term);
    setSubmittedQuery(term.trim());
  }, []);

  const clearAll = useCallback(() => {
    runSearch("");
    setFilters(EMPTY_FILTERS);
    setSortBy("relevance");
  }, [runSearch]);

  const removeRecent = (term: string) => {
    recentSearches.remove(term).then(setRecent);
  };

  const showRecent = !hasCriteria && recent.length > 0;

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
          <Feather name="search" size={18} color="#999" />
          <TextInput
            className="flex-1 text-base h-10 ml-2"
            placeholder="Search products, colours, categories"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => runSearch(searchQuery)}
            autoCorrect={false}
            autoFocus
            returnKeyType="search"
            style={{ fontFamily: "Urbanist" }}
          />
          {isLoading && !isRefetching ? (
            <ActivityIndicator size="small" color="#666" />
          ) : searchQuery.length > 0 ? (
            <TouchableOpacity onPress={() => runSearch("")} hitSlop={8}>
              <Feather name="x-circle" size={18} color="#999" />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          onPress={() => setIsFilterVisible(true)}
          className="w-10 h-10 items-center justify-center bg-gray-100 rounded-full"
        >
          <Feather name="sliders" size={20} color="#111" />
          {activeFilterCount > 0 && (
            <View className="absolute -top-0.5 -right-0.5 bg-black rounded-full min-w-4 h-4 px-1 items-center justify-center">
              <Text
                className="text-white text-[10px]"
                style={{ fontFamily: "Urbanist-SemiBold" }}
              >
                {activeFilterCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Sort row — only useful once there is something to sort */}
      {hasCriteria && results.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          className="max-h-11 mb-1"
        >
          {SORT_OPTIONS.map((option) => {
            const isActive = (sortBy ?? "relevance") === option.value;
            return (
              <TouchableOpacity
                key={option.label}
                onPress={() => setSortBy(option.value)}
                className={`px-4 h-9 rounded-full items-center justify-center ${
                  isActive ? "bg-black" : "bg-gray-100"
                }`}
              >
                <Text
                  className={`text-sm ${isActive ? "text-white" : "text-gray-600"}`}
                  style={{ fontFamily: "Urbanist-Medium" }}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Results Header */}
      {hasCriteria && !isLoading && !isError && results.length > 0 && (
        <View className="px-4 pb-3">
          <Text className="text-2xl" style={{ fontFamily: "Urbanist-SemiBold" }}>
            {submittedQuery ? `Results for “${submittedQuery}”` : "Filtered products"}
          </Text>
          <Text className="text-gray-400" style={{ fontFamily: "Urbanist" }}>
            {total} {total === 1 ? "result" : "results"}
            {activeFilterCount > 0 ? " · filtered" : ""}
          </Text>
          {widened && (
            <Text className="text-gray-500 mt-1" style={{ fontFamily: "Urbanist" }}>
              No exact match — showing the closest products.
            </Text>
          )}
        </View>
      )}

      {/* Error State */}
      {isError && (
        <View className="items-center justify-center py-10 px-8">
          <Feather name="alert-circle" size={40} color="#F44336" />
          <Text
            className="mt-3 text-base text-red-500 text-center"
            style={{ fontFamily: "Urbanist-Medium" }}
          >
            Failed to load results. Please try again.
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="mt-4 bg-black px-6 py-3 rounded-xl"
          >
            <Text className="text-white" style={{ fontFamily: "Urbanist-SemiBold" }}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Recent searches, shown while there is nothing to show results for */}
      {showRecent && !isError && (
        <View className="px-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg" style={{ fontFamily: "Urbanist-SemiBold" }}>
              Recent searches
            </Text>
            <TouchableOpacity
              onPress={() => recentSearches.clear().then(() => setRecent([]))}
            >
              <Text className="text-gray-400" style={{ fontFamily: "Urbanist-Medium" }}>
                Clear all
              </Text>
            </TouchableOpacity>
          </View>
          {recent.map((term) => (
            <View
              key={term}
              className="flex-row items-center justify-between py-3 border-b border-gray-100"
            >
              <TouchableOpacity
                className="flex-1 flex-row items-center gap-x-3"
                onPress={() => runSearch(term)}
              >
                <Feather name="clock" size={16} color="#999" />
                <Text className="text-base" style={{ fontFamily: "Urbanist" }}>
                  {term}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeRecent(term)} hitSlop={8}>
                <Feather name="x" size={16} color="#BBB" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Results List */}
      {!isError && !showRecent && (
        <FlatList
          data={results}
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
              price={String(item.price ?? 0)}
              rating={item.rating ?? 0}
            />
          )}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) fetchNextPage();
          }}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-6">
                <ActivityIndicator size="small" color="#666" />
              </View>
            ) : null
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefetching && !isFetchingNextPage}
              onRefresh={refetch}
            />
          }
          ListEmptyComponent={
            isLoading ? null : hasCriteria ? (
              <View className="items-center justify-center py-20 px-8">
                <Feather name="search" size={64} color="#E5E5E5" />
                <Text
                  className="mt-4 text-xl text-gray-400 text-center"
                  style={{ fontFamily: "Urbanist-Medium" }}
                >
                  {submittedQuery
                    ? `No products match “${submittedQuery}”`
                    : "No products match these filters"}
                </Text>
                <Text
                  className="mt-1 text-gray-400 text-center"
                  style={{ fontFamily: "Urbanist" }}
                >
                  Try fewer words{activeFilterCount > 0 ? " or fewer filters" : ""}.
                </Text>
                <TouchableOpacity
                  onPress={clearAll}
                  className="mt-5 bg-black px-6 py-3 rounded-xl"
                >
                  <Text
                    className="text-white"
                    style={{ fontFamily: "Urbanist-SemiBold" }}
                  >
                    Start over
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="items-center justify-center py-20 px-8">
                <Feather name="search" size={64} color="#E5E5E5" />
                <Text
                  className="mt-4 text-xl text-gray-400 text-center"
                  style={{ fontFamily: "Urbanist-Medium" }}
                >
                  Search by name, colour or category
                </Text>
                <Text
                  className="mt-1 text-gray-400 text-center"
                  style={{ fontFamily: "Urbanist" }}
                >
                  Or open the filters to browse by size, colour and price.
                </Text>
              </View>
            )
          }
        />
      )}

      <FilterModal
        visible={isFilterVisible}
        facets={facets}
        filters={filters}
        onClose={() => setIsFilterVisible(false)}
        onApply={setFilters}
      />
    </SafeAreaView>
  );
}
