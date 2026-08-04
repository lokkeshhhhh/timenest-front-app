import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AuthService } from '../../services/auth';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { OtpInput } from '../../components/ui/OtpInput';
import { LinearGradient } from 'expo-linear-gradient';
import { ArcanaHeroBackground } from '../../components/brand/ArcanaHeroBackground';
import { StyleSheet, ScrollView } from 'react-native';
import { useAuthStore } from '../../store/authStore';
import { shadowLg } from '../../constants/shadows';

export default function TwoFactorScreen() {
  const router = useRouter();
  const { tempToken } = useLocalSearchParams();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeError, setCodeError] = useState('');
  const setTempAuth = useAuthStore(state => state.setTempAuth);

  const handleVerify = async () => {
    if (code.length < 6 || !tempToken) return;

    setLoading(true);
    try {
      const res = await AuthService.submitTwoFactorCode(tempToken as string, code);
      const data = res.data || res;

      if (data.requires_workspace_selection) {
        setTempAuth(data.temp_token, data.workspaces || []);
        router.push('/(auth)/workspace-select');
      } else {
        // Normal success
        router.replace('/(tabs)/');
      }
    } catch (e: any) {
      setCodeError(e.response?.data?.message || 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

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
          <Text className="text-textOnDark text-heading font-serif-bold mt-4">Two-Factor Auth</Text>
          <Text className="text-textSecondaryDark text-body mt-2 leading-6 pr-4">
            Protect your account with an extra layer of security.
          </Text>
        </View>

        {/* Form Area */}
        <View
          style={shadowLg}
          className="bg-surfaceLight dark:bg-white/5 rounded-card mx-4 px-6 py-10 mb-8 mt-2 flex-1 items-center"
        >
          <View className="items-center mb-8 mt-4">
            <Text className="text-textOnLight dark:text-textOnDark text-subheading font-serif-bold text-center">
              Enter Authentication Code
            </Text>
            <Text className="text-textSecondaryLight dark:text-textSecondaryDark text-body text-center mt-2 px-2">
              Open your authenticator app and enter the 6-digit code.
            </Text>
          </View>

          <OtpInput
            length={6}
            value={code}
            onChangeText={(val) => { setCode(val); setCodeError(''); }}
            error={codeError}
          />

          <PrimaryButton
            title="Verify"
            onPress={handleVerify}
            disabled={code.length < 6 || loading}
            loading={loading}
            className="mt-8 w-full"
          />
        </View>
      </ScrollView>
    </View>
  );
}
