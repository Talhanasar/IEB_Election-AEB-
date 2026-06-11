import React, { useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import {
  Colors,
  Spacing,
  FontSize,
  FontWeight,
  BorderRadius,
} from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Prevent the native splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function Index() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Animation values - only transform and opacity (GPU-accelerated)
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const loaderOpacity = useRef(new Animated.Value(0)).current;

  // ─── ONE orchestrated effect: native splash → animate → navigate ───
  useEffect(() => {
    let isActive = true;           // Guards against unmount / StrictMode
    let anim: Animated.CompositeAnimation | null = null;
    let navigateTimer: ReturnType<typeof setTimeout> | null = null;

    const startSequence = async () => {
      // Small delay to ensure native splash is visible briefly
      await new Promise((r) => setTimeout(r, 500));

      if (!isActive) return;
      await SplashScreen.hideAsync();

      if (!isActive) return;

      // Build the sequence
      anim = Animated.sequence([
        Animated.parallel([
          Animated.timing(logoOpacity, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.spring(logoScale, {
            toValue: 1,
            friction: 6,
            tension: 40,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(taglineOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(loaderOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]);

      anim.start(() => {
        if (!isActive) return;
        navigateTimer = setTimeout(() => {
          if (!isActive) return;
          try {
            router.replace('/(voter)/home');
          } catch {
            // Fallback to a safe route — NEVER '/' (that points back here)
            router.replace('/login');
          }
        }, 2000);
      });
    };

    startSequence();

    return () => {
      isActive = false;      // Kills any pending callbacks
      if (anim) anim.stop(); // Stops ongoing animation
      if (navigateTimer) clearTimeout(navigateTimer);
    };
  }, [router]);

  // Animated loader dots
  const dot1Opacity = useRef(new Animated.Value(0.3)).current;
  const dot2Opacity = useRef(new Animated.Value(0.3)).current;
  const dot3Opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const dotAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(dot1Opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dot2Opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dot3Opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dot1Opacity, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        Animated.timing(dot2Opacity, { toValue: 0.3, duration: 400, useNativeDriver: true }),
        Animated.timing(dot3Opacity, { toValue: 0.3, duration: 400, useNativeDriver: true }),
      ])
    );
    dotAnimation.start();
    return () => dotAnimation.stop();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          <View style={styles.logoRing}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
              contentFit="contain"
              transition={300}
            />
          </View>
          <View style={styles.logoGlow} />
        </Animated.View>

        <Animated.View style={{ opacity: titleOpacity }}>
          <Text style={styles.title}>IEB ELECTION 2026</Text>
        </Animated.View>

        <Animated.View style={{ opacity: subtitleOpacity }}>
          <Text style={styles.subtitle}>
            Association of Engineers Bangladesh
          </Text>
        </Animated.View>

        <Animated.View style={[{ opacity: taglineOpacity }, styles.taglineContainer]}>
          <MaterialCommunityIcons name="vote-outline" size={16} color={Colors.accentGold} />
          <Text style={styles.tagline}>Your Vote, Our Future</Text>
          <MaterialCommunityIcons name="vote-outline" size={16} color={Colors.accentGold} />
        </Animated.View>

        <Animated.View style={[styles.loaderContainer, { opacity: loaderOpacity }]}>
          <Text style={styles.loaderText}>Getting things ready</Text>
          <View style={styles.dotsContainer}>
            <Animated.View style={[styles.dot, { opacity: dot1Opacity }]} />
            <Animated.View style={[styles.dot, { opacity: dot2Opacity }]} />
            <Animated.View style={[styles.dot, { opacity: dot3Opacity }]} />
          </View>
        </Animated.View>
      </View>

      <View style={styles.bottomBar}>
        <View style={styles.bottomBarActive} />
      </View>

      <Text style={styles.versionText}>Version 1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.darkNavy,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgCircle1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: Colors.primaryBlue + '10',
    borderWidth: 1,
    borderColor: Colors.primaryBlue + '15',
  },
  bgCircle2: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: Colors.accentGold + '08',
    borderWidth: 1,
    borderColor: Colors.accentGold + '12',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
    position: 'relative',
  },
  logoRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.accentGold,
    ...Platform.select({
      ios: {
        shadowColor: Colors.accentGold,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  logo: {
    width: 70,
    height: 70,
  },
  logoGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.accentGold + '12',
    zIndex: -1,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.white,
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    letterSpacing: 0.5,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primaryBlue + '20',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    borderWidth: 1,
    borderColor: Colors.primaryBlue + '30',
    marginBottom: Spacing.xxxl,
  },
  tagline: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.accentGold,
    letterSpacing: 0.5,
  },
  loaderContainer: {
    alignItems: 'center',
  },
  loaderText: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
    fontWeight: FontWeight.medium,
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accentGold,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 60,
    left: Spacing.xxl,
    right: Spacing.xxl,
    height: 3,
    backgroundColor: Colors.darkNavySurface,
    borderRadius: BorderRadius.round,
    overflow: 'hidden',
  },
  bottomBarActive: {
    width: '60%',
    height: '100%',
    backgroundColor: Colors.primaryBlue,
    borderRadius: BorderRadius.round,
  },
  versionText: {
    position: 'absolute',
    bottom: 30,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
    letterSpacing: 0.5,
  },
});
