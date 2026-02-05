import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "../../../components/ui/icon-symbol";
import SubHeader from "../../components/navbar/SubHeader";

export default function EditProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader
        title="Edit Profile"
        showBackButton
        hideSearch
        hideNotification
      />
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Profile Image */}
        <View className="items-center justify-center mt-6 mb-10">
          <View className="relative">
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=12" }}
              className="w-28 h-28 rounded-xl"
            />
            <View className="absolute inset-0 bg-black/30 rounded-xl items-center justify-center">
              <IconSymbol name="pencil" size={24} color="#FFF" />
            </View>
          </View>
        </View>

        {/* Form Items */}
        <View className="flex-col gap-3">
          <EditProfileItem icon="person" label="Name" onPress={() => {}} />
          <EditProfileItem
            icon="phone"
            label="Phone Number"
            onPress={() => {}}
          />
          <EditProfileItem icon="person.2" label="Gender" onPress={() => {}} />
          <EditProfileItem icon="figure.stand" label="Age" onPress={() => {}} />
          <EditProfileItem
            icon="square.and.pencil"
            label="Change password"
            onPress={() => {}}
          />
          <EditProfileItem
            icon="envelope"
            label="Change Email"
            onPress={() => {}}
          />
        </View>

        {/* Delete Account */}
        <TouchableOpacity className="mt-16 items-center">
          <View className="flex-row items-center gap-2">
            <IconSymbol name="trash" size={20} color="#dc2626" />
            <Text className="text-red-600 font-Urbanist-Bold text-base">
              Delete account
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function EditProfileItem({
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
      className="bg-[#F3F3F3] h-14 px-4 rounded-lg flex-row items-center justify-between"
    >
      <View className="flex-row items-center gap-3">
        <IconSymbol name={icon} size={20} color="#000" />
        <Text className="text-black font-Urbanist-Regular text-base">
          {label}
        </Text>
      </View>
      <IconSymbol name="chevron.right" size={16} color="#000" />
    </TouchableOpacity>
  );
}
