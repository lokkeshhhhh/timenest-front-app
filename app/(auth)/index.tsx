import { Redirect } from 'expo-router';
import { useAuthStore } from '../../store/authStore';

// Safety-net fallback in case something ever lands on the bare "/(auth)" path
// directly. The real routing decision lives in app/index.tsx.
export default function AuthIndex() {
  const hydrated = useAuthStore((state) => state.hydrated);
  const token = useAuthStore((state) => state.token);
  const hasSeenOnboarding = useAuthStore((state) => state.hasSeenOnboarding);

  if (!hydrated) return null;

  if (token) return <Redirect href="/(tabs)" />;
  if (!hasSeenOnboarding) return <Redirect href="/(auth)/onboarding" />;
  return <Redirect href="/(auth)/login" />;
}
