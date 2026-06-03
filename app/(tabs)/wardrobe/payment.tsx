import { cartApi } from "@/api/cart.api";
import { orderApi } from "@/api/order.api";
import { userApi } from "@/api/user.api";
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
  TextInput,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { couponApi } from "@/api/coupon.api";
import { SafeAreaView } from "react-native-safe-area-context";

const WARDROBE_EXTRA_BOTTOM = 96;
import { Feather } from "@expo/vector-icons";
import { useToastStore } from "@/store/toastStore";
import { CheckoutStepper } from "./address";

export default function PaymentScreen() {
  const {
    addressId,
    paymentMethod,
    buyNowVariantId,
    buyNowProductName,
    buyNowVariantName,
    buyNowPrice,
    _ctx,
  } = useLocalSearchParams<{
    addressId: string;
    paymentMethod: string;
    buyNowVariantId?: string;
    buyNowProductName?: string;
    buyNowVariantName?: string;
    buyNowPrice?: string;
    _ctx?: string;
  }>();
  const isBuyNow = !!buyNowVariantId;
  const queryClient = useQueryClient();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
  } | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [orderError, setOrderError] = useState<{
    type: "network" | "server";
    message: string;
  } | null>(null);
  const { showToast } = useToastStore();

  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSavingPhone, setIsSavingPhone] = useState(false);

  // Fetch user profile to check for phone number
  const { data: profileData } = useQuery({
    queryKey: ["userProfile"],
    queryFn: userApi.getProfile,
  });

  // Fetch Cart for summary (skipped in buy-now mode)
  const { data: cartData, isLoading: cartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: cartApi.getCart,
    enabled: !isBuyNow,
  });

  const items = React.useMemo(() => {
    if (isBuyNow) {
      return [
        {
          id: buyNowVariantId,
          quantity: 1,
          variant: {
            basePrice: buyNowPrice || "0",
            product: { name: buyNowProductName || "" },
            name: buyNowVariantName || "",
          },
        },
      ];
    }
    return cartData?.data || [];
  }, [
    isBuyNow,
    cartData,
    buyNowVariantId,
    buyNowProductName,
    buyNowVariantName,
    buyNowPrice,
  ]);

  const subtotal = items.reduce(
    (acc: number, item: any) =>
      acc + parseFloat(item.variant.basePrice) * item.quantity,
    0,
  );
  const shippingCharge = 150; // Flat fee for now
  const discountAmount = appliedCoupon?.discountAmount || 0;
  const total = Math.max(0, subtotal + shippingCharge - discountAmount);

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
      showToast({
        message: error.response?.data?.error || error.response?.data?.message || "Invalid coupon code.",
        type: "error",
      });
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const placeOrderMutation = useMutation({
    mutationFn: (data: any) => orderApi.createOrder(data),
    onSuccess: (response: any) => {
      setOrderError(null);
      if (!isBuyNow) {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
      const basePath = _ctx === "checkout" ? "/checkout" : "/wardrobe";
      router.push({
        pathname: `${basePath}/order-success` as any,
        params: {
          orderCode: response.data?.orderCode,
          orderId: response.data?.id,
        },
      });
    },
    onError: (error: any) => {
      const isNetworkError =
        error?.code === "ERR_NETWORK" ||
        error?.message === "Network Error" ||
        !error?.response;
      setOrderError({
        type: isNetworkError ? "network" : "server",
        message: isNetworkError
          ? "Unable to reach the server. Please check your internet connection and try again."
          : error?.response?.data?.error ||
            error?.response?.data?.message ||
            "Something went wrong while placing your order.",
      });
    },
  });

  const handleSavePhoneAndOrder = async () => {
    const cleanPhone = phoneNumber.trim();
    if (!/^\d{10,13}$/.test(cleanPhone)) {
      Alert.alert("Invalid Number", "Phone number must be between 10 and 13 digits.");
      return;
    }

    setIsSavingPhone(true);
    try {
      await userApi.updateProfile({ phone: cleanPhone });
      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      setShowPhoneModal(false);
      
      // Now place the order directly
      placeOrderMutation.mutate({
        addressId: addressId as string,
        paymentMethod: paymentMethod || "COD",
        couponCode: appliedCoupon?.code,
        ...(isBuyNow && { buyNow: { variantId: buyNowVariantId, quantity: 1 } }),
      });
    } catch (error: any) {
      console.error("Failed to update phone number:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error || error.response?.data?.message || "Failed to update phone number. Please try again."
      );
    } finally {
      setIsSavingPhone(false);
    }
  };

  const handlePlaceOrder = () => {
    setOrderError(null);
    if (!profileData?.phone) {
      setShowPhoneModal(true);
      return;
    }
    placeOrderMutation.mutate({
      addressId: addressId as string,
      paymentMethod: paymentMethod || "COD",
      couponCode: appliedCoupon?.code,
      ...(isBuyNow && { buyNow: { variantId: buyNowVariantId, quantity: 1 } }),
    });
  };

  const getPaymentMethodDetails = () => {
    const method = (paymentMethod as string) || "COD";
    switch (method) {
      case "COD":
        return {
          title: "Cash on Delivery",
          subtitle: "Pay when you receive your order",
          icon: "truck" as const,
        };
      case "CARD":
        return {
          title: "Debit/credit Card",
          subtitle: "Pay securely via your card",
          icon: "credit-card" as const,
        };
      case "WALLET":
        return {
          title: "Wallet",
          subtitle: "Pay via your digital wallet",
          icon: "pocket" as const,
        };
      case "BANK":
        return {
          title: "Net Banking",
          subtitle: "Pay directly from your bank account",
          icon: "home" as const,
        };
      default:
        return {
          title: "Cash on Delivery",
          subtitle: "Pay when you receive your order",
          icon: "truck" as const,
        };
    }
  };

  const methodDetails = getPaymentMethodDetails();
  const isLoading = !isBuyNow && cartLoading;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader title="Payment & Details" showBackButton={true} />

      {/* Stepper with step 3 active */}
      <CheckoutStepper currentStep={3} />

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
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-Urbanist-Bold">Order Summary</Text>
              <Text className="text-sm font-Urbanist-Medium text-gray-500">
                {items.length} {items.length === 1 ? "item" : "items"}
              </Text>
            </View>

            {/* Item List */}
            <View className="mb-4 border-b border-gray-100 pb-2">
              {items.map((item: any, index: number) => {
                const parts = [
                  item.variant.colorName,
                  item.variant.size,
                ].filter(Boolean);
                const variantLabel =
                  parts.length > 0 ? parts.join(" · ") : item.variant.name;

                return (
                  <View
                    key={item.id || index}
                    className="flex-row justify-between mb-3"
                  >
                    <View className="flex-1 mr-3">
                      <Text className="text-black font-Urbanist-Medium">
                        {item.variant.product.name}
                      </Text>
                      <Text className="text-gray-500 text-xs font-Urbanist mt-0.5">
                        {variantLabel} · Qty {item.quantity}
                      </Text>
                    </View>
                    <Text className="text-black font-Urbanist-Bold">
                      ৳
                      {(
                        parseFloat(item.variant.basePrice) * item.quantity
                      ).toLocaleString()}
                    </Text>
                  </View>
                );
              })}
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
                  placeholderTextColor="#9CA3AF"
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

          {/* Payment Method Section (Dynamic based on parameter) */}
          <Text className="text-lg font-Urbanist-Bold mb-4 px-1">
            Payment Method
          </Text>
          <View className="p-5 rounded-2xl border-2 border-black bg-gray-50 flex-row items-center justify-between mb-10">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-black/5 rounded-full items-center justify-center mr-4">
                <Feather name={methodDetails.icon} size={20} color="black" />
              </View>
              <View>
                <Text className="font-Urbanist-Bold">
                  {methodDetails.title}
                </Text>
                <Text className="text-xs text-gray-500 font-Urbanist">
                  {methodDetails.subtitle}
                </Text>
              </View>
            </View>
            <Feather name="check-circle" size={24} color="black" />
          </View>

          <View style={{ height: _ctx === "checkout" ? 160 : 220 }} />
        </ScrollView>
      )}

      {/* Order error banner */}
      {orderError && (
        <View
          style={{
            marginHorizontal: 16,
            marginBottom: 8,
            backgroundColor: "#FEF2F2",
            borderWidth: 1,
            borderColor: "#FECACA",
            borderRadius: 12,
            padding: 14,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              marginBottom: 10,
            }}
          >
            <Feather
              name="wifi-off"
              size={16}
              color="#DC2626"
              style={{ marginTop: 1, marginRight: 8 }}
            />
            <Text
              style={{
                flex: 1,
                fontSize: 13,
                fontFamily: "Urbanist-Medium",
                color: "#991B1B",
                lineHeight: 19,
              }}
            >
              {orderError.message}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              onPress={handlePlaceOrder}
              style={{
                flex: 1,
                backgroundColor: "#DC2626",
                paddingVertical: 9,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 13,
                  fontFamily: "Urbanist-Bold",
                }}
              >
                Try Again
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/profile/help-support")}
              style={{
                flex: 1,
                backgroundColor: "white",
                paddingVertical: 9,
                borderRadius: 8,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#FECACA",
              }}
            >
              <Text
                style={{
                  color: "#DC2626",
                  fontSize: 13,
                  fontFamily: "Urbanist-Bold",
                }}
              >
                Contact Support
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Place Order Button Section */}
      <View
        className="p-4 border-t border-gray-100 bg-white"
        style={{
          paddingBottom: _ctx === "checkout" ? 32 : WARDROBE_EXTRA_BOTTOM,
        }}
      >
        <TouchableOpacity
          className={`bg-black rounded-2xl items-center justify-center flex-row shadow-xl ${
            placeOrderMutation.isPending ? "opacity-70" : ""
          }`}
          style={{ paddingVertical: 18, paddingHorizontal: 16 }}
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
              : paymentMethod === "COD"
                ? `Place Order • ৳${(total || 0).toLocaleString()}`
                : `Pay and Place Order • ৳${(total || 0).toLocaleString()}`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Phone Number Input Modal */}
      <Modal visible={showPhoneModal} animationType="slide" transparent={true}>
        <View className="flex-1 justify-end bg-black/50">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="w-full"
          >
            <View className="bg-white rounded-t-[30px] p-6 pb-12 w-full">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-Urbanist-Bold text-black">
                  Enter Phone Number
                </Text>
                <TouchableOpacity onPress={() => setShowPhoneModal(false)} hitSlop={10}>
                  <Feather name="x" size={24} color="black" />
                </TouchableOpacity>
              </View>
              
              <Text className="text-[14px] font-Urbanist text-gray-500 mb-6 leading-5">
                A phone number is required to place your order so we can contact you for delivery.
              </Text>

              <View className="mb-6">
                <Text className="text-gray-700 font-Urbanist-Medium text-[15px] mb-2">
                  Phone Number
                </Text>
                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5">
                  <Feather name="phone" size={18} color="#9CA3AF" style={{ marginRight: 10 }} />
                  <Text className="font-Urbanist-Medium text-gray-400 text-[15px] mr-1">+880</Text>
                  <View className="w-px h-5 bg-gray-200 mr-3" />
                  <TextInput
                    placeholder="01711234567"
                    placeholderTextColor="#9CA3AF"
                    value={phoneNumber}
                    onChangeText={(text) => setPhoneNumber(text.replace(/\D/g, "").slice(0, 13))}
                    keyboardType="number-pad"
                    autoFocus={true}
                    maxLength={13}
                    className="flex-1 font-Urbanist-Medium text-black text-[15px]"
                  />
                </View>
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setShowPhoneModal(false)}
                  className="flex-1 border border-gray-200 py-4 rounded-xl items-center justify-center"
                >
                  <Text className="font-Urbanist-Bold text-gray-700">Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={handleSavePhoneAndOrder}
                  disabled={isSavingPhone}
                  className={`flex-1 bg-black py-4 rounded-xl items-center justify-center flex-row ${
                    isSavingPhone ? "opacity-70" : ""
                  }`}
                >
                  {isSavingPhone && <ActivityIndicator color="white" className="mr-2" />}
                  <Text className="text-white font-Urbanist-Bold">
                    {isSavingPhone ? "Saving..." : "Confirm & Place"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
