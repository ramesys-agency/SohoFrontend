import { cartApi } from "@/api/cart.api";
import { logisticsApi } from "@/api/logistics.api";
import { orderApi } from "@/api/order.api";
import SubHeader from "@/app/components/navbar/SubHeader";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

export default function PaymentScreen() {
  const { addressId } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const [selectedAggregator, setSelectedAggregator] = useState<string | null>(
    null,
  );

  // Fetch Cart for summary
  const { data: cartData, isLoading: cartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.getCart,
  });

  // Fetch Aggregators
  const { data: aggregatorsData, isLoading: aggregatorsLoading } = useQuery({
    queryKey: ["aggregators"],
    queryFn: logisticsApi.getAggregators,
  });

  const aggregators = aggregatorsData?.data?.aggregators || [];
  const items = cartData?.data || [];

  const subtotal = items.reduce(
    (acc: number, item: any) =>
      acc + parseFloat(item.variant.basePrice) * item.quantity,
    0,
  );
  const shippingCharge = 150; // Flat fee for now
  const total = subtotal + shippingCharge;

  const placeOrderMutation = useMutation({
    mutationFn: (data: any) => orderApi.createOrder(data),
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      router.push({
        pathname: "/wardrobe/order-success",
        params: {
          orderCode: response.data?.orderCode,
          orderId: response.data?.id,
        },
      });
    },
    onError: (error: any) => {
      console.error("Order placement failed:", error);
      Alert.alert("Error", "Failed to place order. Please try again.");
    },
  });

  const handlePlaceOrder = () => {
    if (!selectedAggregator) {
      Alert.alert("Required", "Please select a delivery partner.");
      return;
    }

    placeOrderMutation.mutate({
      addressId: addressId as string,
      aggregator: selectedAggregator,
      paymentMethod: "COD",
    });
  };

  const isLoading = cartLoading || aggregatorsLoading;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader title="Payment & Delivery" showBackButton={true} />

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4 pt-4"
          showsVerticalScrollIndicator={false}
        >
          {/* Order Summary Section */}
          <View className="mb-6 bg-gray-50 p-5 rounded-2xl">
            <Text className="text-lg font-Urbanist-Bold mb-4">
              Order Summary
            </Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500 font-Urbanist-Medium">
                Subtotal ({items.length} items)
              </Text>
              <Text className="text-black font-Urbanist-Bold">
                ৳{subtotal.toLocaleString()}
              </Text>
            </View>
            <View className="flex-row justify-between mb-4">
              <Text className="text-gray-500 font-Urbanist-Medium">
                Shipping Charge
              </Text>
              <Text className="text-black font-Urbanist-Bold">
                ৳{shippingCharge}
              </Text>
            </View>
            <View className="border-t border-gray-200 pt-3 flex-row justify-between">
              <Text className="text-lg font-Urbanist-Bold">Total Amount</Text>
              <Text className="text-lg font-Urbanist-Bold">
                ৳{total.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Aggregator Selection Section */}
          <Text className="text-lg font-Urbanist-Bold mb-4 px-1">
            Choose Delivery Partner
          </Text>
          <View className="flex-row flex-wrap justify-between mb-6">
            {aggregators.map((name: string) => (
              <TouchableOpacity
                key={name}
                onPress={() => setSelectedAggregator(name)}
                className={`w-[48%] mb-4 p-4 rounded-xl border-2 items-center justify-center ${
                  selectedAggregator === name
                    ? "border-black bg-gray-50"
                    : "border-gray-100"
                }`}
              >
                <Text
                  className={`font-Urbanist-Bold capitalize ${
                    selectedAggregator === name ? "text-black" : "text-gray-400"
                  }`}
                >
                  {name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Payment Method Section (Fixed to COD) */}
          <Text className="text-lg font-Urbanist-Bold mb-4 px-1">
            Payment Method
          </Text>
          <View className="p-5 rounded-2xl border-2 border-black bg-gray-50 flex-row items-center justify-between mb-10">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-black/5 rounded-full items-center justify-center mr-4">
                <Feather name="truck" size={20} color="black" />
              </View>
              <View>
                <Text className="font-Urbanist-Bold">Cash on Delivery</Text>
                <Text className="text-xs text-gray-500 font-Urbanist">
                  Pay when you receive your order
                </Text>
              </View>
            </View>
            <Feather name="check-circle" size={24} color="black" />
          </View>

          <View className="h-40" />
        </ScrollView>
      )}

      {/* Place Order Button Section */}
      <View className="p-4 border-t border-gray-100 pb-10">
        <TouchableOpacity
          className={`bg-black p-4 rounded-xl items-center justify-center flex-row ${
            placeOrderMutation.isPending || !selectedAggregator
              ? "opacity-70"
              : ""
          }`}
          onPress={handlePlaceOrder}
          disabled={placeOrderMutation.isPending || !selectedAggregator}
        >
          {placeOrderMutation.isPending ? (
            <ActivityIndicator color="white" className="mr-2" />
          ) : (
            <Feather
              name="shopping-bag"
              size={20}
              color="white"
              className="mr-2"
            />
          )}
          <Text className="text-white font-Urbanist-Bold text-lg ml-2">
            {placeOrderMutation.isPending
              ? "Processing..."
              : `Place Order • ৳${total.toLocaleString()}`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
