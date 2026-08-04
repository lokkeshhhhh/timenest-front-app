import React, { useEffect } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useTheme, ThemeColors } from '../../hooks/useTheme';
import { shadow2xl } from '../../constants/shadows';
import { PrimaryButton } from './PrimaryButton';
import { AppModalVariant, useModalStore } from '../../store/modalStore';

const VARIANT_META: Record<
  AppModalVariant,
  { icon: React.ComponentProps<typeof FontAwesome>['name']; bgClass: string; color: (colors: ThemeColors) => string }
> = {
  success: { icon: 'check-circle', bgClass: 'bg-success/10', color: (c) => c.success },
  error: { icon: 'times-circle', bgClass: 'bg-errorBg dark:bg-errorBgDark', color: (c) => c.error },
  warning: { icon: 'exclamation-triangle', bgClass: 'bg-warningBg dark:bg-warningBgDark', color: (c) => c.warning },
  info: { icon: 'bell', bgClass: 'bg-primaryLight dark:bg-primaryLightDark', color: (c) => c.primary },
};

/**
 * The app's single modal surface — mounted once in app/_layout.tsx and
 * driven imperatively via showAppModal() (store/modalStore.ts), the same
 * way Alert.alert is called, but rendered with the real design system.
 * Field-level form validation must NEVER go through this — it belongs
 * inline on the input (AppTextInput's `error` prop). This is only for
 * confirmations and action results (success/error/destructive-confirm).
 */
export function AppModal() {
  const { visible, variant, title, message, actions, hide } = useModalStore();
  const { colors, scheme } = useTheme();

  const cardScale = useSharedValue(0.9);
  const iconScale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      cardScale.value = withTiming(1, { duration: 180 });
      iconScale.value = withDelay(90, withSpring(1, { damping: 9, stiffness: 160 }));
    } else {
      cardScale.value = 0.9;
      iconScale.value = 0;
    }
  }, [visible, cardScale, iconScale]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardScale.value,
  }));
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const meta = VARIANT_META[variant];
  // `primary` is a dark maroon — same hex in both modes — so on a dark
  // surface it reads fine as a border/text accent but not as an icon glyph
  // against its own tinted-dark background; swap to the on-dark text color
  // there, the same fix RoleBadge already applies for the same reason.
  const iconColor = variant === 'info' && scheme === 'dark' ? colors.textOnSurface : meta.color(colors);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={hide} statusBarTranslucent>
      <View className="flex-1 items-center justify-center px-8" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        {/*
          NativeWind's className-derived styles (background/border here) don't
          reliably combine with an animated `opacity` on the SAME Animated.View
          on web — it renders fully transparent. Splitting the animation-only
          wrapper (plain `style`, no className) from the classed content view
          sidesteps that interop gap entirely instead of depending on it.
        */}
        <Animated.View style={cardStyle} className="w-full">
          {/*
            `bg-surfaceLight dark:bg-white/5` (the usual card convention) is a
            translucent tint meant for cards sitting flat on the page
            background — fine there, but this card sits over a dimmed
            backdrop with real content behind it, so a 5% overlay reads as
            see-through instead of solid. Needs a genuinely opaque fill in
            both modes, which only the raw token (not a tailwind class) gives.
          */}
          <View
            style={[shadow2xl, { backgroundColor: colors.surface }]}
            className="w-full border border-border dark:border-white/10 rounded-card p-6 items-center"
          >
            <Animated.View style={iconStyle}>
              <View
                className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${meta.bgClass}`}
              >
                <FontAwesome name={meta.icon} size={28} color={iconColor} />
              </View>
            </Animated.View>

            <Text className="text-subheading font-serif-bold text-textOnLight dark:text-textOnDark text-center mb-1">
              {title}
            </Text>
            {message ? (
              <Text className="text-body text-textSecondaryLight dark:text-textSecondaryDark text-center leading-6 mb-6">
                {message}
              </Text>
            ) : (
              <View className="mb-4" />
            )}

            <View className="w-full" style={{ gap: 10 }}>
              {actions.map((action, index) => {
                const isPrimary = index === actions.length - 1;
                if (!isPrimary) {
                  return (
                    <TouchableOpacity
                      key={action.label}
                      onPress={() => {
                        hide();
                        action.onPress?.();
                      }}
                      className="py-3.5 items-center"
                    >
                      <Text className="text-body font-serif-semibold text-textSecondaryLight dark:text-textSecondaryDark">
                        {action.label}
                      </Text>
                    </TouchableOpacity>
                  );
                }
                return (
                  <PrimaryButton
                    key={action.label}
                    title={action.label}
                    onPress={() => {
                      hide();
                      action.onPress?.();
                    }}
                    className={action.destructive ? 'bg-error' : ''}
                  />
                );
              })}
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
