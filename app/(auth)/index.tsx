import { Redirect } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function AuthIndex() {
  const hasSeenOnboarding = useAuthStore(state => state.hasSeenOnboarding);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#4C49ED" />
      </View>
    );
  }

  if (!hasSeenOnboarding) {
    return <Redirect href="/(auth)/onboarding" />;
  }
  
  return <Redirect href="/(auth)/login" />;
}
