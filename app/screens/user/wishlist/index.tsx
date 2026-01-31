import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WishlistScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white p-4 justify-center items-center">
      <Text className="text-2xl font-bold">Wishlist</Text>
    </SafeAreaView>
  );
}
