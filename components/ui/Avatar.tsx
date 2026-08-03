import React from 'react';
import { Image, View } from 'react-native';
import { resolveAvatarUrl } from '../../utils/avatar';

interface AvatarProps {
  name: string;
  url?: string | null;
  size?: number;
}

export const Avatar = ({ name, url, size = 48 }: AvatarProps) => {
  return (
    <View
      style={{ width: size, height: size, borderRadius: size / 2 }}
      className="bg-surfaceGray dark:bg-surfaceGrayDark overflow-hidden"
    >
      <Image
        source={{ uri: resolveAvatarUrl(name || '?', url, size * 2) }}
        style={{ width: size, height: size }}
      />
    </View>
  );
};
