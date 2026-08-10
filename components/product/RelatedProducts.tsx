import ProductCard from "@/components/common/ProductCard";
import React from "react";
import { ScrollView, Text, View } from "react-native";

export default function RelatedProducts({ products }: any) {
  return (
    <View className="mt-8 mb-4">
      <Text
        className="text-xl text-black font-semibold mb-1"
        style={{ fontFamily: "UrbanistBold" }}
      >
        Popular with your order
      </Text>
      <Text className="text-gray-500 mb-4" style={{ fontFamily: "Urbanist" }}>
        People also bought these
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="-mx-5 px-5"
      >
        {products.map((item: any) => (
          <View key={item.id} className="w-40 mr-4">
            <ProductCard
              id={item.id}
              name={item.name}
              variantId={item.variantId}
              isWishlisted={item.isWishlisted}
              image={item.image}
              price={item.price}
              rating={item.rating}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
