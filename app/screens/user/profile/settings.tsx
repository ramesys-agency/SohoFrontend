import { IconSymbol } from "@/components/ui/icon-symbol";
import { useNavigation } from "@react-navigation/native";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center p-4 border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <IconSymbol name="chevron.left" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Settings</Text>
      </View>
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg">Settings Options</Text>
      </View>
    </SafeAreaView>
  );
}
