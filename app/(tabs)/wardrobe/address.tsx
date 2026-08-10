import { addressApi } from "@/api/address.api";
import SubHeader from "@/components/navbar/SubHeader";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const TAB_BAR_HEIGHT = 49; // standard React Navigation bottom tab bar
const COLLAPSED_HEIGHT = 370;
const EXPANDED_HEIGHT = SCREEN_HEIGHT * 0.68;

// ── Checkout Stepper ─────────────────────────────────────────────────────────
export const CheckoutStepper = ({ currentStep }: { currentStep: number }) => (
  <View className="flex-row items-center justify-center py-4 bg-white border-b border-gray-50">
    <View className={`w-9 h-9 rounded-full items-center justify-center ${currentStep >= 1 ? "bg-black" : "bg-gray-200"}`}>
      <Feather name="map-pin" size={16} color={currentStep >= 1 ? "white" : "#9CA3AF"} />
    </View>
    <View className="mx-3" style={{ width: 50, borderStyle: "dashed", borderWidth: 1, borderRadius: 1, borderColor: currentStep >= 2 ? "black" : "#D1D5DB" }} />
    <View className={`w-9 h-9 rounded-full items-center justify-center ${currentStep >= 2 ? "bg-black" : "bg-gray-200"}`}>
      <Feather name="credit-card" size={16} color={currentStep >= 2 ? "white" : "#9CA3AF"} />
    </View>
    <View className="mx-3" style={{ width: 50, borderStyle: "dashed", borderWidth: 1, borderRadius: 1, borderColor: currentStep >= 3 ? "black" : "#D1D5DB" }} />
    <View className={`w-9 h-9 rounded-full items-center justify-center ${currentStep >= 3 ? "bg-black" : "bg-gray-200"}`}>
      <Feather name="check" size={16} color={currentStep >= 3 ? "white" : "#9CA3AF"} />
    </View>
  </View>
);

