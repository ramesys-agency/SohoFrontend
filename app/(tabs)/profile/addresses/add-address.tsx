import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import { addressApi } from "../../../../api/address.api";
import { logisticsApi } from "../../../../api/logistics.api";
import SubHeader from "../../../components/navbar/SubHeader";
import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";

const addressSchema = z.object({
  type: z.string().min(1, "Address type is required"),
  street: z.string().min(5, "Street address must be at least 5 characters"),
  division: z.string().min(1, "Division is required"),
  district: z.string().min(1, "District is required"),
  thana: z.string().min(1, "Thana is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  isDefault: z.boolean(),

});

type AddressFormData = z.infer<typeof addressSchema>;

interface SelectModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (item: any) => void;
  items: any[];
  title: string;
  loading?: boolean;
}

const SelectModal = ({ visible, onClose, onSelect, items, title, loading }: SelectModalProps) => (
  <Modal visible={visible} animationType="slide" transparent={true}>
    <View className="flex-1 justify-end bg-black/50">
      <View className="bg-white rounded-t-[30px] h-[60%] p-6">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-Urbanist-Bold">{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={24} color="black" />
          </TouchableOpacity>
        </View>
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator color="black" />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => onSelect(item)}
                className="py-4 border-b border-gray-100"
              >
                <Text className="text-[16px] font-Urbanist-Medium text-gray-800">{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  </Modal>
);

