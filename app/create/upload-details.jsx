import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import AWS from 'aws-sdk';
import config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

AWS.config.update({
  region: 'us-east-2', 
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: config.EXPO_POOL_ID, 
  }),
});

const UploadDetails = () => {
  const { mediaUri, mediaType } = useLocalSearchParams();
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const uploadToS3 = async (file, fileName) => {
    setIsUploading(true);
    const s3 = new AWS.S3();
    
    // Get presigned URL
    const params = {
      Bucket: 'recipe-reels',
      Key: fileName,
      ContentType: mediaType === 'video' ? 'video/mp4' : 'image/jpeg',
      Expires: 60 * 5 // URL expires in 5 minutes
    };

    const presignedUrl = await s3.getSignedUrl('putObject', params);
  
    // Upload directly using fetch or axios
    const response = await fetch(presignedUrl, {
      method: 'POST',
      body: file,
      headers: {
        'Content-Type': mediaType === 'video' ? 'video/mp4' : 'image/jpeg'
      }
    });
    console.log(response)
    setIsUploading(false);
    return presignedUrl.split('?')[0]; // S3 URL without query params
  };

  const handleUpload = async () => {
    try {
      setIsUploading(true);
      const userId = await AsyncStorage.getItem('@user_id');
  
      // Generate unique filename
      const fileExtension = mediaUri.split('.').pop();
      const fileName = `${userId}/reels/${uuidv4()}.${fileExtension}`;
      
      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(mediaUri, {
        encoding: FileSystem.EncodingType.Base64
      });

      // Make API request to Lambda function
      const response = await axios.post(config.API_ENDPOINT, {
        fileName: fileName,
        data: base64,
        metadata: {
          userId: userId,
          caption: caption,
          mediaType: mediaType
        }
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("Response\n",response)

      // Show success and navigate
      Alert.alert('Success', 'Your recipe reel has been uploaded!');

      router.replace('../(tabs)/home');
    } catch (axiosError) {
      console.log('Axios Error Details:', {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        headers: axiosError.response?.headers,
        config: axiosError.config
      });
      throw axiosError;
    }
     finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary flex-1">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-800">
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-psemibold">New Recipe Reel</Text>
          <TouchableOpacity 
            onPress={handleUpload}
            disabled={isUploading}
          >
            <Text className={`text-secondary font-psemibold ${isUploading ? 'opacity-50' : ''}`}>
              {isUploading ? 'Uploading...' : 'Share'}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1 p-4">
          {/* Media Preview */}
          <View className="flex-row mb-4">
            <Image
              source={{ uri: mediaUri }}
              className="w-20 h-20 rounded-xl"
              resizeMode="cover"
            />
            <View className="flex-1 ml-4">
              <TextInput
                className="text-white text-base flex-1 bg-gray-800 p-4 rounded-xl"
                placeholder="Write a caption..."
                placeholderTextColor="#9CA3AF"
                multiline
                value={caption}
                onChangeText={setCaption}
              />
            </View>
          </View>

          {/* Additional Options */}
          <View className="bg-gray-800 rounded-xl p-4 mb-4">
            <TouchableOpacity className="flex-row items-center justify-between">
              <Text className="text-white text-base">Add Location</Text>
              <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <View className="bg-gray-800 rounded-xl p-4">
            <TouchableOpacity className="flex-row items-center justify-between">
              <Text className="text-white text-base">Tag People</Text>
              <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default UploadDetails;