import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export function StatPill({ icon, value }: { icon: string; value: string | number }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: { fontSize: 16 },
  value: { fontSize: 14, fontWeight: '700', color: colors.text },
});
