import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, Shadow, BorderRadius } from '@/constants/theme';

interface ActivityCardProps {
  month: string;
  day: string;
  year: string;
  title: string;
  location: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  onPress?: () => void;
}

export default function ActivityCard({
  month,
  day,
  year,
  title,
  location,
  time,
  status,
  onPress,
}: ActivityCardProps) {
  const statusColor =
    status === 'Confirmed'
      ? Colors.success
      : status === 'Pending'
        ? Colors.warning
        : Colors.danger;

  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
    >
      <View style={styles.dateSection}>
        <Text style={styles.month}>{month}</Text>
        <Text style={styles.day}>{day}</Text>
        <Text style={styles.year}>{year}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoSection}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.detailRow}>
          <FontAwesome5 name="map-marker-alt" size={12} color={Colors.textSecondary} style={styles.detailIcon} />
          <Text style={styles.detailText}>{location}</Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="clock-outline" size={12} color={Colors.textSecondary} style={styles.detailIcon} />
          <Text style={styles.detailText}>{time}</Text>
        </View>
      </View>

      <View style={[styles.statusBadge, { backgroundColor: statusColor + '18' }]}>
        <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadow.sm,
  },
  dateSection: {
    alignItems: 'center',
    minWidth: 50,
  },
  month: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.primaryBlue,
    textTransform: 'uppercase',
  },
  day: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.textPrimary,
    lineHeight: 28,
  },
  year: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
  infoSection: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  detailIcon: {
    marginRight: Spacing.xs,
    width: 14,
    textAlign: 'center',
  },
  detailText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
});
