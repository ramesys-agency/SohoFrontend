import React from "react";
import { Text, View } from "react-native";

/** Key-value JSON object of product attributes from the API.
 *  e.g. { "Material": "Cotton", "Care": "Machine washable" } */
export type ProductAttributes = Record<string, string>;

interface DetailsTabContentProps {
  description: string;
  features: ProductAttributes | null | undefined;
}

export default function DetailsTabContent({
  description,
  features,
}: DetailsTabContentProps) {
  const featureEntries = features ? Object.entries(features) : [];

  return (
    <View className="mt-4">
      {/* ── Description ─────────────────────────────────────── */}
      <Text
        className="text-base font-semibold mb-2"
        style={{ fontFamily: "UrbanistBold" }}
      >
        Description
      </Text>
      <Text
        className="text-base text-gray-800 leading-6 mb-4"
        style={{ fontFamily: "Urbanist" }}
      >
        {description || "No description available."}
      </Text>

      {/* ── Features / Attributes ────────────────────────────── */}
      {featureEntries.length > 0 && (
        <View className="mt-6">
          <Text
            className="text-base font-semibold mb-3"
            style={{ fontFamily: "UrbanistBold" }}
          >
            Features
          </Text>
          {featureEntries.map(([key, value]) => (
            <View key={key} className="flex-row items-start mb-3">
              {/* Bullet */}
              <View className="w-[6px] h-[6px] rounded-full bg-black mt-[7px] mr-3" />
              <View className="flex-1 flex-row flex-wrap">
                <Text
                  className="text-base text-black"
                  style={{ fontFamily: "UrbanistBold" }}
                >
                  {key}:{" "}
                </Text>
                <Text
                  className="text-base text-gray-700"
                  style={{ fontFamily: "Urbanist" }}
                >
                  {value}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
