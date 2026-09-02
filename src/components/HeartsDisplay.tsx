import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export function HeartsDisplay({ hearts, maxHearts = 5 }: { hearts: number; maxHearts?: number }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: maxHearts }).map((_, i) => (
        <Text key={i} style={styles.heart}>
          {i < hearts ? '❤️' : '🤍'}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 2 },
  heart: { fontSize: 18 },
});
