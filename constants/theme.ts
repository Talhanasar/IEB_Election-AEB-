// IEB Election 2026 — Design Tokens
export const Colors = {
  // Primary palette
  primaryBlue: '#1A4789',
  primaryBlueDark: '#0F2D5A',
  primaryBlueLight: '#2B5EA7',
  headerBlue: '#1A3C7A',

  // Dark theme (Candidate Dashboard)
  darkNavy: '#0D1B3E',
  darkNavyLight: '#152247',
  darkNavySurface: '#1A2A52',

  // Accent
  accentGold: '#D4A843',
  accentGoldLight: '#E8C36A',

  // Semantic
  success: '#2E8B57',
  successLight: '#E8F5E9',
  warning: '#E67E22',
  warningLight: '#FFF3E0',
  danger: '#E74C3C',
  dangerLight: '#FFEBEE',
  info: '#3498DB',
  infoLight: '#E3F2FD',

  // Neutrals
  white: '#FFFFFF',
  background: '#F5F7FA',
  surface: '#FFFFFF',
  surfaceLight: '#F0F4F8',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  textPrimary: '#1A202C',
  textSecondary: '#4A5568',
  textTertiary: '#718096',
  textOnDark: '#FFFFFF',
  textMuted: '#A0AEC0',

  // Tab bar
  tabInactive: '#94A3B8',
  tabActive: '#1A4789',

  // Status colors for candidate dashboard
  contacted: '#2E8B57',
  supporters: '#E67E22',
  messagesSent: '#E74C3C',

  // Banner
  bannerBg: '#E8F1FB',
  bannerBgDark: '#1A4789',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  xxl: 24,
  round: 999,
};

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  hero: 34,
};

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
};
