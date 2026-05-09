import { cartApi } from "@/api/cart.api";
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
  TextInput,
} from "react-native";
import { couponApi } from "@/api/coupon.api";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useToastStore } from "@/store/toastStore";

export default function PaymentScreen() {
  const { addressId } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
  } | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const { showToast } = useToastStore();

  // Fetch Cart for summary
  const { data: cartData, isLoading: cartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.getCart,
  });

  const items = React.useMemo(() => cartData?.data || [], [cartData]);

  const subtotal = items.reduce(
    (acc: number, item: any) =>
      acc + parseFloat(item.variant.basePrice) * item.quantity,
    0,
  );
  const shippingCharge = 150; // Flat fee for now
  const discountAmount = appliedCoupon?.discountAmount || 0;
  const total = subtotal + shippingCharge - discountAmount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsValidatingCoupon(true);
    try {
      const response = await couponApi.validateCoupon(couponCode, items);
      setAppliedCoupon({
        code: response.code,
        discountAmount: response.discountAmount,
      });
      showToast({ message: "Coupon applied successfully!", type: "success" });
    } catch (error: any) {
      console.error("Coupon validation failed:", error);
      Alert.alert(
        "Invalid Coupon",
        error.response?.data?.message || "This coupon code is not valid.",
      );
    } finally {
      setIsValidatingCoupon(false);
    }
  };

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
    placeOrderMutation.mutate({
      addressId: addressId as string,
      paymentMethod: "COD",
      couponCode: appliedCoupon?.code,
    });
  };

  const isLoading = cartLoading;

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
          <View className="mb-6 bg-gray-50 p-6 rounded-3xl">
            <Text className="text-xl font-Urbanist-Bold mb-4">
              Order Summary
            </Text>

            {/* Item List */}
            <View className="mb-4 border-b border-gray-100 pb-2">
              {items.map((item: any, index: number) => (
                <View
                  key={item.id || index}
                  className="flex-row justify-between mb-3"
                >
                  <View className="flex-1">
                    <Text className="text-black font-Urbanist-Medium">
                      {item.variant.product.name}
                    </Text>
                    <Text className="text-gray-500 text-xs font-Urbanist">
                      {item.variant.name} × {item.quantity}
                    </Text>
                  </View>
                  <Text className="text-black font-Urbanist-Bold">
                    ৳
                    {(
                      parseFloat(item.variant.basePrice) * item.quantity
                    ).toLocaleString()}
                  </Text>
                </View>
              ))}
            </View>

            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-500 font-Urbanist-Medium">
                Subtotal
              </Text>
              <Text className="text-black font-Urbanist-Bold">
                ৳{(subtotal || 0).toLocaleString()}
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

            {appliedCoupon && (
              <View className="flex-row justify-between mb-4">
                <View className="flex-row items-center">
                  <Text className="text-green-600 font-Urbanist-Medium">
                    Discount ({appliedCoupon.code})
                  </Text>
                  <TouchableOpacity
                    onPress={() => setAppliedCoupon(null)}
                    className="ml-2"
                  >
                    <Feather name="x-circle" size={14} color="#16a34a" />
                  </TouchableOpacity>
                </View>
                <Text className="text-green-600 font-Urbanist-Bold">
                  -৳{(appliedCoupon.discountAmount || 0).toLocaleString()}
                </Text>
              </View>
            )}

            <View className="border-t border-gray-200 pt-4 flex-row justify-between">
              <Text className="text-lg font-Urbanist-Bold">Total Amount</Text>
              <Text className="text-lg font-Urbanist-Bold">
                ৳{(total || 0).toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Coupon Input Section */}
          <View className="mb-6 px-1">
            <Text className="text-lg font-Urbanist-Bold mb-3">
              Have a Coupon?
            </Text>
            <View className="flex-row items-center gap-2">
              <View className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                <TextInput
                  placeholder="Enter code"
                  value={couponCode}
                  onChangeText={setCouponCode}
                  autoCapitalize="characters"
                  className="font-Urbanist-Medium text-black"
                />
              </View>
              <TouchableOpacity
                onPress={handleApplyCoupon}
                disabled={isValidatingCoupon || !couponCode.trim()}
                className={`bg-black px-6 py-3.5 rounded-xl ${
                  isValidatingCoupon || !couponCode.trim() ? "opacity-50" : ""
                }`}
              >
                {isValidatingCoupon ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text className="text-white font-Urbanist-Bold">Apply</Text>
                )}
              </TouchableOpacity>
            </View>
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
      <View className="p-4 border-t border-gray-100 mb-32">
        <TouchableOpacity
          className={`bg-black p-4 rounded-2xl items-center justify-center flex-row shadow-xl ${
            placeOrderMutation.isPending ? "opacity-70" : ""
          }`}
          onPress={handlePlaceOrder}
          disabled={placeOrderMutation.isPending}
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
              : `Place Order • ৳${(total || 0).toLocaleString()}`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
