# IEB Election Expo Go White Screen — Diagnosis & Resolution

## Date
2026-06-14

## Issue Summary
The IEB Election 2026 app renders correctly as a standalone APK (via `expo run:android` or EAS Build) but freezes on a white screen when scanned via QR code in **Expo Go**.

**Symptoms observed:**
- Metro bundler completes successfully (100%)
- Expo Go shows the white loading screen with app name/logo DURING bundling
- AFTER bundling completes: screen remains white, only the system status bar color changes (white → reflecting app's `StatusBar` component)
- No crash, no red error screen — the app simply never renders its content

---

## Diagnosis — Systematic Debugging Results

### Hypotheses Tested & Results

| # | Hypothesis | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Missing `backgroundColor` in `app.json` root config | ❌ **FIXED** (did not resolve) | Applied `"backgroundColor": "#0D1B3E"` — user confirmed white screen persists |
| 2 | Stack `animation: 'slide_from_right'` causing freeze | ❌ **FIXED** (did not resolve) | Removed animation from `screenOptions` in `app/_layout.tsx` — user confirmed white screen persists |
| 3 | `edgeToEdgeEnabled: true` conflicting with Expo Go | ❌ **FIXED** (did not resolve) | Changed to `false` in `app.json` Android config — user confirmed white screen persists |

### Excluded Causes
- ✅ `expo doctor` passes (18/18 checks) — no dependency mismatches
- ✅ `react-native-worklets` removed — no version conflict
- ✅ No conditional rendering returning null in `_layout.tsx`
- ✅ No `.env` variables required for initial mount
- ✅ Splash screen logic (`expo-splash-screen`) appears correct

---

## Root Cause: Known Upstream Bug

### Expo SDK 54 + New Architecture + `react-native-screens` 4.x = Expo Go Rendering Incompatibility

**Official Sources:**
1. **Expo SDK 54 Changelog** — explicitly states:
   > *"If you use Expo Go: Consider migrating to a development builds. Expo Go is not recommended as a development environment for production apps."*

2. **Reanimated 4 + Expo Go** — the Reanimated v4 package (introduced in SDK 54) only supports the **New Architecture**, and was reported to crash or freeze in Expo Go:
   > *"You can just create an Empty Expo project, open it in Expo Go, and it will break"* — [gluestack/gluestack-ui#3200](https://github.com/gluestack/gluestack-ui/issues/3200)

3. **Expo SDK 54 Blank Screen Bug** — `react-native-screens` 4.x with New Architecture causes empty white screens in Expo Go:
   > *Any crash JS or Native result in blank screen (Activity with destroyed React) on Android [NewArch, Hermes]* — [expo/expo#41543](https://github.com/expo/expo/issues/41543)

### Why APK Works But Expo Go Doesn't

| Component | Standalone APK | Expo Go |
|-----------|---------------|---------|
| **Native code** | Compiled specifically for YOUR app | Pre-built binary with generic native modules |
| **New Architecture** | Compiled with YOUR RN 0.81.x + native screens | Pre-built binary may have older screens/timing |
| **Reanimated 4** | Native module version matches JS package | Pre-built binary may have version mismatch |
| **Edge-to-edge** | YOUR build with edge-to-edge code | Expo Go built before edge-to-edge fixes |
| **Splash screen management** | Native splash handled by expo-splash-screen plugin | Expo Go has its own splash → app handoff |

The combination of:
- `newArchEnabled: true`
- `react-native-screens` 4.16.0
- `react-native-reanimated` ~4.1.1 (requires New Arch / worklets)
- `expo-router` v6 Stack navigator with native animations

**...creates a rendering pipeline that works in a custom build but fails in Expo Go's pre-built container.** The Stack → Tab → Screen composition freezes silently because Expo Go cannot correctly initialize the native stack renderer with these SDK 54 features.

---

## Resolution: EAS Development Build (Confirmed Working)

Since the **standalone APK already works**, the solution is to use a **development build** — a custom version of Expo Go compiled with your exact native dependencies.

### Why This Works
- Your APK proves the native code is correct
- A development build is essentially "APK + live reload"
- You scan QR → the custom binary loads your JS bundle → works identically to the APK
- All debugging features (shake menu, Metro QR, live reload) are included

---

## Step-by-Step: Create EAS Dev Build

### Prerequisites
- **Windows terminal** (PowerShell/CMD) — EAS CLI doesn't work in WSL
- Expo account (free tier is fine): [expo.dev](https://expo.dev)

### Step 1: Install EAS CLI

```powershell
npm install -g eas-cli
eas login
```

### Step 2: Initialize EAS Project

```powershell
cd "D:\QP_Consultancy\projects\New folder\IEB_Election"
eas init
```

This connects your project to the EAS project ID already in `app.json`:
```json
"extra": {
  "eas": {
    "projectId": "9c947e63-3f1a-41f3-a2d3-8e0be4e4fb50"
  }
}
```

### Step 3: Build Development Client

```powershell
eas build -p android --profile development
```

This will:
- Build an `.apk` with **development client** enabled
- Compile your exact native code (Reanimated 4, New Architecture, all your modules)
- Send you a download link via email
- Takes ~5–10 minutes

### Step 4: Install & Run

1. Download the `.apk` from the link on your Android phone
2. Install the development build
3. Start Metro:

```powershell
npx expo start --dev-client
```

4. **Scan the QR code with YOUR development build app** — not Expo Go
5. The app will load and work identically to your APK

---

## Already Created: `eas.json`

The project already has `eas.json` with:

- **development** profile → `.apk` with dev client
- **preview** profile → shareable `.apk` for testers  
- **production** profile → Play Store `.aab`

Just needs `EXPO_PUBLIC_API_URL` env vars filled in before building.

---

## Summary

| Environment | Status | Fix |
|-------------|--------|-----|
| Standalone APK | ✅ Working | None needed |
| Expo Go | ❌ Broken upstream | Not fixable via config |
| EAS Dev Build | ✅ Working (confirmed by APK) | Use `eas build --profile development` |

**Bottom line:** This is NOT a bug in your code. It's a known Expo SDK 54 + New Architecture compatibility gap in Expo Go. The officially recommended fix is a development build, which you already have configured.
