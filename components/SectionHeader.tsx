import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, FontSize, FontWeight } from '@/constants/theme';

interface SectionHeaderProps {
  title: string;
  onViewAll?: () => void;
  showViewAll?: boolean;
  dark?: boolean;
}

export default function SectionHeader({
  title,
  onViewAll,
  showViewAll = true,
  dark = false,
}: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, dark && styles.titleDark]}>{title}</Text>
      {showViewAll && (
        <Pressable onPress={onViewAll} style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
          <Text style={styles.viewAllArrow}> ›</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  titleDark: {
    color: Colors.white,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: FontSize.md,
    color: Colors.primaryBlue,
    fontWeight: FontWeight.semibold,
  },
  viewAllArrow: {
    fontSize: FontSize.lg,
    color: Colors.primaryBlue,
    fontWeight: FontWeight.bold,
  },
});
