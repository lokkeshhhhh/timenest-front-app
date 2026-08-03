import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';

interface ModuleCardProps {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  label: string;
  description?: string;
  onPress?: () => void;
  disabled?: boolean;
  badge?: string;
}

/** Half-width dashboard shortcut card. `disabled` renders the "coming soon" look. */
export const ModuleCard = ({ icon, label, description, onPress, disabled, badge }: ModuleCardProps) => {
  const { colors } = useTheme();
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * 0.04 }],
  }));

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={() => {
        pressed.value = withTiming(1, { duration: 100 });
      }}
      onPressOut={() => {
        pressed.value = withTiming(0, { duration: 150 });
      }}
      disabled={disabled || !onPress}
      activeOpacity={0.9}
      className="w-[48%] mb-4"
    >
      <Animated.View
        style={animatedStyle}
        className={`bg-surfaceLight dark:bg-white/5 rounded-card p-4 border border-border dark:border-white/10 ${
          disabled ? 'opacity-50' : ''
        }`}
      >
        <View className="flex-row items-center justify-between mb-3">
          <View className="w-10 h-10 rounded-icon bg-surfaceGray dark:bg-surfaceGrayDark items-center justify-center">
            <FontAwesome name={icon} size={17} color={colors.textOnSurface} />
          </View>
          {badge ? (
            <View className="bg-warningBg dark:bg-warningBgDark px-2 py-0.5 rounded-icon">
              <Text className="text-[10px] font-serif-semibold text-warning uppercase">{badge}</Text>
            </View>
          ) : null}
        </View>
        <Text className="text-label font-serif-bold text-textOnLight dark:text-textOnDark">{label}</Text>
        {description ? (
          <Text
            className="text-caption text-textSecondaryLight dark:text-textSecondaryDark mt-0.5"
            numberOfLines={2}>
            {description}
          </Text>
        ) : null}
      </Animated.View>
    </TouchableOpacity>
  );
};
