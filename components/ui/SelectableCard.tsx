import React, { useEffect } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolateColor } from 'react-native-reanimated';

interface SelectableCardProps {
  title: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
}

export const SelectableCard = ({ title, description, selected, onSelect }: SelectableCardProps) => {
  const progress = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(selected ? 1 : 0, { duration: 250 });
  }, [selected, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#E5E7EB', '#1A1A1A'] // border to textOnLight
    );
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#FFFFFF', '#F5F5F5'] // surfaceLight to surfaceGray
    );
    
    return {
      borderColor,
      backgroundColor,
    };
  });

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onSelect}
      className="mb-4 shadow-sm shadow-black/5"
    >
      <Animated.View
        className="rounded-input p-5 border-2 flex-row items-start"
        style={animatedStyle}
      >
        <View className="flex-1 pr-4">
          <Text className="text-body font-serif-bold text-textOnLight mb-1">{title}</Text>
          {description ? (
            <Text className="text-label text-textSecondaryLight leading-5">
              {description}
            </Text>
          ) : null}
        </View>
        <View className="pt-1">
          <View className={`w-6 h-6 rounded-icon border-2 justify-center items-center ${selected ? 'border-textOnLight bg-textOnLight' : 'border-border bg-transparent'}`}>
            {selected && <FontAwesome name="check" size={12} color="#FFFFFF" />}
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};
