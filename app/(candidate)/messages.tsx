import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppHeader from '@/components/AppHeader';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

interface MessageItem {
  id: string;
  name: string;
  message: string;
  time: string;
  unread: number;
  online: boolean;
}

const MESSAGES: MessageItem[] = [
  { id: '1', name: 'Engr. Hasan Ahmed', message: 'Thank you for the meeting. I will support you.', time: '10:30 AM', unread: 1, online: true },
  { id: '2', name: 'Engr. Nusrat Jahan', message: 'Can we schedule a call tomorrow?', time: '9:15 AM', unread: 2, online: true },
  { id: '3', name: 'BUET Alumni Group', message: 'Meeting confirmed for next Thursday at 4 PM...', time: 'Yesterday', unread: 5, online: false },
  { id: '4', name: 'Engr. Tariq Rahman', message: 'I have shared your manifesto with my colleagues.', time: 'Yesterday', unread: 0, online: false },
  { id: '5', name: 'PDB Engineers Group', message: 'Webinar link has been shared with all members.', time: '2 days ago', unread: 0, online: false },
  { id: '6', name: 'Engr. Fatima Akter', message: 'Looking forward to the Chattogram event!', time: '2 days ago', unread: 0, online: true },
];

function MessageRow({ item }: { item: MessageItem }) {
  const isGroup = item.name.includes('Group');
  return (
    <Pressable style={styles.messageRow}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons
            name={isGroup ? 'account-group' : 'account-circle'}
            size={32}
            color={Colors.primaryBlue}
          />
        </View>
        {item.online && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.contentSection}>
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.message} numberOfLines={1}>
          {item.message}
        </Text>
      </View>

      <View style={styles.rightSection}>
        <Text style={styles.time}>{item.time}</Text>
        {item.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unread}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

export default function MessagesScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <AppHeader variant="dark" notificationCount={3} showLogoutButton={true} onLogoutPress={() => router.push('/(voter)/home')} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Compose */}
        <View style={styles.composeSection}>
          <Pressable style={styles.composeButton}>
            <MaterialCommunityIcons name="email-edit-outline" size={18} color={Colors.white} />
            <Text style={styles.composeText}>  Compose New Message</Text>
          </Pressable>
          <Pressable style={styles.broadcastButton}>
            <MaterialCommunityIcons name="bullhorn" size={18} color={Colors.textPrimary} />
            <Text style={styles.broadcastText}>  Broadcast</Text>
          </Pressable>
        </View>

        {/* Message Tabs */}
        <View style={styles.tabRow}>
          <Pressable style={[styles.tab, styles.tabActive]}>
            <Text style={[styles.tabText, styles.tabTextActive]}>All</Text>
          </Pressable>
          <Pressable style={styles.tab}>
            <Text style={styles.tabText}>Unread (8)</Text>
          </Pressable>
          <Pressable style={styles.tab}>
            <Text style={styles.tabText}>Groups</Text>
          </Pressable>
        </View>

        {/* Messages List */}
        <View style={styles.messagesListContainer}>
          {MESSAGES.map((msg) => (
            <MessageRow key={msg.id} item={msg} />
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
  composeSection: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    gap: Spacing.sm,
  },
  composeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryBlue,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  composeIcon: {
    fontSize: 16,
  },
  composeText: {
    color: Colors.white,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.sm,
  },
  broadcastButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.accentGold,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
  },
  broadcastIcon: {
    fontSize: 16,
  },
  broadcastText: {
    color: Colors.textPrimary,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.sm,
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
  messagesListContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadow.sm,
  },
  messageRow: {
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
