import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SubHeader from "../../components/navbar/SubHeader";

export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader title="Settings" showBackButton={true} />
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">Settings Options</Text>
      </View>
    </SafeAreaView>
  );
}
