import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SubHeader from "../../../components/SubHeader";

export default function ProfileScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader title="Profile" showCategorySelector={false} />
      <View className="flex-1 p-4">
        <TouchableOpacity
          className="bg-gray-100 p-4 rounded-xl mb-4"
          onPress={() => navigation.navigate("Orders")}
        >
          <Text className="text-black font-semibold text-lg">My Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-gray-100 p-4 rounded-xl"
          onPress={() => navigation.navigate("Settings")}
        >
          <Text className="text-black font-semibold text-lg">Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
