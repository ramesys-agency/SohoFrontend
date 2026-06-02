import { collectionApi } from "@/api/collection.api";
import SubHeader from "@/app/components/navbar/SubHeader";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OfferCard, { OfferItem } from "../../components/home/OfferCard";

const OffersScreen = () => {
  const navigation = useNavigation();
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOffers = async () => {
    try {
      const data = await collectionApi.getCollections({
        isActive: true,
        placementPage: "OFFER",
        placementIsActive: true,
      });

      const formattedOffers: (OfferItem & { placementId?: string })[] = data.map((collection: any) => ({
        id: collection.id,
        placementId: collection.collectionPlacements?.[0]?.id,
        title: collection.name,
        subtitle: "For Selected Items",
        discount: "",
        image: {
          uri:
            collection.collectionPlacements?.[0]?.imageUrl ||
            "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=800&auto=format&fit=crop",
        },
      }));

      setOffers(formattedOffers);
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  };

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
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <FlatList
          className="px-10 pt-10 mb-10"
          data={offers}
          renderItem={({ item }) => (
            <OfferCard
              item={item}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/home/shop/[category]",
                  params: {
                    category: (item.title || "").toLowerCase(),
                    gender: "",
                    collectionId: item.id,
                    placementId: (item as any).placementId,
                  },
                })
              }
            />
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
