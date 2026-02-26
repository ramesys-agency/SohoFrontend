import { Feather, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function ShippingTabContent() {
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
          Get it by Mon, 30 Nov
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
