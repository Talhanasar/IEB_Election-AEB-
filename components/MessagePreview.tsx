import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

interface MessagePreviewProps {
  name: string;
  message: string;
  time: string;
  unreadCount?: number;
  icon?: React.ReactNode;
  online?: boolean;
  onPress?: () => void;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter((n) => n.length > 0 && n[0] === n[0].toUpperCase())
    .map((n) => n[0])
    .slice(0, 2)
    .join('') || name.slice(0, 2).toUpperCase();
}

export default function MessagePreview({
  name,
  message,
  time,
  unreadCount = 0,
  icon,
  online = false,
  onPress,
}: MessagePreviewProps) {
  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          {icon ? (
            icon
          ) : (
            <Text style={styles.avatarText}>{getInitials(name)}</Text>
          )}
        </View>
        {online && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.contentSection}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.message} numberOfLines={1}>
          {message}
        </Text>
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.time}>{time}</Text>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{unreadCount}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.primaryBlue,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  contentSection: {
    flex: 1,
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  message: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
  },
  rightSection: {
    alignItems: 'flex-end',
    marginLeft: Spacing.sm,
  },
  time: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginBottom: Spacing.xs,
  },
  unreadBadge: {
    backgroundColor: Colors.primaryBlue,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  unreadText: {
    color: Colors.white,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
});
