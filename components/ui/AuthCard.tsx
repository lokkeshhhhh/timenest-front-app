import React from 'react';
import { View, ViewProps } from 'react-native';

interface AuthCardProps extends ViewProps {
  children: React.ReactNode;
}

export const AuthCard = ({ children, className = '', ...props }: AuthCardProps) => {
  return (
    <View
      className={`bg-surfaceLight rounded-card w-full p-8 shadow-2xl shadow-black/20 elevation-10 mb-8 mx-auto mt-6 ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};
