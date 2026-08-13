import type { DeliveryRegion } from "@/api/checkout.api";
import {
  useDefaultAddressDeliveryFee,
  useDeliveryRegions,
} from "@/hooks/useDeliveryFee";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

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

  const { regions, isLoading: isLoadingRegions } = useDeliveryRegions();
  const { deliveryFee: defaultAddressFee } = useDefaultAddressDeliveryFee();

  const [selectedRegion, setSelectedRegion] = useState<DeliveryRegion | null>(
    null,
  );
  const [isPickerOpen, setPickerOpen] = useState(false);

  // Start on the region the customer's own address falls under, so the fee shown
  // here is the fee their next order is actually charged. They can still switch
  // it to compare — the charge itself always comes from the delivery address.
  useEffect(() => {
    if (!selectedRegion && defaultAddressFee) {
      setSelectedRegion(defaultAddressFee.region);
    }
  }, [defaultAddressFee, selectedRegion]);

  const selected =
    regions.find((option) => option.region === selectedRegion) ?? null;

  return (
    <View className="mt-4">
      {/* Delivery region card — the fee depends on where the parcel goes */}
      <View className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <View className="flex-row items-center justify-between">
          <Text
            className="text-gray-400 text-sm"
            style={{ fontFamily: "Urbanist" }}
          >
            Delivery region
          </Text>
          <TouchableOpacity
            onPress={() => setPickerOpen(true)}
            disabled={regions.length === 0}
          >
            <Text
              className="text-black font-semibold text-sm"
              style={{ fontFamily: "UrbanistBold" }}
            >
              Change
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="mt-2 flex-row items-center justify-between"
          onPress={() => setPickerOpen(true)}
          disabled={regions.length === 0}
        >
          <Text
            className="text-black text-base"
            style={{ fontFamily: "Urbanist" }}
          >
            {selected
              ? `${selected.label} — ৳${selected.fee.toLocaleString()} delivery`
              : isLoadingRegions
                ? "Loading delivery charges..."
                : "Select your delivery region"}
          </Text>
          <Feather name="chevron-down" size={18} color="black" />
        </TouchableOpacity>

        <Text
          className="text-gray-400 text-xs mt-2"
          style={{ fontFamily: "Urbanist" }}
        >
          The charge on your order is set by your delivery address.
        </Text>
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

      <Modal
        visible={isPickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerOpen(false)}
      >
        <Pressable
          className="flex-1 bg-black/40 justify-end"
          onPress={() => setPickerOpen(false)}
        >
          <Pressable className="bg-white rounded-t-2xl p-5">
            <Text
              className="text-black text-lg mb-3"
              style={{ fontFamily: "UrbanistBold" }}
            >
              Delivery region
            </Text>
            {regions.map((option) => {
              const isSelected = option.region === selectedRegion;
              return (
                <TouchableOpacity
                  key={option.region}
                  className="flex-row items-center justify-between py-3 border-b border-gray-100"
                  onPress={() => {
                    setSelectedRegion(option.region);
                    setPickerOpen(false);
                  }}
                >
                  <Text
                    className={`text-base ${isSelected ? "text-black" : "text-gray-600"}`}
                    style={{
                      fontFamily: isSelected ? "UrbanistBold" : "Urbanist",
                    }}
                  >
                    {option.label}
                  </Text>
                  <View className="flex-row items-center">
                    <Text
                      className="text-base text-black mr-2"
                      style={{ fontFamily: "Urbanist" }}
                    >
                      ৳{option.fee.toLocaleString()}
                    </Text>
                    {isSelected && (
                      <Feather name="check" size={18} color="black" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
