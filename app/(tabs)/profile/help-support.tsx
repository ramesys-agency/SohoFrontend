import SubHeader from "@/components/navbar/SubHeader";
import { openLegalDocument } from "@/config/legal";
import { SUPPORT, emailUrl, phoneUrl, whatsappUrl } from "@/config/support";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SupportOption {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}

export default function HelpSupportScreen() {
  /**
   * Opens an external app (WhatsApp, dialer, mail client). If the URL is missing
   * — support details aren't configured — or nothing can handle it, we say so
   * rather than letting the tap do nothing.
   */
  const open = async (url: string | null, unavailableMessage: string) => {
    if (!url) {
      Alert.alert("Not available", unavailableMessage);
      return;
    }

    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert("Not available", unavailableMessage);
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert("Something went wrong", "Please try again in a moment.");
    }
  };

  const supportOptions: SupportOption[] = [
    {
      icon: "message-circle",
      title: "Chat on WhatsApp",
      subtitle: "Returns, refunds and order help",
      onPress: () =>
        open(
          whatsappUrl("Hi Soho, I need help with my order."),
          "WhatsApp support isn't set up yet. Please email us instead.",
        ),
    },
    {
      icon: "phone",
      title: "Call Support",
      subtitle: `Available ${SUPPORT.hours}`,
      onPress: () =>
        open(
          phoneUrl(),
          "A support number isn't set up yet. Please message us on WhatsApp.",
        ),
    },
    {
      icon: "mail",
      title: "Email Us",
      subtitle: SUPPORT.email,
      onPress: () =>
        open(
          emailUrl("Support request"),
          "No support email is configured yet.",
        ),
    },
    {
      icon: "package",
      title: "My Orders",
      subtitle: "Track an order or start a return",
      onPress: () => router.push("/profile/orders"),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader title="Help & Support" showBackButton={true} />
      <ScrollView
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-Urbanist-Bold mb-2">
          How can we help?
        </Text>
        <Text className="text-gray-500 font-Urbanist mb-8">
          Our team is here to assist you with any questions about your orders or
          account.
        </Text>

        {supportOptions.map((option) => (
          <TouchableOpacity
            key={option.title}
            activeOpacity={0.7}
            onPress={option.onPress}
            className="flex-row items-center bg-gray-50 p-5 rounded-2xl mb-4 border border-gray-100"
          >
            <View className="w-12 h-12 bg-white rounded-full items-center justify-center mr-4 shadow-sm">
              <Feather name={option.icon} size={22} color="black" />
            </View>
            <View className="flex-1">
              <Text className="text-[16px] font-Urbanist-Bold text-black">
                {option.title}
              </Text>
              <Text className="text-gray-400 text-xs font-Urbanist mt-0.5">
                {option.subtitle}
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ))}

        <View className="bg-blue-50 p-6 rounded-2xl mt-4 border border-blue-100">
          <Text className="text-blue-900 font-Urbanist-Bold text-lg mb-2">
            Returns &amp; Order Issues
          </Text>
          <Text className="text-blue-700 font-Urbanist text-sm mb-4">
            Message us on WhatsApp with your order number and we&apos;ll sort it
            out. Approved returns show up on your order straight away.
          </Text>
          <View className="flex-row items-center">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/profile/orders")}
              className="bg-blue-600 px-6 py-2 rounded-full"
            >
              <Text className="text-white font-Urbanist-Bold text-sm">
                View My Orders
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => openLegalDocument("returns")}
              className="ml-4"
            >
              <Text className="text-blue-700 font-Urbanist-Bold text-sm underline">
                Return policy
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push("/profile/legal")}
          className="flex-row items-center justify-center mt-6"
        >
          <Feather name="file-text" size={16} color="#6B7280" />
          <Text className="text-gray-500 font-Urbanist text-sm ml-2 underline">
            All policies &amp; legal documents
          </Text>
        </TouchableOpacity>

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
