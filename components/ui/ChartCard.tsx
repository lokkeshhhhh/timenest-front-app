import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { shadowSm } from '../../constants/shadows';

interface ChartCardProps {
  title: string;
  chartSlot: React.ReactNode;
  periods?: string[]; // e.g. ['Day', 'Week', 'Month']
}

export const ChartCard = ({ title, chartSlot, periods }: ChartCardProps) => {
  const [activePeriod, setActivePeriod] = useState(periods ? periods[0] : '');

  return (
    <View
      style={shadowSm}
      className="bg-surfaceLight dark:bg-white/5 rounded-card p-5 mb-4 border border-border dark:border-white/10 w-full"
    >
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-subheading text-textOnLight dark:text-textOnDark font-serif-bold">{title}</Text>

        {periods && periods.length > 0 && (
          <View className="flex-row bg-surfaceGray dark:bg-surfaceGrayDark rounded-input p-1">
            {periods.map((period) => (
              <TouchableOpacity
                key={period}
                onPress={() => setActivePeriod(period)}
                style={activePeriod === period ? shadowSm : undefined}
                className={`px-3 py-1.5 rounded-input ${activePeriod === period ? 'bg-surfaceLight dark:bg-white/10' : 'bg-transparent'}`}
              >
                <Text className={`text-caption font-serif-semibold ${activePeriod === period ? 'text-textOnLight dark:text-textOnDark' : 'text-textSecondaryLight dark:text-textSecondaryDark'}`}>
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      
      <View className="w-full min-h-[200px] justify-center items-center">
        {chartSlot}
      </View>
    </View>
  );
};
