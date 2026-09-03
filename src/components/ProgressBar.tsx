import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export function ProgressBar({ progress, color }: { progress: number; color?: string }) {
  const pct = Math.max(0, Math.min(1, progress));
  const anim = useRef(new Animated.Value(pct)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: pct,
      useNativeDriver: false,
      friction: 9,
      tension: 60,
    }).start();
  }, [pct, anim]);

  return (
    <View style={styles.track}>
      <Animated.View
        style={[
          styles.fill,
          {
            backgroundColor: color ?? colors.success,
            width: anim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          },
        ]}
      />
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
  },
});
