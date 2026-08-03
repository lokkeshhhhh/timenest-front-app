import { Tabs } from 'expo-router';

import { useBootstrapSession } from '@/hooks/useBootstrapSession';
import { AppTabBar } from '@/components/ui/AppTabBar';

export default function TabLayout() {
  useBootstrapSession();

  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="chat" options={{ title: 'Chat' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
