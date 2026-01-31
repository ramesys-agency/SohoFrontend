import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TopNavBar from "../../../components/TopNavBar";

export default function CatalogScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <TopNavBar title="Catalog" showCategorySelector={true} />
      <View className="flex-1 p-4">
        {/* Rest of the content will go here */}
      </View>
    </SafeAreaView>
  );
}
