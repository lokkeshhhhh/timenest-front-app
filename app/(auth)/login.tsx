import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AuthService } from '../../services/auth';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { AppTextInput } from '../../components/ui/AppTextInput';
import { SocialLoginRow } from '../../components/ui/SocialLoginRow';
import { AuthHeader } from '../../components/brand/AuthHeader';
import { useAuthStore } from '../../store/authStore';
import { applySessionData } from '../../utils/session';

export default function LoginScreen() {
  const router = useRouter();
  const setTempAuth = useAuthStore(state => state.setTempAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;

    setLoading(true);
    try {
      const response = await AuthService.login(email, password);
      const data = response.data || response;

      if (data.requires_2fa || data.status === '2fa_required') {
        router.push({ pathname: '/(auth)/2fa', params: { tempToken: data.temp_token } });
      } else if (data.requires_workspace_selection) {
        setTempAuth(data.temp_token, data.workspaces || []);
        router.push('/(auth)/workspace-select');
      } else if (data.status === 'no_workspace') {
        // ASSUMPTION: the backend issues no access_token at all for a user with
        // zero organization memberships (see AuthService::resolveWorkspaceAndIssueTokens),
        // so there is no session to hand to the tab shell here — surface it inline
        // instead of silently calling setAuth(undefined, user).
        Alert.alert(
          'No workspace yet',
          data.message || 'You may need an invitation to join an organization.'
        );
      } else {
        // Normal success
        applySessionData(data);
        router.replace('/(tabs)/');
      }
    } catch (e: any) {
      const errData = e.response?.data || {};
      const meta = errData.meta || {};
      
      if (meta.requires_workspace_selection) {
        setTempAuth(meta.temp_token, meta.workspaces || []);
        router.push('/(auth)/workspace-select');
        return;
      }

      if (e.response?.status === 403 && errData.message?.includes('verified')) {
        Alert.alert('Unverified Account', 'Please check your email to verify your account.');
      } else {
        Alert.alert('Login Failed', errData.message || e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-backgroundDark">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }} bounces={false}>
        <AuthHeader />

        <Image
          source={require('../../assets/images/auth/login.png')}
          resizeMode="contain"
          style={{ width: 168, height: 168 * (900 / 706), alignSelf: 'center', marginBottom: 8 }}
        />

        <Text className="text-textOnLight dark:text-textOnDark text-heading font-serif-bold mt-2">Welcome back</Text>
        <Text className="text-textSecondaryLight dark:text-textSecondaryDark text-body mt-2 mb-6 leading-6">
          Sign in to continue to your account.
        </Text>

        <AppTextInput
          label="Email Address"
          placeholder="johndoe@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <AppTextInput
          label="Password"
          placeholder="••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View className="flex-row justify-between items-center mb-8 w-full px-1">
          <TouchableOpacity className="flex-row items-center">
            <View className="w-4 h-4 rounded border border-border dark:border-white/20 mr-2 items-center justify-center bg-surfaceGray dark:bg-surfaceGrayDark" />
            <Text className="text-textSecondaryLight dark:text-textSecondaryDark text-label">Remember me</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
            <Text className="text-primary text-label font-bold">Forget Password?</Text>
          </TouchableOpacity>
        </View>

        <PrimaryButton
          title="Sign in"
          onPress={handleLogin}
          loading={loading}
          disabled={!email || !password}
        />

        <View className="flex-row justify-center mt-6">
          <Text className="text-textSecondaryLight dark:text-textSecondaryDark text-label">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/account-type')}>
            <Text className="text-primary text-label font-serif-bold">Sign up</Text>
          </TouchableOpacity>
        </View>

        <View className="items-center mb-4 mt-8">
          <SocialLoginRow
            onGooglePress={() => Alert.alert('Google', 'Google OAuth pressed')}
            onFacebookPress={() => Alert.alert('Facebook', 'Facebook OAuth pressed')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
