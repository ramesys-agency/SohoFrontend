import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopNavBar from "../../../components/TopNavBar";

export default function CatalogProductDetailScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <TopNavBar
        title="Catalog Detail"
        showBackButton={true}
        showCategorySelector={false}
      />
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">Catalog Item Information</Text>
      </View>
    </SafeAreaView>
  );
}
