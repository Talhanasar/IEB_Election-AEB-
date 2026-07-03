# Expo Android Release Build R8 Fix

## Problem

The EAS/Android release build failed at `:app:minifyReleaseWithR8` with missing-class errors:

```
Missing class expo.modules.core.errors.CurrentActivityNotFoundException
  (referenced from: expo.modules.webbrowser.WebBrowserModule.givenOrPreferredPackageName)
Missing class expo.modules.kotlin.RuntimeContext
  (referenced from: expo.modules.image.Image.<init>)
Missing class expo.modules.kotlin.types.AnyTypeProvider
  (referenced from: expo.modules.font.FontLoaderModule.definition and 5 other contexts)
Missing class expo.modules.kotlin.types.LazyKType
  (referenced from: expo.modules.font.FontLoaderModule.definition and 5 other contexts)
```

## Root Cause

The project's Expo SDK packages were using mismatched version lines. Several
packages were pinned to the old pre-SDK-aligned version numbers that expected a
newer `expo-modules-core` than the SDK 56 core that was installed:

| Package              | Before        | After (SDK 56) |
|----------------------|---------------|----------------|
| `expo-font`          | `~14.0.11`    | `~56.0.7`      |
| `expo-image`         | `~3.0.11`     | `~56.0.11`     |
| `expo-web-browser`   | `~15.0.11`    | `~56.0.5`      |
| `expo-haptics`       | `~15.0.8`     | `~56.0.3`      |
| `expo-status-bar`    | `~3.0.9`      | `~56.0.4`      |
| `expo-symbols`       | `~1.0.8`      | `~56.0.6`      |
| `expo-system-ui`     | `~6.0.9`      | `~56.0.5`      |

The build also aligned React Native and related libraries to the versions
expected by Expo SDK 56:

| Package                              | Before        | After       |
|--------------------------------------|---------------|-------------|
| `react`                              | `^19.2.3`     | `19.2.3`    |
| `react-dom`                          | `^19.2.3`     | `19.2.3`    |
| `react-native`                       | `^0.86.0`     | `0.85.3`    |
| `react-native-gesture-handler`       | `~2.28.0`     | `~2.31.1`   |
| `react-native-reanimated`            | `~4.5.0`      | `4.3.1`     |
| `react-native-safe-area-context`     | `~5.6.0`      | `~5.7.0`    |
| `react-native-screens`               | `~4.16.0`     | `4.25.2`    |
| `react-native-svg`                   | `^15.12.1`    | `15.15.4`   |
| `react-native-worklets`              | `~0.10.0`     | `0.8.3`     |
| `eslint-config-expo` (dev)           | `~10.0.0`     | `~56.0.4`   |
| `jest` (dev)                         | `~29.2.1`     | `~29.7.0`   |
| `typescript` (dev)                   | `~5.9.2`      | `~6.0.3`    |

## Fix Applied

Ran Expo's version alignment command:

```bash
npx expo install --fix
```

This updated `package.json` and regenerated `package-lock.json` so all Expo SDK
packages resolve against `expo-modules-core@~56.0.17`.

Verification:

```bash
npx expo install --check
# Dependencies are up to date
```

## Next Step

Trigger a new EAS/Android release build. The R8 missing-class error should be
resolved because the native classes referenced by `expo-font`, `expo-image`, and
`expo-web-browser` now match the installed `expo-modules-core` version.
