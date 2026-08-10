import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const TABS = ["Details", "Shipping", "Reviews"];

interface ProductTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function ProductTabs({
  activeTab,
  onTabChange,
}: ProductTabsProps) {
  return (
    <View className="flex-row justify-evenly border-b border-gray-200 mb-6">
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab}
          onPress={() => onTabChange(tab)}
          className={`mr-8 pb-3 ${
            activeTab === tab ? "border-b-2 border-black" : ""
          }`}
        >
          <Text
            className={`text-lg transition-all ${
              activeTab === tab ? "text-black font-semibold" : "text-black"
            }`}
            style={{
              fontFamily: activeTab === tab ? "UrbanistBold" : "Urbanist",
            }}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
