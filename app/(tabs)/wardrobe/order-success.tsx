import { IconSymbol } from "@/components/ui/icon-symbol";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SubHeader from "../../components/navbar/SubHeader";

export default function OrderSuccessScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader title="Success" showBackButton={false} />
      <View className="flex-1 p-4 justify-center items-center">
        <IconSymbol name="checkmark.circle.fill" size={80} color="#10B981" />
        <Text className="text-3xl font-bold mt-4 mb-2">Order Success!</Text>
        <Text className="text-gray-500 text-center mb-8">
          Your order has been placed successfully.
        </Text>

        <TouchableOpacity
          className="bg-black p-4 rounded-xl w-full items-center"
          onPress={() => router.push("/wardrobe")}
        >
          <Text className="text-white font-bold">Back to Wardrobe</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
