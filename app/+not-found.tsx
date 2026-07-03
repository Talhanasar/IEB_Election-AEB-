import { Link, Stack } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, FontWeight, BorderRadius } from '@/constants/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <MaterialCommunityIcons name="alert-circle-outline" size={64} color={Colors.textMuted} />
        <Text style={styles.title}>Page Not Found</Text>
        <Text style={styles.subtitle}>This screen doesn&apos;t exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to Home</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.lg,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textTertiary,
    marginTop: Spacing.sm,
  },
  link: {
    marginTop: Spacing.xl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.primaryBlue,
    borderRadius: BorderRadius.lg,
  },
  linkText: {
    fontSize: FontSize.md,
    color: Colors.white,
    fontWeight: FontWeight.bold,
  },
});
