import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

interface AppHeaderProps {
  variant?: 'light' | 'dark';
  notificationCount?: number;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  showLoginButton?: boolean;
  onLoginPress?: () => void;
  showLogoutButton?: boolean;
  onLogoutPress?: () => void;
}

export default function AppHeader({
  variant = 'light',
  notificationCount = 0,
  onMenuPress,
  onNotificationPress,
  showLoginButton = false,
  onLoginPress,
  showLogoutButton = false,
  onLogoutPress,
}: AppHeaderProps) {
  const isDark = variant === 'dark';
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, isDark && styles.containerDark, { paddingTop: insets.top + Spacing.md }]}>
      {!isDark && onMenuPress && !showLogoutButton && (
        <Pressable onPress={onMenuPress} style={styles.menuButton}>
          <MaterialCommunityIcons name="menu" size={24} color={Colors.textPrimary} />
        </Pressable>
      )}

      <View style={styles.logoSection}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          contentFit="contain"
        />
        <View style={styles.titleContainer}>
          <Text style={[styles.title, isDark && styles.textLight]}>
            Association of Engineers Bangladesh
          </Text>
          <Text style={[styles.subtitle, isDark && styles.subtitleDark]}>
            IEB ELECTION 2026
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <Pressable
          onPress={onNotificationPress}
          style={styles.notificationButton}
        >
          <MaterialCommunityIcons name="bell-outline" size={22} color={isDark ? Colors.white : Colors.textPrimary} />
          {notificationCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </View>
          )}
        </Pressable>

        {showLoginButton && (
          <Pressable onPress={onLoginPress} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Login</Text>
          </Pressable>
        )}

        {showLogoutButton && (
          <Pressable onPress={onLogoutPress} style={styles.menuButton}>
            <MaterialCommunityIcons name="logout" size={24} color={isDark ? Colors.white : Colors.textPrimary} />
          </Pressable>
        )}

        {isDark && onMenuPress && !showLogoutButton && (
          <Pressable onPress={onMenuPress} style={styles.menuButton}>
            <MaterialCommunityIcons name="menu" size={24} color={Colors.white} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  containerDark: {
    backgroundColor: Colors.darkNavy,
    borderBottomWidth: 0,
  },
  menuButton: {
    padding: Spacing.sm,
    marginRight: Spacing.sm,
  },
  menuIcon: {
    fontSize: 22,
    color: Colors.textPrimary,
  },
  logoSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  titleContainer: {
    marginLeft: Spacing.sm,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.primaryBlue,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  subtitleDark: {
    color: Colors.textMuted,
  },
  textLight: {
    color: Colors.white,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  notificationButton: {
    padding: Spacing.sm,
    position: 'relative',
  },
  bellIcon: {
    fontSize: 20,
    color: Colors.textPrimary,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: Colors.danger,
    borderRadius: BorderRadius.round,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: Colors.white,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  loginButton: {
    backgroundColor: Colors.primaryBlue,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
});