// ── Screen ────────────────────────────────────────────────────────────────────
export default function AddressSelectionScreen() {
  const { buyNowVariantId, buyNowProductName, buyNowVariantName, buyNowPrice, _ctx } =
    useLocalSearchParams<{
      buyNowVariantId?: string;
      buyNowProductName?: string;
      buyNowVariantName?: string;
      buyNowPrice?: string;
      _ctx?: string;
    }>();

  const insets = useSafeAreaInsets();
  // In the wardrobe tab flow the tab bar overlaps the bottom of the screen.
  // Inside a tab screen useSafeAreaInsets().bottom is often 0 because the tab
  // bar already consumed it, so we can't rely on insets alone.
  // Use a flat 96px offset (tab bar ~49 + home indicator ~34 + breathing room).
  const WARDROBE_EXTRA_BOTTOM = 96;
  const buttonBottomPadding = _ctx === "checkout"
    ? Math.max(insets.bottom, 20)
    : WARDROBE_EXTRA_BOTTOM;

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: addressesData, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: addressApi.getAddresses,
  });

  const addresses = React.useMemo(() => addressesData?.data || [], [addressesData]);

  const filteredAddresses = React.useMemo(() => {
    if (!searchQuery.trim()) return addresses;
    return addresses.filter(
      (addr: any) =>
        addr.street?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        addr.district?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        addr.thana?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        addr.type?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [addresses, searchQuery]);

  React.useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      const def = addresses.find((a: any) => a.isDefault) || addresses[0];
      setSelectedAddressId(def.id);
    }
  }, [addresses, selectedAddressId]);

  const handleContinue = () => {
    if (!selectedAddressId) return;
    const basePath = _ctx === "checkout" ? "/checkout" : "/wardrobe";
    router.push({
      pathname: `${basePath}/checkout` as any,
      params: {
        addressId: selectedAddressId,
        ...(buyNowVariantId && { buyNowVariantId, buyNowProductName, buyNowVariantName, buyNowPrice }),
        ...(_ctx && { _ctx }),
      },
    });
  };

  // ── Bottom-sheet animation (height, not translateY) ───────────────────────
  // Animating HEIGHT keeps the bottom edge pinned → button always on screen.
  // Dragging UP  (negative translationY) → height grows toward EXPANDED_HEIGHT
  // Dragging DOWN (positive translationY) → height shrinks toward COLLAPSED_HEIGHT
  //
  // In wardrobe flow the tab bar adds extra height to the collapsed state so
  // the button clears the navbar from the very first render.
  const collapsedHeight = COLLAPSED_HEIGHT + (_ctx !== "checkout" ? WARDROBE_EXTRA_BOTTOM : 0);

  const sheetHeight = useSharedValue(collapsedHeight);
  const savedHeight = useSharedValue(collapsedHeight);

  const dragGesture = Gesture.Pan()
    .onBegin(() => {
      savedHeight.value = sheetHeight.value;
    })
    .onUpdate((e) => {
      const next = savedHeight.value - e.translationY;
      sheetHeight.value = Math.max(collapsedHeight, Math.min(EXPANDED_HEIGHT, next));
    })
    .onEnd((e) => {
      const mid = (collapsedHeight + EXPANDED_HEIGHT) / 2;
      const expand = e.velocityY < -400 || sheetHeight.value > mid;
      sheetHeight.value = withSpring(expand ? EXPANDED_HEIGHT : collapsedHeight, {
        damping: 22,
        stiffness: 200,
      });
    });

  const sheetStyle = useAnimatedStyle(() => ({ height: sheetHeight.value }));

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader title="Address" showBackButton={true} />
      <CheckoutStepper currentStep={1} />

      {/* Map + sheet */}
      <View style={{ flex: 1 }}>
        <Image
          source={require("@/assets/images/mock_map.png")}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          resizeMode="cover"
        />

        {/* Sheet — bottom pinned, height animates up/down */}
        <Animated.View
          style={[
            {
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "#F9F9F9",
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -6 },
              shadowOpacity: 0.09,
              shadowRadius: 12,
              elevation: 14,
              overflow: "hidden",
            },
            sheetStyle,
          ]}
        >
          {/* ── Drag handle + static header ─────────────────────────── */}
          <GestureDetector gesture={dragGesture}>
            <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 }}>
              {/* Pill */}
              <View style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: "#D1D5DB", alignSelf: "center", marginBottom: 14 }} />

              {/* Search */}
              <View style={{
                flexDirection: "row", alignItems: "center",
                backgroundColor: "white", borderWidth: 1, borderColor: "#F3F4F6",
                borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11,
                marginBottom: 14,
                shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 3, elevation: 2,
              }}>
                <Feather name="search" size={17} color="#9CA3AF" style={{ marginRight: 9 }} />
                <TextInput
                  placeholder="Search address"
                  placeholderTextColor="#9CA3AF"
                  style={{ flex: 1, fontSize: 14, color: "#111", padding: 0, margin: 0, fontFamily: "Urbanist-Medium" }}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                <TouchableOpacity hitSlop={10}>
                  <Feather name="crosshair" size={17} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Section title */}
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 15, fontFamily: "Urbanist-Bold", color: "#111827" }}>
                  Saved Address
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/wardrobe/add-address")}
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <Feather name="plus" size={15} color="black" />
                  <Text style={{ marginLeft: 3, fontSize: 13, fontFamily: "Urbanist-Bold", color: "#111" }}>
                    Add New
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </GestureDetector>

          {/* ── Scrollable address list ──────────────────────────────── */}
          <ScrollView
            style={{ flex: 1, paddingHorizontal: 20 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 8 }}
          >
            {isLoading ? (
              <View style={{ paddingVertical: 24, alignItems: "center" }}>
                <ActivityIndicator color="black" />
              </View>
            ) : filteredAddresses.length === 0 ? (
              <View style={{
                paddingVertical: 24, alignItems: "center",
                backgroundColor: "white", borderRadius: 14,
                borderWidth: 1, borderColor: "#F3F4F6", padding: 16, marginTop: 6,
              }}>
                <Text style={{ color: "#6B7280", textAlign: "center", marginBottom: 10, fontFamily: "Urbanist" }}>
                  {searchQuery ? "No matching addresses found" : "No saved addresses found"}
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/wardrobe/add-address")}
                  style={{ backgroundColor: "black", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 }}
                >
                  <Text style={{ color: "white", fontFamily: "Urbanist-Bold", fontSize: 12 }}>
                    + Add First Address
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              filteredAddresses.map((address: any) => {
                const isSelected = selectedAddressId === address.id;
                const formattedAddress = [address.street, address.area, address.thana, address.district]
                  .filter(Boolean).join(", ");

                return (
                  <TouchableOpacity
                    key={address.id}
                    onPress={() => setSelectedAddressId(address.id)}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: "row", alignItems: "flex-start",
                      paddingVertical: 14,
                      borderBottomWidth: 1, borderBottomColor: "#F3F4F6",
                    }}
                  >
                    <View style={{
                      width: 20, height: 20, borderRadius: 10, borderWidth: 2,
                      borderColor: isSelected ? "#6B7280" : "#D1D5DB",
                      alignItems: "center", justifyContent: "center",
                      marginRight: 12, marginTop: 2,
                    }}>
                      {isSelected && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#374151" }} />}
                    </View>

                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
                        <Text style={{ fontSize: 14, fontFamily: "Urbanist-Bold", color: "#111827", marginRight: 7 }}>
                          {address.type}
                        </Text>
                        {address.isDefault && (
                          <View style={{ backgroundColor: "#F3F4F6", paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 }}>
                            <Text style={{ fontSize: 9, fontFamily: "Urbanist-Bold", color: "#6B7280" }}>DEFAULT</Text>
                          </View>
                        )}
                      </View>
                      <Text style={{ color: "#4B5563", fontFamily: "Urbanist-Medium", fontSize: 13, lineHeight: 19 }}>
                        {formattedAddress}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>

          {/* ── Continue button — always at the physical bottom ──────── */}
          <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: buttonBottomPadding, backgroundColor: "#F9F9F9" }}>
            <TouchableOpacity
              onPress={handleContinue}
              disabled={!selectedAddressId}
              style={{
                backgroundColor: "black",
                paddingVertical: 18,
                borderRadius: 16,
                alignItems: "center",
                justifyContent: "center",
                opacity: selectedAddressId ? 1 : 0.4,
                shadowColor: "#000",
                shadowOpacity: 0.12,
                shadowRadius: 6,
                elevation: 4,
              }}
            >
              <Text style={{ color: "white", fontFamily: "Urbanist-Bold", fontSize: 16 }}>
                Continue to Payment
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
