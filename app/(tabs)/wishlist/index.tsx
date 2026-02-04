import SubHeader from "@/app/components/navbar/SubHeader";
import WishlistItem from "@/app/components/wishlist/WishlistItem";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Dummy data for wishlist items
const WISHLIST_DATA = [
  {
    id: "1",
    name: "Rose Mist Long kurta",
    size: "M",
    price: "৳4500",
    image:
      "https://images.unsplash.com/photo-1601762603339-fd61e28b698a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "2",
    name: "Cotton Salwar",
    size: "L",
    price: "৳2200",
    image:
      "https://images.unsplash.com/photo-1601762603339-fd61e28b698a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "3",
    name: "Pink Saree",
    size: "L",
    price: "৳8200",
    image:
      "https://images.unsplash.com/photo-1601762603339-fd61e28b698a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "4",
    name: "Women White Top",
    size: "L",
    price: "৳1500",
    image:
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=300&auto=format&fit=crop", // Placeholder image
  },
  {
    id: "5",
    name: "Rose Mist Long kurta",
    size: "M",
    price: "৳4500",
    image:
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "6",
    name: "Cotton Salwar",
    size: "L",
    price: "৳2200",
    image:
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "7",
    name: "Pink Saree",
    size: "L",
    price: "৳8200",
    image:
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "8",
    name: "Women White Top",
    size: "L",
    price: "৳1500",
    image:
      "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=300&auto=format&fit=crop",
  },
];

const WishlistScreen = () => {
  const [items, setItems] = useState(WISHLIST_DATA);
  const router = useRouter();

  const handleDelete = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader title="Wishlist" />
      {items.length === 0 ? (
        <View className="flex-1 justify-center items-center p-4">
          <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
            <IconSymbol name="heart.fill" size={40} color="#9CA3AF" />
          </View>
          <Text className="text-xl font-bold text-gray-900 mb-2 w-full text-center">
            Your wishlist is empty
          </Text>
          <Text className="text-gray-500 text-center mb-8">
            Looks like you haven&apos;t added anything to your wishlist yet.
          </Text>
          <TouchableOpacity
            className="bg-black px-8 py-3 rounded-full"
            onPress={() => router.push("/(tabs)/catalog")}
          >
            <Text className="text-white font-semibold">Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="flex-1 px-4 pt-2">
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <WishlistItem
                image={{ uri: item.image }}
                name={item.name}
                size={item.size}
                price={item.price}
                onDelete={() => handleDelete(item.id)}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default WishlistScreen;
