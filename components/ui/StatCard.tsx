import React from 'react';
import { View, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface StatCardProps {
  label: string;
  value: string;
  trend?: number; // e.g., 3.2 for +3.2%, -1.5 for -1.5%
  trendLabel?: string; // e.g., "vs last week"
  chartSlot?: React.ReactNode;
}

export const StatCard = ({ label, value, trend, trendLabel, chartSlot }: StatCardProps) => {
  const isPositive = trend && trend >= 0;

  return (
    <View className="bg-surfaceLight rounded-card p-5 shadow-sm shadow-black/5 mb-4 border border-border flex-1">
      <Text className="text-label text-textSecondaryLight font-serif-regular mb-1">{label}</Text>
      <View className="flex-row items-end mb-2">
        <Text className="text-heading text-textOnLight font-serif-bold mr-2">{value}</Text>
        {trend !== undefined && (
          <View className="flex-row items-center mb-1 bg-surfaceGray px-2 py-1 rounded-icon">
            <FontAwesome name={isPositive ? 'arrow-up' : 'arrow-down'} size={10} color={isPositive ? '#10B981' : '#EF4444'} />
            <Text className={`text-caption ml-1 font-serif-semibold ${isPositive ? 'text-success' : 'text-error'}`}>
              {Math.abs(trend)}%
            </Text>
          </View>
        )}
      </View>
      {trendLabel && (
        <Text className="text-caption text-textMuted font-serif-regular mb-3">{trendLabel}</Text>
      )}
      {chartSlot && (
        <View className="h-12 w-full mt-auto">
          {chartSlot}
        </View>
      )}
    </View>
  );
};
