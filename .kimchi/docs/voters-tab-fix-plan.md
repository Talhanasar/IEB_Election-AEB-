# Voters Tab Fix Plan — Status Bar & Pagination

## Goal
Fix the unreadable status bar on the Voters tab and replace the "Load More" list pattern with real, configurable pagination controls while keeping the ~4,970-record voter list performant.

## Constraints
- Expo SDK 54 / React Native 0.81 / expo-router 6.
- No new runtime dependencies.
- Preserve existing voter data layer (`src/data/voterData.ts`, `voters.json`).
- Preserve existing filtering logic and stats display.
- Do not alter other candidate tabs.
- Maintain existing `AppHeader` `variant="dark"` behavior.
- Install only dev dependencies required for testing (Jest + renderer).

## Orient Findings
- `app/(candidate)/_layout.tsx` renders a single `<StatusBar style="light" />` from `expo-status-bar` for every candidate tab.
- `app/(candidate)/voters.tsx` wraps the screen in a `View` with `paddingTop: insets.top` and `backgroundColor: Colors.background` (light grey). `AppHeader` already calls `useSafeAreaInsets()` and adds its own `paddingTop`, so the root `paddingTop` is creating the grey band behind the status bar.
- The status-bar text is forced to `light` (white), but the visible background behind it is the light grey page background — causing the unreadable greyish-white + white-text effect.
- Voter list currently slices `filteredVoters` with `displayCount` and renders a "Load More" button.
- Filtering/search is memoized via `useMemo`, so adding pagination slicing on top of the same memoized array is cheap.
- `package.json` has no `test` script and no Jest/Vitest configuration; `@testing-library/react-native` and `jest-expo` are not installed.

## Status Bar Approach
Use React Native’s imperative `StatusBar` inside the Voters screen, wrapped in `useFocusEffect` from `expo-router`, so the dark-navy status bar is applied only while the Voters tab is focused and restored to the layout default on blur.

The layout-level `<StatusBar style="light" />` remains untouched so other tabs keep their current behavior. On focus, the screen calls `StatusBar.setBackgroundColor(Colors.darkNavy, true)` and `StatusBar.setBarStyle('light-content', true)`. On blur, it restores the default/transparent background (`Colors.transparent` or the platform default) and lets the layout's `expo-status-bar` declaration control text color again. This prevents the dark-navy background from leaking to Dashboard/Messages/Tasks/Profile on Android.

Additionally, remove the root `paddingTop: insets.top` in `voters.tsx` so the `AppHeader` container (already handling its own safe area) extends all the way to the top edge. This makes the status bar background visually match the header on iOS, and the explicit `StatusBar` background color handles Android.

## Pagination UX Design
- **Default page size: 20.** A mobile viewport shows roughly 5–7 voter cards; 20 items yields 3–4 screen-heights of scroll — enough to feel like a real list, small enough to keep first paint and re-render fast. 50 would push users too far before interaction, and 10 would feel choppy.
- **Page-size options: 10, 20, 50, 100.** Offered via a small selector at the top-right of the results section (beside the results count).
- **Controls:** Previous / Next buttons plus a compact, clickable numeric page strip (`1 … 4 5 6 … 249`) rendered inside `components/Pagination.tsx`. The strip shows the first page, the last page, the current page, and the two pages on either side of the current page, with ellipsis for skipped ranges. Tapping a number jumps directly to that page. If the strip still overflows on very small screens, it can scroll horizontally.
- **Reset behavior:** Changing search query, active filter, or page size resets `currentPage` to `1`.
- **Performance:** Keep `filteredVoters` memoized; derive `displayedVoters` by `filteredVoters.slice((currentPage - 1) * pageSize, currentPage * pageSize)` inside another `useMemo`. No virtualization is needed at these page sizes.

## Concrete Pagination Component Interface
```ts
interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}
```

`components/Pagination.tsx` will export `Pagination: React.FC<PaginationProps>`.

