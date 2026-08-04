import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AuthService } from '../../services/auth';
import { AppTextInput } from '../../components/ui/AppTextInput';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { ArcanaLogo } from '../../components/brand/ArcanaLogo';
import { ArcanaHeroBackground } from '../../components/brand/ArcanaHeroBackground';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { shadowLg } from '../../constants/shadows';
import { extractFieldErrors, hasFieldErrors } from '../../utils/formErrors';
import { showAppModal } from '../../store/modalStore';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const email = params.email as string;
  const token = params.token as string;

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const validatePassword = () => {
    let newErrors: any = {};
    if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!/[A-Z]/.test(password)) newErrors.password = 'Must contain an uppercase letter';
    else if (!/[0-9]/.test(password)) newErrors.password = 'Must contain a number';
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) newErrors.password = 'Must contain a symbol';
    
    if (password !== passwordConfirmation) newErrors.password_confirmation = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validatePassword()) return;

    setLoading(true);
    try {
      await AuthService.resetPassword({
        email,
        token,
        password,
        password_confirmation: passwordConfirmation
      });

      showAppModal({
        variant: 'success',
        title: 'Password reset',
        message: 'Your password has been reset successfully. You can now sign in.',
        actions: [{ label: 'Go to login', onPress: () => router.replace('/(auth)/login') }],
      });
    } catch (e: any) {
      if (hasFieldErrors(e)) {
        setErrors(extractFieldErrors(e));
      } else {
        showAppModal({
          variant: 'error',
          title: 'Could not reset password',
          message: e.response?.data?.message || 'The link may have expired. Please request a new one.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!email || !token) {
    return (
      <View className="flex-1 bg-background dark:bg-backgroundDark justify-center items-center px-8">
        <Text className="text-textOnLight dark:text-textOnDark text-heading font-serif-bold text-center mb-4">Invalid Link</Text>
        <Text className="text-textSecondaryLight dark:text-textSecondaryDark text-body text-center mb-8">
          This password reset link is missing required information. Please request a new one.
        </Text>
        <PrimaryButton
          title="Return to Login"
          onPress={() => router.replace('/(auth)/login')}
          className="w-full"
        />
      </View>
    );
  }

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
      
      <ScrollView className="flex-1" bounces={false} contentContainerStyle={{ flexGrow: 1 }}>
        {/* Hero Area (Dark) */}
        <View className="relative w-full min-h-[200px] justify-center px-8 pt-20 pb-4">
        
        <Text className="text-textOnDark text-heading font-serif-bold mt-4">New Password</Text>
        <Text className="text-textSecondaryDark text-body mt-2 leading-6 pr-4">
          Create a new strong password for {email}.
        </Text>
        </View>

        {/* Form Area */}
        <View
          style={shadowLg}
          className="bg-surfaceLight dark:bg-white/5 rounded-card mx-4 px-6 py-10 mb-8 mt-2 flex-1"
        >
          <View className="flex-row items-center justify-center mb-10 mt-2">
          <ArcanaLogo size={46} color={colors.textOnSurface} />
        </View>

        <AppTextInput
          label="New Password"
          placeholder="Enter a strong password"
          value={password}
          onChangeText={(val) => {
            setPassword(val);
            if (errors.password) setErrors({ ...errors, password: null });
          }}
          secureTextEntry
          error={errors.password}
        />

        <AppTextInput
          label="Confirm Password"
          placeholder="Repeat new password"
          value={passwordConfirmation}
          onChangeText={(val) => {
            setPasswordConfirmation(val);
            if (errors.password_confirmation) setErrors({ ...errors, password_confirmation: null });
          }}
          secureTextEntry
          error={errors.password_confirmation}
        />

        <PrimaryButton
          title="Reset Password"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading || !password || !passwordConfirmation}
          className="mt-6"
        />
        </View>
      </ScrollView>
    </View>
  );
}
