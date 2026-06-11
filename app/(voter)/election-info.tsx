import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppHeader from '@/components/AppHeader';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

const SCHEDULE = [
  { date: 'June 1, 2026', event: 'Nomination Submission Opens', icon: '📝', status: 'Completed' },
  { date: 'June 15, 2026', event: 'Nomination Deadline', icon: '⏰', status: 'Completed' },
  { date: 'June 20 - July 15, 2026', event: 'Campaign Period', icon: '📢', status: 'Active' },
  { date: 'July 20, 2026', event: 'Election Day', icon: '🗳️', status: 'Upcoming' },
  { date: 'July 25, 2026', event: 'Result Announcement', icon: '📊', status: 'Upcoming' },
];

export default function ElectionInfoScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <AppHeader variant="light" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerBanner}>
          <Text style={styles.headerIcon}>📅</Text>
          <Text style={styles.headerTitle}>Election Schedule</Text>
          <Text style={styles.headerSubtitle}>IEB Election 2026 Timeline</Text>
        </View>

        <View style={styles.timeline}>
          {SCHEDULE.map((item, index) => (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.timelineLine}>
                <View
                  style={[
                    styles.timelineDot,
                    item.status === 'Completed' && styles.dotCompleted,
                    item.status === 'Active' && styles.dotActive,
                  ]}
                >
                  <Text style={styles.dotIcon}>{item.icon}</Text>
                </View>
                {index < SCHEDULE.length - 1 && (
                  <View
                    style={[
                      styles.timelineConnector,
                      item.status === 'Completed' && styles.connectorCompleted,
                    ]}
                  />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.eventDate}>{item.date}</Text>
                <Text style={styles.eventName}>{item.event}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    item.status === 'Completed' && styles.badgeCompleted,
                    item.status === 'Active' && styles.badgeActive,
                    item.status === 'Upcoming' && styles.badgeUpcoming,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      item.status === 'Completed' && styles.statusCompleted,
                      item.status === 'Active' && styles.statusActive,
                      item.status === 'Upcoming' && styles.statusUpcoming,
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Notices Section */}
        <View style={styles.noticesSection}>
          <Text style={styles.sectionTitle}>Official Notices</Text>
          {[
            { title: 'Election Guidelines 2026', date: 'June 1, 2026', type: 'Circular' },
            { title: 'Voter Registration Update', date: 'May 28, 2026', type: 'Notice' },
          ].map((notice, idx) => (
            <View key={idx} style={styles.noticeCard}>
              <View style={styles.noticeIcon}>
                <Text>📋</Text>
              </View>
              <View style={styles.noticeInfo}>
                <Text style={styles.noticeTitle}>{notice.title}</Text>
                <Text style={styles.noticeDate}>{notice.date} • {notice.type}</Text>
              </View>
              <Text style={styles.noticeArrow}>›</Text>
            </View>
          ))}
        </View>

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
  headerBanner: {
    backgroundColor: Colors.primaryBlue,
    margin: Spacing.lg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: FontSize.md,
    color: '#B8D4F0',
    marginTop: 4,
  },
  timeline: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 90,
  },
  timelineLine: {
    alignItems: 'center',
    width: 50,
  },
  timelineDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  dotCompleted: {
    backgroundColor: Colors.successLight,
    borderColor: Colors.success,
  },
  dotActive: {
    backgroundColor: Colors.primaryBlue + '20',
    borderColor: Colors.primaryBlue,
  },
  dotIcon: {
    fontSize: 18,
  },
  timelineConnector: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  connectorCompleted: {
    backgroundColor: Colors.success,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  eventDate: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    fontWeight: FontWeight.medium,
  },
  eventName: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.round,
    marginTop: Spacing.xs,
  },
  badgeCompleted: {
    backgroundColor: Colors.successLight,
  },
  badgeActive: {
    backgroundColor: Colors.primaryBlue + '18',
  },
  badgeUpcoming: {
    backgroundColor: Colors.warningLight,
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  statusCompleted: {
    color: Colors.success,
  },
  statusActive: {
    color: Colors.primaryBlue,
  },
  statusUpcoming: {
    color: Colors.warning,
  },
  noticesSection: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadow.sm,
  },
  noticeIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.bannerBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  noticeInfo: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  noticeDate: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  noticeArrow: {
    fontSize: FontSize.xxl,
    color: Colors.textMuted,
  },
});
