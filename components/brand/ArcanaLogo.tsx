import React from 'react';
import Svg, { Path, Polygon } from 'react-native-svg';

export const ArcanaLogo = ({ size = 40, color = "#1A1A1A" }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Path d="M50 15 L20 85 H40 L45 70 H65 L70 85 H90 L50 15 Z" fill={color} />
    <Polygon points="45,70 65,70 55,40" fill="#FFFFFF" />
  </Svg>
);
