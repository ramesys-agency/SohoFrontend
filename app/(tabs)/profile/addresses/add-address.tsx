import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
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
import SubHeader from "../../../components/navbar/SubHeader";

const addressSchema = z.object({
  type: z.string().min(1, "Address type is required"),
  street: z.string().min(5, "Street address must be at least 5 characters"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  isDefault: z.boolean().default(false),
});

type AddressFormData = z.infer<typeof addressSchema>;

export default function AddAddressScreen() {
  const params = useLocalSearchParams();
  const isEditing = !!params.id;
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      type: (params.type as string) || "Home",
      street: (params.street as string) || "",
      city: (params.city as string) || "",
      state: (params.state as string) || "",
      postalCode: (params.postalCode as string) || "",
      country: (params.country as string) || "",
      isDefault: params.isDefault === "true",
    },
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
          {/* Address Type */}
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
            {errors.type && (
              <Text className="text-red-500 font-Urbanist text-[13px] mt-1">
                {errors.type.message}
              </Text>
            )}
          </View>

          {/* Street Address */}
          <View className="mb-4">
            <Text className="text-gray-700 font-Urbanist-Medium text-[15px] mb-2">
              Street Address
            </Text>
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
              <Text className="text-red-500 font-Urbanist text-[13px] mt-1">
                {errors.street.message}
              </Text>
            )}
          </View>

          {/* City and State */}
          <View className="flex-row gap-4 mb-4">
            <View className="flex-1">
              <Text className="text-gray-700 font-Urbanist-Medium text-[15px] mb-2">
                City
              </Text>
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
              {errors.city && (
                <Text className="text-red-500 font-Urbanist text-[13px] mt-1">
                  {errors.city.message}
                </Text>
              )}
            </View>
            <View className="flex-1">
              <Text className="text-gray-700 font-Urbanist-Medium text-[15px] mb-2">
                State
              </Text>
              <Controller
                control={control}
                name="state"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`bg-gray-50 border ${
                      errors.state ? "border-red-500" : "border-gray-200"
                    } rounded-xl p-4 font-Urbanist text-[15px] text-black`}
                    placeholder="NY"
                    placeholderTextColor="#9ca3af"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.state && (
                <Text className="text-red-500 font-Urbanist text-[13px] mt-1">
                  {errors.state.message}
                </Text>
              )}
            </View>
          </View>

          {/* Postal Code and Country */}
          <View className="flex-row gap-4 mb-4">
            <View className="flex-1">
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
                    placeholder="10001"
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
            <View className="flex-1">
              <Text className="text-gray-700 font-Urbanist-Medium text-[15px] mb-2">
                Country
              </Text>
              <Controller
                control={control}
                name="country"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`bg-gray-50 border ${
                      errors.country ? "border-red-500" : "border-gray-200"
                    } rounded-xl p-4 font-Urbanist text-[15px] text-black`}
                    placeholder="USA"
                    placeholderTextColor="#9ca3af"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.country && (
                <Text className="text-red-500 font-Urbanist text-[13px] mt-1">
                  {errors.country.message}
                </Text>
              )}
            </View>
          </View>

          {/* Set as Default Switch */}
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

      {/* Submit Button */}
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
