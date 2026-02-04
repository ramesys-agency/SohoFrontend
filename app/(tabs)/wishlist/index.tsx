import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SubHeader from "../../components/navbar/SubHeader";

export default function WishlistScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader title="Wishlist" />
      <View className="flex-1 p-4 justify-center items-center">
        <Text className="text-2xl font-bold">Wishlist</Text>
      </View>
    </SafeAreaView>
  );
}
