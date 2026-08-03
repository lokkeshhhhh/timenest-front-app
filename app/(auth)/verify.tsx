import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';
import { ArcanaHeroBackground } from '../../components/brand/ArcanaHeroBackground';
import { StyleSheet, ScrollView } from 'react-native';
import { shadowLg } from '../../constants/shadows';

export default function VerifyScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background dark:bg-backgroundDark">
      {/* Premium Purple Hero Header */}
      <View className="absolute top-0 left-0 right-0 h-[380px] rounded-b-[40px] overflow-hidden">
        <LinearGradient
          colors={['#3C3B75', '#4C49ED', '#5D58A6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <View className="absolute top-[-50px] right-[-50px] opacity-20">
          <ArcanaHeroBackground size={400} />
        </View>
      </View>
      
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
        {/* Hero Header Text */}
        <View className="relative w-full min-h-[200px] justify-center px-8 pt-20 pb-4">
          <Text className="text-textOnDark text-heading font-serif-bold mt-4">Check Your Email</Text>
          <Text className="text-textSecondaryDark text-body mt-2 leading-6 pr-4">
            We need to verify your identity before you can proceed.
          </Text>
        </View>

        {/* Form Area */}
        <View
          style={shadowLg}
          className="bg-surfaceLight dark:bg-white/5 rounded-card mx-4 px-6 py-10 mb-8 mt-2 flex-1 items-center"
        >
          <View className="w-20 h-20 bg-surfaceGray dark:bg-surfaceGrayDark rounded-icon items-center justify-center mb-6 mt-4">
            <FontAwesome name="envelope-o" size={40} color="#4C49ED" />
          </View>

          <Text className="text-textOnLight dark:text-textOnDark text-subheading font-serif-bold text-center mb-2">
            Verification Pending
          </Text>
          <Text className="text-textSecondaryLight dark:text-textSecondaryDark text-body text-center mb-8 px-4">
            We've sent a verification link to your email address. Please tap the link in the email to activate your account.
          </Text>
          
          <PrimaryButton
            title="Back to Login"
            onPress={() => router.push('/(auth)/login')}
            className="w-full mt-4"
          />
        </View>
      </ScrollView>
    </View>
  );
}
