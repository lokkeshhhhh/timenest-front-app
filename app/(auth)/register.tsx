import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AuthService } from '../../services/auth';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { AppTextInput } from '../../components/ui/AppTextInput';
import { AuthHeader } from '../../components/brand/AuthHeader';
import { SocialLoginRow } from '../../components/ui/SocialLoginRow';
import { getAccountTypeVisual } from '../../utils/accountType';
import { extractFieldErrors, hasFieldErrors } from '../../utils/formErrors';
import { showAppModal } from '../../store/modalStore';
import { isValidEmail } from '../../utils/validators';

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const isOrg = accountType === 'organization' || accountType === 'freelance_team';
  const visual = getAccountTypeVisual(accountType);

  const clearFieldError = (field: string) => {
    if (fieldErrors[field]) setFieldErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleRegister = async () => {
    const nextErrors: Record<string, string> = {};
    if (!name) nextErrors.name = 'Full name is required';
    if (!email) nextErrors.email = 'Email address is required';
    else if (!isValidEmail(email)) nextErrors.email = 'Enter a valid email address';
    if (!password) nextErrors.password = 'Password is required';
    if (!passwordConfirmation) nextErrors.password_confirmation = 'Please confirm your password';
    if (isOrg && !orgName) nextErrors.organization_name = 'Organization name is required';
    if (password && passwordConfirmation && password !== passwordConfirmation) {
      nextErrors.password_confirmation = 'Passwords do not match';
    }
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
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
      if (hasFieldErrors(e)) {
        setFieldErrors(extractFieldErrors(e));
      } else {
        showAppModal({
          variant: 'error',
          title: 'Registration failed',
          message: e.response?.data?.message || e.message,
        });
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
          onChangeText={(val) => { setName(val); clearFieldError('name'); }}
          error={fieldErrors.name}
        />
        <AppTextInput
          label="Email Address"
          placeholder="johndoe@example.com"
          value={email}
          onChangeText={(val) => { setEmail(val); clearFieldError('email'); }}
          keyboardType="email-address"
          autoCapitalize="none"
          error={fieldErrors.email}
        />
        {isOrg && (
          <AppTextInput
            label="Organization Name"
            placeholder="Acme Corp"
            value={orgName}
            onChangeText={(val) => { setOrgName(val); clearFieldError('organization_name'); }}
            error={fieldErrors.organization_name}
          />
        )}
        <AppTextInput
          label="Password"
          placeholder="••••••"
          value={password}
          onChangeText={(val) => { setPassword(val); clearFieldError('password'); }}
          secureTextEntry
          error={fieldErrors.password}
        />
        <AppTextInput
          label="Confirm Password"
          placeholder="••••••"
          value={passwordConfirmation}
          onChangeText={(val) => { setPasswordConfirmation(val); clearFieldError('password_confirmation'); }}
          secureTextEntry
          error={fieldErrors.password_confirmation}
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
            onGooglePress={() => showAppModal({ variant: 'info', title: 'Google', message: 'Google OAuth pressed' })}
            onFacebookPress={() => showAppModal({ variant: 'info', title: 'Facebook', message: 'Facebook OAuth pressed' })}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
