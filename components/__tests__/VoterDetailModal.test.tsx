import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';

// Mock icon set
jest.mock('@expo/vector-icons', () => {
  const ReactInner = jest.requireActual('react');
  const { Text: RNText } = jest.requireActual('react-native');
  const make = (name: string) => {
    const Component = (props: { children?: React.ReactNode }) =>
      ReactInner.createElement(RNText, null, name);
    Component.displayName = name;
    return Component;
  };
  const stub: Record<string, unknown> = {};
  [
    'MaterialCommunityIcons',
    'MaterialIcons',
    'Ionicons',
    'FontAwesome',
    'Feather',
    'AntDesign',
  ].forEach((s) => {
    stub[s] = make(s);
  });
  return stub;
});

// Stub expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useFocusEffect: (cb: () => void | (() => void)) => {
    const cleanup = cb();
    return typeof cleanup === 'function' ? cleanup : undefined;
  },
}));

// Mock voterData
jest.mock('@/src/data/voterData', () => ({
  getStatusColor: (status: string) => {
    switch (status) {
      case 'active': return '#00C853';
      case 'defaulter': return '#FF3D00';
      default: return '#9E9E9E';
    }
  },
  getStatusLabel: (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'defaulter': return 'Defaulter';
      default: return status;
    }
  },
}));

/* eslint-disable import/first */
import VoterDetailModal from '../VoterDetailModal';
import type { Voter } from '@/src/data/voterTypes';
/* eslint-enable import/first */

const createMockVoter = (overrides: Partial<Voter> = {}): Voter => ({
  membershipNo: 'M0001',
  name: 'Test Voter',
  division: 'Dhaka',
  university: 'BUET',
  centre: 'Main',
  passingYear: '2010',
  address: '123 Test Street',
  phone: '01700000000',
  email: 'test@example.com',
  status: 'active',
  duesYears: '2022-2023',
  duesAmount: '5000',
  paidUpto: '2021',
  jobLocation: 'Dhaka, Bangladesh',
  ...overrides,
});

describe('VoterDetailModal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders nothing when voter is null', () => {
    render(<VoterDetailModal voter={null} onClose={mockOnClose} />);
    expect(screen.queryByTestId('voter-detail-modal')).toBeNull();
    expect(screen.queryByTestId('voter-detail-backdrop')).toBeNull();
  });

  it('renders voter details when voter is provided', () => {
    const voter = createMockVoter();
    render(<VoterDetailModal voter={voter} onClose={mockOnClose} />);

    expect(screen.getByTestId('voter-detail-modal')).toBeTruthy();
    expect(screen.getByText(voter.name)).toBeTruthy();
    expect(screen.getByText(`Membership: ${voter.membershipNo}`)).toBeTruthy();
    expect(screen.getByText(voter.university || '')).toBeTruthy();
    expect(screen.getByText(voter.jobLocation || '')).toBeTruthy();
    expect(screen.getByText(voter.phone || '')).toBeTruthy();
    expect(screen.getByText(voter.email || '')).toBeTruthy();
  });

  it('hides empty/null fields', () => {
    const voter = createMockVoter({ email: null, jobLocation: null, duesYears: null, duesAmount: null, paidUpto: null });
    render(<VoterDetailModal voter={voter} onClose={mockOnClose} />);

    expect(screen.queryByText('Email')).toBeNull();
    expect(screen.queryByText('Job Location')).toBeNull();
    expect(screen.queryByText('Dues Years')).toBeNull();
    expect(screen.queryByText('Dues Amount')).toBeNull();
    expect(screen.queryByText('Paid Up To')).toBeNull();
  });

  it('calls onClose when backdrop is pressed', () => {
    const voter = createMockVoter();
    render(<VoterDetailModal voter={voter} onClose={mockOnClose} />);

    fireEvent.press(screen.getByTestId('voter-detail-backdrop'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the bottom Close button is pressed', () => {
    const voter = createMockVoter();
    render(<VoterDetailModal voter={voter} onClose={mockOnClose} />);

    fireEvent.press(screen.getByTestId('voter-detail-close-button'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
