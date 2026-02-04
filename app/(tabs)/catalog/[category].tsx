import ProductCard from "@/app/components/common/ProductCard";
import SubHeader from "@/app/components/navbar/SubHeader";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data for products
const products = [
  {
    id: "1",
    name: "Rose Mist Long kurta",
    price: "৳4500",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=400&auto=format&fit=crop",
    category: "saree",
    gender: "women",
  },
  {
    id: "2",
    name: "Cotton Salwar",
    price: "৳2200",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb00dc?q=80&w=400&auto=format&fit=crop",
    category: "saree",
    gender: "women",
  },
  {
    id: "3",
    name: "Women Tops",
    price: "৳600",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=400&auto=format&fit=crop",
    category: "modern",
    gender: "women",
  },
  {
    id: "4",
    name: "Women Pants",
    price: "৳900",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?q=80&w=400&auto=format&fit=crop",
    category: "modern",
    gender: "women",
  },
  {
    id: "5",
    name: "Ethnic Silk",
    price: "৳5500",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop",
    category: "ethnic",
    gender: "women",
  },
  {
    id: "6",
    name: "Designer Wear",
    price: "৳7500",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1550614000-4b9519e090e2?q=80&w=400&auto=format&fit=crop",
    category: "ethnic",
    gender: "women",
  },
];

export default function CategoryScreen() {
  const { category, gender } = useLocalSearchParams();
  const router = useRouter();
  const categoryName = typeof category === "string" ? category : "Clothing";
  const genderName = typeof gender === "string" ? gender : "Women";

  // Format the category name for display (capitalize first letter)
  const displayTitle =
    categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  const displayGender =
    genderName.charAt(0).toUpperCase() + genderName.slice(1);

  return (
    <SafeAreaView className="flex-1 bg-white pb-28" edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View>
        <SubHeader title={displayTitle} showBackButton={true} />

        {/* Gender Filter Button */}
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

      <FlatList
        data={products}
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
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
