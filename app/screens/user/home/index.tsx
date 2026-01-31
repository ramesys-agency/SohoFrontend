import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView className="bg-white flex-1 p-4">
      <Text className="text-4xl font-bold mb-8">Home</Text>
      <TouchableOpacity
        className="bg-black p-4 rounded-xl items-center"
        onPress={() => navigation.navigate("ProductList")}
      >
        <Text className="text-white font-bold">Go to Product List</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
