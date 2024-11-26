import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const Create = () => {
  const [selectedMedia, setSelectedMedia] = useState(null);

  const checkAndRequestPermissions = async () => {
    const { status: existingStatus } = await ImagePicker.getMediaLibraryPermissionsAsync();
    
    if (existingStatus !== 'granted') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return false;
      }
    }
    return true;
  };

  const pickMedia = async () => {
      try {
      const hasPermission = await checkAndRequestPermissions();
      if (!hasPermission) return;
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All, // Use 'All', 'Images', or 'Videos'
        allowsEditing: true,
        aspect: [9, 16],
        quality: 1,
      });
  
      console.log('Picker result:', result); // Debug log
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedMedia(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking media:', error);
      alert('Error selecting media. Please try again.');
    }
  };

  const handleNext = () => {
    if (selectedMedia) {
      router.push({
        pathname: '/create/upload-details',
        params: {
          mediaUri: selectedMedia.uri,
          mediaType: selectedMedia.type || 'image',
        }
      });
      // Reset selected media after navigation
      setSelectedMedia(null);
    }
  };

  return (
    <SafeAreaView className="bg-primary flex-1 relative">
      {/* Main Content Area */}
      <View className="px-4 py-6">
        <Text className="text-white text-2xl font-psemibold mb-4">Recipe Reels</Text>
        <Text className="text-gray-400 mb-4">
          Share your cooking journey with short, engaging video recipes
        </Text>

        {/* Preview selected media */}
        {selectedMedia && (
          <View className="rounded-xl overflow-hidden mb-4">
            <Image
              source={{ uri: selectedMedia.uri }}
              className="w-full h-96"
              resizeMode="cover"
            />
            
            {/* Controls */}
            <View className="mt-4 flex-row justify-between">
              <TouchableOpacity 
                className="bg-gray-800 px-6 py-3 rounded-xl flex-row items-center"
                onPress={() => setSelectedMedia(null)}
              >
                <MaterialIcons name="close" size={24} color="#FFF" />
                <Text className="text-white ml-2">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="bg-secondary px-6 py-3 rounded-xl flex-row items-center"
                onPress={handleNext}
              >
                <MaterialIcons name="arrow-forward" size={24} color="#1F2937" />
                <Text className="text-primary ml-2 font-psemibold">Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Upload Button (FAB) - Hidden when media is selected */}
      {!selectedMedia && (
        <TouchableOpacity 
          className="absolute bottom-8 right-8 bg-secondary w-16 h-16 rounded-full items-center justify-center shadow-lg"
          onPress={pickMedia}
        >
          <MaterialIcons name="upload" size={32} color="#1F2937" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default Create;