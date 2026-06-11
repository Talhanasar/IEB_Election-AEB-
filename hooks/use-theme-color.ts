/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const ThemeColors = {
  light: {
    text: Colors.textPrimary,
    background: Colors.background,
    tint: Colors.primaryBlue,
    icon: Colors.tabInactive,
    tabIconDefault: Colors.tabInactive,
    tabIconSelected: Colors.primaryBlue,
  },
  dark: {
    text: Colors.white,
    background: Colors.darkNavy,
    tint: Colors.white,
    icon: Colors.textMuted,
    tabIconDefault: Colors.textMuted,
    tabIconSelected: Colors.white,
  },
};

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof ThemeColors.light & keyof typeof ThemeColors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return ThemeColors[theme][colorName];
  }
}
