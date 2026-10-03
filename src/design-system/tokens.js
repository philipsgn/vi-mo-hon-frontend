/**
 * VI-MO-HON Neo-Brutalism Design Tokens (ES Module)
 */
import tokensCjs from './tokens.cjs';

export const neoColors = tokensCjs.neoColors;
export const neoBorders = tokensCjs.neoBorders;
export const neoShadows = tokensCjs.neoShadows;
export const neoRadii = tokensCjs.neoRadii;
export const neoSpacing = tokensCjs.neoSpacing;
export const neoTokens = tokensCjs.neoTokens;

// Backward-compatibility aliases for legacy / companion modules
export const COLORS = {
  ...tokensCjs.neoColors,
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
};

export const BORDER_WIDTHS = {
  thin: tokensCjs.neoBorders.thin || 1.5,
  standard: tokensCjs.neoBorders.default || 2,
  thick: tokensCjs.neoBorders.thick || 3,
  hero: tokensCjs.neoBorders.hero || 4,
};

export const SHADOWS = {
  ...tokensCjs.neoShadows,
  hardSm: tokensCjs.neoShadows.default || { shadowColor: '#121212', shadowOffset: { width: 3, height: 3 }, shadowOpacity: 1, shadowRadius: 0, elevation: 3 },
  hardMd: tokensCjs.neoShadows.card || { shadowColor: '#121212', shadowOffset: { width: 4, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4 },
};

export const SPACING = {
  ...tokensCjs.neoSpacing,
};

export const RADII = {
  ...tokensCjs.neoRadii,
  pill: tokensCjs.neoRadii.full || 9999,
};

export const TYPOGRAPHY = {
  label: { fontWeight: '700' },
  caption: { fontWeight: '600' },
  title: { fontWeight: '800' },
};

export default neoTokens;
