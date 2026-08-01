import React, { useRef, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

interface OtpInputProps {
  length?: number;
  value: string;
  onChangeText: (text: string) => void;
}

export const OtpInput = ({ length = 6, value, onChangeText }: OtpInputProps) => {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const renderCells = () => {
    const cells = [];
    for (let i = 0; i < length; i++) {
      const char = value[i] || '';
      const isActive = isFocused && value.length === i;
      cells.push(
        <View
          key={i}
          className={`w-12 h-14 bg-surfaceLight border-2 justify-center items-center rounded-otp shadow-sm shadow-black/5 ${isActive ? 'border-textOnLight' : 'border-border'}`}
        >
          <Text className="text-heading text-textOnLight font-serif-bold">{char}</Text>
        </View>
      );
    }
    return cells;
  };

  return (
    <View className="w-full relative items-center mb-6">
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()}
        className="flex-row justify-center w-full space-x-3 gap-3"
      >
        {renderCells()}
      </TouchableOpacity>
      
      {/* Hidden actual input */}
      <TextInput
        ref={inputRef}
        className="absolute opacity-0 w-full h-full"
        value={value}
        onChangeText={(text) => {
          // Only allow numbers and up to the length
          const cleaned = text.replace(/[^0-9]/g, '').slice(0, length);
          onChangeText(cleaned);
        }}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </View>
  );
};