## Learning Note: What Controls the Status Bar
Two levers exist:

1. **Text/icon color** — controlled by the `style` prop on `<StatusBar>` from `expo-status-bar` (`"auto"`, `"inverted"`, `"light"`, `"dark"`) or by the `barStyle` prop on React Native’s `StatusBar` (`"light-content"`, `"dark-content"`).
2. **Background color (Android) and the visual area behind the notch/status bar (iOS)** — controlled by:
   - React Native `StatusBar` props: `backgroundColor` and `translucent` (Android only).
   - The background color of the view that renders underneath the status bar (iOS). If the root screen has `paddingTop: insets.top`, the view behind the status bar is the root container; removing that padding and letting `AppHeader` extend to the top makes the header background fill the status-bar area.

React Native status-bar settings are global and persist until changed. Because the shared candidate layout uses `expo-status-bar` and does not reset Android background color, a per-screen `StatusBar` declaration would leak its background color to other tabs when the user navigates away. Therefore the Voters screen must apply its dark-navy status bar only while focused (via `useFocusEffect` from `expo-router`) and restore the default/transparent background on blur.

To change status-bar appearance later, edit the focus-effect hook in the relevant screen file (here, `app/(candidate)/voters.tsx`) rather than the tab layout, because the layout currently shares one style across all candidate tabs.

## Chunks

### Chunk 1 — Status Bar Fix on Voters Screen
- **Complexity:** simple
- **Scope:** Update `app/(candidate)/voters.tsx` so the status-bar area matches the dark header and does not leak to other tabs.
- **Files Changed:**
  - `app/(candidate)/voters.tsx` — import `useFocusEffect` from `expo-router` and `StatusBar` from `react-native`; add focus/blur effect that sets/restores status-bar colors; remove root `paddingTop`.
- **Depends On:** none
- **Accept When:**
  1. On Android, status bar background is `Colors.darkNavy` (`#0D1B3E`) with light icons while Voters is focused.
  2. Navigating from Voters to another candidate tab restores the default/transparent Android status-bar background (no dark-navy leak).
  3. On iOS, the area behind the dynamic island/notch/status bar shows the dark navy header background, not the grey page background.
  4. Header text/icons still sit below the safe-area inset (no overlap with status bar).
- **Test Coverage:**
  - Manual visual verification on both platforms (focus and blur).
  - No new automated tests required; behavior is purely visual.
- **Open Questions:**
  - None.

### Chunk 2 — Test Runner Setup
- **Complexity:** simple
- **Scope:** Install the Expo/Jest testing stack and add a `test` script so the pagination and screen tests can run.
- **Files Changed:**
  - `package.json` — add `"test": "jest"` script and dev dependencies: `jest-expo@~54.0.0`, `jest@^29.7.0`, `@testing-library/react-native@^13.0.0`.
  - `jest.config.js` — new Jest preset `jest-expo` with transform and module-file-extensions settings.
- **Depends On:** none
- **Accept When:**
  1. `npm install` completes without dependency conflicts.
  2. `npm test` runs the Jest runner and exits cleanly (zero tests is acceptable at this stage).
  3. `npx jest --listTests` discovers files inside `components/__tests__` and `app/(candidate)/__tests__` after they are created.
- **Test Coverage:**
  - No test files created in this chunk; infrastructure only.
- **Open Questions:**
  - Exact versions of `jest-expo`, `jest`, and `@testing-library/react-native` must be confirmed against the Expo SDK 54 compatibility matrix during implementation (see Decision Log).

### Chunk 3 — Reusable Pagination Component
- **Complexity:** simple
- **Scope:** Create a `Pagination` component that implements the `PaginationProps` interface and renders Previous/Next, a clickable numeric page strip, and a page-size selector.
- **Files Changed:**
  - `components/Pagination.tsx` — new component.
