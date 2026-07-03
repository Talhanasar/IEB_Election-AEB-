---
name: react-native-skills
description: Use when organizing app structure, routing, navigation, or file layout decisions in an Expo Router project. Also applies when adding new screens or refactoring navigation.
---

# Expo Router Patterns & App Structure

## Overview
File-system routing conventions for Expo Router. This project uses `(candidate)` and `(voter)` groups as parallel navigation trees.

## App Directory Rules

### The Golden Rule
The `app/` directory controls **all** navigation. Every file inside it becomes a route. Nothing else goes in `app/`.

```
app/              ← Only routes and layouts
  _layout.tsx     ← Root layout (rendered first)
  index.tsx       ← Splash screen (matches "/")
  login.tsx       ← Login screen (matches "/login")
  +not-found.tsx  ← 404 fallback
  (candidate)/    ← Candidate routes (group, no URL prefix)
    _layout.tsx   ← Tab navigator for candidate
    dashboard.tsx
    profile.tsx
    ...
  (voter)/        ← Voter routes (group, no URL prefix)
    _layout.tsx   ← Tab navigator for voter
    home.tsx
    candidates.tsx
    ...
components/       ← Reusable UI components
constants/        ← Theme, config
hooks/            ← Custom hooks
```

### Never do this
```bash
# ❌ NO components, utils, or types in app/
app/components/     # WRONG
app/utils/          # WRONG
app/types.ts        # WRONG
```

## Route Groups

```tsx
// app/(candidate)/_layout.tsx
export default function CandidateLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="dashboard" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      {/* hidden from tabs but accessible via router.push */}
      <Tabs.Screen name="activities" options={{ href: null }} />
    </Tabs>
  );
}
```

Groups with `(group)` don't appear in URLs:
- File: `app/(candidate)/dashboard.tsx`
- URL: `/dashboard` (not `/(candidate)/dashboard`)

## Navigation

```tsx
import { useRouter } from 'expo-router';

const router = useRouter();

// Push (add to stack)
router.push('/(candidate)/voters');

// Replace (no back button)
router.replace('/(voter)/home');

// Back
router.back();
```

## Layout Files

Every directory can have a `_layout.tsx` that wraps its children:

```tsx
// app/(voter)/_layout.tsx
export default function VoterLayout() {
  return <Tabs>...</Tabs>;
}

// app/_layout.tsx — root layout, rendered before everything
export default function RootLayout() {
  return <Stack>...</Stack>;
}
```

## Shared Screens Between Groups

When a screen appears in multiple contexts (e.g., candidate detail viewable from voter list):

```
app/
  (voter)/
    candidates.tsx
  (candidate)/
    _layout.tsx
  (voter,candidate)/
    candidate-detail.tsx   ← shared across both groups
```

Use array syntax `(voter,candidate)` to share routes.

## Quick Reference

| Pattern | File | URL | Notes |
|---------|------|-----|-------|
| Static route | `home.tsx` | `/home` | Simple screen |
| Group | `(tabs)/home.tsx` | `/home` | Hidden prefix |
| Layout | `_layout.tsx` | — | Wraps directory |
| Dynamic | `[id].tsx` | `/user/123` | `useLocalSearchParams()` |
| Catch-all | `[...slug].tsx` | `/a/b/c` | Deep paths |
| Not found | `+not-found.tsx` | — | 404 fallback |
| Hidden tab | `name="x" options={{ href: null }}` | — | Accessible, not in tab bar |

## Common Mistakes
| Mistake | Fix |
|---------|-----|
| Co-locating components in `app/` | Move to `components/` directory |
| Renaming routes with `name` prop | Use file name ONLY — `name="dashboard"` for `dashboard.tsx` |
| Group URL leaking | Groups use `()` not visible in URL |
| Missing `href: null` for hidden tabs | Add to hide from tab bar but keep routable |
| No `+not-found` | Always add for graceful 404s |
