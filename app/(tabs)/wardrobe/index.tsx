import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SubHeader from "../../components/navbar/SubHeader";

export default function WardrobeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader title="Wardrobe" showBackButton={false} />
      <View className="flex-1 p-4">
        <TouchableOpacity
          className="bg-black p-4 rounded-xl items-center"
          onPress={() => router.push("/wardrobe/address")}
        >
          <Text className="text-white font-bold">Checkout (Address)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
