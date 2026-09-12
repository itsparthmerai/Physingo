import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { LessonNode } from './LessonNode';
import type { Lesson } from '../content/types';

const NODE_SIZE_BASE = 84;
const ROW_HEIGHT_BASE = 150;
const TOP_PADDING_BASE = 30;
const PHASE = 1.15;

/** Themed decoration sets so different units feel like different corners of the same park. */
const SCENERY_THEMES: string[][] = [
  ['🌼', '🌿', '🍀', '🦋'],
  ['🌳', '🌲', '🍃', '🐿️'],
  ['🌸', '🌻', '🐝', '🌿'],
  ['🍁', '🍂', '🌰', '🐿️'],
  ['🌾', '🪷', '🐸', '💧'],
  ['🌳', '🍄', '🍃', '🦔'],
];

/** Deterministic 0-1 pseudo-random value from an integer seed (stable across re-renders). */
function hashFrac(n: number): number {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const cur = points[i];
    const midX = (prev.x + cur.x) / 2;
    const midY = (prev.y + cur.y) / 2;
    d += ` Q ${prev.x} ${prev.y} ${midX} ${midY}`;
  }
  const last = points[points.length - 1];
  d += ` T ${last.x} ${last.y}`;
  return d;
}

export interface LessonPathNode {
  lesson: Lesson;
  locked: boolean;
  stars: number;
}

export function LessonPath({
  nodes,
  topicColor,
  scale,
  themeIndex,
  onPressLesson,
}: {
  nodes: LessonPathNode[];
  topicColor: string;
  scale: number;
  themeIndex: number;
  onPressLesson: (lessonId: string) => void;
}) {
  const [width, setWidth] = useState(0);

  const nodeSize = NODE_SIZE_BASE * scale;
  const rowHeight = ROW_HEIGHT_BASE * scale;
  const topPadding = TOP_PADDING_BASE * scale;
  const height = topPadding + Math.max(0, nodes.length - 1) * rowHeight + nodeSize + 44 * scale;

  const centerX = width / 2;
  const amplitude = Math.min(width * 0.27, 110 * scale);
  const theme = SCENERY_THEMES[themeIndex % SCENERY_THEMES.length];

  const centers = nodes.map((_, i) => ({
    x: centerX + amplitude * Math.sin(i * PHASE),
    y: topPadding + nodeSize / 2 + i * rowHeight,
  }));

  return (
    <View
      style={{ height, width: '100%' }}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {width > 0 && (
        <>
          {/* Ambient scenery near the top of the path */}
          <Scenery emoji={theme[0]} x={width * 0.1} y={topPadding * 0.5} size={20 * scale} opacity={0.5} />
          <Scenery emoji={theme[1]} x={width * 0.9} y={topPadding * 0.7} size={16 * scale} opacity={0.4} />

          <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
            <Path
              d={smoothPath(centers)}
              stroke="#C9B37E"
              strokeWidth={6 * scale}
              strokeLinecap="round"
              strokeDasharray={`1 ${16 * scale}`}
              fill="none"
            />
          </Svg>

          {centers.map((c, i) => {
            const side = c.x < centerX ? 1 : -1;
            const inset = 26 * scale + hashFrac(i * 5 + themeIndex) * 14 * scale;
            const decoX = side > 0 ? width - inset : inset;
            const decoY = c.y + (hashFrac(i * 7 + themeIndex * 3) - 0.5) * rowHeight * 0.5;
            const decoSize = (22 + hashFrac(i * 3 + themeIndex) * 12) * scale;
            const emoji = theme[(i + themeIndex) % theme.length];
            return <Scenery key={`deco-${i}`} emoji={emoji} x={decoX} y={decoY} size={decoSize} opacity={0.85} />;
          })}

          {centers.map((c, i) => (
            <View
              key={nodes[i].lesson.id}
              style={{
                position: 'absolute',
                left: c.x - (100 * scale) / 2,
                top: c.y - nodeSize / 2,
                width: 100 * scale,
              }}
            >
              <LessonNode
                title={nodes[i].lesson.title}
                stars={nodes[i].stars}
                locked={nodes[i].locked}
                topicColor={topicColor}
                scale={scale}
                onPress={() => onPressLesson(nodes[i].lesson.id)}
              />
            </View>
          ))}
        </>
      )}
    </View>
  );
}

function Scenery({ emoji, x, y, size, opacity }: { emoji: string; x: number; y: number; size: number; opacity: number }) {
  return (
    <View pointerEvents="none" style={[styles.scenery, { left: x - size / 2, top: y - size / 2, opacity }]}>
      <Text style={{ fontSize: size, lineHeight: size }}>{emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scenery: {
    position: 'absolute',
  },
});
