import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SubHeader from "../../../components/SubHeader";

export default function AddressScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader
        title="Address"
        showBackButton={true}
        showCategorySelector={false}
      />
      <View className="p-4">
        <TouchableOpacity
          className="bg-black p-4 rounded-xl items-center"
          onPress={() => navigation.navigate("Payment")}
        >
          <Text className="text-white font-bold">Go to Payment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
