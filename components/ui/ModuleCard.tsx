import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '../useColorScheme';

interface ModuleCardProps {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  label: string;
  subtitle?: string;
  onPress?: () => void;
  disabled?: boolean;
  badge?: string;
}

/** Half-width dashboard shortcut card. `disabled` renders the "coming soon" look. */
export const ModuleCard = ({ icon, label, subtitle, onPress, disabled, badge }: ModuleCardProps) => {
  const scheme = useColorScheme();
  const iconColor = scheme === 'dark' ? '#FFFFFF' : '#3D2834';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || !onPress}
      activeOpacity={0.85}
      className={`bg-surfaceLight dark:bg-white/5 rounded-card p-4 border border-border dark:border-white/10 w-[48%] mb-4 ${
        disabled ? 'opacity-50' : ''
      }`}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="w-10 h-10 rounded-icon bg-surfaceGray dark:bg-white/10 items-center justify-center">
          <FontAwesome name={icon} size={17} color={iconColor} />
        </View>
        {badge ? (
          <View className="bg-warningBg px-2 py-0.5 rounded-icon">
            <Text className="text-[10px] font-serif-semibold text-warning uppercase">{badge}</Text>
          </View>
        ) : null}
      </View>
      <Text className="text-label font-serif-bold text-textOnLight dark:text-textOnDark">{label}</Text>
      {subtitle ? (
        <Text className="text-caption text-textSecondaryLight dark:text-textSecondaryDark mt-0.5">
          {subtitle}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};
