import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Polygon } from 'react-native-svg';

export const ArcanaHeroBackground = () => (
  <View className="absolute top-0 left-0 right-0 bottom-0 opacity-20 items-center justify-center -mt-10 overflow-hidden">
    <Svg width="400" height="400" viewBox="0 0 100 100">
      <Path d="M50 15 L20 85 H40 L45 70 H65 L70 85 H90 L50 15 Z" fill="#333333" />
      <Polygon points="45,70 65,70 55,40" fill="#222222" />
    </Svg>
  </View>
);
