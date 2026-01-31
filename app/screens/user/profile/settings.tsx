import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopNavBar from "../../../components/TopNavBar";

export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <TopNavBar
        title="Settings"
        showBackButton={true}
        showCategorySelector={false}
      />
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">Settings Options</Text>
      </View>
    </SafeAreaView>
  );
}
