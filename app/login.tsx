import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Colors,
  Spacing,
  FontSize,
  FontWeight,
  BorderRadius,
  Shadow,
} from '@/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    const demoAccounts = ['demo1', 'demo2', 'demo3'];
    if (demoAccounts.includes(userId.toLowerCase()) && password === '123') {
      router.replace('/(candidate)/dashboard');
    } else {
      Alert.alert('Invalid credentials', 'Please use demo1/123, demo2/123, or demo3/123');
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={process.env.EXPO_OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Button */}
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Back</Text>
        </Pressable>

        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Image
            source={require('@/assets/images/logo.png')}
            style={styles.logo}
            contentFit="contain"
          />
          <Text style={styles.appTitle}>IEB ELECTION 2026</Text>
          <Text style={styles.appSubtitle}>
            Association of Engineers Bangladesh
          </Text>
        </View>

        {/* Login Card */}
        <View style={styles.loginCard}>
          <View style={styles.loginHeader}>
            <Text style={styles.loginTitle}>Candidate Login</Text>
            <Text style={styles.loginSubtitle}>
              Enter your credentials to access the campaign dashboard
            </Text>
          </View>

          {/* User ID Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>User ID</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="account-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your User ID"
                placeholderTextColor={Colors.textMuted}
                value={userId}
                onChangeText={setUserId}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter your Password"
                placeholderTextColor={Colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <MaterialCommunityIcons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={24} color={Colors.textMuted} />
              </Pressable>
            </View>
          </View>

          {/* Forgot Password */}
          <Pressable style={styles.forgotButton}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </Pressable>

          {/* Login Button */}
          <Pressable
            style={styles.loginButton}
            onPress={handleLogin}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </Pressable>
        </View>

        <Text style={styles.footerText}>
          Contact admin if you need login credentials
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 40,
  },
  backButton: {
    paddingVertical: Spacing.md,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: FontSize.md,
    color: Colors.primaryBlue,
    fontWeight: FontWeight.semibold,
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: Spacing.md,
  },
  appTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.primaryBlue,
    letterSpacing: 1,
  },
  appSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  loginCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    ...Shadow.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  loginHeader: {
    marginBottom: Spacing.xxl,
  },
  loginTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  loginSubtitle: {
    fontSize: FontSize.md,
    color: Colors.textTertiary,
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.lg,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  eyeButton: {
    padding: Spacing.sm,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.xl,
  },
  forgotText: {
    fontSize: FontSize.sm,
    color: Colors.primaryBlue,
    fontWeight: FontWeight.semibold,
  },
  loginButton: {
    backgroundColor: Colors.primaryBlue,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    ...Shadow.md,
  },
  loginButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    letterSpacing: 0.5,
  },
  footerText: {
    textAlign: 'center',
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginTop: Spacing.xl,
  },
});
