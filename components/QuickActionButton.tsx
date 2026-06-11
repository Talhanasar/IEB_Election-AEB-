import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, FontSize, FontWeight, Shadow, BorderRadius } from '@/constants/theme';

interface QuickActionButtonProps {
  icon: string | React.ReactNode;
  label: string;
  onPress?: () => void;
  color?: string;
  size?: 'small' | 'medium';
}

export default function QuickActionButton({
  icon,
  label,
  onPress,
  color = Colors.primaryBlue,
  size = 'medium',
}: QuickActionButtonProps) {
  const isSmall = size === 'small';

  return (
    <Pressable
      style={[styles.container, isSmall && styles.containerSmall]}
      onPress={onPress}
    >
      <View
        style={[
          styles.iconContainer,
          isSmall && styles.iconContainerSmall,
          { backgroundColor: color + '12' },
        ]}
      >
        {typeof icon === 'string' ? (
          <Text style={[styles.icon, isSmall && styles.iconSmall]}>{icon}</Text>
        ) : (
          icon
        )}
      </View>
      <Text
        style={[styles.label, isSmall && styles.labelSmall]}
        numberOfLines={2}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadow.sm,
    minWidth: 80,
    flex: 1,
  },
  containerSmall: {
    paddingVertical: Spacing.md,
    minWidth: 60,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  iconContainerSmall: {
    width: 40,
    height: 40,
  },
  icon: {
    fontSize: 24,
  },
  iconSmall: {
    fontSize: 20,
  },
  label: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
    textAlign: 'center',
    lineHeight: 16,
  },
  labelSmall: {
    fontSize: FontSize.xs,
  },
});
