import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

const verified = () => {
  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 py-4 bg-teal-500">
        <Text className="text-2xl font-bold text-white">Welcome to RecipeApp!</Text>
        <Text className="text-sm text-white mt-2">Discover and save your favorite recipes.</Text>
      </View>

      {/* Content */}
      <View className="px-6 py-4">
        {/* Section: Explore Recipes */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-gray-800 mb-2">Explore Recipes</Text>
          <Text className="text-gray-600 mb-4">
            Dive into a world of flavors! Find recipes by cuisine, ingredients, or dietary preferences.
          </Text>
          <TouchableOpacity className="bg-teal-500 rounded-md py-3 px-4">
            <Text className="text-white text-center font-medium">Explore Now</Text>
          </TouchableOpacity>
        </View>

        {/* Section: Saved Recipes */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-gray-800 mb-2">Your Saved Recipes</Text>
          <Text className="text-gray-600 mb-4">
            Access your personal collection of recipes anytime, anywhere.
          </Text>
          <TouchableOpacity className="bg-teal-500 rounded-md py-3 px-4">
            <Text className="text-white text-center font-medium">View Saved Recipes</Text>
          </TouchableOpacity>
        </View>

        {/* Section: Profile */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-gray-800 mb-2">Your Profile</Text>
          <Text className="text-gray-600 mb-4">
            Customize your profile, update preferences, or manage your account.
          </Text>
          <TouchableOpacity className="bg-teal-500 rounded-md py-3 px-4">
            <Text className="text-white text-center font-medium">Go to Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View className="px-6 py-4 border-t border-gray-200">
        <Text className="text-center text-gray-600 text-sm">
          Happy Cooking! 🍳
        </Text>
      </View>
    </ScrollView>
  );
};

export default verified;
