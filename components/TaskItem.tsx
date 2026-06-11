import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

interface TaskItemProps {
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  time: string;
  completed?: boolean;
  onToggle?: () => void;
}

export default function TaskItem({
  title,
  priority,
  time,
  completed = false,
  onToggle,
}: TaskItemProps) {
  const priorityColor =
    priority === 'High'
      ? Colors.danger
      : priority === 'Medium'
        ? Colors.warning
        : Colors.success;

  return (
    <Pressable
      style={styles.container}
      onPress={onToggle}
    >
      <View style={styles.leftSection}>
        <View
          style={[
            styles.checkbox,
            completed && styles.checkboxCompleted,
          ]}
        >
          {completed && <MaterialCommunityIcons name="check" size={16} color={Colors.white} />}
        </View>
        <View style={styles.textSection}>
          <Text
            style={[styles.title, completed && styles.titleCompleted]}
            numberOfLines={1}
          >
            {title}
          </Text>
          <View style={styles.priorityRow}>
            <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
            <Text style={[styles.priorityText, { color: priorityColor }]}>
              {completed ? 'Completed' : `${priority} Priority`}
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.time}>{time}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  checkboxCompleted: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  textSection: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textTertiary,
  },
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.xs,
  },
  priorityText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  time: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    fontWeight: FontWeight.medium,
    marginLeft: Spacing.sm,
  },
});
