/**
 * ZenSpace Design System — Color Palette
 * Primary: Deep Indigo / Soft Lavender
 * Accent: Warm Gold
 * Semantic: Success, Error, Warning
 */

const palette = {
  indigo900: '#0d0d2b',
  indigo800: '#1a1a2e',
  indigo700: '#16213e',
  indigo600: '#0f3460',
  indigo500: '#533483',
  indigo400: '#6c63ff',
  indigo300: '#a29bfe',
  indigo200: '#d6d0ff',
  indigo100: '#ede9ff',

  gold500: '#f6c90e',
  gold400: '#fddb3a',
  gold300: '#ffeaa7',

  teal500: '#00cec9',
  teal400: '#55efc4',

  coral500: '#e17055',
  coral400: '#fab1a0',

  white: '#ffffff',
  offWhite: '#f8f7ff',
  gray100: '#f1f0f7',
  gray200: '#dddbe8',
  gray300: '#b2afc7',
  gray400: '#7c78a0',
  gray500: '#4a4770',
  gray600: '#2d2b50',

  success: '#00b894',
  error: '#d63031',
  warning: '#fdcb6e',

  dark900: '#0a0a1a',
  dark800: '#12122a',
  dark700: '#1e1e3a',
  dark600: '#2a2a50',
};

export const Colors = {
  light: {
    // Backgrounds
    background: palette.offWhite,
    surface: palette.white,
    surfaceSecondary: palette.gray100,
    card: palette.white,

    // Text
    text: palette.indigo800,
    textSecondary: palette.gray500,
    textMuted: palette.gray400,
    textInverse: palette.white,

    // Brand
    primary: palette.indigo400,
    primaryDark: palette.indigo600,
    primaryLight: palette.indigo200,
    accent: palette.gold500,

    // UI
    border: palette.gray200,
    borderLight: palette.gray100,
    icon: palette.indigo400,
    tabIconDefault: palette.gray400,
    tabIconSelected: palette.indigo400,
    headerBackground: palette.white,
    headerText: palette.indigo800,

    // Semantic
    success: palette.success,
    error: palette.error,
    warning: palette.warning,

    // Gradients (start/end)
    gradientStart: palette.indigo400,
    gradientEnd: palette.indigo600,
    heroGradientStart: palette.indigo500,
    heroGradientEnd: palette.indigo800,
  },
  dark: {
    // Backgrounds
    background: palette.indigo800,
    surface: palette.indigo700,
    surfaceSecondary: palette.indigo600,
    card: palette.dark700,

    // Text
    text: palette.offWhite,
    textSecondary: palette.indigo200,
    textMuted: palette.gray300,
    textInverse: palette.indigo800,

    // Brand
    primary: palette.indigo300,
    primaryDark: palette.indigo400,
    primaryLight: palette.indigo600,
    accent: palette.gold400,

    // UI
    border: palette.dark600,
    borderLight: palette.dark700,
    icon: palette.indigo300,
    tabIconDefault: palette.gray400,
    tabIconSelected: palette.indigo300,
    headerBackground: palette.indigo700,
    headerText: palette.offWhite,

    // Semantic
    success: palette.teal500,
    error: palette.coral500,
    warning: palette.gold300,

    // Gradients
    gradientStart: palette.indigo700,
    gradientEnd: palette.indigo900,
    heroGradientStart: palette.indigo600,
    heroGradientEnd: palette.dark900,
  },
};

export type ColorScheme = typeof Colors.light;
export default Colors;
