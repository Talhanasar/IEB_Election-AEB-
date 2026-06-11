import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppHeader from '@/components/AppHeader';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius, Shadow } from '@/constants/theme';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  featured?: boolean;
}

const CATEGORIES = ['All', 'Election Update', 'Event', 'Announcement', 'Circular'];

const NEWS_ITEMS: NewsItem[] = [
  {
    id: '1',
    title: 'IEB Election 2026 Nomination Period Opens',
    excerpt: 'The nomination period for IEB Election 2026 has officially begun. Candidates can submit their nomination forms through the designated channels before the deadline.',
    date: 'June 1, 2026',
    category: 'Election Update',
    readTime: '3 min read',
    featured: true,
  },
  {
    id: '2',
    title: 'AEB Organizes Pre-Election Forum',
    excerpt: 'Association of Engineers Bangladesh is organizing a pre-election forum where all candidates will present their vision and plans for the engineering community.',
    date: 'May 28, 2026',
    category: 'Event',
    readTime: '2 min read',
  },
  {
    id: '3',
    title: 'Updated Voter List Published',
    excerpt: 'The updated voter list for IEB Election 2026 has been published. All IEB members are encouraged to verify their information before the election day.',
    date: 'May 25, 2026',
    category: 'Announcement',
    readTime: '4 min read',
  },
  {
    id: '4',
    title: 'Campaign Guidelines Released',
    excerpt: 'The election commission has released the official campaign guidelines for all candidates participating in IEB Election 2026.',
    date: 'May 22, 2026',
    category: 'Circular',
    readTime: '5 min read',
  },
  {
    id: '5',
    title: 'Engineering Excellence Awards 2026',
    excerpt: 'Nominations are now open for the Engineering Excellence Awards 2026. Recognize outstanding contributions by fellow engineers.',
    date: 'May 18, 2026',
    category: 'Announcement',
    readTime: '2 min read',
  },
  {
    id: '6',
    title: 'Annual General Meeting Schedule',
    excerpt: 'The annual general meeting for Association of Engineers Bangladesh has been scheduled for July 2026 in Dhaka.',
    date: 'May 15, 2026',
    category: 'Event',
    readTime: '1 min read',
  },
  {
    id: '7',
    title: 'Election Security Measures Announced',
    excerpt: 'New security protocols have been established to ensure fair and transparent elections across all engineering institutions.',
    date: 'May 12, 2026',
    category: 'Election Update',
    readTime: '3 min read',
  },
  {
    id: '8',
    title: 'District Coordinator Meeting',
    excerpt: 'All district coordinators are invited to attend the upcoming strategic planning meeting on June 5th.',
    date: 'May 10, 2026',
    category: 'Event',
    readTime: '2 min read',
  },
];

const CATEGORY_ICONS: Record<string, string> = {
  'Election Update': 'vote',
  'Event': 'calendar-star',
  'Announcement': 'bullhorn',
  'Circular': 'file-document',
};

const CATEGORY_COLORS: Record<string, string> = {
  'Election Update': Colors.primaryBlue,
  'Event': Colors.warning,
  'Announcement': Colors.success,
  'Circular': Colors.danger,
};

function getCategoryIcon(category: string) {
  return CATEGORY_ICONS[category] || 'newspaper';
}

function getCategoryColor(category: string) {
  return CATEGORY_COLORS[category] || Colors.textSecondary;
}

