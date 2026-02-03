// Premium iOS-like design system
import { useColorScheme } from 'react-native';

export const lightTheme = {
  background: '#F7F8FA',
  surface: '#FFFFFF',
  surfaceSolid: '#FFFFFF',
  
  // Primary Green
  primary: '#22C55E',
  primaryDark: '#16A34A',
  primaryLight: '#DCFCE7',
  
  // Text
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  
  // Dividers & Borders
  border: '#E5E7EB',
  divider: '#E5E7EB',
  
  // Status Colors
  statusScheduled: '#64748B',
  statusScheduledBg: '#F1F5F9',
  statusDue: '#F59E0B',
  statusDueBg: '#FEF3C7',
  statusOverdue: '#EF4444',
  statusOverdueBg: '#FEE2E2',
  statusTaken: '#22C55E',
  statusTakenBg: '#DCFCE7',
  
  // Legacy support
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  disabled: '#D1D5DB',
  overlay: 'rgba(0, 0, 0, 0.4)',
  cardShadow: 'rgba(0, 0, 0, 0.04)',
};

export const darkTheme = {
  background: '#111827',
  surface: '#1F2937',
  surfaceSolid: '#1F2937',
  
  primary: '#22C55E',
  primaryDark: '#16A34A',
  primaryLight: '#065F46',
  
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  
  border: '#374151',
  divider: '#374151',
  
  statusScheduled: '#94A3B8',
  statusScheduledBg: '#334155',
  statusDue: '#FBBF24',
  statusDueBg: '#78350F',
  statusOverdue: '#F87171',
  statusOverdueBg: '#7F1D1D',
  statusTaken: '#34D399',
  statusTakenBg: '#065F46',
  
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  disabled: '#4B5563',
  overlay: 'rgba(0, 0, 0, 0.6)',
  cardShadow: 'rgba(0, 0, 0, 0.3)',
};

export const highContrastTheme = {
  ...lightTheme,
  text: '#000000',
  border: '#000000',
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
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 22,
  full: 9999,
};

// iOS-inspired typography
export const typography = {
  title: {
    fontSize: 32,
    fontWeight: '600' as const,
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  bodyPrimary: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  bodySecondary: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: -0.1,
  },
  bodyTertiary: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    letterSpacing: 0,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  caption: {
    fontSize: 11,
    fontWeight: '400' as const,
    lineHeight: 14,
    letterSpacing: 0,
  },
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
};
