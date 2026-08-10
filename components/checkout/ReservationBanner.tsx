import { Feather } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import type { CheckoutShortage } from "@/api/checkout.api";

interface ReservationBannerProps {
  loading: boolean;
  enabled: boolean;
  secondsLeft: number;
  expired: boolean;
  shortages: CheckoutShortage[];
  error: string | null;
  /** Sends the customer out of checkout when their hold is gone. */
  onBackToCart: () => void;
  /**
   * Label for that button. The buy-now flow has no cart to return to, so it
   * sends the customer to the product page instead.
   */
  backLabel?: string;
}

function formatCountdown(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Tells the customer their items are held and for how long — and, when the hold
 * is gone, why they cannot simply carry on.
 */
export default function ReservationBanner({
  loading,
  enabled,
  secondsLeft,
  expired,
  shortages,
  error,
  onBackToCart,
  backLabel = "Back to cart",
}: ReservationBannerProps) {
  // Nothing to say when the feature is off server-side.
  if (!enabled && !loading && !error) return null;

  if (loading) {
    return (
      <View className="mx-4 mt-3 flex-row items-center rounded-2xl bg-gray-50 px-4 py-3">
        <ActivityIndicator size="small" color="#111827" />
        <Text className="ml-3 font-Urbanist-Medium text-[13px] text-gray-600">
          Holding your items…
        </Text>
      </View>
    );
  }

  if (shortages.length > 0 || error) {
    return (
      <View className="mx-4 mt-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3">
        <View className="flex-row items-start">
          <Feather name="alert-circle" size={16} color="#DC2626" style={{ marginTop: 2 }} />
          <View className="ml-2 flex-1">
            <Text className="font-Urbanist-Bold text-[13px] text-red-800">
              {error || "Some items are no longer available"}
            </Text>
            {shortages.map((item) => (
              <Text
                key={item.variantId}
                className="mt-0.5 font-Urbanist text-[12px] text-red-700"
              >
                {item.productName || "Item"}
                {item.variantLabel ? ` (${item.variantLabel})` : ""} — you asked
                for {item.requested}, {item.available} left
              </Text>
            ))}
          </View>
        </View>
        <TouchableOpacity
          onPress={onBackToCart}
          className="mt-3 items-center rounded-xl bg-red-600 py-2.5"
        >
          <Text className="font-Urbanist-Bold text-[13px] text-white">
            {backLabel}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (expired) {
    return (
      <View className="mx-4 mt-3 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
        <View className="flex-row items-start">
          <Feather name="clock" size={16} color="#B45309" style={{ marginTop: 2 }} />
          <Text className="ml-2 flex-1 font-Urbanist-Medium text-[13px] text-amber-900">
            Your items are no longer reserved. Go back to check they&apos;re
            still available.
          </Text>
        </View>
        <TouchableOpacity
          onPress={onBackToCart}
          className="mt-3 items-center rounded-xl bg-amber-600 py-2.5"
        >
          <Text className="font-Urbanist-Bold text-[13px] text-white">
            {backLabel}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="mx-4 mt-3 flex-row items-center rounded-2xl bg-gray-50 px-4 py-3">
      <Feather name="clock" size={15} color="#111827" />
      <Text className="ml-2 flex-1 font-Urbanist-Medium text-[13px] text-gray-700">
        Items reserved for you
      </Text>
      <Text className="font-Urbanist-Bold text-[13px] text-black">
        {formatCountdown(secondsLeft)}
      </Text>
    </View>
  );
}
