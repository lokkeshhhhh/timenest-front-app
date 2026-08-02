import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface AppTextInputProps extends TextInputProps {
  label: string;
  error?: string;
  secureTextEntry?: boolean;
}

export const AppTextInput = ({ label, error, secureTextEntry, ...props }: AppTextInputProps) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-5 w-full">
      <Text className="text-label text-textOnLight dark:text-textOnDark font-serif-semibold mb-2 ml-1">{label}</Text>
      <View className="relative w-full flex-row items-center">
        <TextInput
          className={`flex-1 bg-surfaceGray dark:bg-white/10 text-body text-textOnLight dark:text-textOnDark rounded-input px-4 py-4 border ${
            error ? 'border-error' : isFocused ? 'border-primary' : 'border-borderDark dark:border-white/10'
          } ${secureTextEntry ? 'pr-12' : ''}`}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isSecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{ fontFamily: 'LibertinusSerif-Regular' }}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            className="absolute right-4 top-0 bottom-0 justify-center items-center h-full"
            onPress={() => setIsSecure(!isSecure)}
          >
            <FontAwesome name={isSecure ? 'eye-slash' : 'eye'} size={20} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-error text-caption mt-1 ml-1">{error}</Text>}
    </View>
  );
};
