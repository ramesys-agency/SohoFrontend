import { addressApi } from "@/api/address.api";
import SubHeader from "@/app/components/navbar/SubHeader";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

export default function AddressSelectionScreen() {
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );

  const { data: addressesData, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: addressApi.getAddresses,
  });

  const addresses = React.useMemo(
    () => addressesData?.data || [],
    [addressesData],
  );

  // Set default address as selected if none selected yet
  React.useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      const defaultAddress =
        addresses.find((addr: any) => addr.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddress.id);
    }
  }, [addresses, selectedAddressId]);

  const handleContinue = () => {
    if (!selectedAddressId) return;
    router.push({
      pathname: "/wardrobe/payment",
      params: { addressId: selectedAddressId },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader title="Select Address" showBackButton={true} />

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4 pt-4"
          showsVerticalScrollIndicator={false}
        >
          {addresses.map((address: any) => (
            <TouchableOpacity
              key={address.id}
              onPress={() => setSelectedAddressId(address.id)}
              className={`mb-4 p-5 rounded-2xl border-2 ${
                selectedAddressId === address.id
                  ? "border-black bg-gray-50"
                  : "border-gray-100 bg-white"
              }`}
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-lg font-Urbanist-Bold mr-2">
                      {address.type}
                    </Text>
                    {address.isDefault && (
                      <View className="bg-gray-200 px-2 py-0.5 rounded">
                        <Text className="text-[10px] font-Urbanist-Bold">
                          DEFAULT
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-gray-600 font-Urbanist-Medium mb-1">
                    {address.street}
                  </Text>
                  <Text className="text-gray-500 font-Urbanist">
                    {address.thana}, {address.district}, {address.division}
                  </Text>
                </View>
                {selectedAddressId === address.id && (
                  <View className="bg-black rounded-full p-1">
                    <Feather name="check" size={16} color="white" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={() => router.push("/profile/addresses/add-address")}
            className="flex-row items-center justify-center p-5 rounded-2xl border-2 border-dashed border-gray-300 mt-2"
          >
            <Feather name="plus" size={20} color="#6B7280" />
            <Text className="ml-2 text-gray-500 font-Urbanist-Bold">
              Add New Address
            </Text>
          </TouchableOpacity>

          <View className="h-40" />
        </ScrollView>
      )}

      <View className="p-4 border-t border-gray-100 pb-10">
        <TouchableOpacity
          className={`bg-black p-4 rounded-xl items-center justify-center ${
            !selectedAddressId ? "opacity-50" : ""
          }`}
          onPress={handleContinue}
          disabled={!selectedAddressId}
        >
          <Text className="text-white font-Urbanist-Bold text-lg">
            Continue to Payment
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
