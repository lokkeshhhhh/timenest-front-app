import React, { useEffect } from 'react';
import { TouchableOpacity, Text, View, Image } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolateColor } from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';

export interface CardBadge {
  label: string;
  color?: 'primary' | 'warning' | 'success' | 'gray';
}

interface SelectableCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  avatarUrl?: string;
  avatarShape?: 'circle' | 'square';
  badges?: CardBadge[];
  selected: boolean;
  onSelect: () => void;
}

export const SelectableCard = ({ title, subtitle, description, icon, avatarUrl, avatarShape = 'square', badges, selected, onSelect }: SelectableCardProps) => {
  const { scheme } = useTheme();
  const isDark = scheme === 'dark';
  const progress = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(selected ? 1 : 0, { duration: 250 });
  }, [selected, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      isDark ? ['rgba(255,255,255,0.15)', '#FFFFFF'] : ['#E5E7EB', '#1A1A1A']
    );
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      isDark ? ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)'] : ['#FFFFFF', '#F5F5F5']
    );

    return {
      borderColor,
      backgroundColor,
    };
  });

  const renderBadge = (badge: CardBadge, idx: number) => {
    let bgClass = 'bg-surfaceGray dark:bg-surfaceGrayDark';
    let textClass = 'text-textSecondaryLight dark:text-textSecondaryDark';

    if (badge.color === 'primary') { bgClass = 'bg-primaryLight dark:bg-primaryLightDark'; textClass = 'text-primary dark:text-textOnDark'; }
    if (badge.color === 'warning') { bgClass = 'bg-warningBg dark:bg-warningBgDark'; textClass = 'text-warning'; }
    if (badge.color === 'success') { bgClass = 'bg-success/10'; textClass = 'text-success'; }

    return (
      <View key={idx} className={`px-2 py-1 rounded-md mr-2 mt-2 ${bgClass}`}>
        <Text className={`text-[10px] font-serif-semibold uppercase ${textClass}`}>{badge.label}</Text>
      </View>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onSelect}
      className="mb-4"
      style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 }}
    >
      <Animated.View
        className="rounded-[20px] p-5 border-2 flex-row"
        style={animatedStyle}
      >
        <View className="mr-4">
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              className={`w-14 h-14 bg-surfaceGray dark:bg-surfaceGrayDark ${avatarShape === 'circle' ? 'rounded-full' : 'rounded-2xl'}`}
            />
          ) : icon ? (
            icon
          ) : null}
        </View>
        <View className="flex-1 pr-4 justify-center">
          <Text className="text-body font-serif-bold text-textOnLight dark:text-textOnDark mb-1">{title}</Text>
          {subtitle ? (
            <Text className="text-label text-textSecondaryLight dark:text-textSecondaryDark mb-1">{subtitle}</Text>
          ) : null}
          {description ? (
            <Text className="text-label text-textSecondaryLight dark:text-textSecondaryDark leading-5">
              {description}
            </Text>
          ) : null}
          {badges && badges.length > 0 && (
            <View className="flex-row flex-wrap">
              {badges.map(renderBadge)}
            </View>
          )}
        </View>
        <View className="pt-1">
          <View className={`w-6 h-6 rounded-icon border-2 justify-center items-center ${selected ? 'border-textOnLight dark:border-textOnDark bg-textOnLight dark:bg-textOnDark' : 'border-border dark:border-white/20 bg-transparent'}`}>
            {selected && <FontAwesome name="check" size={12} color={isDark ? '#1E2229' : '#FFFFFF'} />}
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};
