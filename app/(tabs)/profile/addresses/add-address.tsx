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
import { useToastStore } from "../../../../store/toastStore";

// Updated Schema with Area and without City
const addressSchema = z.object({
  type: z.string().min(1, "Address type is required"),
  street: z.string().min(5, "Address details (House/Road) are required"),
  division: z.string().min(1, "Division is required"),
  district: z.string().min(1, "District is required"),
  thana: z.string().min(1, "Thana is required"),
  area: z.string().optional(),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  isDefault: z.boolean(),
  state: z.string().optional(),
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

const SelectModal = ({
  visible,
  onClose,
  onSelect,
  items,
  title,
  loading,
}: SelectModalProps) => (
  <Modal visible={visible} animationType="slide" transparent={true}>
    <View className="flex-1 justify-end bg-black/50">
      <View className="bg-white rounded-t-[30px] h-[60%] p-6">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-Urbanist-Bold">{title}</Text>
          <TouchableOpacity onPress={onClose} hitSlop={10}>
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
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
                className="py-4 border-b border-gray-100"
              >
                <Text className="text-[16px] font-Urbanist-Medium text-gray-800">
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
            {!loading && items.length === 0 && (
              <View className="py-20 items-center">
                <Text className="text-gray-400 font-Urbanist">
                  No results found
                </Text>
              </View>
            )}
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
  const { showToast } = useToastStore();

  const [modalType, setModalType] = useState<
    "division" | "district" | "thana" | "area" | null
  >(null);

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
      area: (params.area as string) || "",
      postalCode: (params.postalCode as string) || "",
      country: (params.country as string) || "Bangladesh",
      state: (params.state as string) || "Not Specified",
      isDefault: params.isDefault === "true",
    },
  });

  const selectedDivision = watch("division");
  const selectedDistrict = watch("district");
  const selectedThana = watch("thana");

  // Queries for hierarchical data
  const { data: divisions, isLoading: loadingDivisions } = useQuery({
    queryKey: ["divisions"],
    queryFn: () => logisticsApi.getDivisions().then((res) => res.data),
  });

  const { data: districts, isLoading: loadingDistricts } = useQuery({
    queryKey: ["districts", selectedDivision],
    queryFn: () => {
      const div = divisions?.find((d: any) => d.name === selectedDivision);
      return logisticsApi.getDistricts(div?.id).then((res) => res.data);
    },
    enabled: !!selectedDivision && !!divisions,
  });

  const { data: thanas, isLoading: loadingThanas } = useQuery({
    queryKey: ["thanas", selectedDistrict],
    queryFn: () => {
      const dist = districts?.find((d: any) => d.name === selectedDistrict);
      return logisticsApi.getThanas(dist?.id).then((res) => res.data);
    },
    enabled: !!selectedDistrict && !!districts,
  });

  const { data: areas, isLoading: loadingAreas } = useQuery({
    queryKey: ["areas", selectedThana],
    queryFn: () => {
      const thana = thanas?.find((t: any) => t.name === selectedThana);
      return logisticsApi.getAreas(thana?.id).then((res) => res.data);
    },
    enabled: !!selectedThana && !!thanas,
  });

  const mutation = useMutation({
    mutationFn: (data: AddressFormData) =>
      isEditing
        ? addressApi.updateAddress({ id: params.id as string, data })
        : addressApi.createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      showToast({
        message: isEditing ? "Address updated successfully" : "Address added successfully",
        type: "success",
      });
      router.back();
    },
    onError: (error) => {
      console.error("Failed to save address:", error);
      showToast({
        message: "Failed to save address. Please try again.",
        type: "error",
      });
    },
  });

  const onSubmit = (data: AddressFormData) => {
    mutation.mutate(data);
  };

  const renderSelectField = (
    label: string,
    fieldName: keyof AddressFormData,
    placeholder: string,
    disabled: boolean = false,
  ) => {
    const value = watch(fieldName) as string;
    return (
      <View className={`mb-4 ${disabled ? "opacity-40" : ""}`}>
        <Text className="text-gray-700 font-Urbanist-Medium text-[15px] mb-2">
          {label}
        </Text>
        <TouchableOpacity
          onPress={() => !disabled && setModalType(fieldName as any)}
          disabled={disabled}
          className={`bg-gray-50 border ${errors[fieldName] ? "border-red-500" : "border-gray-200"} rounded-xl p-4 flex-row justify-between items-center`}
        >
          <Text
            className={`font-Urbanist text-[15px] ${value ? "text-black" : "text-gray-400"}`}
          >
            {value || placeholder}
          </Text>
          <Feather name="chevron-down" size={18} color="#9ca3af" />
        </TouchableOpacity>
        {errors[fieldName] && !disabled && (
          <Text className="text-red-500 font-Urbanist text-[13px] mt-1">
            {errors[fieldName]?.message}
          </Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader
        title={isEditing ? "Edit Address" : "Add New Address"}
        showBackButton={true}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-4 pt-4"
          showsVerticalScrollIndicator={false}
        >
          {/* Address Type Selection */}
          <View className="mb-4">
            <Text className="text-gray-700 font-Urbanist-Medium text-[15px] mb-2">
              Address Type
            </Text>
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
                        value === t
                          ? "bg-black border-black"
                          : "bg-white border-gray-300"
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

          {/* Street Address Details */}
          <View className="mb-4">
            <Text className="text-gray-700 font-Urbanist-Medium text-[15px] mb-2">
              Address
            </Text>
            <Controller
              control={control}
              name="street"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`bg-gray-50 border ${
                    errors.street ? "border-red-500" : "border-gray-200"
                  } rounded-xl p-4 font-Urbanist text-[15px] text-black h-24`}
                  placeholder="123 Main St, Apt 4B"
                  placeholderTextColor="#9ca3af"
                  multiline
                  textAlignVertical="top"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.street && (
              <Text className="text-red-500 font-Urbanist text-[13px] mt-1">
                {errors.street.message}
              </Text>
            )}
          </View>

          {/* Location Hierarchy */}
          {renderSelectField("Division", "division", "Select Division")}
          {renderSelectField(
            "District",
            "district",
            "Select District",
            !selectedDivision,
          )}
          {renderSelectField(
            "Thana",
            "thana",
            "Select Thana",
            !selectedDistrict,
          )}
          {renderSelectField("Area", "area", "Select Area", !selectedThana)}

          {/* Postal Code Field */}
          <View className="mb-4">
            <Text className="text-gray-700 font-Urbanist-Medium text-[15px] mb-2">
              Postal Code
            </Text>
            <Controller
              control={control}
              name="postalCode"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className={`bg-gray-50 border ${
                    errors.postalCode ? "border-red-500" : "border-gray-200"
                  } rounded-xl p-4 font-Urbanist text-[15px] text-black`}
                  placeholder="Postal Code"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.postalCode && (
              <Text className="text-red-500 font-Urbanist text-[13px] mt-1">
                {errors.postalCode.message}
              </Text>
            )}
          </View>

          {/* Default Address Switch */}
          <View className="flex-row items-center justify-between mt-2 mb-10 p-5 bg-gray-50 rounded-xl border border-gray-200">
            <Text className="text-black font-Urbanist-Medium text-[15px]">
              Set as default address
            </Text>
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

      {/* Modals */}
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
          setValue("area", "");
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
          setValue("area", "");
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
          setValue("area", "");
        }}
      />
      <SelectModal
        visible={modalType === "area"}
        onClose={() => setModalType(null)}
        title="Select Area"
        items={areas || []}
        loading={loadingAreas}
        onSelect={(item) => {
          setValue("area", item.name);
        }}
      />

      {/* Action Button */}
      <View className="p-4 border-t border-gray-100 pb-32">
        <TouchableOpacity
          className={`bg-black p-4 py-4 rounded-xl items-center justify-center ${
            mutation.isPending ? "opacity-70" : ""
          }`}
          onPress={handleSubmit(onSubmit)}
          disabled={mutation.isPending}
        >
          <Text className="text-white font-Urbanist-Bold text-[16px]">
            {mutation.isPending
              ? "Saving..."
              : isEditing
                ? "Update Address"
                : "Save Address"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
