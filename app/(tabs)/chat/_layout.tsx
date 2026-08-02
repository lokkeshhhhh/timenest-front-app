import { Stack } from 'expo-router';

// Encapsulates chat's index/[id] as one nested stack so the parent Tabs
// navigator sees a single "chat" route instead of flattening these files
// into their own tab-bar entries.
export default function ChatStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
