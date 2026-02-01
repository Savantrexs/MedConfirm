// Theme and design system
import { useColorScheme } from 'react-native';

export const lightTheme = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  primary: '#4A90E2',
  primaryDark: '#357ABD',
  secondary: '#7FB3D5',
  success: '#5CB85C',
  warning: '#F0AD4E',
  danger: '#D9534F',
  text: '#2C3E50',
  textSecondary: '#7F8C8D',
  textLight: '#95A5A6',
  border: '#E1E8ED',
  disabled: '#BDC3C7',
  overlay: 'rgba(0, 0, 0, 0.5)',
  cardShadow: 'rgba(0, 0, 0, 0.08)',
};

export const darkTheme = {
  background: '#1A1A1A',
  surface: '#2C2C2C',
  primary: '#5DA5F5',
  primaryDark: '#4A90E2',
  secondary: '#8FC5E8',
  success: '#6EC76E',
  warning: '#F5BC5D',
  danger: '#E66B68',
  text: '#E8E8E8',
  textSecondary: '#B0B0B0',
  textLight: '#888888',
  border: '#404040',
  disabled: '#555555',
  overlay: 'rgba(0, 0, 0, 0.7)',
  cardShadow: 'rgba(0, 0, 0, 0.3)',
};

export const highContrastTheme = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  primary: '#0000FF',
  primaryDark: '#000080',
  secondary: '#4169E1',
  success: '#008000',
  warning: '#FF8C00',
  danger: '#FF0000',
  text: '#000000',
  textSecondary: '#000000',
  textLight: '#333333',
  border: '#000000',
  disabled: '#808080',
  overlay: 'rgba(0, 0, 0, 0.8)',
  cardShadow: 'rgba(0, 0, 0, 0.2)',
};

export const useTheme = (darkMode: boolean = false, highContrast: boolean = false) => {
  const systemColorScheme = useColorScheme();
  
  if (highContrast) {
    return highContrastTheme;
  }
  
  const isDark = darkMode || systemColorScheme === 'dark';
  return isDark ? darkTheme : lightTheme;
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 26,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
};
