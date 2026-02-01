import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../contexts/AppContext';
import { useTheme, spacing, borderRadius, typography, shadows } from '../../utils/theme';

export default function SettingsScreen() {
  const theme = useTheme();
  const { settings, updateSettings, intakeLogs, medications, unlockAdSlot } = useApp();
  const [exporting, setExporting] = useState(false);

  const showMockRewardedAd = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      Alert.alert(
        'Mock Rewarded Ad',
        'Watch a video ad to unlock CSV export?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => resolve(false),
          },
          {
            text: 'Watch Ad',
            onPress: () => {
              setTimeout(() => {
                Alert.alert('Ad Complete!', 'CSV export unlocked!');
                resolve(true);
              }, 1000);
            },
          },
        ]
      );
    });
  };

  const handleExportCSV = async () => {
    const watched = await showMockRewardedAd();
    if (!watched) return;

    setExporting(true);

    try {
      // Generate CSV content
      let csv = 'Date,Time,Medication,Dosage,Note\n';
      
      for (const log of intakeLogs) {
        const medication = medications.find(m => m.id === log.medicationId);
        const date = new Date(log.takenAt);
        const dateStr = date.toLocaleDateString();
        const timeStr = date.toLocaleTimeString();
        const name = medication?.name || 'Unknown';
        const dosage = medication?.dosageText || '';
        const note = log.note || '';
        
        csv += `${dateStr},${timeStr},${name},${dosage},"${note}"\n`;
      }

      // In a real app, you would save this to a file or share it
      // For now, we'll just show it in an alert
      await Share.share({
        message: csv,
        title: 'MedConfirm Export',
      });
      
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const toggleReminders = async () => {
    await updateSettings({
      ...settings,
      remindersEnabled: !settings.remindersEnabled,
    });
  };

  const toggleDarkMode = async () => {
    await updateSettings({
      ...settings,
      darkMode: !settings.darkMode,
    });
  };

  const toggleHighContrast = async () => {
    await updateSettings({
      ...settings,
      highContrast: !settings.highContrast,
    });
  };

  const SettingRow = ({
    icon,
    title,
    subtitle,
    value,
    onToggle,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    value: boolean;
    onToggle: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.settingRow, { borderBottomColor: theme.border }]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon as any} size={24} color={theme.primary} />
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <View
        style={[
          styles.toggle,
          { backgroundColor: value ? theme.primary : theme.disabled },
        ]}
      >
        <View
          style={[
            styles.toggleThumb,
            { transform: [{ translateX: value ? 22 : 2 }] },
          ]}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.section, { backgroundColor: theme.surface }, shadows.small]}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>NOTIFICATIONS</Text>
          <SettingRow
            icon="notifications-outline"
            title="Reminders"
            subtitle="Enable medication reminders"
            value={settings.remindersEnabled}
            onToggle={toggleReminders}
          />
        </View>

        <View style={[styles.section, { backgroundColor: theme.surface }, shadows.small]}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>APPEARANCE</Text>
          <SettingRow
            icon="moon-outline"
            title="Dark Mode"
            subtitle="Use dark theme"
            value={settings.darkMode}
            onToggle={toggleDarkMode}
          />
          <SettingRow
            icon="contrast-outline"
            title="High Contrast"
            subtitle="Improve visibility"
            value={settings.highContrast}
            onToggle={toggleHighContrast}
          />
        </View>

        <View style={[styles.section, { backgroundColor: theme.surface }, shadows.small]}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>DATA</Text>
          <TouchableOpacity
            style={[styles.actionRow, { borderBottomColor: theme.border }]}
            onPress={handleExportCSV}
            disabled={exporting}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="download-outline" size={24} color={theme.primary} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, { color: theme.text }]}>Export Data</Text>
                <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>
                  Download CSV (requires ad)
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: theme.surface }, shadows.small]}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>ABOUT</Text>
          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={24} color={theme.textSecondary} />
            <View style={styles.infoText}>
              <Text style={[styles.infoTitle, { color: theme.text }]}>MedConfirm v1.0.0</Text>
              <Text style={[styles.infoSubtitle, { color: theme.textSecondary }]}>
                Track medications • Prevent double-dosing
              </Text>
              <Text style={[styles.disclaimer, { color: theme.textTertiary }]}>
                This app is for tracking only and does not provide medical advice.
              </Text>
              <Text style={[styles.branding, { color: theme.textTertiary }]}>
                A product by Savantrexs
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.h2,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  section: {
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  sectionTitle: {
    ...typography.caption,
    fontWeight: '600',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  settingTitle: {
    ...typography.body,
    fontWeight: '600',
  },
  settingSubtitle: {
    ...typography.caption,
    marginTop: 2,
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
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 0,
  },
  infoRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  infoText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  infoTitle: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  infoSubtitle: {
    ...typography.caption,
    marginBottom: spacing.sm,
  },
  disclaimer: {
    ...typography.caption1,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: spacing.sm,
  },
  branding: {
    ...typography.caption2,
    fontSize: 11,
    marginTop: spacing.md,
  },
  bottomPadding: {
    height: spacing.xxl,
  },
});