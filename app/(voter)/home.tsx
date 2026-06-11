import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Dimensions,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import AppHeader from '@/components/AppHeader';
import FeaturedCandidates from '@/components/FeaturedCandidates';
import {
  Colors,
  Spacing,
  FontSize,
  FontWeight,
  Shadow,
  BorderRadius,
} from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/* ─── Data ─── */

interface BannerSlide {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  cta: string;
}

const BANNERS: BannerSlide[] = [
  {
    id: '1',
    title: 'IEB ELECTION 2026',
    subtitle: 'Your Vote, Our Future',
    tagline: 'Connecting Engineers, Strengthening Democracy',
    cta: 'Learn More',
  },
  {
    id: '2',
    title: 'VOTE FOR CHANGE',
    subtitle: 'Shape the Future',
    tagline: "Every Engineer's Voice Matters",
    cta: 'Learn More',
  },
  {
    id: '3',
    title: 'BUILD TOGETHER',
    subtitle: 'Unite & Lead',
    tagline: 'Building a Stronger Engineering Community',
    cta: 'Learn More',
  },
];

interface QuickItem {
  id: string;
  iconName: string;
  iconFamily: 'material' | 'fontawesome';
  label: string;
  color: string;
  route?: string;
}

const QUICK_ACCESS: QuickItem[] = [
  { id: '1', iconName: 'podium', iconFamily: 'material', label: 'President', color: '#1A4789', route: '/(voter)/candidates' },
  { id: '2', iconName: 'account-tie', iconFamily: 'material', label: 'Vice President', color: '#E67E22', route: '/(voter)/candidates' },
  { id: '3', iconName: 'user-tie', iconFamily: 'fontawesome', label: 'Gen. Secretary', color: '#2E8B57', route: '/(voter)/candidates' },
  { id: '4', iconName: 'account-group', iconFamily: 'material', label: 'Directory', color: '#8E44AD', route: '/(voter)/candidates' },
  { id: '5', iconName: 'file-document', iconFamily: 'material', label: 'Manifesto', color: '#00838F', route: '/(voter)/election-info' },
  { id: '6', iconName: 'calendar-month', iconFamily: 'material', label: 'Schedule', color: '#C62828', route: '/(voter)/election-info' },
  { id: '7', iconName: 'bullhorn', iconFamily: 'material', label: 'News', color: '#1565C0', route: '/(voter)/news' },
  { id: '8', iconName: 'phone-classic', iconFamily: 'material', label: 'Contact', color: '#2E7D32', route: '/(voter)/contact' },
];

const FEATURED_CANDIDATES = [
  { id: '1', name: 'Engr. Md. Ashraful Islam', position: 'President Candidate', institution: 'BUET', organization: 'PDB', positionColor: '#1A4789' },
  { id: '2', name: 'Engr. Farhana Rahman', position: 'Vice President Candidate', institution: 'CUET', organization: 'PDB', positionColor: '#E67E22' },
  { id: '3', name: 'Engr. Kamal Hossain', position: 'General Secretary Candidate', institution: 'RUET', organization: 'PGCB', positionColor: '#2E8B57' },
];

/* ─── Sub-components ─── */

const BannerSection = memo(function BannerSection() {
  const [active, setActive] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const transition = useCallback((next: number) => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 12, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setActive(next);
      translateY.setValue(-12);
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }),
      ]).start();
    });
  }, []);

  useEffect(() => {
    const t = setInterval(() => transition((active + 1) % BANNERS.length), 5000);
    return () => clearInterval(t);
  }, [active, transition]);

  const banner = BANNERS[active];

  return (
    <View style={styles.bannerContainer}>
      <View style={styles.bannerCard}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.bannerBgImage}
          contentFit="cover"
        />
        <View style={styles.bannerOverlay} />

        <View style={styles.bannerContent}>
          <Animated.View style={{ opacity: fade, transform: [{ translateY }] }}>
            <View style={styles.bannerBadge}>
              <Text style={styles.bannerBadgeText}>IEB ELECTION 2026</Text>
            </View>
            <Text style={styles.bannerTitle}>{banner.title}</Text>
            <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
            <Text style={styles.bannerTagline}>{banner.tagline}</Text>
            <Pressable style={styles.bannerCta}>
              <Text style={styles.bannerCtaText}>{banner.cta}</Text>
              <MaterialCommunityIcons name="arrow-right" size={16} color={Colors.darkNavy} />
            </Pressable>
          </Animated.View>
        </View>
      </View>

      <View style={styles.dotsRow}>
        {BANNERS.map((_, i) => (
          <Pressable key={i} onPress={() => i !== active && transition(i)}>
            <View style={[styles.dot, i === active && styles.dotActive]} />
          </Pressable>
        ))}
      </View>
    </View>
  );
});

const SearchBar = memo(function SearchBar() {
  return (
    <View style={styles.searchWrap}>
      <View style={styles.searchBar}>
        <MaterialCommunityIcons name="magnify" size={22} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search candidates, news, events..."
          placeholderTextColor={Colors.textMuted}
        />
        <Pressable style={styles.searchFilter}>
          <MaterialCommunityIcons name="tune-variant" size={20} color={Colors.primaryBlue} />
        </Pressable>
      </View>
    </View>
  );
});

