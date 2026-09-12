export const colors = {
  background: '#F0F7F6',
  card: '#FFFFFF',
  border: '#E1E8EA',
  text: '#1A2530',
  textMuted: '#6B7C8A',

  primary: '#2DD4BF',
  primaryDark: '#12B3A0',
  primaryPressed: '#0E9585',
  primaryTint: '#E3FBF8',

  success: '#58CC02',
  successDark: '#3E9200',
  successPressed: '#337B00',
  successTint: '#E3FBCF',

  error: '#FF4B4B',
  errorDark: '#E63333',
  errorPressed: '#C61E1E',
  errorTint: '#FFE7E7',

  warning: '#FF9600',
  warningDark: '#E37D00',
  warningTint: '#FFF1DC',

  heart: '#FF4B6A',
  xp: '#FFC800',
  xpDark: '#E3A800',
  xpTint: '#FFF6D9',

  streak: '#FF9600',
  streakTint: '#FFEBD4',

  locked: '#D9E0E3',
  lockedDark: '#C3CBCF',
  white: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.06)',

  shadow: 'rgba(26, 37, 48, 0.14)',
  cardBorderBottom: '#D3DDE0',
};

/** Darken (negative percent) or lighten (positive percent) a #rrggbb color. */
export function shade(hex: string, percent: number): string {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  const amt = Math.round(2.55 * percent);
  const r = Math.max(0, Math.min(255, (num >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) + amt));
  const b = Math.max(0, Math.min(255, (num & 0x0000ff) + amt));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
