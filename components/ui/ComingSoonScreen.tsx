import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ScreenHeader } from './ScreenHeader';

interface ComingSoonScreenProps {
  title: string;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  description?: string;
}

/** Route stub for a module screen that isn't built yet — keeps nav from crashing. */
export const ComingSoonScreen = ({ title, icon, description }: ComingSoonScreenProps) => {
  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-background dark:bg-backgroundDark">
      <ScreenHeader title={title} />
      <View className="flex-1 items-center justify-center px-10">
        <View className="w-20 h-20 rounded-full bg-surfaceGray dark:bg-white/10 items-center justify-center mb-5">
          <FontAwesome name={icon} size={30} color="#8FA0B5" />
        </View>
        <Text className="text-subheading font-serif-bold text-textOnLight dark:text-textOnDark mb-2 text-center">
          Coming soon
        </Text>
        <Text className="text-body text-textSecondaryLight dark:text-textSecondaryDark text-center leading-6">
          {description || `${title} is on its way — check back soon.`}
        </Text>
      </View>
    </SafeAreaView>
  );
};
