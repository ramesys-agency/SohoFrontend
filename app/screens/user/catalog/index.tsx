import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SubHeader from "../../../components/SubHeader";

export default function CatalogScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader title="Catalog" showCategorySelector={true} />
      <View className="flex-1 p-4">
        {/* Rest of the content will go here */}
      </View>
    </SafeAreaView>
  );
}
