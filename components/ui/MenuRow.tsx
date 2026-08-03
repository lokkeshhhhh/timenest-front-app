import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface MenuRowProps {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  label: string;
  subtitle?: string;
  onPress?: () => void;
  rightSlot?: React.ReactNode;
  destructive?: boolean;
  showChevron?: boolean;
  /** Set on the last row in a group to skip the separator line. */
  last?: boolean;
}

export const MenuRow = ({
  icon,
  label,
  subtitle,
  onPress,
  rightSlot,
  destructive,
  showChevron = true,
  last = false,
}: MenuRowProps) => {
  const labelColorClass = destructive ? 'text-error' : 'text-textOnLight dark:text-textOnDark';
  const iconColor = destructive ? '#FF5C5C' : '#8FA0B5';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
      className={`flex-row items-center py-3.5 ${last ? '' : 'border-b border-border dark:border-white/10'}`}
    >
      <View className="w-9 h-9 rounded-icon bg-surfaceGray dark:bg-surfaceGrayDark items-center justify-center mr-3">
        <FontAwesome name={icon} size={16} color={iconColor} />
      </View>
      <View className="flex-1">
        <Text className={`text-body font-serif-semibold ${labelColorClass}`}>{label}</Text>
        {subtitle ? (
          <Text className="text-label text-textSecondaryLight dark:text-textSecondaryDark mt-0.5">
            {subtitle}
          </Text>
        ) : null}
      </View>
      {rightSlot ?? (showChevron && onPress ? (
        <FontAwesome name="angle-right" size={20} color="#C7CDD6" />
      ) : null)}
    </TouchableOpacity>
  );
};
