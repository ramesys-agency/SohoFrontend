import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SubHeader from "../../../components/SubHeader";

export default function PaymentScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader
        title="Payment"
        showBackButton={true}
        showCategorySelector={false}
      />
      <View className="p-4">
        <TouchableOpacity
          className="bg-black p-4 rounded-xl items-center"
          onPress={() => navigation.navigate("OrderSuccess")}
        >
          <Text className="text-white font-bold">Complete Order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
