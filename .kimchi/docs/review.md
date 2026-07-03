# Review: Voters Tab Status Bar & Pagination

## Verdict

NEEDS_FIXES

## Summary

The implementation matches the plan closely: the status-bar fix is scoped to the Voters screen via `useFocusEffect`, the reusable `Pagination` component implements the agreed interface, and the Voters screen integrates pagination with reset-on-search/filter/page-size behavior. All 24 Jest tests pass, `npx tsc --noEmit` passes, and lint reports no errors in the touched files (the one existing lint error is in `app/+not-found.tsx`, which was not modified).

However, there are two correctness issues that should be addressed before approval:

1. The blur cleanup restores the status-bar text style to `"default"`, which on iOS renders dark text and conflicts with the shared layout's `style="light"` expectation.
2. The Voters screen slices the filtered list using an un-clamped `currentPage`, so a search/filter change that shrinks the result set can briefly render an empty/wrong slice and a nonsensical results summary.

A third, lower-priority item is the noisy `console.warn` output from `StatusBar.setBackgroundColor` during test runs, which should be silenced in the test setup.

## Issues

1. **Status-bar text style on blur conflicts with the shared layout**
   - **File:** `/mnt/d/QP_Consultancy/projects/New folder/IEB_Election/app/(candidate)/voters.tsx`
   - **Lines:** 110–111
   - **Problem:** The focus-effect cleanup calls `StatusBar.setBarStyle('default', true)`. On iOS, `"default"` means *dark* status-bar text. The shared candidate layout renders `<StatusBar style="light" />`, which expects light text. Resetting to `"default"` therefore does not "let the layout's `expo-status-bar` declaration control text color again"; it actively overrides it to a value that can be unreadable against the dark-navy header on other tabs if the layout does not immediately re-render.
   - **Suggested fix:** Restore the layout's intended style explicitly. Replace line 111 with `StatusBar.setBarStyle('light-content', true);` or remove the `setBarStyle` call from the cleanup entirely so the layout's `<StatusBar style="light" />` remains authoritative.

2. **`currentPage` is not clamped before slicing, producing transient bad state**
   - **File:** `/mnt/d/QP_Consultancy/projects/New folder/IEB_Election/app/(candidate)/voters.tsx`
   - **Lines:** 130–147
   - **Problem:** `startIdx`, `endIdx`, and `displayedVoters` are derived from the raw `currentPage` state. When a search or filter change reduces `filteredVoters.length` below the current page, the first render after the change computes an out-of-bounds slice (e.g., `slice(3980, 2000)`), yielding an empty list and a summary string such as `Showing 3981–2000 of 2,000`. The `useEffect` reset to page 1 only fixes this on the *next* render, so users can see a flash of empty/wrong results.
   - **Suggested fix:** Derive a clamped page number before slicing. For example:
     ```ts
     const totalPages = useMemo(
       () => Math.max(1, Math.ceil(filteredVoters.length / pageSize)),
       [filteredVoters.length, pageSize],
     );
     const clampedPage = Math.min(Math.max(1, currentPage), totalPages);
     const startIdx = (clampedPage - 1) * pageSize;
     const endIdx = Math.min(startIdx + pageSize, filteredVoters.length);
     const displayedVoters = useMemo(
       () => filteredVoters.slice(startIdx, endIdx),
       [filteredVoters, startIdx, endIdx],
     );
     ```
     This guarantees the rendered slice is always valid even while the reset effect is pending.

3. **Noisy `StatusBar` warnings in test output**
   - **File:** `/mnt/d/QP_Consultancy/projects/New folder/IEB_Election/app/(candidate)/__tests__/voters.test.tsx`
   - **Lines:** N/A (test setup)
   - **Problem:** Because the test environment is not Android, every render of `VotersScreen` logs `console.warn("\`setBackgroundColor\` is only available on Android")`. With 24 tests and multiple renders per test, the warning is repeated many times, making the test output hard to read and hiding genuine failures.
   - **Suggested fix:** Spy on the two imperative `StatusBar` methods at the top of the test file:
     ```ts
     import { StatusBar } from 'react-native';
     jest.spyOn(StatusBar, 'setBackgroundColor').mockImplementation(() => {});
     jest.spyOn(StatusBar, 'setBarStyle').mockImplementation(() => {});
     ```
     This silences the warnings without affecting the components under test.

## Verification Results

- `npm test`: 24 tests passed across 2 suites.
- `npx tsc --noEmit`: passed with no errors.
- `npm run lint`: one pre-existing error in `app/+not-found.tsx` (not touched); no errors in the modified files.
