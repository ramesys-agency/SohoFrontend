import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

export interface Review {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  date: string;
  comment?: string;
  images?: string[];
  likes?: number;
  sizeBought?: string;
}

export interface RatingBreakdown {
  average: number;
  totalCount: number;
  counts: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

interface ReviewListProps {
  reviews: Review[];
  ratingBreakdown: RatingBreakdown;
}

export default function ReviewList({
  reviews,
  ratingBreakdown,
}: ReviewListProps) {
  const totalReviews = ratingBreakdown.totalCount;

  return (
    <View className="mt-4">
      {/* 1. Rating Summary Section */}
      <View className="flex-row items-center justify-between mb-8">
        <View className="items-center mr-6">
          <View className="flex-row items-center">
            <Text
              className="text-5xl font-bold mr-2 text-black"
              style={{ fontFamily: "UrbanistBold" }}
            >
              {ratingBreakdown.average}
            </Text>
            <AntDesign name="star" size={28} color="#FFD700" />
          </View>
          <Text
            className="text-gray-400 text-sm mt-1"
            style={{ fontFamily: "Urbanist" }}
          >
            {totalReviews} verified buyers
          </Text>
        </View>

        <View className="flex-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const count =
              ratingBreakdown.counts[
                star as keyof typeof ratingBreakdown.counts
              ] || 0;
            const percentage =
              totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <View key={star} className="flex-row items-center mb-1">
                <Text
                  className="text-black font-semibold w-3 mr-2 text-xs"
                  style={{ fontFamily: "UrbanistBold" }}
                >
                  {star}
                </Text>
                <AntDesign
                  name="star"
                  size={12}
                  color="#FFD700"
                  className="mr-2"
                />
                <View className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: star > 2 ? "#4ADE80" : "#D4A596",
                    }}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* 2. Reviews List */}
      {reviews.map((review) => (
        <View key={review.id} className="border-t border-gray-100 py-6">
          {/* Header: User Info & Rating */}
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-row items-center">
              {review.user.avatar ? (
                <Image
                  source={{ uri: review.user.avatar }}
                  className="w-10 h-10 rounded-full mr-3"
                />
              ) : (
                <View className="w-10 h-10 rounded-full mr-3 bg-gray-200 items-center justify-center">
                  <AntDesign name="user" size={20} color="gray" />
                </View>
              )}
              <View>
                <Text
                  className="text-sm text-black font-semibold mb-1"
                  style={{ fontFamily: "UrbanistBold" }}
                >
                  {review.user.name}
                </Text>

                <View className="flex-row items-center">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <AntDesign
                      key={i}
                      name="star"
                      size={12}
                      color={i <= review.rating ? "#FFD700" : "#E5E7EB"}
                    />
                  ))}
                  {review.sizeBought && (
                    <Text
                      className="text-xs text-gray-500 ml-2"
                      style={{ fontFamily: "Urbanist" }}
                    >
                      Size: {review.sizeBought}
                    </Text>
                  )}
                </View>
              </View>
            </View>
            <Text
              className="text-xs text-gray-400"
              style={{ fontFamily: "Urbanist" }}
            >
              {review.date}
            </Text>
          </View>

          {/* Comment */}
          {review.comment && (
            <Text
              className="text-base text-gray-800 leading-6 mb-3"
              style={{ fontFamily: "Urbanist" }}
            >
              {review.comment}
            </Text>
          )}

          {/* Attached Images */}
          {review.images && review.images.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row mb-4"
            >
              {review.images.map((img, index) => (
                <TouchableOpacity key={index} activeOpacity={0.9}>
                  <Image
                    source={{ uri: img }}
                    className="w-20 h-20 rounded-lg mr-3 bg-gray-100"
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Action Buttons */}
          <View className="flex-row items-center space-x-5 mt-1">
            <TouchableOpacity className="flex-row items-center p-1">
              <Feather name="heart" size={16} color="black" />
              <Text className="ml-2 text-xs text-gray-500 font-medium">
                {review.likes || 0} Likes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center p-1">
              <MaterialIcons name="reply" size={16} color="black" />
              <Text className="ml-2 text-xs text-gray-500 font-medium">
                Reply
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}
