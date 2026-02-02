import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SubHeader from "../../../components/SubHeader";

export default function OrdersScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader
        title="My Orders"
        showBackButton={true}
        showCategorySelector={false}
      />
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">No orders yet</Text>
      </View>
    </SafeAreaView>
  );
}
