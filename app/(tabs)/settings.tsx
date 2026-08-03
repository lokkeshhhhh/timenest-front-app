import React, { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { AuthService } from '../../services/auth';
import { clearSession } from '../../utils/session';
import { MenuRow } from '../../components/ui/MenuRow';
import { SectionLabel } from '../../components/ui/SectionLabel';
import { ThemeToggle } from '../../components/ui/ThemeToggle';

export default function SettingsScreen() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          setSigningOut(true);
          try {
            await AuthService.logout();
          } catch {
            // best-effort — clear the local session regardless of server outcome
          } finally {
            clearSession();
            router.replace('/(auth)/login');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background dark:bg-backgroundDark">
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <Text className="text-heading font-serif-bold text-textOnLight dark:text-textOnDark mt-4 mb-6">
          Settings
        </Text>

        <SectionLabel>Appearance</SectionLabel>
        <ThemeToggle />

        <SectionLabel>Security</SectionLabel>
        <View className="bg-surfaceLight dark:bg-white/5 rounded-card px-4 border border-border dark:border-white/10">
          <MenuRow icon="lock" label="Change password" onPress={() => router.push('/change-password')} />
          <MenuRow
            icon="shield"
            label="Two-factor authentication"
            onPress={() => router.push('/two-factor')}
            last
          />
        </View>

        <SectionLabel>Session</SectionLabel>
        <View className="bg-surfaceLight dark:bg-white/5 rounded-card px-4 border border-border dark:border-white/10">
          <MenuRow
            icon="sign-out"
            label={signingOut ? 'Signing out…' : 'Sign out'}
            destructive
            showChevron={false}
            onPress={signingOut ? undefined : handleSignOut}
            last
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
