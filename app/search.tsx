import ProductCard from "@/app/components/common/ProductCard";
import FilterModal from "@/app/components/search/FilterModal";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data for products (Shared or similar to [category].tsx)
const mockProducts = [
  {
    id: "1",
    name: "Rose Mist Long kurta",
    price: "৳4500",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=400&auto=format&fit=crop",
    category: "Clothes",
    brand: "Gucci",
    size: "M",
    color: "#000000",
  },
  {
    id: "2",
    name: "Cotton Salwar",
    price: "৳2200",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb00dc?q=80&w=400&auto=format&fit=crop",
    category: "Clothes",
    brand: "Fendi",
    size: "S",
    color: "#1E88E5",
  },
  {
    id: "3",
    name: "Women Tops",
    price: "৳600",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=400&auto=format&fit=crop",
    category: "Clothes",
    brand: "Adidas",
    size: "L",
    color: "#F44336",
  },
  {
    id: "4",
    name: "Women Pants",
    price: "৳900",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?q=80&w=400&auto=format&fit=crop",
    category: "Clothes",
    brand: "Gucci",
    size: "XL",
    color: "#FFB300",
  },
  {
    id: "5",
    name: "Leather Bag",
    price: "৳5500",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=400&auto=format&fit=crop",
    category: "Bags",
    brand: "Fendi",
    size: "L",
    color: "#000000",
  },
  {
    id: "6",
    name: "Running Shoes",
    price: "৳7500",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=400&auto=format&fit=crop",
    category: "Shoes",
    brand: "Adidas",
    size: "M",
    color: "#1E88E5",
  },
];

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filters, setFilters] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, filters);
  };

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
    applyFilters(searchQuery, newFilters);
  };

  const applyFilters = (query: string, currentFilters: any) => {
    if (!query && !currentFilters) {
      setResults([]);
      return;
    }

    let filtered = mockProducts.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase()),
    );

    if (currentFilters) {
      if (currentFilters.size) {
        filtered = filtered.filter((p) => p.size === currentFilters.size);
      }
      if (currentFilters.color) {
        filtered = filtered.filter((p) => p.color === currentFilters.color);
      }
      if (currentFilters.category && currentFilters.category !== "Custom") {
        filtered = filtered.filter(
          (p) => p.category === currentFilters.category,
        );
      }
      if (currentFilters.brand && currentFilters.brand !== "Custom") {
        filtered = filtered.filter((p) => p.brand === currentFilters.brand);
      }
      // Price range filtering would need more logic to parse strings like "0 - 20,000"
    }

    setResults(filtered);
  };

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
            onChangeText={handleSearch}
            style={{ fontFamily: "Urbanist" }}
          />
          <TouchableOpacity onPress={() => setIsFilterVisible(true)}>
            <Feather name="sliders" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Results Header */}
      {results.length > 0 && (
        <View className="px-4 pb-4">
          <Text
            className="text-2xl"
            style={{ fontFamily: "Urbanist-SemiBold" }}
          >
            {searchQuery ? `Results for "${searchQuery}"` : "Filtered Products"}
          </Text>
          <Text className="text-gray-400" style={{ fontFamily: "Urbanist" }}>
            {results.length} results found
          </Text>
        </View>
      )}

      {/* Results List */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard
            id={item.id}
            name={item.name}
            image={item.image}
            price={item.price}
            rating={item.rating}
            onPress={() => router.push(`/product/${item.id}`)}
          />
        )}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          searchQuery || filters ? (
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

      <FilterModal
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={handleApplyFilters}
      />
    </SafeAreaView>
  );
}
