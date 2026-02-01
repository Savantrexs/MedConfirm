import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../../contexts/AppContext';
import { useTheme, spacing, borderRadius, typography, shadows } from '../../utils/theme';
import { groupLogsByDate, getDateLabel, formatDateTime } from '../../utils/medicationLogic';

export default function HistoryScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { intakeLogs, medications, deleteIntakeLog } = useApp();
  const [selectedMedicationId, setSelectedMedicationId] = useState<string | null>(null);

  const filteredLogs = selectedMedicationId
    ? intakeLogs.filter(log => log.medicationId === selectedMedicationId)
    : intakeLogs;

  const groupedLogs = groupLogsByDate(filteredLogs);
  const dateKeys = Object.keys(groupedLogs);

  const getMedicationName = (medicationId: string) => {
    const med = medications.find(m => m.id === medicationId);
    return med?.name || 'Unknown';
  };

  const handleDeleteLog = (logId: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this intake log?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteIntakeLog(logId),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>History</Text>
        <View style={styles.placeholder} />
      </View>

      {medications.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              {
                backgroundColor: selectedMedicationId === null ? theme.primary : theme.surface,
                borderColor: theme.border,
              },
              shadows.small,
            ]}
            onPress={() => setSelectedMedicationId(null)}
          >
            <Text
              style={[
                styles.filterChipText,
                { color: selectedMedicationId === null ? '#FFFFFF' : theme.text },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          {medications.map((med) => (
            <TouchableOpacity
              key={med.id}
              style={[
                styles.filterChip,
                {
                  backgroundColor: selectedMedicationId === med.id ? theme.primary : theme.surface,
                  borderColor: theme.border,
                },
                shadows.small,
              ]}
              onPress={() => setSelectedMedicationId(med.id)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: selectedMedicationId === med.id ? '#FFFFFF' : theme.text },
                ]}
              >
                {med.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {dateKeys.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="clipboard-outline" size={64} color={theme.textLight} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No History Yet</Text>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Your medication intake logs will appear here
            </Text>
          </View>
        ) : (
          <View style={styles.logsList}>
            {dateKeys.map((dateKey) => (
              <View key={dateKey} style={styles.dateGroup}>
                <Text style={[styles.dateHeader, { color: theme.text }]}>
                  {getDateLabel(dateKey)}
                </Text>
                {groupedLogs[dateKey].map((log) => (
                  <View
                    key={log.id}
                    style={[styles.logCard, { backgroundColor: theme.surface }, shadows.small]}
                  >
                    <View style={styles.logHeader}>
                      <View style={styles.logInfo}>
                        <Ionicons name="medical" size={20} color={theme.primary} />
                        <Text style={[styles.logMedication, { color: theme.text }]}>
                          {getMedicationName(log.medicationId)}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleDeleteLog(log.id)}
                        style={styles.deleteButton}
                      >
                        <Ionicons name="trash-outline" size={20} color={theme.danger} />
                      </TouchableOpacity>
                    </View>
                    <Text style={[styles.logTime, { color: theme.textSecondary }]}>
                      {formatDateTime(log.takenAt)}
                    </Text>
                    {log.note && (
                      <Text style={[styles.logNote, { color: theme.textSecondary }]}>
                        Note: {log.note}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
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
  filterContainer: {
    maxHeight: 60,
  },
  filterContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  filterChipText: {
    ...typography.body,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl * 2,
  },
  emptyTitle: {
    ...typography.h2,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    textAlign: 'center',
  },
  logsList: {
    paddingTop: spacing.md,
  },
  dateGroup: {
    marginBottom: spacing.lg,
  },
  dateHeader: {
    ...typography.h3,
    marginBottom: spacing.sm,
  },
  logCard: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  logInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logMedication: {
    ...typography.body,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  deleteButton: {
    padding: spacing.xs,
  },
  logTime: {
    ...typography.caption,
    marginBottom: spacing.xs,
  },
  logNote: {
    ...typography.caption,
    fontStyle: 'italic',
  },
  bottomPadding: {
    height: spacing.xxl,
  },
});