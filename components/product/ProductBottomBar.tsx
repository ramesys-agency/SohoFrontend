import { Feather } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface ProductBottomBarProps {
  onShopNow: () => void;
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
  isAddedToCart: boolean;
  isAdding: boolean;
  isRemoving: boolean;
  isShoppingNow?: boolean;
  isDisabled?: boolean;
}

export default function ProductBottomBar({
  onShopNow,
  onAddToCart,
  onRemoveFromCart,
  isAddedToCart,
  isAdding,
  isRemoving,
  isShoppingNow = false,
  isDisabled = false,
}: ProductBottomBarProps) {
  return (
    <View className="absolute bottom-0 left-0 right-0 px-6 py-3 bg-white border-t border-gray-100 flex-row items-center gap-3 pb-8 z-30">
      {/* Shop Now */}
      <TouchableOpacity
        className={`flex-1 py-4 rounded-lg bg-white border border-gray-300 items-center justify-center flex-row ${(isShoppingNow || isDisabled) ? "opacity-50 bg-gray-50" : ""}`}
        activeOpacity={0.6}
        onPress={onShopNow}
        disabled={isShoppingNow || isDisabled}
      >
        {isShoppingNow ? (
          <ActivityIndicator size="small" color="black" style={{ marginRight: 8 }} />
        ) : (
          <Feather name="shopping-bag" size={20} color="black" className="mr-2" />
        )}
        <Text
          className="text-black font-semibold text-md"
          style={{ fontFamily: "UrbanistBold" }}
        >
          {isShoppingNow ? "Adding..." : "Shop Now"}
        </Text>
      </TouchableOpacity>

      {/* Add/Remove Wardrobe */}
      {isAddedToCart ? (
        <TouchableOpacity
          className={`flex-1 py-4 rounded-lg bg-red-50 items-center justify-center flex-row border border-red-200 ${isRemoving ? "opacity-50" : ""}`}
          activeOpacity={0.8}
          onPress={onRemoveFromCart}
          disabled={isRemoving}
        >
          <Feather name="minus" size={20} color="#ef4444" className="mr-2" />
          <Text
            className="text-red-500 font-semibold text-md"
            style={{ fontFamily: "UrbanistBold" }}
          >
            {isRemoving ? "Removing..." : "Remove"}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          className={`flex-1 py-4 rounded-lg bg-black items-center justify-center flex-row ${(isAdding || isDisabled) ? "opacity-50 bg-gray-700" : ""}`}
          activeOpacity={0.8}
          onPress={onAddToCart}
          disabled={isAdding || isDisabled}
        >
          <Feather name="plus" size={20} color="white" className="mr-2" />
          <Text
            className="text-white font-semibold text-md"
            style={{ fontFamily: "UrbanistBold" }}
          >
            {isAdding ? "Adding..." : "Add"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
