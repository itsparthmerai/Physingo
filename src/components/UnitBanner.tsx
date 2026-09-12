import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Line, Path, Polygon } from 'react-native-svg';
import type { Unit } from '../content/types';
import { colors } from '../theme/colors';
import { rs } from '../theme/responsive';

/** Distinct banner background colors, cycled by unit index so neighboring units never match. */
const BANNER_COLORS = [
  '#14B8A6', // teal
  '#2E90D6', // blue
  '#8B5CF6', // violet
  '#FB5B85', // rose
  '#FF9600', // orange
  '#3C9F40', // forest green
  '#F2684B', // coral
  '#5B6EE8', // indigo
  '#E8A33D', // amber
];

const VIEW_W = 400;
const VIEW_H = 140;
const INK = 'rgba(255,255,255,0.24)';
const INK_SOFT = 'rgba(255,255,255,0.14)';

function BlobsPattern() {
  return (
    <>
      <Circle cx={355} cy={8} r={70} fill={INK} />
      <Circle cx={28} cy={148} r={58} fill={INK_SOFT} />
    </>
  );
}

function StripesPattern() {
  const lines = [];
  for (let x = -80; x < VIEW_W + 80; x += 46) {
    lines.push(<Line key={x} x1={x} y1={VIEW_H + 20} x2={x + 90} y2={-20} stroke={INK} strokeWidth={16} />);
  }
  return <>{lines}</>;
}

function DotGridPattern() {
  const dots = [];
  let i = 0;
  for (let y = 14; y < VIEW_H; y += 26) {
    for (let x = 14; x < VIEW_W; x += 30) {
      i++;
      dots.push(<Circle key={`${x}-${y}`} cx={x} cy={y} r={i % 3 === 0 ? 4.5 : 2.75} fill={i % 2 === 0 ? INK : INK_SOFT} />);
    }
  }
  return <>{dots}</>;
}

function ChevronPattern() {
  const rows = [];
  for (let row = 0; row < 4; row++) {
    const y = 4 + row * 34;
    const points: string[] = [];
    let up = true;
    for (let x = -20; x <= VIEW_W + 20; x += 34) {
      points.push(`${x},${up ? y + 16 : y - 16}`);
      up = !up;
    }
    rows.push(
      <Polygon key={row} points={points.join(' ')} fill="none" stroke={row % 2 === 0 ? INK : INK_SOFT} strokeWidth={5} />
    );
  }
  return <>{rows}</>;
}

function RingsPattern() {
  const cx = VIEW_W - 24;
  const cy = 18;
  return (
    <>
      <Circle cx={cx} cy={cy} r={28} stroke={INK} strokeWidth={6} fill="none" />
      <Circle cx={cx} cy={cy} r={52} stroke={INK_SOFT} strokeWidth={6} fill="none" />
      <Circle cx={cx} cy={cy} r={76} stroke={INK_SOFT} strokeWidth={5} fill="none" />
    </>
  );
}

function wavePath(y: number, amplitude: number): string {
  const step = 46;
  let d = `M -20 ${y}`;
  for (let x = -20; x < VIEW_W + 40; x += step * 2) {
    d += ` Q ${x + step / 2} ${y - amplitude} ${x + step} ${y}`;
    d += ` Q ${x + step * 1.5} ${y + amplitude} ${x + step * 2} ${y}`;
  }
  return d;
}

function WavesPattern() {
  return (
    <>
      <Path d={wavePath(26, 12)} stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
      <Path d={wavePath(68, 16)} stroke={INK_SOFT} strokeWidth={5} fill="none" strokeLinecap="round" />
      <Path d={wavePath(112, 10)} stroke={INK_SOFT} strokeWidth={5} fill="none" strokeLinecap="round" />
    </>
  );
}

function triangle(cx: number, cy: number, size: number, rotationDeg: number, fill: string) {
  const pts: [number, number][] = [
    [0, -size],
    [size * 0.87, size * 0.5],
    [-size * 0.87, size * 0.5],
  ];
  const rad = (rotationDeg * Math.PI) / 180;
  const points = pts
    .map(([x, y]) => {
      const rx = x * Math.cos(rad) - y * Math.sin(rad) + cx;
      const ry = x * Math.sin(rad) + y * Math.cos(rad) + cy;
      return `${rx},${ry}`;
    })
    .join(' ');
  return <Polygon points={points} fill={fill} />;
}

function TrianglesPattern() {
  return (
    <>
      {triangle(42, 30, 24, 12, INK)}
      {triangle(345, 104, 32, -18, INK_SOFT)}
      {triangle(300, 22, 16, 50, INK_SOFT)}
      {triangle(95, 114, 19, -35, INK)}
      {triangle(220, 116, 14, 8, INK_SOFT)}
    </>
  );
}

const PATTERNS = [BlobsPattern, StripesPattern, DotGridPattern, ChevronPattern, RingsPattern, WavesPattern, TrianglesPattern];

export function UnitBanner({ unit, index, topicIcon, scale }: { unit: Unit; index: number; topicIcon: string; scale: number }) {
  const bg = BANNER_COLORS[index % BANNER_COLORS.length];
  const Pattern = PATTERNS[index % PATTERNS.length];
  return (
    <View style={[styles.banner, { backgroundColor: bg, height: rs(128, scale) }]}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid slice" style={StyleSheet.absoluteFill}>
        <Pattern />
      </Svg>
      <View style={[styles.iconWrap, { width: rs(64, scale), height: rs(64, scale), borderRadius: rs(32, scale) }]}>
        <Text style={{ fontSize: rs(34, scale) }}>{unit.icon ?? topicIcon}</Text>
      </View>
      <Text style={[styles.title, { fontSize: rs(16, scale) }]} numberOfLines={2}>
        {unit.title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 24,
    gap: 10,
  },
  iconWrap: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
  },
});
