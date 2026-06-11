import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing, FontSize, FontWeight, Shadow, BorderRadius } from '@/constants/theme';

interface CandidateCardProps {
  name: string;
  position: string;
  institution: string;
  organization: string;
  icon?: React.ReactNode;
  positionColor?: string;
  onViewProfile?: () => void;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter((n) => n.length > 0 && n[0] === n[0].toUpperCase())
    .map((n) => n[0])
    .slice(0, 2)
    .join('') || name.slice(0, 2).toUpperCase();
}

export default function CandidateCard({
  name,
  position,
  institution,
  organization,
  icon,
  positionColor = Colors.primaryBlue,
  onViewProfile,
}: CandidateCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <View style={[styles.imagePlaceholder, { backgroundColor: positionColor + '15' }]}>
          {icon ? (
            icon
          ) : (
            <Text style={[styles.initials, { color: positionColor }]}>{getInitials(name)}</Text>
          )}
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={[styles.position, { color: positionColor }]} numberOfLines={1}>
          {position}
        </Text>
        <Text style={styles.org} numberOfLines={1}>
          {institution} | {organization}
        </Text>
        <Pressable
          style={styles.viewButton}
          onPress={onViewProfile}
        >
          <Text style={styles.viewButtonText}>View Profile</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginRight: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    width: 280,
    ...Shadow.sm,
  },
  imageContainer: {
    marginRight: Spacing.md,
  },
  imagePlaceholder: {
    width: 80,
    height: 90,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontSize: 24,
    fontWeight: FontWeight.bold,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  position: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    marginBottom: 2,
  },
  org: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginBottom: Spacing.sm,
  },
  viewButton: {
    borderWidth: 1.5,
    borderColor: Colors.primaryBlue,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    alignSelf: 'flex-start',
  },
  viewButtonText: {
    fontSize: FontSize.sm,
    color: Colors.primaryBlue,
    fontWeight: FontWeight.semibold,
  },
});
