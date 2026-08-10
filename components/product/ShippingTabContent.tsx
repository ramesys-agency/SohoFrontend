import { Feather, MaterialIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

/** Days from today that we quote as the delivery estimate. */
const DELIVERY_ESTIMATE_DAYS = 7;

export default function ShippingTabContent() {
  /**
   * Placeholder until the real estimate comes from the backend — a standard
   * seven-day window from whenever the customer is looking at the product,
   * rather than a date hardcoded at build time.
   */
  const estimatedDelivery = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + DELIVERY_ESTIMATE_DAYS);
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }, []);

  return (
    <View className="mt-4">
      {/* Delivery address card */}
      <View className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <View className="flex-row items-center justify-between">
          <Text
            className="text-gray-400 text-sm"
            style={{ fontFamily: "Urbanist" }}
          >
            Delivery &amp; service for
          </Text>
          <TouchableOpacity>
            <Text
              className="text-black font-semibold text-sm"
              style={{ fontFamily: "UrbanistBold" }}
            >
              Change
            </Text>
          </TouchableOpacity>
        </View>
        <View className="mt-2">
          <Text
            className="text-gray-400 text-base"
            style={{ fontFamily: "Urbanist" }}
          >
            560158 (Gayathri P)
          </Text>
        </View>
      </View>

      {/* Delivery info rows */}
      <View className="flex-row items-center mb-3">
        <Feather name="box" size={20} color="black" />
        <Text
          className="ml-3 text-base text-black"
          style={{ fontFamily: "Urbanist" }}
        >
          Get it by {estimatedDelivery}
        </Text>
      </View>
      <View className="flex-row items-center mb-3">
        <MaterialIcons name="payments" size={20} color="black" />
        <Text
          className="ml-3 text-base text-black"
          style={{ fontFamily: "Urbanist" }}
        >
          Cash on Delivery available
        </Text>
      </View>
      <View className="flex-row items-center mb-3">
        <MaterialIcons name="compare-arrows" size={20} color="black" />
        <Text
          className="ml-3 text-base text-black"
          style={{ fontFamily: "Urbanist" }}
        >
          Hassle free 10 days Return &amp; Exchange
        </Text>
      </View>
    </View>
  );
}
