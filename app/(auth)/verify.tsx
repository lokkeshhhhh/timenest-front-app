import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthCard } from '../../components/ui/AuthCard';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function VerifyScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background pt-16">
      <View className="items-center mb-6">
        <Text className="text-textOnDark text-heading font-serif-bold">Check Your Email</Text>
      </View>
      <AuthCard className="items-center flex-1">
        <View className="w-20 h-20 bg-surfaceGray rounded-icon items-center justify-center mb-6 mt-4">
          <FontAwesome name="envelope-o" size={40} color="#1A1A1A" />
        </View>
        
        <Text className="text-textOnLight text-subheading font-serif-bold text-center mb-2">
          Verification Pending
        </Text>
        <Text className="text-textSecondaryLight text-body text-center mb-8 px-4">
          We've sent a verification link to your email address. Please tap the link in the email to activate your account.
        </Text>
        
        <PrimaryButton
          title="Back to Login"
          onPress={() => router.push('/(auth)/login')}
        />
      </AuthCard>
    </View>
  );
}
