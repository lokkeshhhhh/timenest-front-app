import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AuthService } from '../../services/auth';
import { AuthCard } from '../../components/ui/AuthCard';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { OtpInput } from '../../components/ui/OtpInput';

export default function TwoFactorScreen() {
  const router = useRouter();
  const { tempToken } = useLocalSearchParams();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (code.length < 6 || !tempToken) return;

    setLoading(true);
    try {
      const res = await AuthService.submitTwoFactorCode(tempToken as string, code);
      const data = res.data || res;
      
      if (data.requires_workspace_selection) {
        router.push({ pathname: '/(auth)/workspace-select', params: { tempToken: data.temp_token } });
      } else {
        // Normal success
        router.replace('/(tabs)/');
      }
    } catch (e: any) {
      Alert.alert('Verification Failed', e.response?.data?.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background pt-16">
      <View className="items-center mb-6">
        <Text className="text-textOnDark text-heading font-serif-bold">Two-Factor Auth</Text>
      </View>
      <AuthCard className="flex-1">
        <View className="items-center mb-8 mt-4">
          <Text className="text-textOnLight text-subheading font-serif-bold text-center">
            Enter Authentication Code
          </Text>
          <Text className="text-textSecondaryLight text-body text-center mt-2 px-2">
            Open your authenticator app and enter the 6-digit code.
          </Text>
        </View>

        <OtpInput
          length={6}
          value={code}
          onChangeText={setCode}
        />

        <PrimaryButton
          title="Verify"
          onPress={handleVerify}
          disabled={code.length < 6 || loading}
          loading={loading}
          className="mt-8"
        />
      </AuthCard>
    </View>
  );
}
