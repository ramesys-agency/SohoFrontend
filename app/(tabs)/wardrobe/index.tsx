import { cartApi } from "@/api/cart.api";
import WardrobeItem from "@/app/components/wardrobe/WardrobeItem";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SubHeader from "../../components/navbar/SubHeader";

const initialItems = [
  {
    id: "1",
    title: "Rose Mist Long kurta",
    size: "M",
    price: 4500,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Cotton Salwar",
    size: "L",
    price: 2200,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Pink Saree",
    size: "L",
    price: 8200,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Women White Top",
    size: "L",
    price: 1500,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1534964645224-bca2fd1d0a5e?q=80&w=300&auto=format&fit=crop",
  },
];

export default function WardrobeScreen() {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [promoCode, setPromoCode] = useState("");

  const { data: cartData, error } = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.getCart,
  });

  useEffect(() => {
    if (cartData) {
      console.log("Cart API Response:", JSON.stringify(cartData, null, 2));
    }
    if (error) {
      console.error("Error fetching cart data via React Query:", error);
    }
  }, [cartData, error]);

  const handleIncrement = (id: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const handleDecrement = (id: string) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      }),
    );
  };

  const handleRemove = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const subTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = items.length > 0 ? 150 : 0;
  const total = subTotal + shipping;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader title="Wardrobe" showBackButton={false} />

      {items.length === 0 ? (
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
            {items.map((item) => (
              <WardrobeItem
                key={item.id}
                item={item}
                onIncrement={() => handleIncrement(item.id)}
                onDecrement={() => handleDecrement(item.id)}
                onRemove={() => handleRemove(item.id)}
                onPress={() => router.push(`/product/${item.id}`)}
              />
            ))}
          </ScrollView>

          {/* Fixed Bottom Section */}
          <View
            className="bg-gray-100 rounded-t-3xl p-6 absolute bottom-0 left-0 right-0"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 10,
            }}
          >
            {/* Drag Handle Indicator */}
            <View className="items-center mb-6">
              <View className="w-12 h-1 bg-gray-300 rounded-full" />
            </View>

            {/* Promo Code */}
            <View className="mb-4 flex-row">
              <TextInput
                className="flex-1 bg-white rounded-l-lg px-4 py-0 text-base"
                placeholder="Add Promo Code"
                value={promoCode}
                onChangeText={setPromoCode}
              />
              <TouchableOpacity className="bg-black justify-center px-6 rounded-r-lg">
                <Text className="text-white font-Urbanist-Bold">Apply</Text>
              </TouchableOpacity>
            </View>

            {/* Price Summary */}
            <View className="space-y-3 mb-8">
              <View className="flex-row justify-between">
                <Text className="text-gray-600 text-base">Sub Total</Text>
                <Text className="text-gray-900 text-base font-semibold">
                  ৳{subTotal.toLocaleString()}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600 text-base">Shipping</Text>
                <Text className="text-gray-900 text-base font-semibold">
                  ৳{shipping.toLocaleString()}
                </Text>
              </View>
              <View className="flex-row justify-between items-center mt-2">
                <View>
                  <Text className="text-gray-900 text-2xl font-Urbanist-Bold">
                    Total
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    Including $5.00 in taxes
                  </Text>
                </View>
                <Text className="text-gray-900 text-2xl font-Urbanist-Bold">
                  ৳{total.toLocaleString()}
                </Text>
              </View>
            </View>

            {/* Checkout Button */}
            <TouchableOpacity
              className="bg-black p-4 rounded-xl items-center flex-row justify-center mb-28"
              onPress={() => router.push("/wardrobe/address")}
            >
              <IconSymbol
                name="checkmark.circle.fill"
                size={20}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text className="text-white text-lg font-Urbanist-Bold">
                Checkout
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
