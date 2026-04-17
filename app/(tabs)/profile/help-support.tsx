import SubHeader from "@/app/components/navbar/SubHeader";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HelpSupportScreen() {
  const supportOptions = [
    {
      icon: "message-circle",
      title: "Chat with us",
      subtitle: "Average response time: 5 mins",
    },
    {
      icon: "phone",
      title: "Call Support",
      subtitle: "Available 10 AM - 8 PM",
    },
    { icon: "mail", title: "Email Us", subtitle: "support@soho.com" },
    {
      icon: "file-text",
      title: "FAQs",
      subtitle: "Common questions and answers",
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

        {supportOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center bg-gray-50 p-5 rounded-2xl mb-4 border border-gray-100"
          >
            <View className="w-12 h-12 bg-white rounded-full items-center justify-center mr-4 shadow-sm">
              <Feather name={option.icon as any} size={22} color="black" />
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
            Order Issues?
          </Text>
          <Text className="text-blue-700 font-Urbanist text-sm mb-4">
            If you&spo;re having trouble with a specific order, please have your
            order number ready.
          </Text>
          <TouchableOpacity className="bg-blue-600 self-start px-6 py-2 rounded-full">
            <Text className="text-white font-Urbanist-Bold text-sm">
              Track Package
            </Text>
          </TouchableOpacity>
        </View>

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
