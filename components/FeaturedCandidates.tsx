import React, { useRef, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Colors,
  Spacing,
  FontSize,
  FontWeight,
  Shadow,
  BorderRadius,
} from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = 280;
const CARD_GAP = Spacing.sm;
const FULL_CARD_WIDTH = CARD_WIDTH + CARD_GAP;

interface Candidate {
  id: string;
  name: string;
  position: string;
  institution: string;
  organization: string;
  positionColor: string;
}

/* ─── Clickable Dot ─── */
const Dot = memo(function Dot({
  index,
  active,
  onPress,
}: {
  index: number;
  active: boolean;
  onPress: (index: number) => void;
}) {
  return (
    <Pressable
      onPress={() => onPress(index)}
      style={styles.dotPressable}
    >
      <View style={[styles.dotBase, active && styles.dotActive]} />
    </Pressable>
  );
});

/* ─── Candidate Card ─── */
const CandidateItem = memo(function CandidateItem({
  item,
  onPress,
}: {
  item: Candidate;
  onPress: () => void;
}) {
  const initials = item.name
    .split(' ')
    .filter((n) => n[0] === n[0].toUpperCase() && n.length > 2)
    .map((n) => n[0])
    .slice(0, 2)
    .join('') || item.name.slice(0, 2).toUpperCase();

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={[styles.avatar, { backgroundColor: item.positionColor + '15' }]}>
        <Text style={[styles.initials, { color: item.positionColor }]}>{initials}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={[styles.position, { color: item.positionColor }]} numberOfLines={1}>
          {item.position}
        </Text>
        <Text style={styles.org} numberOfLines={1}>
          {item.institution} | {item.organization}
        </Text>
      </View>
    </Pressable>
  );
});

/* ─── Feature Component ─── */
interface FeaturedCandidatesProps {
  candidates: Candidate[];
}

export default function FeaturedCandidates({ candidates }: FeaturedCandidatesProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (e: any) => {
    const { contentOffset, layoutMeasurement } = e.nativeEvent;
    const fractionalIndex = (contentOffset.x + layoutMeasurement.width / 2) / FULL_CARD_WIDTH;
    const newIndex = Math.max(0, Math.min(candidates.length - 1, Math.round(fractionalIndex)));
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  const goToIndex = (index: number) => {
    scrollRef.current?.scrollTo({
      x: index * FULL_CARD_WIDTH,
      animated: true,
    });
    setActiveIndex(index);
  };

  return (
    <View>
      {/* Section title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Featured Candidates</Text>
        <Pressable onPress={() => router.push('/(voter)/candidates') }>
          <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      </View>

      {/* Horizontal scrollable cards */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        decelerationRate="fast"
        snapToInterval={FULL_CARD_WIDTH}
        snapToAlignment="start"
        contentContainerStyle={styles.scrollContent}
      >
        {candidates.map((candidate) => (
          <CandidateItem
            key={candidate.id}
            item={candidate}
            onPress={() => router.push('/(voter)/candidates')}
          />
        ))}
      </ScrollView>

      {/* Active dots */}
      <View style={styles.dots}>
        {candidates.map((_, i) => (
          <Dot key={i} index={i} active={i === activeIndex} onPress={goToIndex} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  viewAll: {
    fontSize: FontSize.sm,
    color: Colors.primaryBlue,
    fontWeight: FontWeight.semibold,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: CARD_GAP,
  },

  /* Card */
  card: {
    width: CARD_WIDTH,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  avatar: {
    width: 64,
    height: 72,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  initials: {
    fontSize: 22,
    fontWeight: FontWeight.bold,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  position: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    marginBottom: 2,
  },
  org: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },

  /* Dots */
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  dotPressable: {
    padding: Spacing.xs,
  },
  dotBase: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: {
    backgroundColor: Colors.primaryBlue,
    width: 24,
  },
});
