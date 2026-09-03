import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export function TopicCard({
  title,
  description,
  icon,
  color,
  completed,
  total,
  onPress,
}: {
  title: string;
  description: string;
  icon: string;
  color: string;
  completed: number;
  total: number;
  onPress: () => void;
}) {
  const pct = total > 0 ? completed / total : 0;
  const done = completed === total && total > 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.iconWrap, { backgroundColor: color }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>
      <View style={styles.footer}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: color }]} />
        </View>
        <Text style={styles.count}>
          {done ? '✓ Complete' : `${completed}/${total}`}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  pressed: { opacity: 0.85 },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  icon: { fontSize: 24 },
  title: { fontSize: 15, fontWeight: '800', color: colors.text, marginBottom: 2 },
  description: { fontSize: 12, color: colors.textMuted, lineHeight: 16, minHeight: 32 },
  footer: { marginTop: 12, gap: 6 },
  track: { height: 6, borderRadius: 3, backgroundColor: colors.border, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
  count: { fontSize: 11, fontWeight: '700', color: colors.textMuted },
});
