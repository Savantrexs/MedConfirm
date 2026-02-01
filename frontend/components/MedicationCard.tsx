import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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

  const getStatusBadge = () => {
    switch (status) {
      case 'due-soon':
        return { text: 'Due Soon', color: theme.warning };
      case 'overdue':
        return { text: 'Overdue', color: theme.danger };
      case 'taken':
        return { text: 'Taken', color: theme.success };
      default:
        return { text: 'Scheduled', color: theme.textSecondary };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }, shadows.medium]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="medical" size={24} color={theme.primary} />
          <View style={styles.titleContainer}>
            <Text style={[styles.name, { color: theme.text }]}>{medication.name}</Text>
            {medication.dosageText && (
              <Text style={[styles.dosage, { color: theme.textSecondary }]}>
                {medication.dosageText}
              </Text>
            )}
          </View>
        </View>
        <View style={[styles.badge, { backgroundColor: statusBadge.color + '20' }]}>
          <Text style={[styles.badgeText, { color: statusBadge.color }]}>
            {statusBadge.text}
          </Text>
        </View>
      </View>

      {medication.instructions && (
        <Text style={[styles.instructions, { color: theme.textSecondary }]}>
          {medication.instructions}
        </Text>
      )}

      <View style={styles.timeInfo}>
        {nextDose && (
          <View style={styles.timeRow}>
            <Ionicons name="time-outline" size={18} color={theme.textSecondary} />
            <Text style={[styles.timeLabel, { color: theme.textSecondary }]}>Next dose:</Text>
            <Text style={[styles.timeValue, { color: theme.text }]}>
              {formatTime(nextDose.time)} {nextDose.isToday ? '(Today)' : '(Tomorrow)'}
            </Text>
          </View>
        )}
        {lastTaken && (
          <View style={styles.timeRow}>
            <Ionicons name="checkmark-circle-outline" size={18} color={theme.success} />
            <Text style={[styles.timeLabel, { color: theme.textSecondary }]}>Last taken:</Text>
            <Text style={[styles.timeValue, { color: theme.text }]}>
              {formatDateTime(lastTaken)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        <Button
          title="Mark as Taken"
          onPress={onMarkTaken}
          variant="primary"
          style={styles.primaryButton}
        />
        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: theme.border }]}
          onPress={onViewHistory}
          activeOpacity={0.7}
        >
          <Text style={[styles.secondaryButtonText, { color: theme.primary }]}>History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleContainer: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  name: {
    ...typography.h3,
    marginBottom: 2,
  },
  dosage: {
    ...typography.caption,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    ...typography.caption,
    fontWeight: '600',
  },
  instructions: {
    ...typography.caption,
    marginBottom: spacing.md,
    fontStyle: 'italic',
  },
  timeInfo: {
    marginBottom: spacing.md,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  timeLabel: {
    ...typography.caption,
    marginLeft: spacing.xs,
  },
  timeValue: {
    ...typography.caption,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  primaryButton: {
    flex: 2,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: borderRadius.md,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    ...typography.button,
  },
});