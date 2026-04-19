import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { addressApi } from "../../../../api/address.api";
import { IconSymbol } from "../../../../components/ui/icon-symbol";
import SubHeader from "../../../components/navbar/SubHeader";
import { useToastStore } from "../../../../store/toastStore";

interface Address {
  id: string;
  type: string;
  street: string;
  division?: string;
  district?: string;
  thana?: string;
  area?: string;
  city?: string;
  state?: string;
  postalCode: string;
  country?: string;
  isDefault: boolean;
}

export default function AddressesScreen() {
  const queryClient = useQueryClient();

  const {
    data: fetchResponse,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["addresses"],
    queryFn: addressApi.getAddresses,
  });

  const addresses: Address[] = fetchResponse?.data || [];

  const { showToast } = useToastStore();
  const deleteMutation = useMutation({
    mutationFn: (id: string) => addressApi.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      showToast({
        message: "Address deleted successfully",
        type: "success",
      });
    },
  });

  const makeDefaultMutation = useMutation({
    mutationFn: (id: string) => addressApi.makeDefault(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      showToast({
        message: "Default address updated",
        type: "success",
      });
    },
  });

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: () => deleteMutation.mutate(id) 
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top", "bottom"]}>
      <SubHeader title="Addresses" showBackButton={true} />
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading || isRefetching}
            onRefresh={refetch}
          />
        }
      >
        {isError ? (
          <View className="flex-1 items-center justify-center p-4">
            <Text className="text-red-500 font-Urbanist-Medium">
              Error loading addresses.
            </Text>
          </View>
        ) : addresses.length === 0 ? (
          <View className="flex-1 items-center justify-center pt-20">
            <Text className="text-gray-500 font-Urbanist-Medium">
              No addresses found. Add one!
            </Text>
          </View>
        ) : (
          addresses.map((address) => (
            <View
              key={address.id}
              className="mb-4 p-4 rounded-xl border border-gray-200 bg-gray-50 flex-row items-center justify-between"
            >
              <View className="flex-1">
                <View className="flex-row items-center mb-2">
                  <View className="bg-black px-2 py-1 rounded-md mr-2">
                    <Text className="text-white text-[10px] font-Urbanist-Bold uppercase tracking-wider">
                      {address.type}
                    </Text>
                  </View>
                  {address.isDefault ? (
                    <View className="bg-green-100 px-2 py-1 rounded-md">
                      <Text className="text-green-800 text-[10px] font-Urbanist-Bold uppercase tracking-wider">
                        Default
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      className={`bg-gray-200 px-2 py-1 rounded-md ${
                        makeDefaultMutation.isPending ? "opacity-50" : ""
                      }`}
                      onPress={() => makeDefaultMutation.mutate(address.id)}
                      disabled={makeDefaultMutation.isPending}
                    >
                      <Text className="text-gray-700 text-[10px] font-Urbanist-Bold uppercase tracking-wider">
                        {makeDefaultMutation.isPending
                          ? "Setting..."
                          : "Make Default"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <Text className="text-black font-Urbanist-Medium text-base mb-1">
                  {address.street}
                </Text>
                <Text className="text-gray-500 font-Urbanist text-sm">
                  {[address.district, address.thana, address.area]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
                <Text className="text-gray-500 font-Urbanist text-sm">
                  {address.postalCode}
                </Text>
                {address.country && (
                  <Text className="text-gray-500 font-Urbanist text-sm">
                    {address.country}
                  </Text>
                )}
              </View>
              <View className="flex-row items-center gap-4 pl-4">
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/profile/addresses/add-address",
                      params: {
                        id: address.id,
                        type: address.type,
                        street: address.street,
                        division: address.division || "",
                        district: address.district || "",
                        thana: address.thana || "",
                        area: address.area || "",
                        state: address.state || "",
                        postalCode: address.postalCode,
                        country: address.country || "",
                        isDefault: address.isDefault.toString(),
                      },
                    })
                  }
                >
                  <IconSymbol name="pencil" size={20} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(address.id)}
                  disabled={deleteMutation.isPending}
                  className={deleteMutation.isPending ? "opacity-50" : ""}
                >
                  <IconSymbol name="trash" size={20} color="#dc2626" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View className="p-4 border-t border-gray-100 pb-24">
        <TouchableOpacity
          className="bg-black p-4 rounded-xl items-center flex-row justify-center py-4"
          onPress={() => router.push("/profile/addresses/add-address")}
        >
          <IconSymbol name="plus" size={20} color="#fff" />
          <Text className="text-white font-Urbanist-Bold text-[16px] ml-2">
            Add New Address
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
