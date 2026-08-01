import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthService } from '../../services/auth';
import { AuthCard } from '../../components/ui/AuthCard';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { AppTextInput } from '../../components/ui/AppTextInput';
import { SocialLoginRow } from '../../components/ui/SocialLoginRow';
import { ArcanaLogo } from '../../components/brand/ArcanaLogo';
import { ArcanaHeroBackground } from '../../components/brand/ArcanaHeroBackground';
import { ScrollView } from 'react-native';
import { useAuthStore } from '../../store/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const setTempAuth = useAuthStore(state => state.setTempAuth);
  const setAuth = useAuthStore(state => state.setAuth);
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
      } else {
        // Normal success
        setAuth(data.access_token, data.user);
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
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingBottom: 40 }} bounces={false}>
      {/* Hero Header Area (Dark) */}
      <View className="relative w-full min-h-[300px] justify-center px-8 pt-16 pb-8 overflow-hidden">
        <ArcanaHeroBackground />
        <View className="z-10 mt-10">
          <Text className="text-textOnDark text-[24px] font-serif-bold mb-4">Arcana</Text>
          <Text className="text-textOnDark text-[32px] font-serif-bold mb-4 leading-9">Welcome to Arcana</Text>
          <Text className="text-textSecondaryDark text-body leading-6 mb-6">
            Arcana helps developers to build organized and well coded dashboards full of beautiful and rich modules. Join us and start building your application today.
          </Text>
          <Text className="text-textOnDark text-caption font-serif-semibold">
            More than 17k people joined us, it's your turn
          </Text>
        </View>
      </View>

      {/* Form Area (Light) */}
      <View className="bg-surfaceLight rounded-[40px] mx-4 px-6 py-10 shadow-2xl shadow-black/20 mb-8 mt-2">
        <View className="flex-row items-center justify-center mb-10 mt-2">
          <ArcanaLogo size={46} />
          <Text className="text-textOnLight text-[32px] font-serif-bold ml-3 mt-1">Arcana</Text>
        </View>
        
        <View className="mb-6">
          <Text className="text-textOnLight text-subheading font-serif-bold">Sign in</Text>
        </View>
        
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
            <View className="w-4 h-4 rounded border border-border mr-2 items-center justify-center bg-surfaceGray" />
            <Text className="text-textSecondaryLight text-label">Remember me</Text>
          </TouchableOpacity>
        </View>
        
        <PrimaryButton
          title="Sign in"
          onPress={handleLogin}
          loading={loading}
          disabled={!email || !password}
        />
        
        <View className="flex-row mt-6">
          <Text className="text-textSecondaryLight text-label">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/account-type')}>
            <Text className="text-textOnLight text-label font-serif-bold">Sign up</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity className="mt-2 mb-8">
          <Text className="text-textSecondaryLight text-label">Forgot Password</Text>
        </TouchableOpacity>

        <View className="items-center mb-4">
          <SocialLoginRow 
            onGooglePress={() => Alert.alert('Google', 'Google OAuth pressed')}
            onApplePress={() => Alert.alert('Apple', 'Apple OAuth pressed')}
            onFacebookPress={() => Alert.alert('Facebook', 'Facebook OAuth pressed')}
          />
        </View>
      </View>
    </ScrollView>
  );
}
