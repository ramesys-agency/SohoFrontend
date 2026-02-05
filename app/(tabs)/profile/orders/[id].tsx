import { router, useLocalSearchParams } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SubHeader from "../../../components/navbar/SubHeader";

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams();

  // Mock data - normally fetch based on id
  const order = {
    id: id || "F9057845RA",
    productName: "Cotton Salwar",
    price: "৳2200",
    brand: "Agha Noor",
    deliveryDate: "25th December 2025",
    image: "https://i.pravatar.cc/150?img=1", // Using placeholder as previously established
    timeline: [
      {
        title: "Order date",
        date: "22th Dec, 2025 | 11:38 AM",
        completed: true,
      },
      {
        title: "Confirmation Date",
        date: "23th Dec, 2025 | 10:24 AM",
        completed: true,
      },
      { title: "Shipping", date: "23th Dec, 2025 | 11:50 AM", completed: true },
      { title: "Delivery", date: "Waiting for delivery", completed: false },
    ],
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader
        title="Order Details"
        hideSearch
        hideNotification
        showBackButton={true}
      />
      <ScrollView
        className="flex-1 px-8"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Product Card */}
        <View className="bg-gray-50 rounded-2xl p-4 mb-8">
          <Image
            source={{ uri: order.image }}
            className="w-full h-80 rounded-xl mb-4 bg-gray-200"
            resizeMode="cover"
          />

          <View className="gap-y-3">
            <DetailRow
              label="Product Name:"
              value={order.productName}
              boldValue
            />
            <DetailRow label="Price:" value={order.price} boldValue />
            <DetailRow label="Brand:" value={order.brand} boldValue />
            <DetailRow label="Order No." value={order.id as string} boldValue />
            <DetailRow
              label="Delivery Date:"
              value={order.deliveryDate}
              boldValue
            />
          </View>
        </View>

        <Text className="text-xl font-Urbanist-Bold mb-6">Order Status</Text>

        {/* Timeline */}
        <View className="bg-gray-50 rounded-2xl p-6 mb-8">
          <View className="ml-2">
            {order.timeline.map((step, index) => (
              <TimelineStep
                key={index}
                step={step}
                isLast={index === order.timeline.length - 1}
              />
            ))}
          </View>
        </View>

        {/* Cancel Button */}
        <TouchableOpacity
          className="bg-black py-4 rounded-full items-center mb-8"
          onPress={() => router.back()}
        >
          <Text className="text-white font-Urbanist-Bold text-lg">
            Cancel Order
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
    <View className="flex-row justify-between items-center">
      <Text className="text-black font-Urbanist text-base">{label}</Text>
      <Text
        className={`text-black font-Urbanist text-base w-1/2 text-right ${boldValue ? "font-Urbanist-Bold" : ""}`}
      >
        {value}
      </Text>
    </View>
  );
}

function TimelineStep({
  step,
  isLast,
}: {
  step: { title: string; date: string; completed: boolean };
  isLast: boolean;
}) {
  return (
    <View className="flex-row">
      <View className="items-center mr-4">
        <View
          className={`w-4 h-4 rounded-full ${step.completed ? "bg-blue-500" : "bg-gray-300"}`}
        />
        {!isLast && (
          <View
            className={`w-0.5 flex-1 my-1 ${step.completed ? "bg-gray-300" : "bg-gray-200"}`}
            style={{ minHeight: 30 }}
          />
        )}
      </View>
      <View className="pb-6">
        <Text className="text-black font-Urbanist-Bold text-base leading-none mb-1">
          {step.title}
        </Text>
        <Text className="text-gray-500 text-xs font-Urbanist">{step.date}</Text>
      </View>
    </View>
  );
}
