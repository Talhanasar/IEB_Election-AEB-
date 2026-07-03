import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { StatusBar } from 'react-native';

// Silence noisy StatusBar warnings during tests (setBackgroundColor is
// only available on Android; setBarStyle is also called imperatively).
jest.spyOn(StatusBar, 'setBackgroundColor').mockImplementation(() => {});
jest.spyOn(StatusBar, 'setBarStyle').mockImplementation(() => {});

// Mock icon set: lazy requires inside the factory to avoid Jest's
// out-of-scope hoisting restriction.
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

// Stub expo-router's useFocusEffect so the focus callback runs eagerly.
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useFocusEffect: (cb: () => void | (() => void)) => {
    const cleanup = cb();
    return typeof cleanup === 'function' ? cleanup : undefined;
  },
}));

// Stub AppHeader to avoid pulling in expo-image and safe-area-context.
jest.mock('@/components/AppHeader', () => {
  const ReactInner = jest.requireActual('react');
  const { View } = jest.requireActual('react-native');
  const AppHeader = (props: Record<string, unknown>) =>
    ReactInner.createElement(View, { testID: 'app-header', ...props });
  AppHeader.displayName = 'AppHeader';
  return { __esModule: true, default: AppHeader };
});

// Build a deterministic 50-voter fixture and wire up the data layer mocks.
// The fixture is built inside the jest.mock factory because Jest hoists
// jest.mock above lexical `const` declarations, so a top-level fixture
// variable would be `undefined` when the factory runs.
jest.mock('@/src/data/voterData', () => {
  const FIXTURE_SIZE = 50;
  const mockFixture = Array.from({ length: FIXTURE_SIZE }, (_, i) => {
    const idx = i + 1;
    return {
      membershipNo: `M${String(idx).padStart(4, '0')}`,
      name: `Voter ${String(idx).padStart(3, '0')}`,
      division: 'Dhaka',
      university: idx % 2 === 0 ? 'BUET' : 'DU',
      centre: 'Main',
      passingYear: '2010',
      address: '123 Test Street',
      phone: `017${String(i).padStart(8, '0')}`,
      email: null,
      status: idx % 3 === 0 ? ('defaulter' as const) : ('active' as const),
      duesYears: null,
      duesAmount: null,
      paidUpto: null,
      jobLocation: null,
    };
  });
  return {
    getAllVoters: () => mockFixture,
    searchVoters: (query: string) => {
      const q = (query || '').toLowerCase().trim();
      if (!q) return mockFixture;
      return mockFixture.filter(
        (v: { name: string; membershipNo: string }) =>
          v.name.toLowerCase().includes(q) ||
          v.membershipNo.toLowerCase().includes(q),
      );
    },
    TOTAL_VOTERS: mockFixture.length,
    ACTIVE_VOTERS: mockFixture.filter((v) => v.status === 'active').length,
    DEFAULTER_VOTERS: mockFixture.filter((v) => v.status === 'defaulter').length,
    VOTERS_WITH_PHONE: mockFixture.filter((v) => v.phone).length,
    UNIVERSITIES: ['BUET', 'DU'],
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
  };
});

/* eslint-disable import/first */
// Import the screen AFTER mocks are registered.
import VotersScreen from '../voters';
/* eslint-enable import/first */

function nameOnPage(idx: number) {
  return `Voter ${String(idx).padStart(3, '0')}`;
}

