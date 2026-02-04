import SubHeader from "@/app/components/navbar/SubHeader";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BannerCarousel from "../../components/catalog/BannerCarousel";
import CategoryCircle from "../../components/catalog/CategoryCircle";
import CategoryGridItem from "../../components/catalog/CategoryGridItem";

const circularCategories = [
  {
    id: "1",
    name: "Saree",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Modern",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Ethnic",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "4",
    name: "Shoes",
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "5",
    name: "Accessories",
    image:
      "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?q=80&w=200&auto=format&fit=crop",
  },
];

const gridItems = [
  {
    id: "1",
    name: "New Arrival",
    image:
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Trending",
    image:
      "https://images.unsplash.com/photo-1475180098004-ca77a652e95c?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Clothing",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "4",
    name: "Shoes",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "5",
    name: "New Arrival",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "6",
    name: "Trending",
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=400&auto=format&fit=crop",
  },
];

const banners = [
  {
    id: "1",
    title: "Stock Clearance",
    subtitle: "For Selected Items",
    discount: "25% OFF",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "New Collection",
    subtitle: "Summer vibes",
    discount: "FREE SHIPPING",
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "Season Sale",
    subtitle: "Winter collection",
    discount: "UP TO 50%",
    image:
      "https://images.unsplash.com/photo-1445205174273-59396092d3af?q=80&w=800&auto=format&fit=crop",
  },
];

export default function CatalogScreen() {
  const [activeCategory, setActiveCategory] = useState("women");

  const segments = [
    { label: "Women", value: "women" },
    { label: "Men", value: "men" },
    { label: "Kids", value: "kids" },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white pb-28" edges={["top"]}>
      <View>
        <SubHeader title="Catalog" />
        <View className="pb-2"></View>
        <SegmentedControl
          style={{ marginHorizontal: 16 }}
          backgroundColor="#F3F3F3"
          values={segments.map((s) => s.label)}
          selectedIndex={segments.findIndex((s) => s.value === activeCategory)}
          onChange={(event) => {
            setActiveCategory(
              segments[event.nativeEvent.selectedSegmentIndex].value,
            );
          }}
        />
      </View>

      <ScrollView
        className="flex-1 px-4 pt-2"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Horizontal Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="py-4"
        >
          {circularCategories.map((item) => (
            <CategoryCircle
              key={item.id}
              name={item.name}
              image={item.image}
              onPress={() => {}}
            />
          ))}
        </ScrollView>

        {/* Promotional Banner */}
        <BannerCarousel banners={banners} />

        {/* Categories Grid */}
        <View className="flex-row flex-wrap -mx-1">
          {gridItems.map((item) => (
            <View key={item.id} className="w-1/2 p-1">
              <CategoryGridItem
                name={item.name}
                image={item.image}
                onPress={() => {}}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
