import { useWindowDimensions } from 'react-native';

const TABLET_BREAKPOINT = 768;
const LARGE_TABLET_BREAKPOINT = 1100;

export interface Responsive {
  width: number;
  isTablet: boolean;
  /** Grid columns for card layouts (topics, quests, etc). */
  columns: number;
  /** Multiplier to scale up key dimensions (fonts, tiles, icons) on larger screens. */
  scale: number;
  /** Max width for reading-focused screens (lesson questions) so lines don't get absurdly wide. */
  contentMaxWidth: number;
}

export function useResponsive(): Responsive {
  const { width } = useWindowDimensions();
  const isTablet = width >= TABLET_BREAKPOINT;
  const columns = width >= LARGE_TABLET_BREAKPOINT ? 3 : 2;
  const scale = width >= LARGE_TABLET_BREAKPOINT ? 1.5 : isTablet ? 1.32 : 1;
  const contentMaxWidth = isTablet ? 840 : width;
  return { width, isTablet, columns, scale, contentMaxWidth };
}

/** Round-scale a base dimension (font size, spacing, icon size, etc). */
export function rs(base: number, scale: number): number {
  return Math.round(base * scale);
}
