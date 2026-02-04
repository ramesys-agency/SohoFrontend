import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SubHeader from "../../components/navbar/SubHeader";

export default function AddressScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader title="Address" showBackButton={true} />
      <View className="p-4">
        <TouchableOpacity
          className="bg-black p-4 rounded-xl items-center"
          onPress={() => router.push("/wardrobe/payment")}
        >
          <Text className="text-white font-bold">Go to Payment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
