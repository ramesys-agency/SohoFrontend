import { router } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SubHeader from "../../../components/navbar/SubHeader";

const MOCK_ORDERS = [
  {
    id: "F9057845RA",
    date: "22 Dec, 2025",
    total: "৳2200",
    status: "Shipping",
    items: "Cotton Salwar",
    image: "https://i.pravatar.cc/150?img=1", // Placeholder, ideally product image
  },
  {
    id: "F9057846RB",
    date: "10 Nov, 2025",
    total: "৳1500",
    status: "Delivered",
    items: "Blue Jeans",
    image: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "F9057847RC",
    date: "05 Oct, 2025",
    total: "৳3200",
    status: "Cancelled",
    items: "Silk Saree",
    image: "https://i.pravatar.cc/150?img=3",
  },
];

export default function OrdersListScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader title="My Orders" showBackButton={true} />
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {MOCK_ORDERS.map((order) => (
          <TouchableOpacity
            key={order.id}
            activeOpacity={0.8}
            onPress={() => router.push(`/profile/orders/${order.id}`)}
            className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100 flex-row gap-4"
          >
            <Image
              source={{ uri: order.image }}
              className="w-20 h-24 rounded-lg bg-gray-200"
            />
            <View className="flex-1 justify-between py-1">
              <View>
                <View className="flex-row justify-between items-start">
                  <Text
                    className="font-bold text-base text-black"
                    numberOfLines={1}
                  >
                    {order.items}
                  </Text>
                  <Text className="text-gray-500 text-xs">{order.date}</Text>
                </View>
                <Text className="text-gray-500 text-sm mt-1">
                  Order No: {order.id}
                </Text>
              </View>

              <View className="flex-row justify-between items-end mt-2">
                <Text className="font-bold text-base">{order.total}</Text>
                <OrderStatusBadge status={order.status} />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  let bg = "bg-gray-100";
  let text = "text-gray-600";

  if (status === "Delivered") {
    bg = "bg-green-100";
    text = "text-green-700";
  } else if (status === "Shipping") {
    bg = "bg-blue-100";
    text = "text-blue-700";
  } else if (status === "Cancelled") {
    bg = "bg-red-100";
    text = "text-red-700";
  }

  return (
    <View className={`${bg} px-3 py-1 rounded-full`}>
      <Text className={`${text} text-xs font-medium`}>{status}</Text>
    </View>
  );
}
