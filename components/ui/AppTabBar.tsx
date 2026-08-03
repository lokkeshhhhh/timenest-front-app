import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const ICONS: Record<string, React.ComponentProps<typeof FontAwesome>['name']> = {
  index: 'home',
  chat: 'comments',
  profile: 'user',
  settings: 'cog',
};

/**
 * Floating capsule tab bar. The capsule itself is always solid black,
 * regardless of light/dark theme — everything else (this wrapper, the
 * screen behind it) is fully transparent, so nothing here paints its own
 * background. Colors are plain inline styles, not `dark:` classNames: this
 * bar re-renders on every theme change, and that's exactly the situation
 * that previously triggered NativeWind's navigation-context crash — fixed
 * signature avoids raising the risk again.
 */
export function AppTabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
  return (
    <View
      style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: insets.bottom + 12 }}
      className="items-center px-6"
    >
      <View
        style={{
          backgroundColor: '#000000',
          borderColor: 'rgba(255,255,255,0.12)',
          borderWidth: 1,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 10,
          elevation: 6,
        }}
        className="flex-row rounded-full px-3 py-2"
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = (options.title ?? route.name) as string;
          const isFocused = state.index === index;
          const icon = ICONS[route.name] ?? 'circle';

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel={label}
              accessibilityState={{ selected: isFocused }}
              style={{ backgroundColor: isFocused ? '#3D2834' : 'transparent' }}
              className="w-12 h-12 rounded-full items-center justify-center mx-1"
            >
              <FontAwesome name={icon} size={18} color={isFocused ? '#FFFFFF' : '#9CA3AF'} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
