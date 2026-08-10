import { orderApi } from "@/api/order.api";
import SubHeader from "@/app/components/navbar/SubHeader";
import { returnRequestMessage, whatsappUrl } from "@/config/support";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import dayjs from "dayjs";
import { Feather } from "@expo/vector-icons";

/** A rejected return frees the unit up again, so it doesn't count as returned. */
const liveReturnedUnits = (returns: any[] | undefined): number =>
  (returns || [])
    .filter((r: any) => r.status !== "rejected")
    .reduce((sum: number, r: any) => sum + (r.quantity ?? 1), 0);

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

  const orderReference =
    order?.orderCode || (order?.id ? order.id.slice(0, 8).toUpperCase() : "");

  // Every return raised against this order, flattened with its item for context.
  const returns: any[] = (order?.items || []).flatMap((item: any) =>
    (item.returns || []).map((r: any) => ({ ...r, item })),
  );

  // A return is worth offering only while some unit is still eligible.
  const hasReturnableUnits = (order?.items || []).some(
    (item: any) => item.quantity - liveReturnedUnits(item.returns) > 0,
  );

  const canRequestReturn =
    order?.status?.toLowerCase() === "delivered" && hasReturnableUnits;

  /** Opens WhatsApp pre-filled so support can record the return. */
  const handleRequestReturn = async () => {
    const url = whatsappUrl(
      returnRequestMessage(
        orderReference,
        (order?.items || []).map((item: any) => item.product?.name).filter(Boolean),
      ),
    );

    if (!url) {
      Alert.alert(
        "Not available",
        "WhatsApp support isn't set up yet. Please use Contact Support below.",
      );
      return;
    }

    try {
      const supported = await Linking.canOpenURL(url);
      if (!supported) {
        Alert.alert(
          "WhatsApp not installed",
          "Install WhatsApp, or use Contact Support below to reach us another way.",
        );
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert("Something went wrong", "Please try again in a moment.");
    }
  };

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
            {/* Broken out so the total reconciles with the item prices above —
                the delivery charge is part of what was collected. */}
            {parseFloat(order.discountAmount ?? "0") > 0 && (
              <DetailRow
                label="Discount:"
                value={`-৳${parseFloat(order.discountAmount).toLocaleString()}`}
                boldValue
              />
            )}
            <DetailRow
              label="Delivery Charge:"
              value={`৳${parseFloat(order.shippingFee ?? "0").toLocaleString()}`}
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
                // Prefer the courier's own wording ("Rider Accepted") over our
                // collapsed status enum when the entry came from RoadRush.
                title={(log.logisticsStatusName || log.status).replace(/_/g, " ")}
                date={dayjs(log.createdAt).format("DD MMM, YYYY | hh:mm A")}
                // The admin's note explains manual changes ("Return approved —
                // wrong size"). Skipped when it just repeats the courier status.
                note={
                  log.note && log.note !== log.logisticsStatusName
                    ? log.note
                    : undefined
                }
                completed={true}
                isLast={index === (order.statusLogs?.length || 0) - 1}
              />
            ))}
            {/* If the order hasn't reached a terminal state, show a placeholder step */}
            {!["delivered", "cancelled", "returned"].includes(
              (order.status || "").toLowerCase(),
            ) && (
              <TimelineStep
                title="Future Update"
                date="Awaiting next update..."
                completed={false}
                isLast={true}
              />
            )}
          </View>
        </View>

        {/* Returns — only present once support has recorded one */}
        {returns.length > 0 && (
          <>
            <Text className="text-xl font-Urbanist-Bold mb-2">Returns</Text>
            <Text className="text-gray-500 font-Urbanist text-sm mb-5">
              Recorded by our team after you got in touch.
            </Text>
            <View className="mb-8">
              {returns.map((entry: any) => (
                <ReturnCard key={entry.id} entry={entry} />
              ))}
            </View>
          </>
        )}

        {/* Return request — WhatsApp is the intake channel; an admin records the
            return on their side and it then appears in the section above. */}
        {canRequestReturn && (
          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-[#25D366] py-4 rounded-full items-center mb-4 flex-row justify-center"
            onPress={handleRequestReturn}
          >
            <Feather name="message-circle" size={20} color="white" />
            <Text className="text-white font-Urbanist-Bold text-lg ml-3">
              Request a Return
            </Text>
          </TouchableOpacity>
        )}

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
  note,
  completed,
  isLast,
}: {
  title: string;
  date: string;
  note?: string;
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
        {note && (
          <Text className="text-gray-500 text-xs font-Urbanist mb-1 max-w-[95%]">
            {note}
          </Text>
        )}
        <Text className="text-gray-400 text-xs font-Urbanist">{date}</Text>
      </View>
    </View>
  );
}

const RETURN_STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  requested: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    label: "Under review",
  },
  approved: { bg: "bg-blue-100", text: "text-blue-700", label: "Approved" },
  rejected: { bg: "bg-red-100", text: "text-red-700", label: "Not approved" },
  refunded: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    label: "Refunded",
  },
};

function ReturnCard({ entry }: { entry: any }) {
  const style =
    RETURN_STATUS_STYLES[entry.status] ?? RETURN_STATUS_STYLES.requested;

  return (
    <View className="bg-gray-50 rounded-2xl p-5 mb-3 border border-gray-100">
      <View className="flex-row items-start justify-between gap-3 mb-2">
        <Text
          className="text-black font-Urbanist-Bold text-base flex-1"
          numberOfLines={2}
        >
          {entry.item?.product?.name}
        </Text>
        <View className={`${style.bg} px-3 py-1 rounded-full`}>
          <Text
            className={`${style.text} text-[10px] font-Urbanist-Bold uppercase`}
          >
            {style.label}
          </Text>
        </View>
      </View>

      <Text className="text-gray-500 font-Urbanist text-xs mb-2">
        Qty {entry.quantity ?? 1} of {entry.item?.quantity} ·{" "}
        {dayjs(entry.createdAt).format("DD MMM, YYYY")}
      </Text>

      <Text className="text-gray-700 font-Urbanist text-sm">
        <Text className="font-Urbanist-Bold">Reason: </Text>
        {entry.reason}
      </Text>

      {entry.note && (
        <Text className="text-gray-500 font-Urbanist text-xs mt-1.5 italic">
          {entry.note}
        </Text>
      )}

      {entry.refundAmount && (
        <Text className="text-purple-700 font-Urbanist-Bold text-sm mt-2">
          Refunded ৳{parseFloat(entry.refundAmount).toLocaleString()}
        </Text>
      )}
    </View>
  );
}
