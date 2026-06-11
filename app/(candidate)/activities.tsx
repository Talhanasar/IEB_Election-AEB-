import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppHeader from '@/components/AppHeader';
import ActivityCard from '@/components/ActivityCard';
import SectionHeader from '@/components/SectionHeader';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

const ACTIVITIES = [
  { month: 'JUN', day: '15', year: '2026', title: 'Engineers Meet-Up', location: 'Chattogram', time: '04:00 PM - 06:00 PM', status: 'Confirmed' as const },
  { month: 'JUN', day: '20', year: '2026', title: 'BUET Alumni Networking', location: 'Dhaka', time: '10:00 AM - 12:00 PM', status: 'Pending' as const },
  { month: 'JUN', day: '25', year: '2026', title: 'Department Visit - PDB', location: 'Dhaka', time: '02:00 PM - 04:00 PM', status: 'Confirmed' as const },
  { month: 'JUL', day: '02', year: '2026', title: 'Online Webinar', location: 'Virtual', time: '07:00 PM - 09:00 PM', status: 'Pending' as const },
  { month: 'JUL', day: '08', year: '2026', title: 'Discussion Meeting', location: 'Khulna', time: '11:00 AM - 01:00 PM', status: 'Confirmed' as const },
];

export default function ActivitiesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <AppHeader variant="dark" showLogoutButton={true} onLogoutPress={() => router.push('/(voter)/home')} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Add Activity Button */}
        <View style={styles.headerSection}>
          <Pressable style={styles.addButton}>
            <MaterialCommunityIcons name="plus" size={18} color={Colors.white} />
            <Text style={styles.addButtonText}>  Create Activity</Text>
          </Pressable>
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          <Pressable style={[styles.tab, styles.tabActive]}>
            <Text style={[styles.tabText, styles.tabTextActive]}>Upcoming</Text>
          </Pressable>
          <Pressable style={styles.tab}>
            <Text style={styles.tabText}>Past</Text>
          </Pressable>
          <Pressable style={styles.tab}>
            <Text style={styles.tabText}>Calendar</Text>
          </Pressable>
        </View>

        {/* Activities List */}
        <SectionHeader title="June 2026" showViewAll={false} />
        {ACTIVITIES.filter(a => a.month === 'JUN').map((activity, idx) => (
          <ActivityCard key={idx} {...activity} />
        ))}

        <SectionHeader title="July 2026" showViewAll={false} />
        {ACTIVITIES.filter(a => a.month === 'JUL').map((activity, idx) => (
          <ActivityCard key={idx} {...activity} />
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
  },
  headerSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  addButton: {
    backgroundColor: Colors.primaryBlue,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  addButtonText: {
    color: Colors.white,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.md,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    gap: Spacing.sm,
  },
  tab: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabActive: {
    backgroundColor: Colors.primaryBlue,
    borderColor: Colors.primaryBlue,
  },
  tabText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  tabTextActive: {
    color: Colors.white,
  },
});
