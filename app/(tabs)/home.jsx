import { StyleSheet, Text, View, ScrollView, Image, TextInput, TouchableOpacity, FlatList } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  // Template recipe data
  const recipes = [
    {
      id: '1',
      title: 'Spicy Thai Basil Chicken',
      category: 'Main Course',
      duration: '30 mins',
      difficulty: 'Medium',
      imageUrl: 'https://placeholder.com/food1.jpg'
    },
    {
      id: '2',
      title: 'Classic Margherita Pizza',
      category: 'Italian',
      duration: '45 mins',
      difficulty: 'Easy',
      imageUrl: 'https://placeholder.com/food2.jpg'
    },
    {
      id: '3',
      title: 'Chocolate Lava Cake',
      category: 'Dessert',
      duration: '25 mins',
      difficulty: 'Hard',
      imageUrl: 'https://placeholder.com/food3.jpg'
    },
  ];

  const categories = [
    'All', 'Main Course', 'Appetizers', 'Desserts', 'Beverages', 'Healthy'
  ];

  const RecipeCard = ({ item }) => (
    <TouchableOpacity 
      className="bg-gray-800 rounded-xl p-4 mb-4 mx-2"
      onPress={() => router.push(`/recipe/${item.id}`)}
    >
      <View className="relative">
        <Image
          source={{ uri: '/api/placeholder/350/200' }}
          className="w-full h-48 rounded-lg mb-3"
          resizeMode="cover"
        />
        <View className="absolute top-2 right-2 bg-primary px-3 py-1 rounded-full">
          <Text className="text-white text-xs">{item.duration}</Text>
        </View>
      </View>
      
      <Text className="text-white text-xl font-psemibold mb-2">{item.title}</Text>
      
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-400 text-sm">{item.category}</Text>
        <View className="flex-row items-center">
          <MaterialIcons name="difficulty-level" size={16} color="#9CA3AF" />
          <Text className="text-gray-400 text-sm ml-1">{item.difficulty}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="bg-primary flex-1">
      <ScrollView>
        <View className="px-4 py-6">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-8">
            <View>
              <Text className="text-white text-2xl font-psemibold">Hello Chef 👋</Text>
              <Text className="text-gray-400 mt-1">What would you like to cook today?</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/profile')}>
              <Image
                source={{ uri: '/api/placeholder/40/40' }}
                className="w-10 h-10 rounded-full"
              />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="flex-row items-center bg-gray-800 rounded-xl px-4 py-3 mb-6">
            <MaterialIcons name="search" size={24} color="#9CA3AF" />
            <TextInput
              className="flex-1 ml-3 text-white"
              placeholder="Search recipes..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Categories */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="mb-6"
          >
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                className={`px-4 py-2 rounded-full mr-3 ${
                  index === 0 ? 'bg-secondary' : 'bg-gray-800'
                }`}
              >
                <Text className={`${
                  index === 0 ? 'text-primary' : 'text-white'
                } font-medium`}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Featured Recipe */}
          <View className="mb-8">
            <Text className="text-white text-xl font-psemibold mb-4">Featured Recipe</Text>
            <TouchableOpacity 
              className="relative w-full h-48 rounded-xl overflow-hidden"
              onPress={() => router.push('/recipe/featured')}
            >
              <Image
                source={{ uri: '/api/placeholder/400/200' }}
                className="w-full h-full"
                resizeMode="cover"
              />
              <View className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50">
                <Text className="text-white text-xl font-psemibold">Homemade Pasta Carbonara</Text>
                <Text className="text-gray-300">Italian • 40 mins • Expert</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Recent Recipes */}
          <View>
            <Text className="text-white text-xl font-psemibold mb-4">Recent Recipes</Text>
            <FlatList
              data={recipes}
              renderItem={({ item }) => <RecipeCard item={item} />}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;