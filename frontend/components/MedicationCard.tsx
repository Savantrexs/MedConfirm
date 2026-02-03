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
  onDetails: () => void;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  intakeLogs,
  onMarkTaken,
  onDetails,
}) => {
  const theme = useTheme();
  const nextDose = getNextDoseTime(medication);
  const status = getDoseStatus(medication, intakeLogs);
  const lastTaken = getLastTakenTime(medication.id, intakeLogs);

  const getStatusConfig = () => {
    switch (status) {
      case 'due-soon':
        return { 
          text: 'Due', 
          color: theme.statusDue, 
          bg: theme.statusDueBg,
          helper: 'Due now'
        };
      case 'overdue':
        const now = new Date();
        const [hours, minutes] = (nextDose?.time || '00:00').split(':').map(Number);
        const scheduledTime = new Date();
        scheduledTime.setHours(hours, minutes, 0, 0);
        const diffMinutes = Math.floor((now.getTime() - scheduledTime.getTime()) / 60000);
        return { 
          text: 'Overdue', 
          color: theme.statusOverdue, 
          bg: theme.statusOverdueBg,
          helper: `Overdue by ${diffMinutes} min`
        };
      case 'taken':
        return { 
          text: 'Taken', 
          color: theme.statusTaken, 
          bg: theme.statusTakenBg,
          helper: null
        };
      default:
        return { 
          text: 'Scheduled', 
          color: theme.statusScheduled, 
          bg: theme.statusScheduledBg,
          helper: 'Upcoming'
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }, shadows.medium]}>
      {/* Header Row: Name + Status Pill */}
      <View style={styles.header}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
          {medication.name}
        </Text>
        <View style={[styles.statusPill, { backgroundColor: statusConfig.bg }]}>
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.text}
          </Text>
        </View>
      </View>

      {/* Dosage + Instructions Row */}
      <View style={styles.metaRow}>
        {medication.dosageText && (
          <Text style={[styles.metaText, { color: theme.textSecondary }]}>
            {medication.dosageText}
          </Text>
        )}
        {medication.dosageText && medication.instructions && (
          <Text style={[styles.metaSeparator, { color: theme.textTertiary }]}> • </Text>
        )}
        {medication.instructions && (
          <Text style={[styles.metaText, { color: theme.textSecondary }]} numberOfLines={1}>
            {medication.instructions}
          </Text>
        )}
      </View>

      {/* Next Dose - Key Info */}
      {nextDose && (
        <View style={styles.doseInfo}>
          <View style={styles.doseRow}>
            <Ionicons name="time-outline" size={16} color={theme.primary} />
            <Text style={[styles.doseTime, { color: theme.text }]}>
              {formatTime(nextDose.time)}
            </Text>
            {!nextDose.isToday && (
              <Text style={[styles.doseTomorrow, { color: theme.textTertiary }]}>
                (Tomorrow)
              </Text>
            )}
          </View>
          {statusConfig.helper && (
            <Text style={[styles.helperText, { color: theme.textTertiary }]}>
              {statusConfig.helper}
            </Text>
          )}
        </View>
      )}

      {/* Last Taken - Secondary */}
      {lastTaken && (
        <View style={styles.lastTakenRow}>
          <Ionicons name="checkmark-circle-outline" size={12} color="#007AFF" />
          <Text style={[styles.lastTakenText, { color: theme.textTertiary }]}>
            Last taken {formatDateTime(lastTaken)}
          </Text>
        </View>
      )}

      {/* Actions Row */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.takenButton, { backgroundColor: theme.primary }]}
          onPress={onMarkTaken}
          activeOpacity={0.8}
        >
          <Text style={styles.takenButtonText}>Taken</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.detailsButton}
          onPress={onDetails}
          activeOpacity={0.7}
        >
          <Text style={[styles.detailsButtonText, { color: theme.primary }]}>Details</Text>
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
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  name: {
    ...typography.bodyPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  statusPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.xs,
  },
  statusText: {
    ...typography.bodyTertiary,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  metaText: {
    ...typography.bodySecondary,
  },
  metaSeparator: {
    ...typography.bodySecondary,
  },
  doseInfo: {
    marginBottom: spacing.xs,
  },
  doseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  doseTime: {
    ...typography.sectionHeading,
    fontSize: 18,
    marginLeft: spacing.xs,
  },
  doseTomorrow: {
    ...typography.bodySecondary,
    marginLeft: spacing.xs,
  },
  helperText: {
    ...typography.bodyTertiary,
    marginLeft: 24,
  },
  lastTakenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  lastTakenText: {
    ...typography.bodyTertiary,
    marginLeft: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  takenButton: {
    flex: 1,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  takenButtonText: {
    ...typography.button,
    color: '#FFFFFF',
  },
  detailsButton: {
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsButtonText: {
    ...typography.bodyPrimary,
    fontWeight: '600',
  },
});
