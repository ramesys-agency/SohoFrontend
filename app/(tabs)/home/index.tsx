import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="bg-blue-200 flex-1">
      <Text className="text-2xl font-classy">Home</Text>
    </SafeAreaView>
  );
}
