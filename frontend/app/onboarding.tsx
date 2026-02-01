import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { useTheme, spacing, typography } from '../utils/theme';
import { setOnboardingComplete } from '../utils/storage';
import { requestNotificationPermissions } from '../utils/notifications';

export default function OnboardingScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleGetStarted = async () => {
    setLoading(true);

    if (remindersEnabled) {
      await requestNotificationPermissions();
    }

    await setOnboardingComplete();
    setLoading(false);
    
    // Navigate to tabs/today
    router.replace('/(tabs)/today');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: theme.primary + '20' }]}>
            <Ionicons name="medical" size={64} color={theme.primary} />
          </View>
        </View>

        <Text style={[styles.title, { color: theme.text }]}>Welcome to MedConfirm</Text>
        
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          Track your medications. Confirm doses. Avoid double-dosing.
        </Text>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Ionicons name="checkmark-circle" size={24} color={theme.success} />
            <Text style={[styles.featureText, { color: theme.text }]}>
              Never forget if you took your medication
            </Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="checkmark-circle" size={24} color={theme.success} />
            <Text style={[styles.featureText, { color: theme.text }]}>
              Prevent accidental double-dosing
            </Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="checkmark-circle" size={24} color={theme.success} />
            <Text style={[styles.featureText, { color: theme.text }]}>
              Get reminders for scheduled times
            </Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="checkmark-circle" size={24} color={theme.success} />
            <Text style={[styles.featureText, { color: theme.text }]}>
              Track your medication history
            </Text>
          </View>
        </View>

        <View style={[styles.reminderSection, { backgroundColor: theme.surface }]}>
          <View style={styles.reminderHeader}>
            <Ionicons name="notifications" size={24} color={theme.primary} />
            <Text style={[styles.reminderTitle, { color: theme.text }]}>Enable Reminders</Text>
          </View>
          <Text style={[styles.reminderText, { color: theme.textSecondary }]}>
            Get notified when it's time to take your medications
          </Text>
          <View style={styles.toggleContainer}>
            <Text style={[styles.toggleLabel, { color: theme.text }]}>Reminders</Text>
            <View
              style={[
                styles.toggle,
                { backgroundColor: remindersEnabled ? theme.primary : theme.disabled },
              ]}
            >
              <View
                style={[
                  styles.toggleThumb,
                  { transform: [{ translateX: remindersEnabled ? 22 : 2 }] },
                ]}
              />
            </View>
          </View>
        </View>

        <View style={styles.disclaimer}>
          <Ionicons name="information-circle-outline" size={20} color={theme.textTertiary} />
          <Text style={[styles.disclaimerText, { color: theme.textTertiary }]}>
            This app is for tracking only and does not provide medical advice.
          </Text>
        </View>

        <View style={styles.branding}>
          <Text style={[styles.brandingText, { color: theme.textTertiary }]}>
            A product by Savantrexs
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Get Started"
          onPress={handleGetStarted}
          loading={loading}
          size="large"
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...typography.h1,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    ...typography.bodyLarge,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  features: {
    marginBottom: spacing.xl,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  featureText: {
    ...typography.body,
    marginLeft: spacing.md,
    flex: 1,
  },
  reminderSection: {
    padding: spacing.lg,
    borderRadius: 16,
    marginBottom: spacing.lg,
  },
  reminderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  reminderTitle: {
    ...typography.h3,
    marginLeft: spacing.sm,
  },
  reminderText: {
    ...typography.body,
    marginBottom: spacing.md,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleLabel: {
    ...typography.body,
    fontWeight: '600',
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
  },
  disclaimerText: {
    ...typography.caption1,
    fontSize: 12,
    marginLeft: spacing.sm,
    flex: 1,
    fontStyle: 'italic',
  },
  branding: {
    alignItems: 'center',
    marginTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  brandingText: {
    ...typography.caption2,
    fontSize: 11,
  },
  footer: {
    padding: spacing.lg,
  },
  button: {
    width: '100%',
  },
});