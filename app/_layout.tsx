import '../global.css';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { useColorScheme } from '@/components/useColorScheme';
import { useAuthStore } from '@/store/authStore';
import { useSplashStore } from '@/store/splashStore';
import { AnimatedSplashScreen } from '@/components/splash/AnimatedSplashScreen';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(auth)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'LibertinusSerif-Regular': require('../assets/fonts/LibertinusSerif-Regular.otf'),
    'LibertinusSerif-Bold': require('../assets/fonts/LibertinusSerif-Bold.otf'),
    'LibertinusSerif-Semibold': require('../assets/fonts/LibertinusSerif-Semibold.otf'),
    'LibertinusSerif-Italic': require('../assets/fonts/LibertinusSerif-Italic.otf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Note: the native splash is hidden by <AnimatedSplashScreen> once it mounts,
  // not here — see that component for why the handoff is flicker-free.
  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const hydrated = useAuthStore((state) => state.hydrated);
  const [splashVisible, setSplashVisible] = useState(true);

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
        {splashVisible && (
          <AnimatedSplashScreen
            ready={hydrated}
            onFinish={() => {
              setSplashVisible(false);
              useSplashStore.getState().setSplashDone(true);
            }}
          />
        )}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
