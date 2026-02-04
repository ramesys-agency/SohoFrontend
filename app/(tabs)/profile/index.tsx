import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SubHeader from "../../components/navbar/SubHeader";

export default function ProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader title="Profile" showBackButton={true} />
      <View className="flex-1 p-4">
        <TouchableOpacity
          className="bg-gray-100 p-4 rounded-xl mb-4"
          onPress={() => router.push("/profile/orders")}
        >
          <Text className="text-black font-semibold text-lg">My Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-gray-100 p-4 rounded-xl"
          onPress={() => router.push("/profile/settings")}
        >
          <Text className="text-black font-semibold text-lg">Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
