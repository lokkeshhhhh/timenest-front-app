import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ChartCardProps {
  title: string;
  chartSlot: React.ReactNode;
  periods?: string[]; // e.g. ['Day', 'Week', 'Month']
}

export const ChartCard = ({ title, chartSlot, periods }: ChartCardProps) => {
  const [activePeriod, setActivePeriod] = useState(periods ? periods[0] : '');

  return (
    <View className="bg-surfaceLight rounded-card p-5 shadow-sm shadow-black/5 mb-4 border border-border w-full">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-subheading text-textOnLight font-serif-bold">{title}</Text>
        
        {periods && periods.length > 0 && (
          <View className="flex-row bg-surfaceGray rounded-input p-1">
            {periods.map((period) => (
              <TouchableOpacity
                key={period}
                onPress={() => setActivePeriod(period)}
                className={`px-3 py-1.5 rounded-input ${activePeriod === period ? 'bg-surfaceLight shadow-sm shadow-black/5' : 'bg-transparent'}`}
              >
                <Text className={`text-caption font-serif-semibold ${activePeriod === period ? 'text-textOnLight' : 'text-textSecondaryLight'}`}>
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
