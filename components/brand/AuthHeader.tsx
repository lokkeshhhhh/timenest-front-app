import React from 'react';
import { Text, View } from 'react-native';
import { ArcanaLogo } from './ArcanaLogo';

// Plain logo + wordmark lockup for auth screens — normal flow, top of the
// scrollable content. No fixed positioning, no background: the screen's own
// SafeAreaView handles keeping it clear of the status bar / notch.
export function AuthHeader() {
  return (
    <View style={{ alignItems: 'center', paddingTop: 4, marginBottom: 20 }}>
      <ArcanaLogo size={32} color="#1E2229" />
      <Text className="text-textOnLight text-[15px] font-serif-bold mt-1.5">Arcana</Text>
    </View>
  );
}
