import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function ChatListScreen() {
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-background dark:bg-backgroundDark">
      <Text className="text-heading font-serif-bold text-textOnLight dark:text-textOnDark px-5 mt-4 mb-6">
        Chat
      </Text>
      <View className="flex-1 items-center justify-center px-10 -mt-16">
        <View className="w-20 h-20 rounded-full bg-surfaceGray dark:bg-white/10 items-center justify-center mb-5">
          <FontAwesome name="comments-o" size={30} color="#8FA0B5" />
        </View>
        <Text className="text-subheading font-serif-bold text-textOnLight dark:text-textOnDark mb-2 text-center">
          No conversations yet
        </Text>
        <Text className="text-body text-textSecondaryLight dark:text-textSecondaryDark text-center leading-6">
          Team chat is coming soon — you'll see your conversations here.
        </Text>
      </View>
    </SafeAreaView>
  );
}
