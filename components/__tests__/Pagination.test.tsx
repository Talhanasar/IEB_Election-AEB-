// @expo/vector-icons pulls in expo-font -> expo-asset which isn't installed in
// the test environment. Replace the icon set with a lightweight Text stub.
// The factory must be self-contained because jest.mock is hoisted above
// imports, so use require() inside it (eslint-disable for this rule).
/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock('@expo/vector-icons', () => {
  const mockReact = require('react');
  const mockRN = require('react-native');
  const stub: Record<string, unknown> = {};
  const sets = [
    'MaterialCommunityIcons',
    'MaterialIcons',
    'Ionicons',
    'FontAwesome',
    'Feather',
    'AntDesign',
  ];
  sets.forEach((name) => {
    const Component = () => mockReact.createElement(mockRN.Text, null, name);
    Component.displayName = name;
    stub[name] = Component;
  });
  return stub;
});
/* eslint-enable @typescript-eslint/no-require-imports */

/* eslint-disable import/first */
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Pagination } from '../Pagination';
/* eslint-enable import/first */

// Total items chosen so totalPages = 10 with pageSize = 10
const TOTAL_ITEMS = 100;
const PAGE_SIZE = 10;
const TOTAL_PAGES = 10;

function renderPagination(
  overrides: Partial<React.ComponentProps<typeof Pagination>> = {},
) {
  const onPageChange = jest.fn();
  const onPageSizeChange = jest.fn();
  const props: React.ComponentProps<typeof Pagination> = {
    currentPage: 1,
    totalItems: TOTAL_ITEMS,
    pageSize: PAGE_SIZE,
    onPageChange,
    onPageSizeChange,
    ...overrides,
  };

  const utils = render(<Pagination {...props} />);
  return {
    ...utils,
    onPageChange,
    onPageSizeChange,
  };
}

