import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopNavBar from "../../../components/TopNavBar";

export default function WardrobeScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <TopNavBar title="Wardrobe" showCategorySelector={false} />
      <View className="flex-1 p-4">
        <TouchableOpacity
          className="bg-black p-4 rounded-xl items-center"
          onPress={() => navigation.navigate("Address")}
        >
          <Text className="text-white font-bold">Checkout (Address)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
