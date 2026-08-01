import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface SocialLoginRowProps {
  onGooglePress?: () => void;
  onApplePress?: () => void;
  onFacebookPress?: () => void;
}

export const SocialLoginRow = ({ onGooglePress, onApplePress, onFacebookPress }: SocialLoginRowProps) => {
  return (
    <View className="flex-row justify-center items-center mt-6 space-x-4 gap-4">
      <TouchableOpacity
        className="w-12 h-12 rounded-icon bg-surfaceLight border border-border items-center justify-center shadow-sm shadow-black/10"
        onPress={onFacebookPress}
        activeOpacity={0.8}
      >
        <FontAwesome name="facebook" size={20} color="#1A1A1A" />
      </TouchableOpacity>
      <TouchableOpacity
        className="w-12 h-12 rounded-icon bg-surfaceLight border border-border items-center justify-center shadow-sm shadow-black/10"
        onPress={onGooglePress}
        activeOpacity={0.8}
      >
        <FontAwesome name="google" size={20} color="#1A1A1A" />
      </TouchableOpacity>
      <TouchableOpacity
        className="w-12 h-12 rounded-icon bg-surfaceLight border border-border items-center justify-center shadow-sm shadow-black/10"
        onPress={onApplePress}
        activeOpacity={0.8}
      >
        <FontAwesome name="apple" size={20} color="#1A1A1A" />
      </TouchableOpacity>
    </View>
  );
};
