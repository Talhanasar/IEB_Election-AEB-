import React, { memo, useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  StatusBar,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppHeader from '@/components/AppHeader';
import { Pagination } from '@/components/Pagination';
import VoterDetailModal from '@/components/VoterDetailModal';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';
import {
  getAllVoters,
  searchVoters,
  TOTAL_VOTERS,
  ACTIVE_VOTERS,
  DEFAULTER_VOTERS,
  VOTERS_WITH_PHONE,
  UNIVERSITIES,
  getStatusColor,
  getStatusLabel,
} from '@/src/data/voterData';
import type { Voter } from '@/src/data/voterTypes';

const FILTER_CATEGORIES = ['All', 'Active', 'Defaulter', ...UNIVERSITIES.slice(0, 8)];
const DEFAULT_PAGE_SIZE = 20;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const VoterCard = memo(function VoterCard({
  item,
  onPress,
}: {
  item: Voter;
  onPress: (voter: Voter) => void;
}) {
  const color = getStatusColor(item.status);
  const label = getStatusLabel(item.status);
  const initial = item.name.replace(/^ENGR\.\s*/i, '').charAt(0).toUpperCase();

  const handlePhonePress = useCallback(() => {
    // Placeholder for phone action
  }, []);

  const handleMessagePress = useCallback(() => {
    // Placeholder for message action
  }, []);

  return (
    <Pressable
      style={styles.voterCard}
      onPress={() => onPress(item)}
      testID={`voter-card-${item.membershipNo}`}
    >
      <View style={styles.voterAvatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>
      <View style={styles.voterInfo}>
        <Text style={styles.voterName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.voterMeta}>
          {item.membershipNo} • {item.university || 'N/A'} • {item.division}
        </Text>
        {item.jobLocation ? (
          <Text style={styles.voterOrg} numberOfLines={1}>{item.jobLocation}</Text>
        ) : (
          <Text style={styles.voterOrg} numberOfLines={1}>{item.address.slice(0, 40)}...</Text>
        )}
      </View>
      <View style={styles.voterRight}>
        <View style={[styles.statusBadge, { backgroundColor: color + '18' }]}>
          <Text style={[styles.statusText, { color }]}>{label}</Text>
        </View>
        <View style={styles.actionRow}>
          {item.phone && (
            <Pressable style={styles.actionBtn} onPress={handlePhonePress}>
              <MaterialCommunityIcons name="phone-in-talk" size={18} color={Colors.primaryBlue} />
            </Pressable>
          )}
          <Pressable style={styles.actionBtn} onPress={handleMessagePress}>
            <MaterialCommunityIcons name="message-text" size={18} color={Colors.success} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
});

export default function VotersScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [selectedVoter, setSelectedVoter] = useState<Voter | null>(null);

  // Apply a dark-navy status bar only while Voters is focused, then restore
  // the default appearance on blur so other candidate tabs are unaffected.
  useFocusEffect(
    useCallback(() => {
      StatusBar.setBackgroundColor(Colors.darkNavy, true);
      StatusBar.setBarStyle('light-content', true);
      return () => {
        StatusBar.setBackgroundColor('transparent', true);
        StatusBar.setBarStyle('light-content', true);
      };
    }, []),
  );

  const filteredVoters = useMemo(() => {
    let results = getAllVoters();

    if (searchQuery.trim()) {
      results = searchVoters(searchQuery);
    }

    if (activeFilter === 'Active') {
      results = results.filter((v) => v.status === 'active');
    } else if (activeFilter === 'Defaulter') {
      results = results.filter((v) => v.status === 'defaulter');
    } else if (activeFilter !== 'All') {
      results = results.filter((v) => v.university === activeFilter);
    }

    return results;
  }, [searchQuery, activeFilter]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredVoters.length / pageSize)),
    [filteredVoters.length, pageSize],
  );
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, filteredVoters.length);

  const displayedVoters = useMemo(
    () => filteredVoters.slice(startIdx, endIdx),
    [filteredVoters, startIdx, endIdx],
  );

  // Reset to page 1 when the user changes search query or active filter.
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  return (
    <View style={styles.container}>
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
              value={searchQuery}
              onChangeText={setSearchQuery}
              testID="voters-search-input"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <MaterialCommunityIcons name="close-circle" size={20} color={Colors.textMuted} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {FILTER_CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              testID={`voters-filter-chip-${cat}`}
              style={[styles.filterChip, activeFilter === cat && styles.filterChipActive]}
              onPress={() => setActiveFilter(cat)}
            >
              <Text style={[styles.filterText, activeFilter === cat && styles.filterTextActive]}>{cat}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{TOTAL_VOTERS.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.success }]}>{ACTIVE_VOTERS.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.warning }]}>{DEFAULTER_VOTERS.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Defaulter</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: Colors.danger }]}>{VOTERS_WITH_PHONE.toLocaleString()}</Text>
            <Text style={styles.statLabel}>With Phone</Text>
          </View>
        </View>

        {/* Results Count */}
        <View style={styles.resultsBar}>
          <Text style={styles.resultsText} testID="voters-results-summary">
            {filteredVoters.length === 0
              ? `Showing 0 of 0 results${searchQuery ? ` for "${searchQuery}"` : ''}`
              : `Showing ${startIdx + 1}\u2013${endIdx} of ${filteredVoters.length.toLocaleString()}${searchQuery ? ` for "${searchQuery}"` : ''}`}
          </Text>
        </View>

        {/* Voter List */}
        <View style={styles.listContainer}>
          {displayedVoters.map((voter) => (
            <VoterCard
              key={voter.membershipNo}
              item={voter}
              onPress={setSelectedVoter}
            />
          ))}
        </View>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredVoters.length}
          pageSize={pageSize}
          pageSizeOptions={PAGE_SIZE_OPTIONS}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />

        <VoterDetailModal
          voter={selectedVoter}
          onClose={() => setSelectedVoter(null)}
        />

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
  resultsBar: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  resultsText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
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
  loadMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  loadMoreText: {
    fontSize: FontSize.md,
    color: Colors.primaryBlue,
    fontWeight: FontWeight.semibold,
    marginRight: Spacing.xs,
  },
});
