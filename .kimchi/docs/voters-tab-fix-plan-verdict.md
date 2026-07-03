# Voters Tab Fix Plan — Verification Verdict

**Verdict:** NEEDS_REVISION

The plan covers both requirements and is generally well-structured, but it has a few concrete gaps that should be addressed before implementation starts.

## Gaps

1. **Status-bar color will leak to other candidate tabs on Android.**
   - **File/Chunk reference:** Chunk 1 — `app/(candidate)/voters.tsx`.
   - **Problem:** The plan proposes adding a React Native `StatusBar` with `backgroundColor={Colors.darkNavy}` on the Voters screen while leaving the shared layout `app/(candidate)/_layout.tsx` using `<StatusBar style="light" />` from `expo-status-bar`. React Native status-bar props are global and persist until changed. When the user navigates away from Voters to Dashboard/Messages/Tasks/Profile, the dark-navy Android status-bar background will remain because the layout's `expo-status-bar` does not reset the background color.
   - **Suggested fix:** Use `useFocusEffect` from `expo-router` (or a `useEffect` with focus/blur listeners) to apply the dark-navy status bar on focus and restore the default/transparent background on blur. Document this in the Learning Note so the user knows why a focus-aware wrapper is needed.

2. **The "page numbers" requirement is only partially met.**
   - **File/Chunk reference:** Chunk 2 — `components/Pagination.tsx` (Pagination UX Design section).
   - **Problem:** The original task explicitly asks for "Previous/Next buttons, page numbers." The plan only specifies a read-only indicator (`Page 3 of 249`) and deliberately avoids clickable page numbers because there are ~249 pages at size 20. This is a reasonable UX trade-off, but the plan should either (a) add a compact clickable page-number strip (e.g., first, last, and current ±2) or (b) explicitly state that the indicator satisfies the requirement and note why a full strip was rejected.
   - **Suggested fix:** Add a small, horizontally scrollable or truncated numeric page strip (e.g., `1 … 5 6 7 … 249`) to the `Pagination` component, or update the Decision Log to record that "page numbers" means the `Page X of Y` indicator.

3. **The verification strategy assumes a test runner that does not exist.**
   - **File/Chunk reference:** Verification Strategy; `package.json`.
   - **Problem:** The plan says to run `npm test -- Pagination`, but the project's `package.json` has no `test` script and no Jest/Vitest configuration. The plan also proposes adding `components/__tests__/Pagination.test.tsx` and `app/(candidate)/__tests__/voters.test.tsx` without mentioning how those tests will be executed.
   - **Suggested fix:** Add a step to Chunk 2 or the Verification Strategy to install/configure Jest (or the project's chosen test runner) and add a `test` script to `package.json`. Specify the test framework, renderer (e.g., `@testing-library/react-native`), and any required dev dependencies.

4. **The performance acceptance criterion is not verifiable.**
   - **File/Chunk reference:** Chunk 3 — Accept When item 5.
   - **Problem:** "Scrolling and page transitions remain at 60 FPS / smooth on a low-end device" cannot be verified in a code review or standard test run.
   - **Suggested fix:** Replace it with measurable criteria, such as: "Switching pages or changing page size re-renders in under 16 ms on the JS thread as measured by React DevTools Profiler" or "No frame drops are observed when paging through the full 4,970-record list on a target device."

5. **Pagination component interface is not fully specified.**
   - **File/Chunk reference:** Chunk 2 — `components/Pagination.tsx`.
   - **Problem:** The plan describes props informally ("current page, total items, page size, and callbacks") but does not give a concrete TypeScript interface or prop names. This can lead to mismatches between Chunk 2 and Chunk 3.
   - **Suggested fix:** Include a concrete interface, e.g.:
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

## Summary

After addressing the status-bar color-leak risk, clarifying the "page numbers" requirement, and adding the missing test-runner setup, the plan should be ready for implementation.
