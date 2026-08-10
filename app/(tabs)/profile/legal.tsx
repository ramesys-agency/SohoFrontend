import SubHeader from "@/components/navbar/SubHeader";
import {
  LEGAL_DOCUMENTS,
  copyrightLine,
  openLegalDocument,
} from "@/config/legal";
import { Feather } from "@expo/vector-icons";
import Constants from "expo-constants";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Every policy the store is required to publish, in one place. The documents
 * themselves are hosted on the website (see config/legal.ts) — this screen is
 * the in-app route to them, which App Review expects for a commerce app.
 */
export default function LegalScreen() {
  const appVersion = Constants.expoConfig?.version ?? "—";

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader title="Legal & Policies" showBackButton={true} />
      <ScrollView
        className="flex-1 px-6 pt-6"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-gray-500 font-Urbanist mb-8">
          These open in a browser so you always see the current version.
        </Text>

        {LEGAL_DOCUMENTS.map((doc) => (
          <TouchableOpacity
            key={doc.key}
            activeOpacity={0.7}
            onPress={() => openLegalDocument(doc.key)}
            className="flex-row items-center bg-gray-50 p-5 rounded-2xl mb-4 border border-gray-100"
          >
            <View className="w-12 h-12 bg-white rounded-full items-center justify-center mr-4 shadow-sm">
              <Feather name="file-text" size={22} color="black" />
            </View>
            <View className="flex-1">
              <Text className="text-[16px] font-Urbanist-Bold text-black">
                {doc.title}
              </Text>
              <Text className="text-gray-400 text-xs font-Urbanist mt-0.5">
                {doc.subtitle}
              </Text>
            </View>
            <Feather name="external-link" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        ))}

        <View className="items-center mt-8">
          <Text className="text-gray-400 text-xs font-Urbanist">
            Version {appVersion}
          </Text>
          <Text className="text-gray-400 text-xs font-Urbanist mt-1">
            {copyrightLine()}
          </Text>
        </View>

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