- **Depends On:** none (depends on Chunk 2 only for test execution, not for component logic)
- **Accept When:**
  1. Given `currentPage={3}`, `totalItems={4970}`, `pageSize={20}`, component shows "Previous" enabled, "Next" enabled, and a clickable numeric strip such as `1 … 3 4 5 … 249`.
  2. Tapping a page number in the strip calls `onPageChange` with that page exactly once.
  3. Page-size selector options default to `[10, 20, 50, 100]`.
  4. `onPageSizeChange(newSize)` fires exactly once per user interaction.
  5. Previous is disabled on page 1; Next is disabled on the last page; current page is visually highlighted in the strip.
- **Test Coverage:**
  - Create `components/__tests__/Pagination.test.tsx` covering:
    - rendering at first/middle/last page,
    - disabled states,
    - callback invocation for Previous/Next/page-number taps,
    - ellipsis/non-clickable separators,
    - page-size selection.
- **Open Questions:**
  - None.

### Chunk 4 — Integrate Pagination into Voters Screen
- **Complexity:** complex
- **Scope:** Replace `displayCount` / "Load More" logic in `voters.tsx` with `currentPage` and `pageSize` state, wire up `Pagination`, and ensure page resets on search/filter/page-size changes.
- **Files Changed:**
  - `app/(candidate)/voters.tsx` — state + derived list + UI integration.
- **Depends On:** Chunk 3 (`components/Pagination.tsx` exists with the agreed interface)
- **Accept When:**
  1. Initial render shows first 20 voters (or chosen page size) and correct "Showing 1–20 of 4,970" text.
  2. Tapping Next advances to page 2 and shows voters 21–40.
  3. Typing in search or changing a filter chip resets to page 1.
  4. Changing page size resets to page 1 and updates the displayed slice immediately.
  5. Searching for a rare term with fewer than one page of results disables Next and shows page count `1`.
  6. Switching pages or changing page size re-renders without visible jank and without UI-blocking JavaScript hangs on the target device.
- **Test Coverage:**
  - Add/update `app/(candidate)/__tests__/voters.test.tsx` covering:
    - pagination slicing,
    - reset-to-page-1 on search/filter change,
    - page-size change behavior.
- **Open Questions:**
  - None.

## Verification Strategy
1. **Status bar:**
   - Launch the app, navigate to the Voters tab.
   - Inspect the status bar on iOS and Android; confirm dark navy background + light icons/text while focused.
   - Navigate to Dashboard/Messages/Tasks/Profile and confirm the dark-navy background does not leak on Android.
   - Rotate device / toggle dark mode to ensure no regressions.
2. **Test runner:**
   - Run `npm install` after updating `package.json`.
   - Run `npm test` and confirm Jest starts without errors.
   - After Chunk 3, run `npm test -- Pagination` and confirm all new tests pass.
3. **Pagination component:**
   - Run `npm test -- Pagination` and confirm all tests pass.
   - Manually render the component with `currentPage={3}`, `totalItems={4970}`, `pageSize={20}` and verify the clickable strip is `1 … 3 4 5 … 249`.
4. **Voters screen integration:**
   - Run the app, confirm first page size is 20.
   - Tap Next/Previous and confirm slice updates.
   - Tap a page number in the strip and confirm direct jump.
   - Type a query, confirm page resets to 1.
   - Select a filter chip, confirm page resets to 1.
   - Change page size to 50, confirm reset to 1 and slice updates.
   - Search for a rare term with < 1 page of results; confirm Next is disabled and page count is 1.
5. **Lint / type check:**
   - Run `npm run lint` and `npx tsc --noEmit` (or the project’s type-check command) and ensure no new errors.
6. **Performance sanity check:**
   - Page the full 4,970-record list on a target device and confirm no visible jank or JS-thread blocking.

