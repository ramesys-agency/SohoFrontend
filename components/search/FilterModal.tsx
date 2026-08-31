import { type SearchFacets } from "@/api/product.api";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

/**
 * The filter sheet is built from the facets the current search returned, so it
 * only ever offers sizes, colours and categories that lead to products. The
 * hard-coded brand and category lists it used to show matched nothing in the
 * catalogue and emptied the results whenever they were applied.
 */

export interface SearchFilters {
  categoryId: string | null;
  gender: string | null;
  sizes: string[];
  /** Colour names, matched against the variant's colour. */
  colors: string[];
  minPrice: number | null;
  maxPrice: number | null;
  inStockOnly: boolean;
}

export const EMPTY_FILTERS: SearchFilters = {
  categoryId: null,
  gender: null,
  sizes: [],
  colors: [],
  minPrice: null,
  maxPrice: null,
  inStockOnly: false,
};

export const countActiveFilters = (filters: SearchFilters): number =>
  (filters.categoryId ? 1 : 0) +
  (filters.gender ? 1 : 0) +
  filters.sizes.length +
  filters.colors.length +
  (filters.minPrice !== null || filters.maxPrice !== null ? 1 : 0) +
  (filters.inStockOnly ? 1 : 0);

interface FilterModalProps {
  visible: boolean;
  /** Undefined until the first search comes back. */
  facets?: SearchFacets;
  filters: SearchFilters;
  onClose: () => void;
  onApply: (filters: SearchFilters) => void;
}

const GENDER_LABELS: Record<string, string> = {
  MEN: "Men",
  WOMEN: "Women",
  KIDS: "Kids",
};

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  facets,
  filters,
  onClose,
  onApply,
}) => {
  // Edited in the sheet and only handed back on Apply, so backing out of a
  // half-made choice leaves the results alone.
  const [draft, setDraft] = useState<SearchFilters>(filters);
  const [minPriceText, setMinPriceText] = useState("");
  const [maxPriceText, setMaxPriceText] = useState("");

  useEffect(() => {
    if (!visible) return;
    setDraft(filters);
    setMinPriceText(filters.minPrice !== null ? String(filters.minPrice) : "");
    setMaxPriceText(filters.maxPrice !== null ? String(filters.maxPrice) : "");
  }, [visible, filters]);

  const toggle = (list: string[], value: string): string[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const parsePrice = (text: string): number | null => {
    const value = Number(text.replace(/[^0-9.]/g, ""));
    return text.trim() && Number.isFinite(value) ? value : null;
  };

  const handleApply = () => {
    onApply({
      ...draft,
      minPrice: parsePrice(minPriceText),
      maxPrice: parsePrice(maxPriceText),
    });
    onClose();
  };

  const handleClear = () => {
    setDraft(EMPTY_FILTERS);
    setMinPriceText("");
    setMaxPriceText("");
    onApply(EMPTY_FILTERS);
  };

  const priceRange = facets?.priceRange;
  const hasAnyFacet =
    Boolean(facets) &&
    (facets!.categories.length > 0 ||
      facets!.colors.length > 0 ||
      facets!.sizes.length > 0 ||
      facets!.genders.length > 0);

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

  const Chip = ({
    label,
    count,
    isSelected,
    onPress,
  }: {
    label: string;
    count?: number;
    isSelected: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`px-5 py-2.5 rounded-xl ${isSelected ? "bg-black" : "bg-gray-100"}`}
    >
      <Text
        className={`text-base ${isSelected ? "text-white" : "text-gray-500"}`}
        style={{ fontFamily: "Urbanist" }}
      >
        {label}
        {count !== undefined ? ` (${count})` : ""}
      </Text>
    </TouchableOpacity>
  );

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
            keyboardShouldPersistTaps="handled"
          >
            {!hasAnyFacet && (
              <Text
                className="text-gray-400 text-base py-6"
                style={{ fontFamily: "Urbanist" }}
              >
                Nothing to filter yet — search for something first.
              </Text>
            )}

            {facets && facets.categories.length > 0 && (
              <Section title="Categories">
                {facets.categories.map((category) => (
                  <Chip
                    key={category.id}
                    label={category.name}
                    count={category.count}
                    isSelected={draft.categoryId === category.id}
                    onPress={() =>
                      setDraft((prev) => ({
                        ...prev,
                        categoryId:
                          prev.categoryId === category.id ? null : category.id,
                      }))
                    }
                  />
                ))}
              </Section>
            )}

            {facets && facets.genders.length > 1 && (
              <Section title="Shop for">
                {facets.genders.map(({ gender, count }) => (
                  <Chip
                    key={gender}
                    label={GENDER_LABELS[gender] ?? gender}
                    count={count}
                    isSelected={draft.gender === gender}
                    onPress={() =>
                      setDraft((prev) => ({
                        ...prev,
                        gender: prev.gender === gender ? null : gender,
                      }))
                    }
                  />
                ))}
              </Section>
            )}

            {facets && facets.sizes.length > 0 && (
              <Section title="Sizes">
                {facets.sizes.map(({ size, count }) => (
                  <Chip
                    key={size}
                    label={size}
                    count={count}
                    isSelected={draft.sizes.includes(size)}
                    onPress={() =>
                      setDraft((prev) => ({ ...prev, sizes: toggle(prev.sizes, size) }))
                    }
                  />
                ))}
              </Section>
            )}

            {facets && facets.colors.length > 0 && (
              <Section title="Colour">
                {facets.colors.map(({ colorName, colorValue }) => {
                  const isSelected = draft.colors.includes(colorName);
                  return (
                    <TouchableOpacity
                      key={`${colorName}-${colorValue}`}
                      onPress={() =>
                        setDraft((prev) => ({
                          ...prev,
                          colors: toggle(prev.colors, colorName),
                        }))
                      }
                      className="items-center w-16"
                    >
                      <View
                        className={`w-10 h-10 rounded-full items-center justify-center ${
                          isSelected ? "border-2 border-black" : ""
                        }`}
                        style={{ padding: 2 }}
                      >
                        <View
                          className="w-full h-full rounded-full border border-gray-200"
                          style={{ backgroundColor: colorValue }}
                        />
                      </View>
                      <Text
                        numberOfLines={1}
                        className="text-[11px] text-gray-500 mt-1"
                        style={{ fontFamily: "Urbanist" }}
                      >
                        {colorName}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </Section>
            )}

            {priceRange && (
              <Section title="Price range">
                <View className="flex-row items-center gap-x-3 w-full">
                  <TextInput
                    className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-base"
                    placeholder={`৳${priceRange.min}`}
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={minPriceText}
                    onChangeText={setMinPriceText}
                    style={{ fontFamily: "Urbanist" }}
                  />
                  <Text className="text-gray-400" style={{ fontFamily: "Urbanist" }}>
                    to
                  </Text>
                  <TextInput
                    className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-base"
                    placeholder={`৳${priceRange.max}`}
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={maxPriceText}
                    onChangeText={setMaxPriceText}
                    style={{ fontFamily: "Urbanist" }}
                  />
                </View>
              </Section>
            )}

            {hasAnyFacet && (
              <Section title="Availability">
                <Chip
                  label="In stock only"
                  isSelected={draft.inStockOnly}
                  onPress={() =>
                    setDraft((prev) => ({ ...prev, inStockOnly: !prev.inStockOnly }))
                  }
                />
              </Section>
            )}

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
