import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useColorScheme } from '../useColorScheme';

interface ScreenHeaderProps {
  title: string;
  rightSlot?: React.ReactNode;
}

/** Back-chevron + title bar for stack screens pushed on top of the tab shell. */
export const ScreenHeader = ({ title, rightSlot }: ScreenHeaderProps) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scheme = useColorScheme();
  const iconColor = scheme === 'dark' ? '#FFFFFF' : '#1E2229';

  return (
    <View
      style={{ paddingTop: insets.top + 8 }}
      className="flex-row items-center px-4 pb-4 bg-background dark:bg-backgroundDark"
    >
      <TouchableOpacity
        onPress={() => router.back()}
        hitSlop={12}
        className="w-9 h-9 rounded-icon bg-surfaceGray dark:bg-white/10 items-center justify-center mr-3"
      >
        <FontAwesome name="angle-left" size={20} color={iconColor} />
      </TouchableOpacity>
      <Text className="text-subheading font-serif-bold text-textOnLight dark:text-textOnDark flex-1">
        {title}
      </Text>
      {rightSlot}
    </View>
  );
};
