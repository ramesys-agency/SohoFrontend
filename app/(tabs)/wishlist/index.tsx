import { cartApi } from "@/api/cart.api";
import { wishlistApi } from "@/api/wishlist.api";
import SubHeader from "@/components/navbar/SubHeader";
import WishlistItem from "@/components/wishlist/WishlistItem";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useToastStore } from "@/store/toastStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
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
  const queryClient = useQueryClient();
  const showToast = useToastStore((s: any) => s.showToast);
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);

  const {
    data: wishlistData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistApi.fetchWishlist,
  });

  const addToCartMutation = useMutation({
    mutationFn: (variantId: string) => cartApi.addToCart(variantId),
    onSuccess: () => {
      showToast({ message: "Added to wardrobe", type: "success" });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error: any) => {
      showToast({
        message: error?.response?.data?.error || "Failed to add to wardrobe.",
        type: "error",
      });
    },
    onSettled: () => {
      setAddingToCartId(null);
    },
  });

  const handleDelete = async (variantId: string) => {
    try {
      await wishlistApi.toggleWishlist(variantId);
      refetch();
    } catch (error) {
      console.error("Error removing from wishlist", error);
    }
  };

  const handleAddToCart = (variantId: string) => {
    if (addToCartMutation.isPending) return;
    setAddingToCartId(variantId);
    addToCartMutation.mutate(variantId);
  };

  const { data: cartData } = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.getCart,
  });

  const inCartIds = useMemo<Set<string>>(() => {
    const cartItems: any[] = cartData?.data || [];
    return new Set(cartItems.map((i: any) => i.variantId));
  }, [cartData]);

  const items = wishlistData?.data || [];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader title="Wishlist" />
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#000" />
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
                  onDelete={() => handleDelete(item.variantId)}
                  onAddToCart={() => handleAddToCart(item.variantId)}
                  isAddingToCart={addingToCartId === item.variantId}
                  isInCart={inCartIds.has(item.variantId)}
                  onPress={() => router.push(`/product/${product?.id}`)}
                />
              );
            }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshing={isLoading}
            onRefresh={refetch}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default WishlistScreen;
