import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import AppHeader from '@/components/AppHeader';
import SectionHeader from '@/components/SectionHeader';
import KPICard from '@/components/KPICard';
import QuickActionButton from '@/components/QuickActionButton';
import TaskItem from '@/components/TaskItem';
import ActivityCard from '@/components/ActivityCard';
import MessagePreview from '@/components/MessagePreview';
import CircularProgress from '@/components/CircularProgress';
import {
  Colors,
  Spacing,
  FontSize,
  FontWeight,
  Shadow,
  BorderRadius,
} from '@/constants/theme';

export default function CandidateDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Dark Header */}
      <View style={styles.darkHeader}>
        <AppHeader
          variant="dark"
          notificationCount={5}
          showLogoutButton={true}
          onLogoutPress={() => router.replace('/(voter)/home')}
        />

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileLeft}>
            <View style={styles.profileAvatar}>
              <MaterialCommunityIcons name="account-tie" size={30} color={Colors.white} />
              <View style={styles.editBadge}>
                <MaterialCommunityIcons name="pencil" size={12} color={Colors.white} />
              </View>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.greetingText}>
                Good Morning, Engr. Ashraful Islam 👋
              </Text>
              <Text style={styles.positionText}>President Candidate</Text>
              <Text style={styles.memberIdText}>IEB-880123</Text>
              <Text style={styles.sloganText}>
                "Together We Build, Together We Lead"
              </Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>Campaign Progress</Text>
            <CircularProgress
              percentage={72}
              size={65}
              strokeWidth={5}
              color={Colors.success}
              label="Keep Going!"
            />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Overview KPI Cards */}
        <SectionHeader title="Overview" onViewAll={() => {}} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.kpiContainer}
        >
          <KPICard
            icon={<FontAwesome5 name="users" size={20} color={Colors.primaryBlue} />}
            label="Total Voters"
            value="12,456"
            subtitle="All Voters"
            color={Colors.primaryBlue}
          />
          <KPICard
            icon={<FontAwesome5 name="phone-alt" size={20} color={Colors.success} />}
            label="Contacted Voters"
            value="4,320"
            subtitle="34.7% of Total"
            color={Colors.success}
          />
          <KPICard
            icon={<FontAwesome5 name="handshake" size={20} color={Colors.warning} />}
            label="Supporters"
            value="3,215"
            subtitle="25.8% of Total"
            color={Colors.warning}
          />
          <KPICard
            icon={<MaterialCommunityIcons name="message-text" size={20} color={Colors.danger} />}
            label="Messages Sent"
            value="2,850"
            subtitle="This Campaign"
            color={Colors.danger}
          />
        </ScrollView>

        {/* Quick Actions */}
        <SectionHeader title="Quick Actions" showViewAll={false} />
        <View style={styles.quickActionsRow}>
          <QuickActionButton 
            icon={<FontAwesome5 name="users" size={20} color={Colors.primaryBlue} />} 
            label="Voter List" 
            size="small" 
            color={Colors.primaryBlue} 
            onPress={() => router.push('/(candidate)/voters')}
          />
          <QuickActionButton 
            icon={<MaterialCommunityIcons name="message-text" size={20} color={Colors.success} />} 
            label="Send Message" 
            size="small" 
            color={Colors.success} 
            onPress={() => router.push('/(candidate)/messages')}
          />
          <QuickActionButton 
            icon={<FontAwesome5 name="user-friends" size={20} color="#8E44AD" />} 
            label="Create Group" 
            size="small" 
            color="#8E44AD" 
            onPress={() => router.push('/(candidate)/messages')}
          />
          <QuickActionButton 
            icon={<FontAwesome5 name="calendar-alt" size={20} color={Colors.warning} />} 
            label="Add Activity" 
            size="small" 
            color={Colors.warning} 
            onPress={() => router.push('/(candidate)/activities')}
          />
          <QuickActionButton 
            icon={<FontAwesome5 name="check-circle" size={20} color={Colors.primaryBlue} />} 
            label="Add Task" 
            size="small" 
            color={Colors.primaryBlue} 
            onPress={() => router.push('/(candidate)/tasks')}
          />
        </View>

        {/* Upcoming Activities */}
        <SectionHeader title="Upcoming Activities" onViewAll={() => router.push('/(candidate)/activities')} />
        <ActivityCard
          month="JUN"
          day="15"
          year="2026"
          title="Engineers Meet-Up"
          location="Chattogram"
          time="04:00 PM - 06:00 PM"
          status="Confirmed"
        />
        <ActivityCard
          month="JUN"
          day="20"
          year="2026"
          title="BUET Alumni Networking"
          location="Dhaka"
          time="10:00 AM - 12:00 PM"
          status="Pending"
        />

        {/* Tasks Due Today */}
        <SectionHeader title="Tasks Due Today" onViewAll={() => router.push('/(candidate)/tasks')} />
        <View style={styles.tasksContainer}>
          <TaskItem
            title="Call BUET Alumni Members"
            priority="High"
            time="10:00 AM"
            onToggle={() => router.push('/(candidate)/tasks')}
          />
          <TaskItem
            title="Prepare Meeting Speech"
            priority="Medium"
            time="02:00 PM"
            onToggle={() => router.push('/(candidate)/tasks')}
          />
          <TaskItem
            title="Update Campaign Banner"
            priority="Low"
            time="Yesterday"
            completed={true}
            onToggle={() => router.push('/(candidate)/tasks')}
          />
        </View>

        {/* Recent Messages */}
        <SectionHeader title="Recent Messages" onViewAll={() => router.push('/(candidate)/messages')} />
        <View style={styles.messagesContainer}>
          <MessagePreview
            name="Engr. Hasan Ahmed"
            message="Thank you for the meeting. I will support you."
            time="10:30 AM"
            unreadCount={1}
            icon={<MaterialCommunityIcons name="account-circle" size={40} color={Colors.primaryBlue} />}
            online={true}
          />
          <MessagePreview
            name="Engr. Nusrat Jahan"
            message="Can we schedule a call tomorrow?"
            time="9:15 AM"
            unreadCount={0}
            icon={<MaterialCommunityIcons name="account-circle" size={40} color={Colors.warning} />}
            online={false}
          />
          <MessagePreview
            name="BUET Alumni Group"
            message="Meeting confirmed for next Thursday..."
            time="Yesterday"
            unreadCount={5}
            icon={<MaterialCommunityIcons name="account-group" size={40} color={Colors.danger} />}
            online={false}
          />
        </View>


        <View style={{ height: 100 }} />
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Dark Header
  darkHeader: {
    backgroundColor: Colors.darkNavy,
    paddingBottom: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.xxl,
    borderBottomRightRadius: BorderRadius.xxl,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  profileLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.darkNavySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.primaryBlueLight,
  },
  profileAvatarText: {
    fontSize: 30,
  },
  editBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.darkNavy,
  },
  editIcon: {
    fontSize: 10,
  },
  profileInfo: {
    flex: 1,
  },
  greetingText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
  },
  positionText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.warning,
    marginTop: 2,
  },
  memberIdText: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  sloganText: {
    fontSize: FontSize.xs,
    color: '#B8D4F0',
    fontStyle: 'italic',
    marginTop: 4,
  },
  progressSection: {
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  progressLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
    fontWeight: FontWeight.medium,
  },

  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // KPI
  kpiContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },

  // Quick Actions
  quickActionsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },

  // Tasks
  tasksContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadow.sm,
  },

  // Messages
  messagesContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
    ...Shadow.sm,
  },

  // Logout
  logoutButton: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xxl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  logoutText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontWeight: FontWeight.semibold,
  },
});
