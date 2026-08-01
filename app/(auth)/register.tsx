import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AuthService } from '../../services/auth';
import { AuthCard } from '../../components/ui/AuthCard';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { AppTextInput } from '../../components/ui/AppTextInput';
import { ArcanaLogo } from '../../components/brand/ArcanaLogo';
import { ArcanaHeroBackground } from '../../components/brand/ArcanaHeroBackground';

export default function RegisterScreen() {
  const router = useRouter();
  const { accountType } = useLocalSearchParams();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);

  const isOrg = accountType === 'organization' || accountType === 'freelance_team';

  const handleRegister = async () => {
    if (!name || !email || !password || !passwordConfirmation || (isOrg && !orgName)) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    if (password !== passwordConfirmation) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await AuthService.register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        account_type: accountType,
        organization_name: isOrg ? orgName : undefined
      });
      // Registration sets user to PENDING_VERIFICATION.
      router.push('/(auth)/verify');
    } catch (e: any) {
      // Very basic error handling for Phase 4. Will improve in Phase 6.
      Alert.alert('Registration Failed', e.response?.data?.message || e.message);
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
          <Text className="text-textOnDark text-[32px] font-serif-bold mb-4 leading-9">Join Arcana</Text>
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
          <Text className="text-textOnLight text-subheading font-serif-bold">Create Account</Text>
        </View>

        <AppTextInput
          label="Full Name"
          placeholder="John Doe"
          value={name}
          onChangeText={setName}
        />
        <AppTextInput
          label="Email Address"
          placeholder="johndoe@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {isOrg && (
          <AppTextInput
            label="Organization Name"
            placeholder="Acme Corp"
            value={orgName}
            onChangeText={setOrgName}
          />
        )}
        <AppTextInput
          label="Password"
          placeholder="••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <AppTextInput
          label="Confirm Password"
          placeholder="••••••"
          value={passwordConfirmation}
          onChangeText={setPasswordConfirmation}
          secureTextEntry
        />
        
        <PrimaryButton
          title="Sign up"
          onPress={handleRegister}
          loading={loading}
          className="mt-4"
        />
        
        <View className="flex-row justify-center mt-8 mb-4">
          <Text className="text-textSecondaryLight text-body">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text className="text-textOnLight text-body font-serif-bold">Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
