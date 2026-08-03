import React from 'react';
import { Text } from 'react-native';

export function SectionLabel({ children }: { children: string }) {
  return (
    <Text className="text-label font-serif-semibold text-textSecondaryLight dark:text-textSecondaryDark uppercase mb-2 mt-6">
      {children}
    </Text>
  );
}
