import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { ScreenHeader } from '../../../components/ui/ScreenHeader';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  return (
    <SafeAreaView edges={['bottom']} className="flex-1 bg-background dark:bg-backgroundDark">
      <ScreenHeader title="Conversation" />
      <Text className="text-body text-textSecondaryLight dark:text-textSecondaryDark text-center mt-10 px-8">
        Chat thread {id} is coming soon.
      </Text>
    </SafeAreaView>
  );
}