const QuickAccessButton = memo(function QuickAccessButton({
  item,
  onPress,
}: {
  item: QuickItem;
  onPress: () => void;
}) {
  const icon =
    item.iconFamily === 'fontawesome' ? (
      <FontAwesome5 name={item.iconName as any} size={22} color={item.color} />
    ) : (
      <MaterialCommunityIcons name={item.iconName as any} size={24} color={item.color} />
    );

  return (
    <Pressable style={styles.quickBtn} onPress={onPress}>
      <View style={[styles.quickIconBg, { backgroundColor: item.color + '12' }]}>
        {icon}
      </View>
      <Text style={styles.quickLabel}>{item.label}</Text>
    </Pressable>
  );
});

const QuickAccessGrid = memo(function QuickAccessGrid() {
  const router = useRouter();

  return (
    <View style={styles.quickGrid}>
      {QUICK_ACCESS.map((item) => (
        <QuickAccessButton
          key={item.id}
          item={item}
          onPress={() => item.route && router.push(item.route as any)}
        />
      ))}
    </View>
  );
});

const CTABanner = memo(function CTABanner() {
  return (
    <View style={styles.ctaCard}>
      <View style={styles.ctaIconCircle}>
        <MaterialCommunityIcons name="vote-outline" size={24} color={Colors.white} />
      </View>
      <View style={styles.ctaTextBlock}>
        <Text style={styles.ctaTitle}>Fair Election. Strong IEB</Text>
        <Text style={styles.ctaSubtitle}>Your vote shapes the future of our engineering community.</Text>
      </View>
      <MaterialCommunityIcons name="vote" size={36} color={Colors.primaryBlue + '40'} />
    </View>
  );
});

const LoginBanner = memo(function LoginBanner() {
  const router = useRouter();
  return (
    <Pressable style={styles.loginCard} onPress={() => router.push('/login')}>
      <View style={styles.loginIconWrap}>
        <MaterialCommunityIcons name="shield-lock" size={32} color={Colors.accentGold} />
      </View>
      <View style={styles.loginTextBlock}>
        <Text style={styles.loginTitle}>Are you a Candidate?</Text>
        <Text style={styles.loginSubtitle}>Login to manage your campaign dashboard</Text>
      </View>
      <View style={styles.loginArrowWrap}>
        <MaterialCommunityIcons name="chevron-right" size={28} color={Colors.accentGold} />
      </View>
    </Pressable>
  );
});

/* ─── Screen ─── */

export default function VoterHomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.screen, { opacity: fadeAnim }]}>
      <AppHeader variant="light" showLoginButton onLoginPress={() => router.push('/login')} />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100 + insets.bottom,
        }}
      >
        <BannerSection />
        <SearchBar />

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
        </View>
        <QuickAccessGrid />

        <FeaturedCandidates candidates={FEATURED_CANDIDATES} />

        <CTABanner />
        <LoginBanner />
      </ScrollView>
    </Animated.View>
  );
}

/* ─── Styles ─── */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },

  /* ── Banner ── */
  bannerContainer: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
  },
  bannerCard: {
    borderRadius: BorderRadius.xxl,
    overflow: 'hidden',
    minHeight: 200,
    backgroundColor: Colors.primaryBlue,
  },
  bannerBgImage: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.08,
  },
  bannerOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(26,71,137,0.85)',
  },
  bannerContent: {
    padding: Spacing.xl,
    position: 'relative',
  },
  bannerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accentGold,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  bannerBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.darkNavy,
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.white,
    letterSpacing: 0.5,
  },
  bannerSubtitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.accentGold,
    marginTop: Spacing.xs,
  },
  bannerTagline: {
    fontSize: FontSize.sm,
    color: '#B8D4F0',
    marginTop: Spacing.sm,
    lineHeight: 20,
    maxWidth: '80%',
  },
  bannerCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.accentGold,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: BorderRadius.lg,
    alignSelf: 'flex-start',
    marginTop: Spacing.lg,
  },
  bannerCtaText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.darkNavy,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primaryBlue,
  },

  /* ── Search ── */
  searchWrap: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
    ...Shadow.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  searchFilter: {
    padding: Spacing.xs,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.md,
  },

  /* ── Section Header ── */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },

  /* ── Quick Access ── */
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  quickBtn: {
    alignItems: 'center',
    gap: Spacing.xs,
    width: (SCREEN_WIDTH - Spacing.lg * 2 - Spacing.sm * 3) / 4,
  },
  quickIconBg: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  quickLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  /* ── CTA Banner ── */
  ctaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Shadow.sm,
    gap: Spacing.md,
  },
  ctaIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primaryBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaTextBlock: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  ctaSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 18,
  },

  /* ── Login Banner ── */
  loginCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkNavy,
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  loginIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(212,168,67,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginTextBlock: {
    flex: 1,
  },
  loginTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  loginSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: 2,
  },
  loginArrowWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(212,168,67,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
