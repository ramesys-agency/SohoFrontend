import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopNavBar from "../../../components/TopNavBar";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <TopNavBar title="Home" showCategorySelector={true} />
      <View className="flex-1 p-4">{/* Home content */}</View>
    </SafeAreaView>
  );
}
