import { cartApi } from "@/api/cart.api";
import WardrobeItem from "@/app/components/wardrobe/WardrobeItem";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SubHeader from "../../components/navbar/SubHeader";

export default function WardrobeScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: cartData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.getCart,
  });

  const addToCartMutation = useMutation({
    mutationFn: cartApi.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: cartApi.removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const decrementCartMutation = useMutation({
    mutationFn: cartApi.decrementCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const items = React.useMemo(() => {
    if (!cartData?.data) return [];
    return cartData.data.map((cartItem: any) => {
      const variant = cartItem.variant || {};
      const product = variant.product || {};
      return {
        id: cartItem.id,
        variantId: variant.id,
        productId: product.id,
        title: product.name || "Unknown Product",
        size: variant.size || "N/A",
        color: variant.colorName || "N/A",
        price: parseFloat(variant.basePrice) || 0,
        quantity: cartItem.quantity || 1,
        image: variant.images?.[0]?.imageUrl,
      };
    });
  }, [cartData]);

  if (error) {
    console.error("Error fetching cart data via React Query:", error);
  }

  const handleIncrement = (variantId: string) => {
    if (!variantId) return;
    addToCartMutation.mutate(variantId);
  };

  const handleDecrement = (variantId: string) => {
    if (!variantId) return;
    decrementCartMutation.mutate(variantId);
  };

  const handleRemove = (variantId: string) => {
    if (!variantId) return;
    removeFromCartMutation.mutate(variantId);
  };

  const subTotal = items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0,
  );
  const shipping = items.length > 0 ? 150 : 0;
  const total = subTotal + shipping;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader title="Wardrobe" showBackButton={false} />

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : items.length === 0 ? (
        <View className="flex-1 justify-center items-center p-4">
          <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
            <IconSymbol name="cart.fill" size={40} color="#9CA3AF" />
          </View>
          <Text className="text-xl font-Urbanist-Bold text-gray-900 mb-2 w-full text-center">
            Your wardrobe is empty
          </Text>
          <Text className="text-gray-500 text-center mb-8">
            Looks like you haven&apos;t added anything to your wardrobe yet.
          </Text>
          <TouchableOpacity
            className="bg-black px-8 py-3 rounded-full"
            onPress={() => router.push("/(tabs)/catalog")}
          >
            <Text className="text-white font-semibold">Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView
            className="flex-1 px-4"
            contentContainerStyle={{ paddingBottom: 400 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Additional padding for visual spacing */}
            <View className="h-4" />

            {/* Items List */}
            {items.map((item: any) => (
              <WardrobeItem
                key={item.id}
                item={item}
                onIncrement={() => handleIncrement(item.variantId)}
                onDecrement={() => handleDecrement(item.variantId)}
                onRemove={() => handleRemove(item.variantId)}
                onPress={() => router.push(`/product/${item.productId}`)}
              />
            ))}
          </ScrollView>

          {/* Fixed Bottom Section */}
          <View
            className="bg-gray-100 py-6 px-6 absolute bottom-3 left-0 right-0"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 10,
            }}
          >
            <View className="flex-row justify-between items-center mb-24">
              <View>
                <Text className="text-gray-500 font-medium mb-1">Total</Text>
                <Text className="text-gray-900 text-2xl font-Urbanist-Bold">
                  ৳{total.toLocaleString()}
                </Text>
              </View>

              <TouchableOpacity
                className="bg-black px-6 py-3 rounded-md flex-row items-center"
                onPress={() => router.push("/wardrobe/address")}
              >
                <Text className="text-white text-lg font-Urbanist-Bold mr-2">
                  Proceed
                </Text>
                <IconSymbol name="chevron.right" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
