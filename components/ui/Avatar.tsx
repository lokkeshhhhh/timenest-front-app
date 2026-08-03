import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';

interface AvatarProps {
  name: string;
  url?: string | null;
  size?: number;
}

// Drawn from the app's existing accent palette so a generated avatar never
// clashes with the rest of the design system.
const PALETTE = ['#3D2834', '#4B70A7', '#5A57E6', '#10B981', '#FFAB2E', '#9EC5AE'];

function colorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

function firstLetterOf(name: string): string {
  const trimmed = name.trim();
  return trimmed ? trimmed[0].toUpperCase() : '?';
}

/**
 * Single source of truth for rendering a user/org avatar anywhere in the
 * app. Renders the real photo when `url` is given and loads successfully;
 * otherwise (no url, or the image fails to load) falls back to the first
 * letter of `name` on a deterministic colored circle — entirely local, no
 * network round-trip, so it can never show a broken/empty image.
 */
export const Avatar = ({ name, url, size = 48 }: AvatarProps) => {
  const [failed, setFailed] = useState(false);
  const showImage = !!url && !failed;

  if (showImage) {
    return (
      <Image
        source={{ uri: url! }}
        onError={() => setFailed(true)}
        style={{ width: size, height: size, borderRadius: size / 2 }}
        className="bg-surfaceGray dark:bg-surfaceGrayDark"
      />
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colorForName(name || '?'),
      }}
      className="items-center justify-center"
    >
      <Text style={{ fontSize: size * 0.42 }} className="text-white font-serif-bold">
        {firstLetterOf(name)}
      </Text>
    </View>
  );
};
