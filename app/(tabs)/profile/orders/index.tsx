import { orderApi } from "@/api/order.api";
import SubHeader from "@/components/navbar/SubHeader";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import dayjs from "dayjs";

export default function OrdersListScreen() {
  const {
    data: fetchResponse,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: orderApi.getOrders,
  });

  const orders = fetchResponse?.data || [];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader
        title="My Orders"
        hideSearch
        hideNotification
        showBackButton={true}
      />

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : isError ? (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-red-500 font-Urbanist-Medium">
            Failed to load orders.
          </Text>
        </View>
      ) : orders.length === 0 ? (
        <View className="flex-1 justify-center items-center p-4">
          <Text className="text-gray-500 font-Urbanist-Medium">
            You haven&apos;t placed any orders yet.
          </Text>
          <TouchableOpacity
            className="mt-4 bg-black px-6 py-2 rounded-full"
            onPress={() => router.push("/(tabs)/catalog")}
          >
            <Text className="text-white font-Urbanist-Bold">
              Start Shopping
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4 pt-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={isLoading || isRefetching}
              onRefresh={refetch}
            />
          }
        >
          {orders.map((order: any) => {
            const firstItem = order.items?.[0];
            const itemCount = order.items?.length || 0;
            const itemText =
              itemCount > 1
                ? `${firstItem?.product?.name} + ${itemCount - 1} more`
                : firstItem?.product?.name;
            const productImage =
              firstItem?.variant?.images?.[0]?.imageUrl ||
              "https://i.pravatar.cc/150?img=1";

            // Surface an in-flight return even when the order itself still reads
            // "delivered" — a partial return never changes the order status.
            const openReturns = (order.items || []).flatMap((item: any) =>
              (item.returns || []).filter(
                (r: any) => r.status === "requested" || r.status === "approved",
              ),
            );

            return (
              <TouchableOpacity
                key={order.id}
                activeOpacity={0.8}
                onPress={() => router.push(`/profile/orders/${order.id}`)}
                className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100 flex-row gap-4"
              >
                <Image
                  source={{ uri: productImage }}
                  className="w-20 h-24 rounded-lg bg-gray-200"
                />
                <View className="flex-1 justify-between py-1">
                  <View>
                    <View className="flex-row justify-between items-start">
                      <Text
                        className="font-Urbanist-Bold text-base text-black flex-1 mr-2"
                        numberOfLines={1}
                      >
                        {itemText || "Order Items"}
                      </Text>
                      <Text className="text-gray-500 text-xs font-Urbanist">
                        {dayjs(order.createdAt).format("DD MMM, YYYY")}
                      </Text>
                    </View>
                    <Text className="text-gray-500 text-sm mt-1 font-Urbanist">
                      Order No:{" "}
                      {order.orderCode || order.id.slice(0, 8).toUpperCase()}
                    </Text>
                    {openReturns.length > 0 && (
                      <View className="flex-row items-center mt-1.5">
                        <View className="bg-orange-100 px-2 py-0.5 rounded-full">
                          <Text className="text-orange-700 text-[10px] font-Urbanist-Bold uppercase">
                            {openReturns.some(
                              (r: any) => r.status === "approved",
                            )
                              ? "Return approved"
                              : "Return under review"}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>

                  <View className="flex-row justify-between items-end mt-2">
                    <Text className="font-Urbanist-Bold text-base">
                      ৳{parseFloat(order.totalAmount).toLocaleString()}
                    </Text>
                    <OrderStatusBadge status={order.status} />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  let bg = "bg-gray-100";
  let text = "text-gray-600";

  const statusLower = status.toLowerCase();

  if (statusLower === "delivered") {
    bg = "bg-green-100";
    text = "text-green-700";
  } else if (["shipping", "shipped", "on_the_way"].includes(statusLower)) {
    bg = "bg-blue-100";
    text = "text-blue-700";
  } else if (["cancelled", "failed"].includes(statusLower)) {
    bg = "bg-red-100";
    text = "text-red-700";
  } else if (statusLower === "returned") {
    bg = "bg-orange-100";
    text = "text-orange-700";
  } else if (statusLower === "pending") {
    bg = "bg-yellow-100";
    text = "text-yellow-700";
  }

  return (
    <View className={`${bg} px-3 py-1 rounded-full`}>
      <Text className={`${text} text-[10px] font-Urbanist-Bold uppercase`}>
        {status.replace(/_/g, " ")}
      </Text>
    </View>
  );
}
