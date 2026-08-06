import SubHeader from "@/app/components/navbar/SubHeader";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { CheckoutStepper } from "./address";

const WARDROBE_EXTRA_BOTTOM = 96;

export default function CheckoutScreen() {
  const { addressId, buyNowVariantId, buyNowProductName, buyNowVariantName, buyNowPrice, _ctx } =
    useLocalSearchParams<{
      addressId: string;
      buyNowVariantId?: string;
      buyNowProductName?: string;
      buyNowVariantName?: string;
      buyNowPrice?: string;
      _ctx?: string;
    }>();
  // Card, wallet and net banking are not live yet. Unreleased methods are kept
  // out of the list entirely rather than shown disabled — App Review rejects
  // builds that display features which don't work (Guideline 2.1).
  const paymentMethods = [
    { id: "CARD", label: "Debit/credit Card", enabled: false },
    { id: "WALLET", label: "Wallet", enabled: false },
    { id: "BANK", label: "Net Banking", enabled: false },
    { id: "COD", label: "Cash on delivery", enabled: true },
  ].filter((method) => method.enabled);

  const [selectedMethod, setSelectedMethod] = useState<string | null>(
    paymentMethods.length === 1 ? paymentMethods[0].id : null
  );

  const handleContinue = () => {
    if (!selectedMethod) return;
    const basePath = _ctx === "checkout" ? "/checkout" : "/wardrobe";
    router.push({
      pathname: `${basePath}/payment` as any,
      params: {
        addressId: addressId as string,
        paymentMethod: selectedMethod,
        ...(buyNowVariantId && {
          buyNowVariantId,
          buyNowProductName,
          buyNowVariantName,
          buyNowPrice,
        }),
        ...(_ctx && { _ctx }),
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* SubHeader matching screenshot */}
      <SubHeader title="Checkout" showBackButton={true} />

      {/* Stepper showing step 2 active */}
      <CheckoutStepper currentStep={2} />

      {/* Inner Content */}
      <View className="flex-1 px-5 pt-6 flex-col">
        {/* Choose Payment Method title */}
        <Text className="text-[18px] font-Urbanist-Bold text-gray-900 mb-6">
          Choose Payment Method
        </Text>

        {/* Payment Methods List */}
        <View className="border-t border-gray-100 mb-6">
          {paymentMethods.map((method) => {
            const isSelected = selectedMethod === method.id;
            
            return (
              <TouchableOpacity
                key={method.id}
                disabled={!method.enabled}
                onPress={() => setSelectedMethod(method.id)}
                activeOpacity={0.7}
                className={`flex-row justify-between items-center py-5 border-b border-gray-100 ${
                  !method.enabled ? "opacity-35" : ""
                } ${isSelected ? "bg-gray-50/50" : ""}`}
              >
                <View className="flex-row items-center flex-1">
                  {/* Visual indicator of selection for Cash on delivery */}
                  {method.enabled && (
                    <View className="mr-3">
                      <View
                        className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                          isSelected ? "border-black" : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <View className="w-2.5 h-2.5 rounded-full bg-black" />
                        )}
                      </View>
                    </View>
                  )}
                  
                  <Text
                    className={`text-[16px] font-Urbanist-Bold ${
                      isSelected ? "text-black" : "text-gray-800"
                    }`}
                  >
                    {method.label}
                  </Text>
                </View>

                {method.enabled && isSelected ? (
                  <Feather name="check" size={20} color="black" />
                ) : (
                  <Feather name="chevron-right" size={20} color="#D1D5DB" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Consent warning message (positioned at bottom before the button) */}
        <View className="mt-auto flex-row items-start py-4 px-1 bg-white">
          <View className="w-5 h-5 bg-red-100 rounded-full items-center justify-center mt-0.5 mr-2">
            <Feather name="alert-circle" size={12} color="#EF4444" />
          </View>
          <Text className="flex-1 text-[12px] font-Urbanist-Medium text-gray-500 leading-4">
            By proceeding, I express my consent to complete this transaction
          </Text>
        </View>

        {/* Action Button at bottom */}
        <View style={{ paddingTop: 8, paddingBottom: _ctx === "checkout" ? 32 : WARDROBE_EXTRA_BOTTOM }}>
          <TouchableOpacity
            style={{
              backgroundColor: "black",
              paddingVertical: 18,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              opacity: selectedMethod ? 1 : 0.5,
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 4,
            }}
            onPress={handleContinue}
            disabled={!selectedMethod}
          >
            <Text className="text-white font-Urbanist-Bold text-[16px]">
              Continue to Payment
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