export default function AddAddressScreen() {
  const params = useLocalSearchParams();
  const isEditing = !!params.id;
  const queryClient = useQueryClient();

  const [modalType, setModalType] = useState<"division" | "district" | "thana" | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      type: (params.type as string) || "Home",
      street: (params.street as string) || "",
      division: (params.division as string) || "",
      district: (params.district as string) || "",
      thana: (params.thana as string) || "",
      city: (params.city as string) || "",
      state: (params.state as string) || "",
      postalCode: (params.postalCode as string) || "",
      country: (params.country as string) || "Bangladesh",
      isDefault: params.isDefault === "true",
    },
  });

  const selectedDivision = watch("division");
  const selectedDistrict = watch("district");

  // Queries for locations
  const { data: divisions, isLoading: loadingDivisions } = useQuery({
    queryKey: ["divisions"],
    queryFn: () => logisticsApi.getDivisions().then(res => res.data),
  });

  const { data: districts, isLoading: loadingDistricts } = useQuery({
    queryKey: ["districts", selectedDivision],
    queryFn: () => {
      const div = divisions?.find((d: any) => d.name === selectedDivision);
      return logisticsApi.getDistricts(div?.id).then(res => res.data);
    },
    enabled: !!selectedDivision && !!divisions,
  });

  const { data: thanas, isLoading: loadingThanas } = useQuery({
    queryKey: ["thanas", selectedDistrict],
    queryFn: () => {
      const dist = districts?.find((d: any) => d.name === selectedDistrict);
      return logisticsApi.getThanas(dist?.id).then(res => res.data);
    },
    enabled: !!selectedDistrict && !!districts,
  });

  const mutation = useMutation({
    mutationFn: (data: AddressFormData) =>
      isEditing
        ? addressApi.updateAddress({ id: params.id as string, data })
        : addressApi.createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      router.back();
    },
    onError: (error) => {
      console.error("Failed to save address:", error);
    },
  });

  const onSubmit = (data: AddressFormData) => {
    mutation.mutate(data);
  };

  const renderSelectField = (label: string, value: string, type: any, placeholder: string) => (
    <View className="mb-4">
      <Text className="text-gray-700 font-Urbanist-Medium text-[15px] mb-2">{label}</Text>
      <TouchableOpacity
        onPress={() => setModalType(type)}
        className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex-row justify-between items-center"
      >
        <Text className={`font-Urbanist text-[15px] ${value ? "text-black" : "text-gray-400"}`}>
          {value || placeholder}
        </Text>
        <Feather name="chevron-down" size={18} color="#9ca3af" />
      </TouchableOpacity>
      {errors[type as keyof AddressFormData] && (
        <Text className="text-red-500 font-Urbanist text-[13px] mt-1">
          {errors[type as keyof AddressFormData]?.message as string}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader title={isEditing ? "Edit Address" : "Add New Address"} showBackButton={true} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
          {/* Address Type */}
          <View className="mb-4">
            <Text className="text-gray-700 font-Urbanist-Medium text-[15px] mb-2">Address Type</Text>
            <Controller
              control={control}
              name="type"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row gap-3">
                  {["Home", "Work", "Other"].map((t) => (
                    <TouchableOpacity
                      key={t}
                      onPress={() => onChange(t)}
                      className={`px-5 py-2.5 rounded-xl border ${
                        value === t ? "bg-black border-black" : "bg-white border-gray-300"
                      }`}
                    >
                      <Text
                        className={`font-Urbanist-Medium text-[14px] ${
                          value === t ? "text-white" : "text-black"
                        }`}
                      >
                        {t}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
          </View>

          {/* Street Address */}
          <View className="mb-4">
            <Text className="text-gray-700 font-Urbanist-Medium text-[15px] mb-2">Street Address</Text>
            <Controller
              control={control}
              name="street"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`bg-gray-50 border ${
                    errors.street ? "border-red-500" : "border-gray-200"
                  } rounded-xl p-4 font-Urbanist text-[15px] text-black`}
                  placeholder="123 Main St, Apt 4B"
                  placeholderTextColor="#9ca3af"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.street && (
              <Text className="text-red-500 font-Urbanist text-[13px] mt-1">{errors.street.message}</Text>
            )}
          </View>

          {/* Hierarchical Selection */}
          {renderSelectField("Division", watch("division"), "division", "Select Division")}
          {renderSelectField("District", watch("district"), "district", "Select District")}
          {renderSelectField("Thana", watch("thana"), "thana", "Select Thana")}

          {/* City and State */}
          <View className="flex-row gap-4 mb-4">
            <View className="flex-1">
              <Text className="text-gray-700 font-Urbanist-Medium text-[15px] mb-2">City</Text>
              <Controller
                control={control}
                name="city"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`bg-gray-50 border ${
                      errors.city ? "border-red-500" : "border-gray-200"
                    } rounded-xl p-4 font-Urbanist text-[15px] text-black`}
                    placeholder="New York"
                    placeholderTextColor="#9ca3af"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
            </View>
            <View className="flex-1">
              <Text className="text-gray-700 font-Urbanist-Medium text-[15px] mb-2">Postal Code</Text>
              <Controller
                control={control}
                name="postalCode"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`bg-gray-50 border ${
                      errors.postalCode ? "border-red-500" : "border-gray-200"
                    } rounded-xl p-4 font-Urbanist text-[15px] text-black`}
                    placeholder="10001"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
            </View>
          </View>

          <View className="flex-row items-center justify-between mt-2 mb-10 p-5 bg-gray-50 rounded-xl border border-gray-200">
            <Text className="text-black font-Urbanist-Medium text-[15px]">Set as default address</Text>
            <Controller
              control={control}
              name="isDefault"
              render={({ field: { onChange, value } }) => (
                <Switch
                  trackColor={{ false: "#d1d5db", true: "#000" }}
                  thumbColor={value ? "#fff" : "#f3f4f6"}
                  ios_backgroundColor="#d1d5db"
                  onValueChange={onChange}
                  value={value}
                />
              )}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modals for Selection */}
      <SelectModal
        visible={modalType === "division"}
        onClose={() => setModalType(null)}
        title="Select Division"
        items={divisions || []}
        loading={loadingDivisions}
        onSelect={(item) => {
          setValue("division", item.name);
          setValue("district", "");
          setValue("thana", "");
          setModalType(null);
        }}
      />
      <SelectModal
        visible={modalType === "district"}
        onClose={() => setModalType(null)}
        title="Select District"
        items={districts || []}
        loading={loadingDistricts}
        onSelect={(item) => {
          setValue("district", item.name);
          setValue("thana", "");
          setModalType(null);
        }}
      />
      <SelectModal
        visible={modalType === "thana"}
        onClose={() => setModalType(null)}
        title="Select Thana"
        items={thanas || []}
        loading={loadingThanas}
        onSelect={(item) => {
          setValue("thana", item.name);
          setModalType(null);
        }}
      />

      <View className="p-4 border-t border-gray-100 pb-32">
        <TouchableOpacity
          className={`bg-black p-4 py-4 rounded-xl items-center justify-center ${
            mutation.isPending ? "opacity-70" : ""
          }`}
          onPress={handleSubmit(onSubmit)}
          disabled={mutation.isPending}
        >
          <Text className="text-white font-Urbanist-Bold text-[16px]">
            {mutation.isPending ? "Saving..." : isEditing ? "Update Address" : "Save Address"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

