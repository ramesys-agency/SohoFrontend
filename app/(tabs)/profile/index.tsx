import { router } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "../../../components/ui/icon-symbol";
import SubHeader from "../../components/navbar/SubHeader";

export default function ProfileScreen() {
  // const [isDarkTheme, setIsDarkTheme] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader title="Account" hideSearch hideNotification />
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View className="bg-gray-100 h-28 p-3 rounded-xl flex-row items-center mb-6">
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=12" }}
            className="w-20 h-full rounded-xl mr-4"
          />
          <View className="flex-1">
            <Text className="text-lg font-Urbanist-Bold text-black font-Urbanist">
              Milan Sarker
            </Text>
            <Text className="text-gray-500 text-sm font-Urbanist">
              milansarker4321@gmail.com
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/profile/edit-profile")}
          >
            <IconSymbol name="pencil" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View className="flex-col gap-2 mb-6">
          <MenuItem
            icon="list.bullet"
            label="My orders"
            onPress={() => router.push("/profile/orders")}
          />
          <MenuItem
            icon="arrow.counterclockwise"
            label="Returns"
            onPress={() => {}}
          />
          {/* Note: 'house.fill' maps to 'home' (filled) in our icon set, which is close enough for Address */}
          <MenuItem icon="house.fill" label="Addresses" onPress={() => {}} />
          <MenuItem icon="creditcard" label="Payment" onPress={() => {}} />
          <MenuItem icon="map" label="Region and language" onPress={() => {}} />
          <MenuItem
            icon="bell"
            label="Notification"
            onPress={() => router.push("/notifications")}
          />
        </View>

        {/* Dark Theme */}
        {/* <View className="bg-gray-100 p-4 rounded-2xl flex-row items-center justify-between mb-8">
          <View className="flex-row items-center">
            <View className="w-8 items-center mr-3">
              <IconSymbol name="moon" size={22} color="#000" />
            </View>
            <Text className="text-black font-Urbanist-Bold text-base">Dark theme</Text>
          </View>
          <Switch
            trackColor={{ false: "#767577", true: "#000" }}
            thumbColor={"#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => setIsDarkTheme((prev) => !prev)}
            value={isDarkTheme}
          />
        </View> */}

        {/* Log out */}
        <TouchableOpacity
          className="flex-row items-center justify-center mb-10"
          onPress={() => router.replace("/(auth)/login")}
        >
          <IconSymbol
            name="rectangle.portrait.and.arrow.right"
            size={24}
            color="#dc2626"
          />
          <Text className="text-red-600 font-Urbanist-Bold text-lg ml-2 font-Urbanist">
            Log out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-[#F3F3F3] h-20 p-4 rounded-lg flex-row items-center justify-between"
    >
      <View className="flex-row items-center">
        <View className="w-8 items-center mr-3">
          <IconSymbol name={icon} size={22} color="#000" />
        </View>
        <Text className="text-black font-Urbanist-Bold text-[16px] font-Urbanist">
          {label}
        </Text>
      </View>
      <IconSymbol name="chevron.right" size={20} color="#000" />
    </TouchableOpacity>
  );
}
