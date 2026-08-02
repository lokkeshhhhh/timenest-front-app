import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  showArrow?: boolean;
}

export const PrimaryButton = ({ title, loading, disabled, showArrow, className = '', ...props }: PrimaryButtonProps) => {
  return (
    <TouchableOpacity
      className={`bg-primary rounded-button flex-row items-center justify-center py-4 w-full ${disabled || loading ? 'opacity-50' : ''} ${className}`}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" className="mr-2" />
      ) : null}
      <Text className="text-white text-body font-serif-bold text-center">
        {title}
      </Text>
      {showArrow && !loading && (
        <View className="ml-2">
          <FontAwesome name="arrow-right" size={14} color="#FFFFFF" />
        </View>
      )}
    </TouchableOpacity>
  );
};
