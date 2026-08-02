import React from 'react';
import { Text, View } from 'react-native';

/** Human-readable role display only — never used for gating, permissions are. */
export const RoleBadge = ({ label }: { label: string }) => {
  return (
    <View className="bg-primaryLight dark:bg-white/10 px-3 py-1 rounded-icon self-start">
      <Text className="text-caption font-serif-semibold text-primary dark:text-textOnDark uppercase">
        {label}
      </Text>
    </View>
  );
};
