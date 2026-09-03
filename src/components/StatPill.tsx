import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '../theme/colors';

export function StatPill({
  icon,
  value,
  tint = colors.card,
  textColor = colors.text,
  scale = 1,
}: {
  icon: string;
  value: string | number;
  tint?: string;
  textColor?: string;
  scale?: number;
}) {
  return (
    <View
      style={[
        styles.pill,
        styles.shadow,
        {
          backgroundColor: tint,
          borderRadius: Math.round(20 * scale),
          paddingVertical: Math.round(7 * scale),
          paddingHorizontal: Math.round(13 * scale),
        },
      ]}
    >
      <Text style={{ fontSize: Math.round(16 * scale) }}>{icon}</Text>
      <Text style={[styles.value, { color: textColor, fontSize: Math.round(14 * scale) }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 2,
      },
      android: { elevation: 1 },
      default: {},
    }),
  },
  value: { fontWeight: '800' },
});
