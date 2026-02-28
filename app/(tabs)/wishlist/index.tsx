import { wishlistApi } from "@/api/wishlist.api";
import SubHeader from "@/app/components/navbar/SubHeader";
import WishlistItem from "@/app/components/wishlist/WishlistItem";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const WishlistScreen = () => {
  const router = useRouter();

  const {
    data: wishlistData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistApi.fetchWishlist,
  });

  const handleDelete = async (id: string, variantId: string) => {
    try {
      await wishlistApi.toggleWishlist(variantId);
      refetch();
    } catch (error) {
      console.error("Error removing from wishlist", error);
    }
  };

  const items = wishlistData?.data || [];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader title="Wishlist" />
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : items.length === 0 ? (
        <View className="flex-1 justify-center items-center p-4">
          <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
            <IconSymbol name="heart.fill" size={40} color="#9CA3AF" />
          </View>
          <Text className="text-xl font-Urbanist-Bold text-gray-900 mb-2 w-full text-center">
            Your wishlist is empty
          </Text>
          <Text className="text-gray-500 text-center mb-8">
            Looks like you haven&apos;t added anything to your wishlist yet.
          </Text>
          <TouchableOpacity
            className="bg-black px-8 py-3 rounded-full"
            onPress={() => router.push("/(tabs)/catalog")}
          >
            <Text className="text-white font-semibold">Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-1 px-4 pt-2">
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const variant = item.variant;
              const product = variant?.product;
              const primaryImage =
                variant?.images?.find((img: any) => img.isPrimary)?.imageUrl ||
                variant?.images?.[0]?.imageUrl;

              return (
                <WishlistItem
                  image={{
                    uri:
                      primaryImage ||
                      "https://dummyimage.com/600x800/cccccc/000000&text=No+Image",
                  }}
                  name={product?.name || "Unknown Product"}
                  size={variant?.size || "N/A"}
                  price={`৳${variant?.basePrice || "0"}`}
                  onDelete={() => handleDelete(item.id, item.variantId)}
                />
              );
            }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default WishlistScreen;
