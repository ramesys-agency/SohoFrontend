import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
}) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(
    null,
  );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const sizes = ["XS", "S", "M", "L", "XL"];
  const colors = ["#000000", "#1E88E5", "#F44336", "#FFB300", "#791F1F"];
  const priceRanges = ["0 - 20,000", "20,000 - 40,000", "Custom"];
  const brands = ["Gucci", "Fendi", "Adidas", "Custom"];
  const categories = ["Bags", "Shoes", "Clothes", "Custom"];

  const handleApply = () => {
    onApply({
      size: selectedSize,
      color: selectedColor,
      priceRange: selectedPriceRange,
      brand: selectedBrand,
      category: selectedCategory,
    });
    onClose();
  };

  const handleClear = () => {
    setSelectedSize(null);
    setSelectedColor(null);
    setSelectedPriceRange(null);
    setSelectedBrand(null);
    setSelectedCategory(null);
    onApply(null);
  };

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <View className="mb-6">
      <Text className="text-xl mb-4" style={{ fontFamily: "Urbanist-Medium" }}>
        {title}
      </Text>
      <View className="flex-row flex-wrap gap-3">{children}</View>
    </View>
  );

  const FilterItem = ({
    label,
    isSelected,
    onPress,
    isCircle = false,
    color,
  }: {
    label?: string;
    isSelected: boolean;
    onPress: () => void;
    isCircle?: boolean;
    color?: string;
  }) => {
    if (isCircle) {
      return (
        <TouchableOpacity
          onPress={onPress}
          className={`w-10 h-10 rounded-full items-center justify-center ${
            isSelected ? "border-2 border-black" : ""
          }`}
          style={{ padding: 2 }}
        >
          <View
            className="w-full h-full rounded-full"
            style={{ backgroundColor: color }}
          />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        onPress={onPress}
        className={`px-5 py-2.5 rounded-xl ${
          isSelected ? "bg-black" : "bg-gray-100"
        }`}
      >
        <Text
          className={`text-base ${isSelected ? "text-white" : "text-gray-500"}`}
          style={{ fontFamily: "Urbanist" }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View className="flex-1 justify-end">
        {/* Backdrop */}
        <TouchableOpacity
          activeOpacity={1}
          className="absolute inset-0 bg-black/40"
          onPress={onClose}
        />

        {/* Drawer Content */}
        <View className="bg-white rounded-t-3xl h-[85%] pb-8 shadow-xl">
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-6 border-b border-gray-100">
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={onClose}
                className="w-10 h-10 items-center justify-center bg-gray-100 rounded-full mr-4"
              >
                <Feather name="chevron-left" size={24} color="black" />
              </TouchableOpacity>
              <Text className="text-4xl" style={{ fontFamily: "Classyvogue" }}>
                Filter By
              </Text>
            </View>
          </View>

          <ScrollView
            className="flex-1 px-4 pt-4"
            showsVerticalScrollIndicator={false}
          >
            <Section title="Sizes">
              {sizes.map((size) => (
                <FilterItem
                  key={size}
                  label={size}
                  isSelected={selectedSize === size}
                  onPress={() => setSelectedSize(size)}
                />
              ))}
            </Section>

            <Section title="Colour">
              {colors.map((color) => (
                <FilterItem
                  key={color}
                  isCircle
                  color={color}
                  isSelected={selectedColor === color}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </Section>

            <Section title="Price range">
              {priceRanges.map((range) => (
                <FilterItem
                  key={range}
                  label={range}
                  isSelected={selectedPriceRange === range}
                  onPress={() => setSelectedPriceRange(range)}
                />
              ))}
            </Section>

            <Section title="Brands">
              {brands.map((brand) => (
                <FilterItem
                  key={brand}
                  label={brand}
                  isSelected={selectedBrand === brand}
                  onPress={() => setSelectedBrand(brand)}
                />
              ))}
            </Section>

            <Section title="Categories">
              {categories.map((cat) => (
                <FilterItem
                  key={cat}
                  label={cat}
                  isSelected={selectedCategory === cat}
                  onPress={() => setSelectedCategory(cat)}
                />
              ))}
            </Section>

            <View className="flex flex-row justify-evenly mt-8 mb-10 gap-x-4">
              <TouchableOpacity
                onPress={handleApply}
                className="w-[45%] bg-black py-4 rounded-xl items-center"
                activeOpacity={0.8}
              >
                <Text
                  className="text-white text-xl"
                  style={{ fontFamily: "Urbanist-SemiBold" }}
                >
                  Apply Filter
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleClear}
                className="w-[45%] bg-gray-100 py-4 rounded-xl items-center"
                activeOpacity={0.8}
              >
                <Text
                  className="text-black text-xl"
                  style={{ fontFamily: "Urbanist-SemiBold" }}
                >
                  Clear Filter
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;
