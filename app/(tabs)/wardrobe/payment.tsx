import { cartApi } from "@/api/cart.api";
import { checkoutApi } from "@/api/checkout.api";
import { orderApi } from "@/api/order.api";
import { userApi } from "@/api/user.api";
import SubHeader from "@/components/navbar/SubHeader";
import { openLegalDocument } from "@/config/legal";
import { exitCheckout, exitCheckoutLabel } from "@/utils/checkoutExit";
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
  Keyboard,
  Platform,
} from "react-native";
import { couponApi } from "@/api/coupon.api";
import { SafeAreaView } from "react-native-safe-area-context";

const WARDROBE_EXTRA_BOTTOM = 96;
import { Feather } from "@expo/vector-icons";
import { useToastStore } from "@/store/toastStore";
import { CheckoutStepper } from "./address";
import ReservationBanner from "@/components/checkout/ReservationBanner";
import { useCheckoutReservation } from "@/hooks/useCheckoutReservation";

export default function PaymentScreen() {
  const {
    addressId,
    paymentMethod,
    checkoutId,
    buyNowProductId,
    buyNowVariantId,
    buyNowProductName,
    buyNowVariantName,
    buyNowPrice,
    _ctx,
  } = useLocalSearchParams<{
    addressId: string;
    paymentMethod: string;
    /** Stock hold taken on the previous step; absent if reservations are off. */
    checkoutId?: string;
    buyNowProductId?: string;
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
    type: "network" | "server" | "stock";
    message: string;
  } | null>(null);
  const { showToast } = useToastStore();

  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSavingPhone, setIsSavingPhone] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Android edge-to-edge (SDK 54) stops the modal window from resizing when the
  // keyboard opens, so KeyboardAvoidingView has nothing to shrink and the sheet
  // stays hidden behind the keys. Track the height and lift the sheet ourselves.
  React.useEffect(() => {
    if (!showPhoneModal) {
      setKeyboardHeight(0);
      return;
    }
    const isIOS = Platform.OS === "ios";
    const showSub = Keyboard.addListener(
      isIOS ? "keyboardWillShow" : "keyboardDidShow",
      (e) => setKeyboardHeight(e.endCoordinates.height),
    );
    const hideSub = Keyboard.addListener(
      isIOS ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardHeight(0),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [showPhoneModal]);

  const closePhoneModal = () => {
    Keyboard.dismiss();
    setShowPhoneModal(false);
  };

  // Continue the hold taken on the checkout step — the customer keeps seeing
  // how long their items are theirs while they review and pay.
  const reservation = useCheckoutReservation({
    existingCheckoutId: checkoutId,
    skip: !checkoutId,
  });

  // Leaving the flow for good — hand the units back now rather than let them sit
  // until the hold lapses. Stepping back to the checkout screen goes through the
  // header instead, and keeps the hold.
  const backToCart = () => {
    void reservation.release();
    exitCheckout({ ctx: _ctx, buyNowProductId });
  };

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
  // The server owns this number and applies it to the order itself — showing a
  // locally hardcoded fee is how the displayed total and the amount the courier
  // collects drift apart. It depends on where the parcel is going, so it is
  // resolved from the address chosen on the previous step rather than the flat
  // rate in the checkout config.
  const {
    data: deliveryFee,
    isLoading: isLoadingFee,
    isError: isFeeError,
    refetch: refetchFee,
  } = useQuery({
    queryKey: ["deliveryFee", addressId],
    queryFn: () => checkoutApi.getDeliveryFee(addressId as string),
    enabled: !!addressId,
    staleTime: 5 * 60 * 1000,
  });

  const shippingCharge = deliveryFee?.fee ?? 0;
  // Until the fee is known the total on screen is not the total that will be
  // charged, so ordering waits for it rather than quoting one and charging
  // another.
  const isFeeUnknown = !deliveryFee;
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

      // 409 means the hold lapsed or an item sold out — retrying the same order
      // cannot help, so send the customer back to their cart instead.
      if (error?.response?.status === 409) {
        setOrderError({
          type: "stock",
          message:
            error?.response?.data?.error ||
            error?.response?.data?.message ||
            "Your reserved items are no longer available.",
        });
        return;
      }

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
        // Lets the server spend the hold taken at checkout instead of racing
        // for the stock all over again.
        ...(checkoutId && { checkoutId }),
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

  // Tapping the button only asks; nothing is charged or reserved until the
  // customer confirms in the sheet below.
  const handleReviewOrder = () => {
    setOrderError(null);
    setShowConfirmModal(true);
  };

  // Handing straight from one Modal to another skips the slide-out animation and
  // leaves iOS showing a blank sheet, so let this one close before the next opens.
  const handleConfirmOrder = () => {
    setShowConfirmModal(false);
    if (!profileData?.phone) {
      setTimeout(() => setShowPhoneModal(true), 300);
      return;
    }
    handlePlaceOrder();
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
      // Spends the hold taken at checkout rather than re-racing for the stock.
      ...(checkoutId && { checkoutId }),
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

      <ReservationBanner
        loading={reservation.loading}
        enabled={reservation.enabled && !!checkoutId}
        secondsLeft={reservation.secondsLeft}
        expired={reservation.expired}
        shortages={reservation.shortages}
        error={reservation.error}
        onBackToCart={backToCart}
        backLabel={exitCheckoutLabel(_ctx)}
      />

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
                {/* Naming the region makes the two different totals customers
                    see across orders explainable at a glance. */}
                {deliveryFee ? ` (${deliveryFee.label})` : ""}
              </Text>
              <Text className="text-black font-Urbanist-Bold">
                {isFeeUnknown ? "—" : `৳${shippingCharge.toLocaleString()}`}
              </Text>
            </View>

            {isFeeError && (
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-red-600 font-Urbanist-Medium flex-1 mr-2">
                  Couldn&apos;t load the delivery charge for this address.
                </Text>
                <TouchableOpacity onPress={() => refetchFee()}>
                  <Text className="text-black font-Urbanist-Bold">Retry</Text>
                </TouchableOpacity>
              </View>
            )}

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
              name={
                orderError.type === "network"
                  ? "wifi-off"
                  : orderError.type === "stock"
                    ? "shopping-bag"
                    : "alert-circle"
              }
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
            {/* Retrying a sold-out order can only fail again — the only useful
                move is out of checkout, to the cart or the product page. */}
            <TouchableOpacity
              onPress={
                orderError.type === "stock" ? backToCart : handlePlaceOrder
              }
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
                {orderError.type === "stock"
                  ? exitCheckoutLabel(_ctx)
                  : "Try Again"}
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
        {/* The policies a customer commits to at the moment of purchase. */}
        <Text className="text-gray-400 text-[11px] leading-[16px] font-Urbanist text-center mb-3 px-2">
          By placing this order you agree to our{" "}
          <Text
            onPress={() => openLegalDocument("terms")}
            suppressHighlighting
            className="text-gray-600 font-Urbanist-Bold underline"
          >
            Terms of Service
          </Text>
          ,{" "}
          <Text
            onPress={() => openLegalDocument("returns")}
            suppressHighlighting
            className="text-gray-600 font-Urbanist-Bold underline"
          >
            Return Policy
          </Text>{" "}
          and{" "}
          <Text
            onPress={() => openLegalDocument("shipping")}
            suppressHighlighting
            className="text-gray-600 font-Urbanist-Bold underline"
          >
            Shipping Policy
          </Text>
          .
        </Text>

        {/* Ordering is held back until the delivery fee is known, so the button
            can never quote a total that leaves the charge out. */}
        <TouchableOpacity
          className={`bg-black rounded-2xl items-center justify-center flex-row shadow-xl ${
            placeOrderMutation.isPending || isFeeUnknown ? "opacity-70" : ""
          }`}
          style={{ paddingVertical: 18, paddingHorizontal: 16 }}
          onPress={handleReviewOrder}
          disabled={placeOrderMutation.isPending || isFeeUnknown}
        >
          {placeOrderMutation.isPending || isLoadingFee ? (
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
            {isLoadingFee
              ? "Loading total..."
              : placeOrderMutation.isPending
                ? "Processing..."
                : isFeeUnknown
                  ? "Delivery charge unavailable"
                  : paymentMethod === "COD"
                    ? `Place Order • ৳${(total || 0).toLocaleString()}`
                    : `Pay and Place Order • ৳${(total || 0).toLocaleString()}`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Order Confirmation Modal — last stop before the order is submitted. */}
      <Modal
        visible={showConfirmModal}
        animationType="slide"
        transparent={true}
        statusBarTranslucent
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View
            className="bg-white rounded-t-[30px] p-6 w-full"
            style={{ paddingBottom: 48 }}
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-Urbanist-Bold text-black">
                Confirm Your Order
              </Text>
              <TouchableOpacity
                onPress={() => setShowConfirmModal(false)}
                hitSlop={10}
              >
                <Feather name="x" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <Text className="text-[14px] font-Urbanist text-gray-500 mb-6 leading-5">
              {paymentMethod === "COD"
                ? "Please review the details below. You'll pay the courier when your order arrives."
                : "Please review the details below before we take your payment."}
            </Text>

            <View className="bg-gray-50 rounded-2xl p-5 mb-6">
              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-500 font-Urbanist-Medium">
                  Items
                </Text>
                <Text className="text-black font-Urbanist-Bold">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </Text>
              </View>
              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-500 font-Urbanist-Medium">
                  Payment
                </Text>
                <Text className="text-black font-Urbanist-Bold">
                  {methodDetails.title}
                </Text>
              </View>
              {appliedCoupon && (
                <View className="flex-row justify-between mb-3">
                  <Text className="text-gray-500 font-Urbanist-Medium">
                    Discount
                  </Text>
                  <Text className="text-green-600 font-Urbanist-Bold">
                    -৳{(appliedCoupon.discountAmount || 0).toLocaleString()}
                  </Text>
                </View>
              )}
              <View className="border-t border-gray-200 pt-3 flex-row justify-between">
                <Text className="text-black font-Urbanist-Bold text-lg">
                  Total
                </Text>
                <Text className="text-black font-Urbanist-Bold text-lg">
                  ৳{(total || 0).toLocaleString()}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowConfirmModal(false)}
                className="flex-1 border border-gray-200 py-4 rounded-xl items-center justify-center"
              >
                <Text className="font-Urbanist-Bold text-gray-700">
                  Go Back
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmOrder}
                className="flex-1 bg-black py-4 rounded-xl items-center justify-center"
              >
                <Text className="text-white font-Urbanist-Bold">
                  Confirm Order
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Phone Number Input Modal */}
      <Modal
        visible={showPhoneModal}
        animationType="slide"
        transparent={true}
        statusBarTranslucent
        onRequestClose={closePhoneModal}
      >
        <View
          className="flex-1 justify-end bg-black/50"
          style={{ paddingBottom: keyboardHeight }}
        >
          <View
            className="bg-white rounded-t-[30px] p-6 w-full"
            style={{ paddingBottom: keyboardHeight > 0 ? 24 : 48 }}
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-Urbanist-Bold text-black">
                Enter Phone Number
              </Text>
              <TouchableOpacity onPress={closePhoneModal} hitSlop={10}>
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
                onPress={closePhoneModal}
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
        </View>
      </Modal>
    </SafeAreaView>
  );
}
