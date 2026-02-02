import SubHeader from "@/app/components/SubHeader";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OfferCard, OfferItem } from "../../../components/home/OfferCard";

const OFFERS: OfferItem[] = [
  {
    id: "1",
    title: "Winter Collection",
    subtitle: "For Selected Items",
    discount: "20% OFF",
    image: {
      uri: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=800&auto=format&fit=crop",
    },
  },
  {
    id: "2",
    title: "Cool Casuals",
    subtitle: "For Selected Items",
    discount: "25% OFF",
    image: {
      uri: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
    },
  },
  {
    id: "3",
    title: "Stock Clearance",
    subtitle: "For Selected Items",
    discount: "25% OFF",
    image: {
      uri: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800&auto=format&fit=crop",
    },
  },
];

const OffersScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader
        title="Offers"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      {/* Offers List */}
      <FlatList
        className="px-10 pt-10 mb-10"
        data={OFFERS}
        renderItem={({ item }) => <OfferCard item={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
};

export default OffersScreen;
