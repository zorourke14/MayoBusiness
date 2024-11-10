import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import React, {useState} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';
import { 
  CognitoUserPool,
  CognitoUserAttribute
} from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: process.env.EXPO_PUBLIC_COGNITO_USER_POOL_ID,
  ClientId: process.env.EXPO_PUBLIC_COGNITO_CLIENT_ID
};

const userPool = new CognitoUserPool(poolData);

const SignUp = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phonenumber: ""
  });

  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const validateForm = () => {
    if (!form.username || !form.email || !form.password || !form.phonenumber) {
      setError("All fields are required");
      return false;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email");
      return false;
    }
    // Username validation - only allow letters, numbers, and underscores
    if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      setError("Username can only contain letters, numbers, and underscores");
      return false;
    }
    // Phone number validation - basic format check
    if (!/^\+?[\d\s-]+$/.test(form.phonenumber)) {
      setError("Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const submit = async () => {
    setError("");
    if (!validateForm()) return;

    try {
      setSubmitting(true);

      // Prepare the attributes
      const attributeList = [];
      
      const emailAttribute = new CognitoUserAttribute({
        Name: 'email',
        Value: form.email.trim()
      });

      const phoneAttribute = new CognitoUserAttribute({
        Name: 'phone_number',
        Value: form.phonenumber.startsWith('+') ? form.phonenumber : `+${form.phonenumber}`
      });

      const nicknameAttribute = new CognitoUserAttribute({
        Name: 'nickname',
        Value: form.username.trim()
      });

      attributeList.push(emailAttribute);
      attributeList.push(phoneAttribute);
      attributeList.push(nicknameAttribute);

      // Sign up the user
      userPool.signUp(
        form.username,
        form.password,
        attributeList,
        null,
        (err, result) => {
          setSubmitting(false);

          if (err) {
            console.error('Error signing up:', err);
            switch (err.code) {
              case 'UsernameExistsException':
                setError('This username is already taken');
                break;
              case 'InvalidPasswordException':
                setError('Password must be at least 8 characters long and contain numbers, special characters, uppercase and lowercase letters');
                break;
              case 'InvalidParameterException':
                if (err.message.includes('phone')) {
                  setError('Please provide a valid phone number in international format (e.g., +1234567890)');
                } else if (err.message.includes('email')) {
                  setError('Please provide a valid email address');
                } else {
                  setError('Username can only contain letters, numbers, and underscores');
                }
                break;
              default:
                setError(err.message || "An error occurred during sign up");
            }
            return;
          }

          // Signup successful
          console.log('Signup successful. Username is ' + result.user.getUsername());
          
          // Navigate to verification page
          router.push({
            pathname: '/verified',
            params: { 
              username: form.username,
              email: form.email 
            }
          });
        }
      );

    } catch (err) {
      setSubmitting(false);
      console.error('Error in submit function:', err);
      setError("An unexpected error occurred. Please try again.");
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
            Sign up to Aora
          </Text>

          {error ? (
            <Text className="text-red-500 mt-4 text-center">{error}</Text>
          ) : null}

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e.toLowerCase() })}
            otherStyles="mt-10"
            autoCapitalize="none"
            placeholder="letters, numbers, and underscores only"
          />

          <FormField
            title="Phone number"
            value={form.phonenumber}
            handleChangeText={(e) => setForm({ ...form, phonenumber: e.trim() })}
            otherStyles="mt-7"
            autoCapitalize="none"
            placeholder="+1234567890"
            keyboardType="phone-pad"
          />

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
            title="Sign up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-secondary"
            >
              Sign in
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;