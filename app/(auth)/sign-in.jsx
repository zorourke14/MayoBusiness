import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';
import config from '../config';

import { 
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails
} from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: config.EXPO_POOL_ID,
  ClientId: config.EXPO_CLIENT_ID
};

const userPool = new CognitoUserPool(poolData);

const SignIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setSubmitting(true);

      const authenticationData = {
        Username: form.email,
        Password: form.password,
      };
      const authenticationDetails = new AuthenticationDetails(authenticationData);

      const userData = {
        Username: form.email,
        Pool: userPool
      };
      const cognitoUser = new CognitoUser(userData);

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          setSubmitting(false);
          console.log('Authentication successful', result);
          
          // Get the user's access token
          const accessToken = result.getAccessToken().getJwtToken();
          
          // Navigate to home screen
          router.push('/home');
        },

        onFailure: (err) => {
          setSubmitting(false);
          console.error('Authentication failed:', err);
          
          switch (err.code) {
            case 'UserNotFoundException':
              setError('User not found');
              break;
            case 'NotAuthorizedException':
              setError('Incorrect username or password');
              break;
            case 'UserNotConfirmedException':
              setError('Please verify your email first');
              router.push({
                pathname: '/verified',
                params: { email: form.email }
              });
              break;
            default:
              setError(err.message || 'An error occurred during sign in');
          }
        },

        newPasswordRequired: (userAttributes, requiredAttributes) => {
          setSubmitting(false);
          setError('You need to change your password');
          router.push({
            pathname: '/change-password',
            params: { email: form.email }
          });
        },

        // Add MFA handling
        mfaRequired: (challengeName, challengeParameters) => {
          setSubmitting(false);
          // Store cognitoUser in state or context if needed for MFA verification
          router.push({
            pathname: '/home',
            params: { 
              email: form.email,
              challengeName,
              ...challengeParameters
            }
          });
        },

        mfaSetup: (challengeName, challengeParameters) => {
          setSubmitting(false);
          router.push({
            pathname: '/mfa-setup',
            params: { 
              email: form.email,
              challengeName,
              ...challengeParameters
            }
          });
        },
      });

    } catch (err) {
      setSubmitting(false);
      console.error('Error in submit function:', err);
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
            Log in to Aora
          </Text>

          {error ? (
            <Text className="text-red-500 mt-4 text-center">{error}</Text>
          ) : null}

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e.trim() })}
            otherStyles="mt-7"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            secureTextEntry
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="./sign-up"
              className="text-lg font-psemibold text-secondary"
            >
              Signup
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;