function FeaturedNewsCard({ item }: { item: NewsItem }) {
  return (
    <Pressable style={styles.featuredCard}>
      <View style={styles.featuredImagePlaceholder}>
        <MaterialCommunityIcons name="newspaper-variant" size={40} color={Colors.white} />
        <View style={styles.featuredOverlay} />
      </View>

      <View style={styles.featuredContent}>
        <View style={styles.featuredBadge}>
          <MaterialCommunityIcons name="star" size={12} color={Colors.white} />
          <Text style={styles.featuredBadgeText}> FEATURED</Text>
        </View>

        <Text style={styles.featuredTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.featuredExcerpt} numberOfLines={2}>
          {item.excerpt}
        </Text>

        <View style={styles.featuredMeta}>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="calendar-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.metaText}>{item.date}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="clock-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.metaText}>{item.readTime}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function NewsListItem({ item }: { item: NewsItem }) {
  const color = getCategoryColor(item.category);
  return (
    <Pressable style={styles.newsCard}>
      <View style={[styles.newsIconCircle, { backgroundColor: color + '15' }]}>
        <MaterialCommunityIcons
          name={getCategoryIcon(item.category) as any}
          size={22}
          color={color}
        />
      </View>

      <View style={styles.newsInfo}>
        <View style={styles.newsTagRow}>
          <View style={[styles.tagBadge, { backgroundColor: color + '12' }]}>
            <Text style={[styles.tagText, { color }]}>
              {item.category}
            </Text>
          </View>
        </View>

        <Text style={styles.newsTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={styles.newsExcerpt} numberOfLines={2}>
          {item.excerpt}
        </Text>

        <View style={styles.newsMeta}>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="calendar-outline" size={12} color={Colors.textMuted} />
            <Text style={styles.metaTextSmall}>{item.date}</Text>
          </View>
          <View style={styles.metaItem}>
            <MaterialCommunityIcons name="clock-outline" size={12} color={Colors.textMuted} />
            <Text style={styles.metaTextSmall}>{item.readTime}</Text>
          </View>
        </View>
      </View>

      <View style={styles.arrowContainer}>
        <MaterialCommunityIcons name="chevron-right" size={24} color={Colors.textMuted} />
      </View>
    </Pressable>
  );
}

export default function NewsScreen() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredNews = activeCategory === 'All'
    ? NEWS_ITEMS
    : NEWS_ITEMS.filter(item => item.category === activeCategory);

  const featuredNews = filteredNews.find(item => item.featured);
  const regularNews = filteredNews.filter(item => !item.featured);

  return (
    <View style={styles.container}>
      <AppHeader variant="light" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Dark Header Section */}
        <View style={styles.darkHeader}>
          <View style={styles.headerTop}>
            <View style={styles.headerIconCircle}>
              <MaterialCommunityIcons name="newspaper-variant" size={28} color={Colors.white} />
            </View>
            <View>
              <Text style={styles.headerTitle}>News & Updates</Text>
              <Text style={styles.headerSubtitle}>Stay informed about IEB Election 2026</Text>
            </View>
          </View>

          {/* Category Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContainer}
          >
            {CATEGORIES.map((cat) => (
              <Pressable
                key={cat}
                style={[
                  styles.categoryChip,
                  activeCategory === cat && styles.categoryChipActive,
                ]}
                onPress={() => setActiveCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    activeCategory === cat && styles.categoryChipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Featured News Card */}
        {featuredNews && <FeaturedNewsCard item={featuredNews} />}

        {/* Section Header */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeaderTitle}>Latest News</Text>
          <Text style={styles.sectionHeaderCount}>{regularNews.length} articles</Text>
        </View>

        {/* News List */}
        {regularNews.map((item) => (
          <NewsListItem key={item.id} item={item} />
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

  // Dark Header
  darkHeader: {
    backgroundColor: Colors.darkNavy,
    paddingBottom: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.xxl,
    borderBottomRightRadius: BorderRadius.xxl,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  headerIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },

  // Category Chips
  categoryContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    paddingTop: Spacing.md,
  },
  categoryChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  categoryChipActive: {
    backgroundColor: Colors.accentGold,
    borderColor: Colors.accentGold,
  },
  categoryChipText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: FontWeight.semibold,
  },
  categoryChipTextActive: {
    color: Colors.darkNavy,
    fontWeight: FontWeight.bold,
  },

  // Featured Card
  featuredCard: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadow.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  featuredImagePlaceholder: {
    height: 150,
    backgroundColor: Colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  featuredOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  featuredContent: {
    padding: Spacing.xl,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.accentGold,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  featuredBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.darkNavy,
  },
  featuredTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    lineHeight: 26,
    marginBottom: Spacing.sm,
  },
  featuredExcerpt: {
    fontSize: FontSize.md,
    color: Colors.textTertiary,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  featuredMeta: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },

  // Section Header
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  sectionHeaderTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  sectionHeaderCount: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },

  // News Cards
  newsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadow.sm,
    gap: Spacing.md,
  },
  newsIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newsInfo: {
    flex: 1,
  },
  newsTagRow: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
  },
  tagBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  tagText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
  newsTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
    lineHeight: 20,
  },
  newsExcerpt: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  newsMeta: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  arrowContainer: {
    paddingLeft: Spacing.sm,
  },

  // Meta
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
  metaTextSmall: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
});
