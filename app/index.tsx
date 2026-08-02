import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/authStore';

export default function Index() {
  const hydrated = useAuthStore((state) => state.hydrated);
  const token = useAuthStore((state) => state.token);
  const hasSeenOnboarding = useAuthStore((state) => state.hasSeenOnboarding);

  // The animated splash overlay (mounted in the root layout) stays on screen
  // until hydration finishes, so nothing is visibly shown while this is null.
  if (!hydrated) return null;

  if (token) return <Redirect href="/(tabs)" />;
  if (!hasSeenOnboarding) return <Redirect href="/(auth)/onboarding" />;
  return <Redirect href="/(auth)/login" />;
}
