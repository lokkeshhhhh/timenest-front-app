import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AuthService } from '../../services/auth';
import { AppTextInput } from '../../components/ui/AppTextInput';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { AuthHeader } from '../../components/brand/AuthHeader';
import { extractFieldErrors, hasFieldErrors } from '../../utils/formErrors';
import { showAppModal } from '../../store/modalStore';
import { isValidEmail } from '../../utils/validators';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');

  const handleSubmit = async () => {
    if (!email) return;

    if (!isValidEmail(email)) {
      setEmailError('Enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await AuthService.requestPasswordReset(email);
      setSuccess(true);
    } catch (e: any) {
      // For security, most systems shouldn't reveal if email exists,
      // but if the backend throws validation errors (e.g. invalid format), we handle them here.
      if (hasFieldErrors(e)) {
        setEmailError(extractFieldErrors(e).email || '');
      } else {
        showAppModal({
          variant: 'error',
          title: 'Error',
          message: e.response?.data?.message || 'Failed to request reset link.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-backgroundDark">
      <ScrollView className="flex-1" bounces={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40, flexGrow: 1 }}>
        <AuthHeader />

        <Image
          source={require('../../assets/images/auth/forgot-password.png')}
          resizeMode="contain"
          style={{ width: 168, height: 168 * (644 / 900), alignSelf: 'center', marginBottom: 8 }}
        />

        <Text className="text-textOnLight dark:text-textOnDark text-heading font-serif-bold mt-2">Reset password</Text>
        <Text className="text-textSecondaryLight dark:text-textSecondaryDark text-body mt-2 mb-6 leading-6">
          Enter your email address and we'll send you instructions to reset your password.
        </Text>

        {success ? (
          <View className="items-center">
            <Text className="text-textOnLight dark:text-textOnDark text-heading font-serif-bold text-center mb-4">Check your email</Text>
            <Text className="text-textSecondaryLight dark:text-textSecondaryDark text-body text-center leading-6 mb-8">
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
              onChangeText={(val) => { setEmail(val); setEmailError(''); }}
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailError}
            />

            <PrimaryButton
              title="Send Reset Link"
              onPress={handleSubmit}
              loading={loading}
              disabled={!email || loading}
              className="mt-6"
            />
            
            <View className="flex-row justify-center mt-6">
              <Text className="text-textSecondaryLight dark:text-textSecondaryDark text-label mr-1">Remembered your password?</Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text className="text-primary text-label font-bold">Sign in</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
