import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme, ThemePreference } from '../../hooks/useTheme';
import { shadowSm } from '../../constants/shadows';

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

/** Three-way System / Light / Dark segmented control, backed by useTheme(). */
export function ThemeToggle() {
  const { preference, setPreference } = useTheme();

  return (
    <View className="flex-row bg-surfaceGray dark:bg-surfaceGrayDark rounded-input p-1">
      {OPTIONS.map((option) => {
        const active = preference === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => setPreference(option.value)}
            activeOpacity={0.8}
            style={active ? shadowSm : undefined}
            className={`flex-1 items-center py-2.5 rounded-input ${
              active ? 'bg-surfaceLight dark:bg-white/10' : ''
            }`}
          >
            <Text
              className={`text-label font-serif-semibold ${
                active
                  ? 'text-textOnLight dark:text-textOnDark'
                  : 'text-textSecondaryLight dark:text-textSecondaryDark'
              }`}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
