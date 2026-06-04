import { orderApi } from "@/api/order.api";
import SubHeader from "@/app/components/navbar/SubHeader";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import dayjs from "dayjs";
import { Feather } from "@expo/vector-icons";

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams();

  const {
    data: fetchResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order", id],
    queryFn: () => orderApi.getOrderById(id as string),
    enabled: !!id,
  });

  const order = fetchResponse?.data;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  if (isError || !order) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center p-4">
        <Text className="text-red-500 font-Urbanist-Medium">
          Failed to load order details.
        </Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-black font-Urbanist-Bold underline">
            Go Back
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader
        title="Order Details"
        hideSearch
        hideNotification
        showBackButton={true}
      />
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Product Cards */}
        {order.items.map((item: any, index: number) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.7}
            onPress={() =>
              router.push({
                pathname: `/product/${item.productId}`,
                params: { variantId: item.variantId },
              })
            }
            className="bg-gray-50 rounded-2xl p-4 mb-4 flex-row gap-4 border border-gray-100"
          >
            <Image
              source={{
                uri:
                  item.variant?.images?.[0]?.imageUrl ||
                  "https://i.pravatar.cc/150?img=1",
              }}
              className="w-24 h-32 rounded-xl bg-gray-200"
              resizeMode="cover"
            />
            <View className="flex-1 justify-center py-2">
              <Text
                className="text-lg font-Urbanist-Bold text-black mb-1"
                numberOfLines={2}
              >
                {item.product?.name}
              </Text>
              <Text className="text-gray-500 font-Urbanist mb-1 text-sm">
                Quantity: {item.quantity}
              </Text>
              <Text className="text-black font-Urbanist-Bold text-lg">
                ৳{parseFloat(item.variant?.basePrice || "0").toLocaleString()}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Info Section */}
        <View className="bg-gray-50 rounded-2xl p-6 mb-8 mt-2">
          <View className="gap-y-3">
            <DetailRow
              label="Order Number:"
              value={order.orderCode || order.id.slice(0, 8).toUpperCase()}
              boldValue
            />
            <DetailRow
              label="Payment Method:"
              value={order.payments?.[0]?.paymentMethod || "COD"}
              boldValue
            />
            <DetailRow
              label="Total Amount:"
              value={`৳${parseFloat(order.totalAmount).toLocaleString()}`}
              boldValue
            />
            <DetailRow
              label="Order Date:"
              value={dayjs(order.createdAt).format("DD MMM YYYY, hh:mm A")}
              boldValue
            />
          </View>

          <View className="h-[1px] bg-gray-200 my-4" />

          <Text className="text-xs text-gray-400 font-Urbanist-Bold mb-2 uppercase tracking-widest">
            Shipping Address
          </Text>
          <Text className="text-black font-Urbanist-Bold text-base mb-1">
            {order.address?.type || "Primary"}
          </Text>
          <Text className="text-gray-500 font-Urbanist text-sm">
            {order.address?.street}, {order.address?.thana},{" "}
            {order.address?.district}, {order.address?.division}
          </Text>
        </View>

        <Text className="text-xl font-Urbanist-Bold mb-6">Order Timeline</Text>

        {/* Timeline */}
        <View className="bg-gray-50 rounded-2xl p-6 mb-8">
          <View className="ml-2">
            {(order.statusLogs || []).map((log: any, index: number) => (
              <TimelineStep
                key={log.id}
                title={log.status.replace(/_/g, " ")}
                date={dayjs(log.createdAt).format("DD MMM, YYYY | hh:mm A")}
                completed={true}
                isLast={index === (order.statusLogs?.length || 0) - 1}
              />
            ))}
            {/* If order is not delivered, show a pending step for illustration or future state */}
            {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
              <TimelineStep
                title="Future Update"
                date="Awaiting next update..."
                completed={false}
                isLast={true}
              />
            )}
          </View>
        </View>

        {/* Support Button */}
        <TouchableOpacity
          className="bg-black py-4 rounded-full items-center mb-8 flex-row justify-center"
          onPress={() => router.push("/profile/help-support")}
        >
          <Feather name="headphones" size={20} color="white" />
          <Text className="text-white font-Urbanist-Bold text-lg ml-3">
            Contact Support
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({
  label,
  value,
  boldValue = false,
}: {
  label: string;
  value: string;
  boldValue?: boolean;
}) {
  return (
    <View className="flex-row justify-between items-start">
      <Text className="text-gray-500 font-Urbanist text-sm">{label}</Text>
      <Text
        className={`text-black font-Urbanist text-sm max-w-[60%] text-right ${boldValue ? "font-Urbanist-Bold" : ""}`}
      >
        {value}
      </Text>
    </View>
  );
}

function TimelineStep({
  title,
  date,
  completed,
  isLast,
}: {
  title: string;
  date: string;
  completed: boolean;
  isLast: boolean;
}) {
  return (
    <View className="flex-row">
      <View className="items-center mr-4">
        <View
          className={`w-4 h-4 rounded-full ${completed ? "bg-black" : "bg-gray-300"}`}
        />
        {!isLast && (
          <View
            className={`w-0.5 flex-1 my-1 ${completed ? "bg-black" : "bg-gray-200"}`}
            style={{ minHeight: 30 }}
          />
        )}
      </View>
      <View className="pb-6">
        <Text
          className={`font-Urbanist-Bold text-base leading-none mb-1 uppercase ${completed ? "text-black" : "text-gray-400"}`}
        >
          {title}
        </Text>
        <Text className="text-gray-400 text-xs font-Urbanist">{date}</Text>
      </View>
    </View>
  );
}
