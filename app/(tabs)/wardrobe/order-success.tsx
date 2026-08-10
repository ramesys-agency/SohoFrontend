import { useEffect } from "react";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { router, useLocalSearchParams } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SubHeader from "@/components/navbar/SubHeader";
import { Feather } from "@expo/vector-icons";

export default function OrderSuccessScreen() {
  const { orderCode } = useLocalSearchParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(tabs)/wardrobe");
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader title="Congratulations!" showBackButton={false} />

      <View className="flex-1 px-6 justify-center items-center">
        <View className="w-24 h-24 bg-green-50 rounded-full items-center justify-center mb-6">
          <IconSymbol name="checkmark.circle.fill" size={60} color="#10B981" />
        </View>

        <Text className="text-3xl font-Urbanist-Bold text-center mb-2">
          Order Placed!
        </Text>
        <Text className="text-gray-500 text-center mb-10 text-[16px] font-Urbanist">
          Your order has been placed successfully and is being processed.
        </Text>

        {orderCode && (
          <View className="w-full bg-gray-50 border border-gray-100 rounded-[25px] p-6 mb-10 items-center">
            <Text className="text-gray-400 font-Urbanist-Bold text-xs tracking-widest mb-1">
              TRACKING CODE
            </Text>
            <Text className="text-2xl font-Urbanist-Bold tracking-tighter text-black select-text">
              {orderCode}
            </Text>
            <TouchableOpacity
              className="mt-4 flex-row items-center bg-white px-4 py-2 rounded-full border border-gray-200"
              onPress={() => {
                /* Copy to clipboard logic could go here */
              }}
            >
              <Feather name="copy" size={14} color="black" />
              <Text className="ml-2 font-Urbanist-Bold text-xs">Copy Code</Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="w-full gap-y-4">
          <TouchableOpacity
            className="bg-black p-5 rounded-2xl w-full items-center flex-row justify-center"
            onPress={() => router.push("/profile/orders")}
          >
            <Feather name="list" size={18} color="white" />
            <Text className="text-white font-Urbanist-Bold ml-3 text-lg">
              Manage Orders
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white border-2 border-gray-100 p-5 rounded-2xl w-full items-center flex-row justify-center"
            onPress={() => router.push("/(tabs)/catalog")}
          >
            <Feather name="shopping-cart" size={18} color="black" />
            <Text className="text-black font-Urbanist-Bold ml-3 text-lg">
              Continue Shopping
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
