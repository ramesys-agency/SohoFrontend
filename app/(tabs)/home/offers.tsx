import { placementApi, type Placement } from "@/api/placement.api";
import SubHeader from "@/components/navbar/SubHeader";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OfferCard, { OfferItem } from "@/components/home/OfferCard";

const FALLBACK_OFFER_IMAGE =
  "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=800&auto=format&fit=crop";

const OffersScreen = () => {
  const navigation = useNavigation();
  const [offers, setOffers] = useState<Placement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOffers = async () => {
    try {
      setOffers(await placementApi.getPlacements("OFFERS"));
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  };

  /** Each offer card is its own placement — own name, image and product list. */
  const openOffer = (placement: Placement) => {
    if (placement.productId) {
      router.push(`/product/${placement.productId}`);
      return;
    }

    router.push({
      pathname: "/(tabs)/home/shop/[category]",
      params: {
        category: placement.name,
        gender: "",
        collectionSlug: placement.slug,
        placementId: placement.id,
      },
    });
  };

  const toOfferItem = (placement: Placement): OfferItem => ({
    id: placement.id,
    title: placement.name,
    subtitle: placement.description ?? "For Selected Items",
    discount: "",
    image: { uri: placement.imageUrl || FALLBACK_OFFER_IMAGE },
  });

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchOffers();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader
        title="Offers"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      {/* Offers List */}
      {loading ? (
        <View className="px-10 pt-10">
          {[1, 2, 3].map((key) => (
            <View
              key={key}
              className="w-full h-[400px] bg-gray-200 rounded-3xl mb-6 opacity-50"
            />
          ))}
        </View>
      ) : (
        <FlatList
          className="px-10 pt-10 mb-10"
          data={offers}
          renderItem={({ item }) => (
            <OfferCard item={toOfferItem(item)} onPress={() => openOffer(item)} />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
    </SafeAreaView>
  );
};

export default OffersScreen;
