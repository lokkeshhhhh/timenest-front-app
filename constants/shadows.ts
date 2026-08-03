import type { ViewStyle } from 'react-native';

/**
 * Plain RN `style`-based shadows — deliberately NOT NativeWind `shadow-*`
 * classNames. Those route through NativeWind's CSS-interop runtime, which
 * has a documented race with React Navigation's context: toggling theme
 * (or any app-wide re-render) while a `shadow-*` class is present —
 * especially one that's conditionally applied — can throw "Couldn't find
 * a navigation context" and tear down the navigator.
 * See https://github.com/nativewind/nativewind/issues/1432.
 * A plain `style` prop never touches that runtime, so it can't trigger it.
 */
export const shadowSm: ViewStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 1,
};

export const shadowSmStrong: ViewStyle = {
  ...shadowSm,
  shadowOpacity: 0.1,
};

export const shadowLg: ViewStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.05,
  shadowRadius: 16,
  elevation: 6,
};

export const shadow2xl: ViewStyle = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 16 },
  shadowOpacity: 0.2,
  shadowRadius: 28,
  elevation: 12,
};
