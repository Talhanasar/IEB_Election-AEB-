import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

export interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

type StripItem = number | 'ellipsis';

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;
const SIBLING_COUNT = 2;

/**
 * Build a compact numeric page strip:
 *   - always includes page 1 and the last page
 *   - always includes the current page and SIBLING_COUNT pages on each side
 *   - inserts an ellipsis wherever the gap between consecutive visible numbers
 *     is greater than 1
 */
function buildPageStrip(currentPage: number, totalPages: number): StripItem[] {
  if (totalPages <= 0) {
    return [];
  }

  const visible = new Set<number>();
  visible.add(1);
  visible.add(totalPages);
  for (let p = currentPage - SIBLING_COUNT; p <= currentPage + SIBLING_COUNT; p += 1) {
    if (p >= 1 && p <= totalPages) {
      visible.add(p);
    }
  }

  const sorted = Array.from(visible).sort((a, b) => a - b);
  const items: StripItem[] = [];
  for (let i = 0; i < sorted.length; i += 1) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      items.push('ellipsis');
    }
    items.push(sorted[i]);
  }
  return items;
}

export function Pagination({
  currentPage,
  totalItems,
  pageSize,
  pageSizeOptions = [...DEFAULT_PAGE_SIZE_OPTIONS],
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const isFirst = safeCurrentPage <= 1;
  const isLast = safeCurrentPage >= totalPages;

  const handlePrev = () => {
    if (!isFirst) onPageChange(safeCurrentPage - 1);
  };

  const handleNext = () => {
    if (!isLast) onPageChange(safeCurrentPage + 1);
  };

  const strip = useMemo(
    () => buildPageStrip(safeCurrentPage, totalPages),
    [safeCurrentPage, totalPages],
  );

  return (
    <View style={styles.container} testID="pagination">
      {/* Page-size selector */}
      <View style={styles.pageSizeRow} testID="pagination-page-size">
        <Text style={styles.pageSizeLabel}>Rows</Text>
        <View style={styles.chipsContainer}>
          {pageSizeOptions.map((size) => {
            const isActive = size === pageSize;
            return (
              <Pressable
                key={size}
                onPress={() => onPageSizeChange(size)}
                style={[styles.chip, isActive && styles.chipActive]}
                accessibilityRole="button"
                accessibilityLabel={`Show ${size} per page`}
                accessibilityState={{ selected: isActive }}
                testID={`pagination-page-size-${size}`}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {size}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Pagination controls */}
      <View style={styles.controlsRow} testID="pagination-controls">
        <Pressable
          onPress={handlePrev}
          disabled={isFirst}
          style={[styles.navBtn, isFirst && styles.navBtnDisabled]}
          accessibilityRole="button"
          accessibilityLabel="Previous page"
          accessibilityState={{ disabled: isFirst }}
          testID="pagination-prev"
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={18}
            color={isFirst ? Colors.textMuted : Colors.primaryBlue}
          />
          <Text style={[styles.navBtnText, isFirst && styles.navBtnTextDisabled]}>Prev</Text>
        </Pressable>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.stripContainer}
          testID="pagination-strip"
        >
          {strip.map((item, idx) => {
            if (item === 'ellipsis') {
              return (
                <View
                  key={`ellipsis-${idx}`}
                  style={styles.ellipsis}
                  testID="pagination-ellipsis"
                  accessibilityElementsHidden
                  importantForAccessibility="no"
                >
                  <Text style={styles.ellipsisText}>…</Text>
                </View>
              );
            }
            const isCurrent = item === safeCurrentPage;
            return (
              <Pressable
                key={item}
                onPress={() => onPageChange(item)}
                style={[styles.pageBtn, isCurrent && styles.pageBtnActive]}
                accessibilityRole="button"
                accessibilityLabel={`Page ${item}`}
                accessibilityState={{ selected: isCurrent }}
                testID={`pagination-page-${item}`}
              >
                <Text
                  style={[styles.pageBtnText, isCurrent && styles.pageBtnTextActive]}
                  maxFontSizeMultiplier={1.4}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Pressable
          onPress={handleNext}
          disabled={isLast}
          style={[styles.navBtn, isLast && styles.navBtnDisabled]}
          accessibilityRole="button"
          accessibilityLabel="Next page"
          accessibilityState={{ disabled: isLast }}
          testID="pagination-next"
        >
          <Text style={[styles.navBtnText, isLast && styles.navBtnTextDisabled]}>Next</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={18}
            color={isLast ? Colors.textMuted : Colors.primaryBlue}
          />
        </Pressable>
      </View>
    </View>
  );
}

export default Pagination;

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  pageSizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: Spacing.sm,
  },
  pageSizeLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginRight: Spacing.sm,
    fontWeight: FontWeight.medium,
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  chip: {
    minWidth: 36,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontWeight: FontWeight.semibold,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  navBtnDisabled: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.borderLight,
  },
  navBtnText: {
    fontSize: FontSize.sm,
    color: Colors.primaryBlue,
    fontWeight: FontWeight.semibold,
    marginHorizontal: 2,
  },
  navBtnTextDisabled: {
    color: Colors.textMuted,
  },
  stripContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
    gap: Spacing.xs,
  },
  pageBtn: {
    minWidth: 34,
    height: 34,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageBtnActive: {
    backgroundColor: Colors.primaryBlue,
    borderColor: Colors.primaryBlue,
  },
  pageBtnText: {
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
  },
  pageBtnTextActive: {
    color: Colors.white,
    fontWeight: FontWeight.bold,
  },
  ellipsis: {
    minWidth: 24,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
  },
  ellipsisText: {
    fontSize: FontSize.md,
    color: Colors.textTertiary,
    fontWeight: FontWeight.bold,
  },
});
