import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export function ProgressBar({ progress }: { progress: number }) {
  const pct = Math.max(0, Math.min(1, progress));
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${pct * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 14,
    borderRadius: 8,
    backgroundColor: colors.border,
    overflow: 'hidden',
    flex: 1,
  },
  fill: {
    height: '100%',
    borderRadius: 8,
    backgroundColor: colors.success,
  },
});
