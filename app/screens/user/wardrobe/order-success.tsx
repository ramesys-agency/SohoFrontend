import { IconSymbol } from "@/components/ui/icon-symbol";
import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrderSuccessScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView className="flex-1 bg-white p-4 justify-center items-center">
      <IconSymbol name="checkmark.circle.fill" size={80} color="#10B981" />
      <Text className="text-3xl font-bold mt-4 mb-2">Order Success!</Text>
      <Text className="text-gray-500 text-center mb-8">
        Your order has been placed successfully.
      </Text>

      <TouchableOpacity
        className="bg-black p-4 rounded-xl w-full items-center"
        onPress={() => navigation.navigate("WardrobeIndex")}
      >
        <Text className="text-white font-bold">Back to Wardrobe</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
