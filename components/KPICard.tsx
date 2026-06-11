import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, FontSize, FontWeight, Shadow, BorderRadius } from '@/constants/theme';

interface KPICardProps {
  icon: string | React.ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  onPress?: () => void;
}

export default function KPICard({
  icon,
  label,
  value,
  subtitle,
  color = Colors.primaryBlue,
  onPress,
}: KPICardProps) {
  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        {typeof icon === 'string' ? (
          <Text style={styles.icon}>{icon}</Text>
        ) : (
          icon
        )}
      </View>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, { color }]}>{value.toLocaleString()}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    minWidth: 75,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  icon: {
    fontSize: 20,
  },
  label: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  value: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginTop: 2,
    textAlign: 'center',
  },
});
