import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ApplyLeaveScreen() {
  return (
    <View style={styles.container}>
      <Text>Apply for Leave</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
