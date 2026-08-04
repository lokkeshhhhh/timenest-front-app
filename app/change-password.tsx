import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ScreenHeader } from '../components/ui/ScreenHeader';
import { AppTextInput } from '../components/ui/AppTextInput';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { AuthService } from '../services/auth';
import { extractFieldErrors } from '../utils/formErrors';
import { showAppModal } from '../store/modalStore';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = currentPassword.length > 0 && password.length >= 8 && password === confirmPassword;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError('');
    setLoading(true);
    try {
      await AuthService.changePassword(currentPassword, password, confirmPassword);
      showAppModal({
        variant: 'success',
        title: 'Password changed',
        message: 'Your password has been changed.',
        actions: [{ label: 'OK', onPress: () => router.back() }],
      });
    } catch (e: any) {
      const fieldErrors = extractFieldErrors(e);
      const firstFieldError = Object.values(fieldErrors)[0];
      setError(firstFieldError || e.response?.data?.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-background dark:bg-backgroundDark">
      <ScreenHeader title="Change Password" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32 }}>
        <AppTextInput
          label="Current password"
          placeholder="••••••"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
        />
        <AppTextInput
          label="New password"
          placeholder="••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <AppTextInput
          label="Confirm new password"
          placeholder="••••••"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          error={confirmPassword.length > 0 && confirmPassword !== password ? "Passwords don't match" : error}
        />
        <PrimaryButton title="Update password" onPress={handleSubmit} disabled={!canSubmit} loading={loading} />
      </ScrollView>
    </SafeAreaView>
  );
}
