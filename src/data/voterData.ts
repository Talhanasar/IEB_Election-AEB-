import rawVoters from './voters.json';
import type { Voter } from './voterTypes';
import { Colors } from '@/constants/theme';

const ALL_VOTERS: Voter[] = rawVoters as Voter[];

/**
 * Returns the color associated with a voter status.
 */
export function getStatusColor(status: string) {
  switch (status) {
    case 'active': return Colors.success;
    case 'defaulter': return Colors.danger;
    default: return Colors.textSecondary;
  }
}

/**
 * Returns the display label for a voter status.
 */
export function getStatusLabel(status: string) {
  switch (status) {
    case 'active': return 'Active';
    case 'defaulter': return 'Defaulter';
    default: return status;
  }
}

export const TOTAL_VOTERS = ALL_VOTERS.length;
export const ACTIVE_VOTERS = ALL_VOTERS.filter((v) => v.status === 'active').length;
export const DEFAULTER_VOTERS = ALL_VOTERS.filter((v) => v.status === 'defaulter').length;
export const VOTERS_WITH_PHONE = ALL_VOTERS.filter((v) => v.phone).length;

/** All unique universities in the dataset */
export const UNIVERSITIES = Array.from(new Set(ALL_VOTERS.map((v) => v.university).filter(Boolean))).sort();

/** All unique divisions in the dataset */
export const DIVISIONS = Array.from(new Set(ALL_VOTERS.map((v) => v.division).filter(Boolean))).sort();

/** Returns the full list of voters */
export function getAllVoters(): Voter[] {
  return ALL_VOTERS;
}

/** Search voters by name, membership number, or address */
export function searchVoters(query: string): Voter[] {
  const q = query.toLowerCase().trim();
  if (!q) return ALL_VOTERS;
  return ALL_VOTERS.filter(
    (v) =>
      v.name.toLowerCase().includes(q) ||
      v.membershipNo.toLowerCase().includes(q) ||
      (v.address && v.address.toLowerCase().includes(q)) ||
      (v.phone && v.phone.includes(q)) ||
      (v.jobLocation && v.jobLocation.toLowerCase().includes(q))
  );
}

/** Filter voters by one or more criteria */
export function filterVoters(filters: {
  status?: 'active' | 'defaulter' | 'all';
  university?: string;
  division?: string;
}): Voter[] {
  return ALL_VOTERS.filter((v) => {
    if (filters.status && filters.status !== 'all' && v.status !== filters.status) return false;
    if (filters.university && v.university !== filters.university) return false;
    if (filters.division && v.division !== filters.division) return false;
    return true;
  });
}

/** Get voters by status with optional search */
export function getVotersByStatus(
  status: 'active' | 'defaulter' | 'all',
  query?: string
): Voter[] {
  let list = status === 'all' ? ALL_VOTERS : ALL_VOTERS.filter((v) => v.status === status);
  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    list = list.filter(
      (v) =>
        v.name.toLowerCase().includes(q) ||
        v.membershipNo.toLowerCase().includes(q) ||
        (v.address && v.address.toLowerCase().includes(q))
    );
  }
  return list;
}

export type { Voter } from './voterTypes';
