import React, { useState } from 'react';
import { View, Text, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthService } from '../../services/auth';
import { AppTextInput } from '../../components/ui/AppTextInput';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { ArcanaLogo } from '../../components/brand/ArcanaLogo';
import { ArcanaHeroBackground } from '../../components/brand/ArcanaHeroBackground';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!email) return;
    
    setLoading(true);
    try {
      await AuthService.requestPasswordReset(email);
      setSuccess(true);
    } catch (e: any) {
      // For security, most systems shouldn't reveal if email exists, 
      // but if the backend throws validation errors (e.g. invalid format), we handle them here.
      const errData = e.response?.data || {};
      Alert.alert('Error', errData.message || 'Failed to request reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background">
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
      
      <ScrollView className="flex-1" bounces={false} contentContainerStyle={{ flexGrow: 1 }}>
        {/* Hero Area (Dark) */}
        <View className="relative w-full min-h-[200px] justify-center px-8 pt-20 pb-4">
        
        <Text className="text-textOnDark text-heading font-serif-bold mt-4">Reset Password</Text>
        <Text className="text-textSecondaryDark text-body mt-2 leading-6 pr-4">
          Enter your email address and we'll send you instructions to reset your password.
        </Text>
        </View>

        {/* Form Area (Light) */}
        <View className="bg-surfaceLight rounded-card mx-4 px-6 py-10 shadow-lg shadow-black/5 mb-8 mt-2 flex-1">
          <View className="flex-row items-center justify-center mb-10 mt-2">
          <ArcanaLogo size={46} />
        </View>

        {success ? (
          <View className="items-center">
            <Text className="text-textOnLight text-heading font-serif-bold text-center mb-4">Check your email</Text>
            <Text className="text-textSecondaryLight text-body text-center leading-6 mb-8">
              If an account with that email exists, we've sent a password reset link to <Text className="font-bold">{email}</Text>.
            </Text>
            <PrimaryButton
              title="Return to Login"
              onPress={() => router.replace('/(auth)/login')}
              className="w-full"
            />
          </View>
        ) : (
          <>
            <AppTextInput
              label="Email Address"
              placeholder="name@company.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={undefined}
            />

            <PrimaryButton
              title="Send Reset Link"
              onPress={handleSubmit}
              loading={loading}
              disabled={!email || loading}
              className="mt-6"
            />
            
            <View className="flex-row justify-center mt-6">
              <Text className="text-textSecondaryLight text-label mr-1">Remembered your password?</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text className="text-textOnLight text-label font-bold">Sign in</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        </View>
      </ScrollView>
    </View>
  );
}
