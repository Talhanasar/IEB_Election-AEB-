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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppHeader from '@/components/AppHeader';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

interface Candidate {
  name: string;
  position: string;
  org: string;
}

const POSITIONS = ['All Positions', 'President', 'Vice President', 'Gen. Secretary', 'Council Member'];

const CANDIDATES: Candidate[] = [
  { name: 'Engr. Md. Ashraful Islam', position: 'President', org: 'BUET | PDB' },
  { name: 'Engr. Farhana Rahman', position: 'Vice President', org: 'CUET | PDB' },
  { name: 'Engr. Kamal Hossain', position: 'General Secretary', org: 'RUET | PGCB' },
  { name: 'Engr. Tanvir Ahmed', position: 'Council Member', org: 'KUET | BPDB' },
  { name: 'Engr. Nasrin Akter', position: 'Council Member', org: 'DUET | DESCO' },
  { name: 'Engr. Rafiq Uddin', position: 'Council Member', org: 'BUET | WASA' },
];

const CandidateItem = memo(function CandidateItem({ item }: { item: Candidate }) {
  return (
    <Pressable style={styles.candidateItem}>
      <View style={styles.candidateAvatar}>
        <MaterialCommunityIcons name="account-tie" size={28} color={Colors.primaryBlue} />
      </View>
      <View style={styles.candidateInfo}>
        <Text style={styles.candidateName}>{item.name}</Text>
        <Text style={styles.candidatePosition}>{item.position}</Text>
        <Text style={styles.candidateOrg}>{item.org}</Text>
      </View>
      <Pressable style={styles.viewBtn}>
        <Text style={styles.viewBtnText}>View</Text>
      </Pressable>
    </Pressable>
  );
});

export default function CandidatesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <AppHeader variant="light" />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <MaterialCommunityIcons name="magnify" size={20} color={Colors.textMuted} style={{ marginRight: Spacing.sm }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, discipline, org..."
              placeholderTextColor={Colors.textMuted}
            />
          </View>
        </View>

        {/* Position Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContainer}
        >
          {POSITIONS.map((pos, index) => (
            <Pressable
              key={pos}
              style={[styles.chip, index === 0 && styles.chipActive]}
            >
              <Text style={[styles.chipText, index === 0 && styles.chipTextActive]}>
                {pos}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Candidate List */}
        <View style={styles.listContainer}>
          {CANDIDATES.map((candidate) => (
            <CandidateItem key={candidate.name} item={candidate} />
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
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
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
  chipsContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
  },
  chipActive: {
    backgroundColor: Colors.primaryBlue,
    borderColor: Colors.primaryBlue,
  },
  chipText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  chipTextActive: {
    color: Colors.white,
  },
  listContainer: {
    paddingHorizontal: Spacing.lg,
  },
  candidateItem: {
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
  candidateAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.bannerBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  candidateInfo: {
    flex: 1,
  },
  candidateName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  candidatePosition: {
    fontSize: FontSize.sm,
    color: Colors.primaryBlue,
    fontWeight: FontWeight.semibold,
    marginTop: 2,
  },
  candidateOrg: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  viewBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1.5,
    borderColor: Colors.primaryBlue,
  },
  viewBtnText: {
    fontSize: FontSize.sm,
    color: Colors.primaryBlue,
    fontWeight: FontWeight.semibold,
  },
});
