import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '../../hooks/useTheme';
import { shadowSmStrong } from '../../constants/shadows';

const ICONS: Record<string, React.ComponentProps<typeof FontAwesome>['name']> = {
  index: 'home',
  chat: 'comments',
  profile: 'user',
  settings: 'cog',
};

/**
 * Floating capsule tab bar: every tab is the same fixed-size circular icon
 * button, active one filled with the accent color. Deliberately uniform —
 * an earlier version made the active tab a wider pill with a text label,
 * which produced uneven edge spacing (the bar's content width changed
 * depending on which tab, and how long its label, was active) and shifted
 * neighboring buttons whenever the active tab changed. Fixed-size circles
 * can't have either problem: every slot is identical regardless of state.
 */
export function AppTabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
  const { colors } = useTheme();

  return (
    <View style={{ paddingBottom: insets.bottom + 12 }} className="items-center px-6">
      <View
        style={shadowSmStrong}
        className="flex-row bg-surface dark:bg-backgroundDark rounded-full border border-border dark:border-white/10 px-3 py-2"
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
              className={`w-12 h-12 rounded-full items-center justify-center mx-1 ${
                isFocused ? 'bg-primary' : ''
              }`}
            >
              <FontAwesome name={icon} size={18} color={isFocused ? '#FFFFFF' : colors.textSecondary} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
