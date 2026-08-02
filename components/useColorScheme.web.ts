import { useEffect, useState } from 'react';
import { useColorScheme as useColorSchemeCore } from 'react-native';

// NOTE: The default React Native styling doesn't support server rendering.
// Server rendered styles should not change between the first render of the HTML
// and the first render on the client. Typically, web developers will use CSS media queries
// to render different styles on the client and server, these aren't directly supported in React Native
// but can be achieved using a styling library like Nativewind.
//
// NativeWind's own `dark:` classes are driven by a real CSS media query, so
// they already reflect the OS/browser preference from the first paint. But
// any component that reads this hook directly in JS (to pick a raw color for
// an icon, a tab bar, etc.) needs the same real value — returning a hardcoded
// 'light' here left every such component stuck in light mode on web. Report
// 'light' for the first render (matching the server, avoiding a hydration
// mismatch), then flip to the real value once mounted in the browser.
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useColorSchemeCore();
  if (!hasHydrated) return 'light';
  return colorScheme === 'unspecified' || !colorScheme ? 'light' : colorScheme;
}