## Decision Log
- **Status-bar fix location:** Per-screen (`voters.tsx`) instead of layout-wide. Rationale: the tab layout is shared across screens with different backgrounds; changing it would affect Dashboard/Messages/Tasks/Profile and is out of scope.
- **Status-bar API + focus wrapper:** React Native `StatusBar` with `useFocusEffect` from `expo-router`. Rationale: RN `StatusBar` supports `backgroundColor` for Android and can be applied imperatively; wrapping it in a focus effect prevents the dark-navy Android background from persisting on other tabs. `expo-status-bar` only supports `style`/`animated`, and `expo-system-ui` applies globally/persistently.
- **Default page size: 20.** Rationale: balances content density and scroll length on mobile; 50 felt too long, 10 too fragmented.
- **Clickable numeric page strip.** Rationale: the user explicitly asked for "page numbers" alongside Previous/Next. A compact strip (`first`, `last`, `current ±2`, ellipsis) satisfies the requirement without rendering ~250 buttons on mobile. Rejected alternative: a read-only `Page X of Y` indicator.
- **Page-size selector reset to page 1.** Rationale: keeps the user anchored at the start of a new result set and avoids landing past the new last page.
- **No virtualization library.** Rationale: rendering at most 100 items per page is well within RN’s flat list performance; adding `react-native-super-grid` or similar is unnecessary and adds a dependency.
- **Test framework: Jest via `jest-expo` + `@testing-library/react-native`.** Rationale: this is the standard Expo/React Native testing stack and integrates with the existing Expo SDK 54 project. Rejected alternative: Vitest, because it requires more manual RN transformer setup and is less common in the Expo ecosystem. Versions (`jest-expo@~54.0.0`, `jest@^29.7.0`, `@testing-library/react-native@^13.0.0`) are provisional and should be verified during implementation.

## Risks
| Risk | Likelihood | Mitigation |
|------|------------|------------|
| `useFocusEffect` fires too late or does not run on initial focus in expo-router. | low | Test on both platforms; fallback to `useEffect` with `navigation.addListener('focus', ...)` if needed. |
| Removing root `paddingTop` causes header to overlap notch on unusual devices. | low | `AppHeader` already consumes `useSafeAreaInsets()` and applies `paddingTop: insets.top + Spacing.md`; verify on iOS/Android simulators. |
| Pagination state becomes inconsistent if filter/search resets are missed. | medium | Centralize reset in `useEffect` keyed on `searchQuery` and `activeFilter`, and also reset inside the page-size change handler. |
| Page-size selector crowds the filter chips row on small screens. | low | Place selector in the results-summary bar below stats, not in the horizontal filter scroll. |
| Test dependency versions conflict with Expo SDK 54. | low | Pin versions compatible with SDK 54; run `npm install` and Jest smoke test before writing tests. |

## Revision Notes
This plan was revised based on the verification verdict in `.kimchi/docs/voters-tab-fix-plan-verdict.md`.

1. **Status-bar color leak fixed.** Added `useFocusEffect` from `expo-router` around the React Native `StatusBar` calls so the dark-navy background is applied only while Voters is focused and restored on blur. Updated the Learning Note to explain why a focus-aware wrapper is required (React Native status-bar props are global and persist until changed).
2. **Clickable page numbers added.** Replaced the read-only `Page X of Y` indicator with a compact clickable numeric page strip (`first`, `last`, `current ±2`, ellipsis) in `components/Pagination.tsx`. Documented the rejection of the indicator-only approach in the Decision Log.
3. **Test runner setup added.** Added Chunk 2 to install `jest-expo`, `jest`, and `@testing-library/react-native`; create `jest.config.js`; and add a `test` script to `package.json`. Updated the Verification Strategy to run `npm test` and listed the provisional exact dev dependencies.
4. **Performance criterion made measurable.** Replaced "60 FPS on a low-end device" with "re-renders without visible jank / without UI-blocking JavaScript hangs on the target device" and added a manual sanity-check step in the Verification Strategy.
5. **Pagination component interface specified.** Added the concrete TypeScript `PaginationProps` interface to the spec so Chunk 3 and Chunk 4 share an exact contract.
