import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export function LessonNode({
  title,
  index,
  stars,
  locked,
  topicColor,
  onPress,
}: {
  title: string;
  index: number;
  stars: number;
  locked: boolean;
  topicColor: string;
  onPress: () => void;
}) {
  const completed = stars > 0;
  return (
    <View
      style={[
        styles.wrapper,
        index % 2 === 1 && styles.offsetRight,
        index % 2 === 0 && index !== 0 && styles.offsetLeft,
      ]}
    >
      <Pressable
        onPress={onPress}
        disabled={locked}
        style={[styles.node, { backgroundColor: locked ? colors.locked : completed ? colors.xp : topicColor }]}
      >
        <Text style={styles.icon}>{locked ? '🔒' : completed ? '⭐' : '▶'}</Text>
        {completed && (
          <View style={styles.starsRow}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Text key={i} style={styles.smallStar}>
                {i < stars ? '★' : '☆'}
              </Text>
            ))}
          </View>
        )}
      </Pressable>
      <Text style={styles.label} numberOfLines={2}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 100,
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 8,
  },
  offsetRight: { alignSelf: 'flex-end', marginRight: 30 },
  offsetLeft: { alignSelf: 'flex-start', marginLeft: 30 },
  node: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  icon: { fontSize: 22 },
  starsRow: { flexDirection: 'row', marginTop: 2 },
  smallStar: { fontSize: 10, color: colors.white },
  label: {
    width: 100,
    textAlign: 'center',
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
});
