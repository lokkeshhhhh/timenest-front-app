import React from 'react';
import { View, ViewProps } from 'react-native';
import { shadow2xl } from '../../constants/shadows';

interface AuthCardProps extends ViewProps {
  children: React.ReactNode;
}

export const AuthCard = ({ children, className = '', style, ...props }: AuthCardProps) => {
  return (
    <View
      style={[shadow2xl, style]}
      className={`bg-surfaceLight rounded-card w-full p-8 mb-8 mx-auto mt-6 ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};
