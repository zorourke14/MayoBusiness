import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { useLocalSearchParams, router } from 'expo-router';
import config from '../config';

import { 
  CognitoUserPool,
  CognitoUser
} from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: config.EXPO_POOL_ID,
  ClientId: config.EXPO_CLIENT_ID
};

const userPool = new CognitoUserPool(poolData);

const verified = () => {
  const params = useLocalSearchParams();
  const [verificationCode, setVerificationCode] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Ensure we have the required parameters
  useEffect(() => {
    if (!params.username || !params.email) {
      router.replace('/sign-up');
    }
  }, [params]);

  const resendCode = async () => {
    try {
      setError('');
      setSubmitting(true);

      const userData = {
        Username: params.username,
        Pool: userPool
      };

      const cognitoUser = new CognitoUser(userData);

      cognitoUser.resendConfirmationCode((err, result) => {
        setSubmitting(false);
        
        if (err) {
          console.error('Error resending code:', err);
          setError(err.message || 'Failed to resend verification code');
          return;
        }

        setSuccess('Verification code has been resent to your email');
        setTimeout(() => setSuccess(''), 5000); // Clear success message after 5 seconds
      });

    } catch (err) {
      setSubmitting(false);
      console.error('Error in resendCode:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const verifyAccount = async () => {
    try {
      setError('');
      setSuccess('');
      
      if (!verificationCode) {
        setError('Please enter the verification code');
        return;
      }

      setSubmitting(true);

      const userData = {
        Username: params.username,
        Pool: userPool
      };

      const cognitoUser = new CognitoUser(userData);

      cognitoUser.confirmRegistration(verificationCode, true, (err, result) => {
        setSubmitting(false);

        if (err) {
          console.error('Error confirming registration:', err);
          switch (err.code) {
            case 'CodeMismatchException':
              setError('Invalid verification code. Please try again.');
              break;
            case 'ExpiredCodeException':
              setError('Verification code has expired. Please request a new one.');
              break;
            default:
              setError(err.message || 'Failed to verify account');
          }
          return;
        }

        // Verification successful
        setSuccess('Account verified successfully!');
        
        // Navigate to sign in page after short delay
        setTimeout(() => {
          router.replace('/home');
        }, 1500);
      });

    } catch (err) {
      setSubmitting(false);
      console.error('Error in verifyAccount:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image 
            source={images.logo} 
            resizeMode='contain'
            className='w-[115px] h-[35px]'
          />

          <Text className='text-2xl text-white text-semibold mt-10 font-psemibold'>
            Verify your account
          </Text>

          <Text className='text-gray-300 mt-4 font-pregular'>
            We've sent a verification code to {params.email}. Please enter it below to verify your account.
          </Text>

          {error ? (
            <Text className="text-red-500 mt-4 text-center">{error}</Text>
          ) : null}

          {success ? (
            <Text className="text-green-500 mt-4 text-center">{success}</Text>
          ) : null}

          <FormField
            title="Verification Code"
            value={verificationCode}
            handleChangeText={setVerificationCode}
            otherStyles="mt-10"
            keyboardType="number-pad"
            maxLength={6}
            placeholder="Enter 6-digit code"
          />

          <CustomButton
            title="Verify Account"
            handlePress={verifyAccount}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <CustomButton
            title="Resend Code"
            handlePress={resendCode}
            containerStyles="mt-4"
            variant="secondary"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Back to
            </Text>
            <Text
              onPress={() => router.replace('/sign-up')}
              className="text-lg font-psemibold text-secondary"
            >
              Sign up
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default verified;