describe('VotersScreen pagination', () => {
  it('shows the first 20 voters and the matching summary on first render', () => {
    render(<VotersScreen />);

    // First page (1-20) is visible.
    expect(screen.getByText(nameOnPage(1))).toBeTruthy();
    expect(screen.getByText(nameOnPage(20))).toBeTruthy();
    // 21+ are not yet visible.
    expect(screen.queryByText(nameOnPage(21))).toBeNull();
    expect(screen.queryByText(nameOnPage(50))).toBeNull();

    // Summary text reflects the current range.
    expect(screen.getByTestId('voters-results-summary').props.children).toContain(
      'Showing 1\u201320 of 50',
    );
  });

  it('advances to the next page when Next is pressed and shows voters 21-40', () => {
    render(<VotersScreen />);

    fireEvent.press(screen.getByTestId('pagination-next'));

    expect(screen.queryByText(nameOnPage(1))).toBeNull();
    expect(screen.queryByText(nameOnPage(20))).toBeNull();
    expect(screen.getByText(nameOnPage(21))).toBeTruthy();
    expect(screen.getByText(nameOnPage(40))).toBeTruthy();
    expect(screen.queryByText(nameOnPage(41))).toBeNull();

    expect(screen.getByTestId('voters-results-summary').props.children).toContain(
      'Showing 21\u201340 of 50',
    );
  });

  it('jumps directly to a tapped page number', () => {
    render(<VotersScreen />);

    // 50 items / 20 per page = 3 pages. Page 3 should show 41-50.
    fireEvent.press(screen.getByTestId('pagination-page-3'));

    expect(screen.queryByText(nameOnPage(1))).toBeNull();
    expect(screen.getByText(nameOnPage(41))).toBeTruthy();
    expect(screen.getByText(nameOnPage(50))).toBeTruthy();

    expect(screen.getByTestId('voters-results-summary').props.children).toContain(
      'Showing 41\u201350 of 50',
    );
  });

  it('resets to page 1 when the search query changes', () => {
    render(<VotersScreen />);

    // Navigate to page 3.
    fireEvent.press(screen.getByTestId('pagination-page-3'));
    expect(screen.getByText(nameOnPage(41))).toBeTruthy();

    // Now search; pagination should snap back to page 1.
    fireEvent.changeText(screen.getByTestId('voters-search-input'), nameOnPage(5));

    // First-page voter is visible again.
    expect(screen.getByText(nameOnPage(5))).toBeTruthy();
    // Voter from the third page is no longer rendered.
    expect(screen.queryByText(nameOnPage(41))).toBeNull();
    // Summary reflects a reset to page 1 with the query in the suffix.
    const summary = screen.getByTestId('voters-results-summary').props.children as string;
    expect(summary).toContain(`Showing 1\u20131 of 1 for "${nameOnPage(5)}"`);
  });

  it('resets to page 1 when the active filter changes', () => {
    render(<VotersScreen />);

    fireEvent.press(screen.getByTestId('pagination-page-3'));
    expect(screen.getByText(nameOnPage(41))).toBeTruthy();

    // Switch to the "Active" filter chip.
    fireEvent.press(screen.getByTestId('voters-filter-chip-Active'));

    // First-page voter visible again.
    expect(screen.getByText(nameOnPage(1))).toBeTruthy();
    // Late-page voter is no longer rendered.
    expect(screen.queryByText(nameOnPage(41))).toBeNull();
    // Summary reflects page 1 of the filtered set.
    expect(screen.getByTestId('voters-results-summary').props.children).toContain(
      'Showing 1\u201320',
    );
  });

  it('resets to page 1 and updates the slice when page size changes', () => {
    render(<VotersScreen />);

    // Navigate away from page 1.
    fireEvent.press(screen.getByTestId('pagination-page-2'));
    expect(screen.getByText(nameOnPage(21))).toBeTruthy();
    expect(screen.queryByText(nameOnPage(1))).toBeNull();

    // Change page size to 50.
    fireEvent.press(screen.getByTestId('pagination-page-size-50'));

    // Page resets to 1; first voter is back and 21 is still visible because
    // the slice now extends to the end of the fixture (only 50 items).
    expect(screen.getByText(nameOnPage(1))).toBeTruthy();
    expect(screen.queryByText(nameOnPage(21))).toBeTruthy();
    expect(screen.getByText(nameOnPage(50))).toBeTruthy();

    // Summary reflects the new page size.
    expect(screen.getByTestId('voters-results-summary').props.children).toContain(
      'Showing 1\u201350 of 50',
    );
  });

  it('disables Next and shows page 1 only when the filtered result set is smaller than one page', () => {
    render(<VotersScreen />);

    // Search for a term that matches a single voter.
    fireEvent.changeText(
      screen.getByTestId('voters-search-input'),
      nameOnPage(7),
    );

    expect(screen.getByText(nameOnPage(7))).toBeTruthy();
    // Only one match, so no other pages exist.
    expect(screen.queryByText(nameOnPage(8))).toBeNull();
    // Next is disabled because there is only one page.
    expect(screen.getByTestId('pagination-next').props.accessibilityState).toMatchObject({
      disabled: true,
    });
  });

  it('opens the voter detail modal when a voter card is pressed', () => {
    render(<VotersScreen />);
    fireEvent.press(screen.getByTestId('voter-card-M0001'));
    expect(screen.getByTestId('voter-detail-modal')).toBeTruthy();
    // Name appears in both list and modal, so use getAllByText
    expect(screen.getAllByText(nameOnPage(1)).length).toBeGreaterThan(0);
  });
});