describe('Pagination', () => {
  describe('rendering', () => {
    it('renders the container and controls on the first page', () => {
      renderPagination({ currentPage: 1 });

      expect(screen.getByTestId('pagination')).toBeTruthy();
      expect(screen.getByTestId('pagination-page-size')).toBeTruthy();
      expect(screen.getByTestId('pagination-controls')).toBeTruthy();
      expect(screen.getByTestId('pagination-prev')).toBeTruthy();
      expect(screen.getByTestId('pagination-next')).toBeTruthy();
      expect(screen.getByTestId('pagination-strip')).toBeTruthy();
    });

    it('renders page 1 as current on the first page', () => {
      renderPagination({ currentPage: 1 });

      const pageOne = screen.getByTestId('pagination-page-1');
      expect(pageOne).toBeTruthy();
      expect(pageOne.props.accessibilityState).toMatchObject({ selected: true });
    });

    it('renders the requested page as current in the middle of the strip', () => {
      renderPagination({ currentPage: 5 });

      const pageFive = screen.getByTestId('pagination-page-5');
      expect(pageFive).toBeTruthy();
      expect(pageFive.props.accessibilityState).toMatchObject({ selected: true });

      // Adjacent pages should still be reachable
      expect(screen.getByTestId('pagination-page-4')).toBeTruthy();
      expect(screen.getByTestId('pagination-page-6')).toBeTruthy();
    });

    it('renders the last page as current on the last page', () => {
      renderPagination({ currentPage: TOTAL_PAGES });

      const lastPage = screen.getByTestId(`pagination-page-${TOTAL_PAGES}`);
      expect(lastPage).toBeTruthy();
      expect(lastPage.props.accessibilityState).toMatchObject({ selected: true });
    });

    it('inserts ellipsis separators between non-adjacent visible page numbers', () => {
      renderPagination({ currentPage: 1 });

      // With currentPage=1 and totalPages=10, the strip should contain
      // 1, 2, 3, ellipsis, 10 — so exactly one ellipsis is rendered.
      // The component marks ellipsis as accessibility-hidden, so pass
      // { hidden: true } to surface it through the testID query.
      const ellipses = screen.getAllByTestId('pagination-ellipsis', { hidden: true });
      expect(ellipses.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('disabled states', () => {
    it('disables Previous on the first page and enables Next', () => {
      renderPagination({ currentPage: 1 });

      expect(screen.getByTestId('pagination-prev').props.accessibilityState).toMatchObject({
        disabled: true,
      });
      expect(screen.getByTestId('pagination-next').props.accessibilityState).toMatchObject({
        disabled: false,
      });
    });

    it('disables Next on the last page and enables Previous', () => {
      renderPagination({ currentPage: TOTAL_PAGES });

      expect(screen.getByTestId('pagination-next').props.accessibilityState).toMatchObject({
        disabled: true,
      });
      expect(screen.getByTestId('pagination-prev').props.accessibilityState).toMatchObject({
        disabled: false,
      });
    });

    it('enables both Previous and Next on a middle page', () => {
      renderPagination({ currentPage: 5 });

      expect(screen.getByTestId('pagination-prev').props.accessibilityState).toMatchObject({
        disabled: false,
      });
      expect(screen.getByTestId('pagination-next').props.accessibilityState).toMatchObject({
        disabled: false,
      });
    });
  });

  describe('callbacks', () => {
    it('invokes onPageChange with previous page when Previous is pressed', () => {
      const { onPageChange } = renderPagination({ currentPage: 5 });

      fireEvent.press(screen.getByTestId('pagination-prev'));

      expect(onPageChange).toHaveBeenCalledTimes(1);
      expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it('invokes onPageChange with next page when Next is pressed', () => {
      const { onPageChange } = renderPagination({ currentPage: 5 });

      fireEvent.press(screen.getByTestId('pagination-next'));

      expect(onPageChange).toHaveBeenCalledTimes(1);
      expect(onPageChange).toHaveBeenCalledWith(6);
    });

    it('invokes onPageChange with the tapped page number', () => {
      const { onPageChange } = renderPagination({ currentPage: 1 });

      fireEvent.press(screen.getByTestId('pagination-page-3'));

      expect(onPageChange).toHaveBeenCalledTimes(1);
      expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it('does not invoke onPageChange when Previous is pressed on the first page', () => {
      const { onPageChange } = renderPagination({ currentPage: 1 });

      fireEvent.press(screen.getByTestId('pagination-prev'));

      expect(onPageChange).not.toHaveBeenCalled();
    });

    it('does not invoke onPageChange when Next is pressed on the last page', () => {
      const { onPageChange } = renderPagination({ currentPage: TOTAL_PAGES });

      fireEvent.press(screen.getByTestId('pagination-next'));

      expect(onPageChange).not.toHaveBeenCalled();
    });
  });

  describe('ellipsis', () => {
    it('renders ellipsis as a non-interactive element', () => {
      const { onPageChange } = renderPagination({ currentPage: 1 });

      const ellipses = screen.getAllByTestId('pagination-ellipsis', { hidden: true });
      expect(ellipses.length).toBeGreaterThan(0);

      // Ellipsis is a plain View, not a Pressable, so there is nothing to fire
      // and no handler to invoke. Assert the type explicitly.
      ellipses.forEach((node) => {
        expect(node.type).not.toBe('Pressable');
      });

      // Pressing should be a no-op for onPageChange.
      ellipses.forEach((node) => fireEvent.press(node));
      expect(onPageChange).not.toHaveBeenCalled();
    });
  });

  describe('page-size selection', () => {
    it('renders the default page-size options and marks the active one', () => {
      renderPagination({ pageSize: 20 });

      [10, 20, 50, 100].forEach((size) => {
        const chip = screen.getByTestId(`pagination-page-size-${size}`);
        expect(chip).toBeTruthy();
        expect(chip.props.accessibilityState).toMatchObject({
          selected: size === 20,
        });
      });
    });

    it('invokes onPageSizeChange with the selected size', () => {
      const { onPageSizeChange } = renderPagination({ pageSize: 10 });

      fireEvent.press(screen.getByTestId('pagination-page-size-50'));

      expect(onPageSizeChange).toHaveBeenCalledTimes(1);
      expect(onPageSizeChange).toHaveBeenCalledWith(50);
    });

    it('honours custom pageSizeOptions', () => {
      const { onPageSizeChange } = renderPagination({
        pageSize: 25,
        pageSizeOptions: [25, 75],
      });

      expect(screen.getByTestId('pagination-page-size-25')).toBeTruthy();
      expect(screen.getByTestId('pagination-page-size-75')).toBeTruthy();
      expect(screen.queryByTestId('pagination-page-size-10')).toBeNull();

      fireEvent.press(screen.getByTestId('pagination-page-size-75'));
      expect(onPageSizeChange).toHaveBeenCalledWith(75);
    });
  });
});
