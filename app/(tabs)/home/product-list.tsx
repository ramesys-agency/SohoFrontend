import { IconSymbol } from "@/components/ui/icon-symbol";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductListScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <IconSymbol name="chevron.left" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Product List</Text>
      </View>
      <View className="p-4">
        <TouchableOpacity
          className="bg-black p-4 rounded-xl items-center"
          onPress={() => router.push("/home/product-detail")}
        >
          <Text className="text-white font-bold">View Product Detail</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
