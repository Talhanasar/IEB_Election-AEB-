import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppHeader from '@/components/AppHeader';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

interface Voter {
  name: string;
  membership: string;
  org: string;
  status: string;
  phone: string;
  institution: string;
}

const FILTER_CATEGORIES = ['All', 'BUET', 'CUET', 'RUET', 'KUET', 'DUET'];

const VOTERS: Voter[] = [
  { name: 'Engr. Rakib Hasan', membership: 'IEB-990234', org: 'PDB', status: 'Supporter', phone: '01712345678', institution: 'BUET' },
  { name: 'Engr. Salma Begum', membership: 'IEB-880567', org: 'PGCB', status: 'Contacted', phone: '01898765432', institution: 'CUET' },
  { name: 'Engr. Mahfuz Alam', membership: 'IEB-770890', org: 'DESCO', status: 'Not Contacted', phone: '01556789012', institution: 'RUET' },
  { name: 'Engr. Nadia Islam', membership: 'IEB-660123', org: 'WASA', status: 'Neutral', phone: '01623456789', institution: 'BUET' },
  { name: 'Engr. Tariq Rahman', membership: 'IEB-550456', org: 'BPDB', status: 'Undecided', phone: '01734567890', institution: 'KUET' },
];

function getStatusColor(status: string) {
  switch (status) {
    case 'Supporter': return Colors.success;
    case 'Contacted': return Colors.primaryBlue;
    case 'Not Contacted': return Colors.textMuted;
    case 'Neutral': return Colors.warning;
    case 'Undecided': return Colors.danger;
    default: return Colors.textSecondary;
  }
}

const VoterCard = memo(function VoterCard({ item }: { item: Voter }) {
  const color = getStatusColor(item.status);
  return (
    <Pressable style={styles.voterCard}>
      <View style={styles.voterAvatar}>
        <Text style={styles.avatarText}>{item.name.charAt(6)}</Text>
      </View>
      <View style={styles.voterInfo}>
        <Text style={styles.voterName}>{item.name}</Text>
        <Text style={styles.voterMeta}>{item.membership} • {item.institution}</Text>
        <Text style={styles.voterOrg}>{item.org}</Text>
      </View>
      <View style={styles.voterRight}>
        <View style={[styles.statusBadge, { backgroundColor: color + '18' }]}>
          <Text style={[styles.statusText, { color }]}>
            {item.status}
          </Text>
        </View>
        <View style={styles.actionRow}>
          <Pressable style={styles.actionBtn}>
            <MaterialCommunityIcons name="phone-in-talk" size={18} color={Colors.primaryBlue} />
          </Pressable>
          <Pressable style={styles.actionBtn}>
            <MaterialCommunityIcons name="message-text" size={18} color={Colors.success} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
});

export default function VotersScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AppHeader variant="dark" showLogoutButton={true} onLogoutPress={() => router.push('/(voter)/home')} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <MaterialCommunityIcons name="magnify" size={20} color={Colors.textMuted} style={{ marginRight: Spacing.sm }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, ID, mobile..."
              placeholderTextColor={Colors.textMuted}
            />
          </View>
        </View>

        {/* Institution Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {FILTER_CATEGORIES.map((cat, idx) => (
            <Pressable
              key={cat}
              style={[styles.filterChip, idx === 0 && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, idx === 0 && styles.filterTextActive]}>{cat}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12,456</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.success }]}>4,320</Text>
            <Text style={styles.statLabel}>Contacted</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.warning }]}>3,215</Text>
            <Text style={styles.statLabel}>Supporters</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.danger }]}>4,921</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {/* Voter List */}
        <View style={styles.listContainer}>
          {VOTERS.map((voter) => (
            <VoterCard key={voter.membership} item={voter} />
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
  searchSection: {
    padding: Spacing.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    paddingVertical: Spacing.sm,
  },
  filterContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  filterChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
  },
  filterChipActive: {
    backgroundColor: Colors.primaryBlue,
    borderColor: Colors.primaryBlue,
  },
  filterText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  filterTextActive: {
    color: Colors.white,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadow.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.primaryBlue,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.borderLight,
  },
  listContainer: {
    marginHorizontal: Spacing.lg,
  },
  voterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadow.sm,
  },
  voterAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryBlue + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.primaryBlue,
  },
  voterInfo: {
    flex: 1,
  },
  voterName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  voterMeta: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  voterOrg: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  voterRight: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.xs,
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionBtn: {
    padding: 4,
  },
});
