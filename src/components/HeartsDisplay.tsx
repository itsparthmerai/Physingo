import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

export function HeartsDisplay({ hearts, maxHearts = 5 }: { hearts: number; maxHearts?: number }) {
  const prevHearts = useRef(hearts);
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (hearts < prevHearts.current) {
      shake.setValue(0);
      Animated.sequence([
        Animated.timing(shake, { toValue: 1, duration: 45, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -1, duration: 45, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 1, duration: 45, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 45, useNativeDriver: true }),
      ]).start();
    }
    prevHearts.current = hearts;
  }, [hearts, shake]);

  const translateX = shake.interpolate({ inputRange: [-1, 0, 1], outputRange: [-5, 0, 5] });

  return (
    <Animated.View style={[styles.row, { transform: [{ translateX }] }]}>
      {Array.from({ length: maxHearts }).map((_, i) => (
        <Text key={i} style={styles.heart}>
          {i < hearts ? '❤️' : '🤍'}
        </Text>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 2 },
  heart: { fontSize: 18 },
});
