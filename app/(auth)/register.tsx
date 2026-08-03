import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AuthService } from '../../services/auth';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { AppTextInput } from '../../components/ui/AppTextInput';
import { AuthHeader } from '../../components/brand/AuthHeader';
import { SocialLoginRow } from '../../components/ui/SocialLoginRow';
import { getAccountTypeVisual } from '../../utils/accountType';

export default function RegisterScreen() {
  const router = useRouter();
  const { accountType: accountTypeParam } = useLocalSearchParams();
  const accountType = Array.isArray(accountTypeParam) ? accountTypeParam[0] : accountTypeParam || '';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);

  const isOrg = accountType === 'organization' || accountType === 'freelance_team';
  const visual = getAccountTypeVisual(accountType);

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
    <SafeAreaView className="flex-1 bg-background dark:bg-backgroundDark">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }} bounces={false}>
        <AuthHeader />

        <Image
          source={visual.illustration}
          resizeMode="contain"
          style={{ width: 168, height: 168 / visual.illustrationRatio, alignSelf: 'center', marginBottom: 8 }}
        />

        <Text className="text-textOnLight dark:text-textOnDark text-heading font-serif-bold mt-2">Create your account</Text>
        <Text className="text-textSecondaryLight dark:text-textSecondaryDark text-body mt-2 mb-6 leading-6">
          Join Arcana — built for solo freelancers, teams, and organizations alike.
        </Text>

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
        
        <View className="flex-row justify-center mt-6">
          <Text className="text-textSecondaryLight dark:text-textSecondaryDark text-label">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text className="text-primary text-label font-serif-bold">Log in</Text>
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
