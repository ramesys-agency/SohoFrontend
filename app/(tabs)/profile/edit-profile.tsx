import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { z } from "zod";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { userApi } from "../../../api/user.api";
import { useAuthStore } from "../../../store/authStore";
import { useToastStore } from "../../../store/toastStore";
import { IconSymbol } from "../../../components/ui/icon-symbol";
import SubHeader from "@/components/navbar/SubHeader";

const profileSchema = z.object({
  fullName: z.string().min(1, "Name is required"),
  phone: z.string().optional(),
  gender: z.string().optional(),
  age: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function EditProfileScreen() {
  const queryClient = useQueryClient();
  const { updateUser, logout } = useAuthStore();
  const { showToast } = useToastStore();
  const [savingField, setSavingField] = useState<keyof ProfileFormData | null>(
    null,
  );
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const {
    data: profileData,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: userApi.getProfile,
  });

  const {
    control,
    trigger,
    getValues,
    reset,
    formState: { errors, dirtyFields },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      gender: "",
      age: "",
    },
  });

  useEffect(() => {
    if (profileData) {
      reset({
        fullName: profileData.fullName || "",
        phone: profileData.phone || "",
        gender: profileData.gender || "",
        age: profileData.age ? String(profileData.age) : "",
      });
    }
  }, [profileData, reset]);

  const mutation = useMutation({
    mutationFn: (data: Partial<ProfileFormData>) => userApi.updateProfile(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      // Update global auth state
      if (data) {
        updateUser({
          name: data.fullName,
          avatar: data.avatar,
        });
        showToast({
          message: "Profile updated successfully",
          type: "success",
        });
      }
      // Reset the form with current values so dirty status clears
      reset(getValues());
      setSavingField(null);
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
      showToast({
        message: "Failed to update profile",
        type: "error",
      });
      setSavingField(null);
    },
  });

  const handleInlineSave = async (field: keyof ProfileFormData) => {
    const isValid = await trigger(field);
    if (isValid) {
      setSavingField(field);
      const value = getValues(field);

      let payloadValue: any = value;
      if (field === "age" && typeof value === "string") {
        payloadValue = value ? parseInt(value, 10) : null;
      }

      mutation.mutate({ [field]: payloadValue } as Partial<ProfileFormData>);
    }
  };

  const isSaving = (field: keyof ProfileFormData) => savingField === field;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleUploadAvatar = async () => {
    if (!selectedImage) return;

    try {
      setIsUploading(true);
      const filename = selectedImage.split("/").pop();
      const match = /\.(\w+)$/.exec(filename || "");
      const type = match ? `image/${match[1]}` : `image`;

      const formData = new FormData();
      formData.append("avatar", {
        uri: selectedImage,
        name: filename,
        type,
      } as any);

      const result = await userApi.updateAvatar(formData);
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });

      // Update global auth state
      if (result?.avatar) {
        updateUser({ avatar: result.avatar });
      }

      showToast({
        message: "Avatar updated successfully",
        type: "success",
      });

      setSelectedImage(null);
    } catch (error) {
      console.error("Upload failed", error);
      showToast({
        message: "Failed to update avatar",
        type: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const deleteAccount = async () => {
    try {
      setIsDeletingAccount(true);
      await userApi.deleteAccount();

      // Order matters: drop the tokens and leave the screen first, then empty
      // the cache. Clearing while this screen is still mounted would refire the
      // profile query against an account that no longer exists.
      await logout();
      router.replace("/(auth)/login");
      queryClient.clear();

      showToast({
        message: "Your account has been deleted",
        type: "success",
      });
    } catch (error: any) {
      console.error("Failed to delete account:", error);
      showToast({
        message:
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Could not delete your account. Please try again.",
        type: "error",
      });
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleDeleteAccount = () => {
    if (isDeletingAccount) return;

    Alert.alert(
      "Delete account?",
      "This permanently deletes your profile, cart, wishlist, saved addresses and reviews. Orders you have already placed are kept as sales records and any parcel on its way will still be delivered. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete account",
          style: "destructive",
          onPress: deleteAccount,
        },
      ],
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
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <SubHeader
        title="Edit Profile"
        showBackButton
        hideSearch
        hideNotification
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={
            <RefreshControl
              refreshing={isLoading || isRefetching}
              onRefresh={refetch}
            />
          }
        >
          {/* Profile Image */}
          <View className="items-center justify-center mt-6 mb-10">
            <View className="relative">
              {selectedImage || profileData?.avatar ? (
                <Image
                  source={{ uri: selectedImage || profileData.avatar }}
                  className="w-28 h-28 rounded-xl"
                />
              ) : (
                <View className="w-28 h-28 rounded-xl bg-gray-200 items-center justify-center">
                  <IconSymbol name="person.fill" size={50} color="#9CA3AF" />
                </View>
              )}
              <TouchableOpacity
                onPress={pickImage}
                className="absolute inset-0 bg-black/30 rounded-xl items-center justify-center"
              >
                <IconSymbol name="pencil" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* The picker crops to a square, so the only thing worth saying is
                how much detail survives that crop. */}
            <Text className="text-gray-400 text-[11px] font-Urbanist mt-3">
              Square photo, at least 400 × 400 px
            </Text>

            {selectedImage && (
              <TouchableOpacity
                onPress={handleUploadAvatar}
                disabled={isUploading}
                className="mt-4 bg-black px-6 py-2 rounded-full h-10 items-center justify-center min-w-[120px]"
              >
                {isUploading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text className="text-white font-Urbanist-Bold">
                    Save Avatar
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Form Items */}
          <View className="flex-col gap-4">
            {/* Name */}
            <View>
              <Text className="text-gray-700 font-Urbanist-Medium text-[15px] mb-2">
                Name
              </Text>
              <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    className={`bg-[#F3F3F3] border ${errors.fullName ? "border-red-500" : "border-transparent"} rounded-lg flex-row items-center px-4 h-14`}
                  >
                    <IconSymbol name="person" size={20} color="#6b7280" />
                    <TextInput
                      className="flex-1 mx-3 font-Urbanist-Regular text-base text-black h-full"
                      placeholder="Your Name"
                      placeholderTextColor="#9ca3af"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                    {dirtyFields.fullName && (
                      <TouchableOpacity
                        onPress={() => handleInlineSave("fullName")}
                        disabled={isSaving("fullName")}
                        className="py-1 px-2"
                      >
                        {isSaving("fullName") ? (
                          <ActivityIndicator size="small" color="#000" />
                        ) : (
                          <Text className="text-black font-Urbanist-Bold">
                            Save
                          </Text>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              />
              {errors.fullName && (
                <Text className="text-red-500 font-Urbanist text-[13px] mt-1">
                  {errors.fullName.message}
                </Text>
              )}
            </View>

            {/* Phone Number */}
            <View>
              <Text className="text-gray-700 font-Urbanist-Medium text-[15px] mb-2">
                Phone Number
              </Text>
              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    className={`bg-[#F3F3F3] border border-transparent rounded-lg flex-row items-center px-4 h-14`}
                  >
                    <IconSymbol name="phone" size={20} color="#6b7280" />
                    <TextInput
                      className="flex-1 mx-3 font-Urbanist-Regular text-base text-black h-full"
                      placeholder="Phone Number"
                      placeholderTextColor="#9ca3af"
                      keyboardType="phone-pad"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                    {dirtyFields.phone && (
                      <TouchableOpacity
                        onPress={() => handleInlineSave("phone")}
                        disabled={isSaving("phone")}
                        className="py-1 px-2"
                      >
                        {isSaving("phone") ? (
                          <ActivityIndicator size="small" color="#000" />
                        ) : (
                          <Text className="text-black font-Urbanist-Bold">
                            Save
                          </Text>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              />
            </View>

            {/* Gender */}
            <View className="z-10">
              <Text className="text-gray-700 font-Urbanist-Medium text-[15px] mb-2">
                Gender
              </Text>
              <Controller
                control={control}
                name="gender"
                render={({ field: { onChange, value } }) => (
                  <View>
                    <TouchableOpacity
                      onPress={() =>
                        setIsGenderDropdownOpen(!isGenderDropdownOpen)
                      }
                      activeOpacity={0.7}
                      className={`bg-[#F3F3F3] border border-transparent rounded-lg flex-row items-center px-4 h-14`}
                    >
                      <IconSymbol name="person.2" size={20} color="#6b7280" />
                      <Text
                        className={`flex-1 mx-3 font-Urbanist-Regular text-base ${
                          value ? "text-black" : "text-[#9ca3af]"
                        }`}
                      >
                        {value || "Gender"}
                      </Text>
                      <View className="mr-2">
                        <IconSymbol
                          name={
                            isGenderDropdownOpen
                              ? "chevron.up"
                              : ("chevron.down" as any)
                          }
                          size={16}
                          color="#6b7280"
                        />
                      </View>
                      {dirtyFields.gender && (
                        <TouchableOpacity
                          onPress={() => {
                            setIsGenderDropdownOpen(false);
                            handleInlineSave("gender");
                          }}
                          disabled={isSaving("gender")}
                          className="py-1 pl-2 border-l border-gray-300"
                        >
                          {isSaving("gender") ? (
                            <ActivityIndicator size="small" color="#000" />
                          ) : (
                            <Text className="text-black font-Urbanist-Bold">
                              Save
                            </Text>
                          )}
                        </TouchableOpacity>
                      )}
                    </TouchableOpacity>

                    {isGenderDropdownOpen && (
                      <View className="bg-white border border-gray-100 rounded-lg mt-1 shadow-sm overflow-hidden z-20 absolute top-[60px] w-full">
                        {["MALE", "FEMALE", "Other"].map(
                          (option, index, arr) => (
                            <TouchableOpacity
                              key={option}
                              onPress={() => {
                                onChange(option);
                                setIsGenderDropdownOpen(false);
                              }}
                              className={`px-4 py-3 bg-white ${
                                index !== arr.length - 1
                                  ? "border-b border-gray-100"
                                  : ""
                              }`}
                            >
                              <Text
                                className={`font-Urbanist-Regular text-base ${
                                  value === option
                                    ? "text-black font-Urbanist-Bold"
                                    : "text-gray-600"
                                }`}
                              >
                                {option}
                              </Text>
                            </TouchableOpacity>
                          ),
                        )}
                      </View>
                    )}
                  </View>
                )}
              />
            </View>

            {/* Age */}
            <View>
              <Text className="text-gray-700 font-Urbanist-Medium text-[15px] mb-2">
                Age
              </Text>
              <Controller
                control={control}
                name="age"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View
                    className={`bg-[#F3F3F3] border border-transparent rounded-lg flex-row items-center px-4 h-14`}
                  >
                    <IconSymbol name="figure.stand" size={20} color="#6b7280" />
                    <TextInput
                      className="flex-1 mx-3 font-Urbanist-Regular text-base text-black h-full"
                      placeholder="Age"
                      placeholderTextColor="#9ca3af"
                      keyboardType="numeric"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                    {dirtyFields.age && (
                      <TouchableOpacity
                        onPress={() => handleInlineSave("age")}
                        disabled={isSaving("age")}
                        className="py-1 px-2"
                      >
                        {isSaving("age") ? (
                          <ActivityIndicator size="small" color="#000" />
                        ) : (
                          <Text className="text-black font-Urbanist-Bold">
                            Save
                          </Text>
                        )}
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              />
            </View>

            <TouchableOpacity
              onPress={() => {}}
              className="mt-2 bg-[#F3F3F3] h-14 px-4 rounded-lg flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3">
                <IconSymbol name="square.and.pencil" size={20} color="#000" />
                <Text className="text-black font-Urbanist-Regular text-base">
                  Change password
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color="#000" />
            </TouchableOpacity>

            {/* <TouchableOpacity
              onPress={() => {}}
              className="bg-[#F3F3F3] h-14 px-4 rounded-lg flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3">
                <IconSymbol name="envelope" size={20} color="#000" />
                <Text className="text-black font-Urbanist-Regular text-base">
                  Change Email
                </Text>
              </View>
              <IconSymbol name="chevron.right" size={16} color="#000" />
            </TouchableOpacity> */}
          </View>

          {/* Delete Account */}
          <TouchableOpacity
            onPress={handleDeleteAccount}
            disabled={isDeletingAccount}
            className={`mt-12 items-center mb-6 ${isDeletingAccount ? "opacity-50" : ""}`}
          >
            <View className="flex-row items-center gap-2">
              {isDeletingAccount ? (
                <ActivityIndicator size="small" color="#dc2626" />
              ) : (
                <IconSymbol name="trash" size={20} color="#dc2626" />
              )}
              <Text className="text-red-600 font-Urbanist-Bold text-base">
                {isDeletingAccount ? "Deleting account…" : "Delete account"}
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
