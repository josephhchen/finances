import { Theme } from '../types';

const lightTheme: Theme = {
  colors: {
    primary: '#000000',
    primaryDark: '#1A1A1A',
    secondary: '#666666',
    background: '#F9F9F9',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    border: '#E5E5E5',
    success: '#000000',
    warning: '#000000',
    error: '#000000',
    info: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    },
  },
  shadows: {
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
      elevation: 6,
    },
    lg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.18,
      shadowRadius: 24,
      elevation: 12,
    },
  },
};

const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    primary: '#FFFFFF',
    primaryDark: '#E5E5E5',
    secondary: '#999999',
    background: '#0F0F0F',
    surface: '#1A1A1A',
    card: '#222222',
    text: '#FFFFFF',
    textSecondary: '#999999',
    border: '#333333',
    success: '#FFFFFF',
    warning: '#FFFFFF',
    error: '#FFFFFF',
    info: '#FFFFFF',
  },
  shadows: {
    sm: {
      shadowColor: '#FFFFFF',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 3,
    },
    md: {
      shadowColor: '#FFFFFF',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 6,
    },
    lg: {
      shadowColor: '#FFFFFF',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 12,
    },
  },
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export const getTheme = (mode: 'light' | 'dark'): Theme => {
  return themes[mode];
};