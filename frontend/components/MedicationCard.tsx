import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Medication, IntakeLog } from '../utils/storage';
import { useTheme, spacing, borderRadius, shadows, typography } from '../utils/theme';
import {
  getNextDoseTime,
  getDoseStatus,
  getLastTakenTime,
  formatTime,
  formatDateTime,
} from '../utils/medicationLogic';
import { Button } from './Button';
import { BlurView } from 'expo-blur';

interface MedicationCardProps {
  medication: Medication;
  intakeLogs: IntakeLog[];
  onMarkTaken: () => void;
  onViewHistory: () => void;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  intakeLogs,
  onMarkTaken,
  onViewHistory,
}) => {
  const theme = useTheme();
  const nextDose = getNextDoseTime(medication);
  const status = getDoseStatus(medication, intakeLogs);
  const lastTaken = getLastTakenTime(medication.id, intakeLogs);

  const getStatusConfig = () => {
    switch (status) {
      case 'due-soon':
        return { text: 'Due Soon', color: theme.warning, bg: theme.warning + '15' };
      case 'overdue':
        return { text: 'Overdue', color: theme.danger, bg: theme.danger + '15' };
      case 'taken':
        return { text: 'Taken', color: theme.success, bg: theme.success + '15' };
      default:
        return { text: 'Scheduled', color: theme.textTertiary, bg: theme.textTertiary + '10' };
    }
  }; 

  const statusConfig = getStatusConfig();

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }, shadows.medium]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.medInfo}>
          <View style={[styles.iconCircle, { backgroundColor: theme.primary + '15' }]}>
            <Ionicons name="medical" size={20} color={theme.primary} />
          </View>
          <View style={styles.medDetails}>
            <Text style={[styles.name, { color: theme.text }]}>{medication.name}</Text>
            {medication.dosageText && (
              <Text style={[styles.dosage, { color: theme.textSecondary }]}>
                {medication.dosageText}
              </Text>
            )}
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.text}
          </Text>
        </View>
      </View>

      {/* Instructions */}
      {medication.instructions && (
        <View style={[styles.instructionsContainer, { backgroundColor: theme.background }]}>
          <Ionicons name="information-circle-outline" size={14} color={theme.textTertiary} />
          <Text style={[styles.instructions, { color: theme.textSecondary }]}>
            {medication.instructions}
          </Text>
        </View>
      )}

      {/* Time Info - Prominent */}
      <View style={styles.timeSection}>
        {nextDose && (
          <View style={styles.timeRow}>
            <Ionicons name="time" size={18} color={theme.primary} />
            <View style={styles.timeContent}>
              <Text style={[styles.timeLabel, { color: theme.textTertiary }]}>Next dose</Text>
              <Text style={[styles.timeValue, { color: theme.text }]}>
                {formatTime(nextDose.time)} {nextDose.isToday ? '(Today)' : '(Tomorrow)'}
              </Text>
            </View>
          </View>
        )}
        {lastTaken && (
          <View style={styles.timeRow}>
            <Ionicons name="checkmark-circle" size={18} color={theme.success} />
            <View style={styles.timeContent}>
              <Text style={[styles.timeLabel, { color: theme.textTertiary }]}>Last taken</Text>
              <Text style={[styles.timeValue, { color: theme.text }]}>
                {formatDateTime(lastTaken)}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Primary Action - Most Prominent */}
      <Button
        title="Mark as Taken"
        onPress={onMarkTaken}
        variant="primary"
        size="large"
        style={styles.primaryButton}
      />

      {/* Secondary Action */}
      <TouchableOpacity
        style={styles.historyButton}
        onPress={onViewHistory}
        activeOpacity={0.7}
      >
        <Ionicons name="time-outline" size={16} color={theme.primary} />
        <Text style={[styles.historyButtonText, { color: theme.primary }]}>View History</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  medInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  medDetails: {
    marginLeft: spacing.md,
    flex: 1,
  },
  name: {
    ...typography.title3,
    marginBottom: 2,
  },
  dosage: {
    ...typography.subheadline,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    marginLeft: spacing.sm,
  },
  statusText: {
    ...typography.caption1,
    fontWeight: '600',
  },
  instructionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.md,
  },
  instructions: {
    ...typography.footnote,
    marginLeft: spacing.xs,
    flex: 1,
    fontStyle: 'italic',
  },
  timeSection: {
    marginBottom: spacing.lg,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  timeContent: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  timeLabel: {
    ...typography.caption1,
    marginBottom: 2,
  },
  timeValue: {
    ...typography.headline,
  },
  primaryButton: {
    width: '100%',
    marginBottom: spacing.sm,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  historyButtonText: {
    ...typography.callout,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
});