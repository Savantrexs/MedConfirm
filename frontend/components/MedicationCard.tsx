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

  const getStatusColor = () => {
    switch (status) {
      case 'due-soon':
      case 'overdue':
        return theme.warning;
      case 'taken':
        return theme.success;
      default:
        return theme.textTertiary;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'due-soon':
        return 'Due Soon';
      case 'overdue':
        return 'Missed';
      case 'taken':
        return 'Taken';
      default:
        return 'Scheduled';
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.surface }, shadows.small]}>
      {/* Header: Name, Dosage, Status */}
      <View style={styles.header}>
        <View style={styles.medInfo}>
          <Text style={[styles.name, { color: theme.text }]}>{medication.name}</Text>
          {medication.dosageText && (
            <Text style={[styles.dosage, { color: theme.textSecondary }]}>
              {medication.dosageText}
            </Text>
          )}
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '15' }]}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
        </View>
      </View>

      {/* Instructions (if any) */}
      {medication.instructions && (
        <Text style={[styles.instructions, { color: theme.textTertiary }]}>
          {medication.instructions}
        </Text>
      )}

      {/* Next Dose - Prominent */}
      {nextDose && (
        <View style={styles.doseRow}>
          <Ionicons name="time" size={16} color={theme.primary} />
          <Text style={[styles.doseLabel, { color: theme.textSecondary }]}>Next dose:</Text>
          <Text style={[styles.doseValue, { color: theme.text }]}>
            {formatTime(nextDose.time)} {nextDose.isToday ? '' : '(Tomorrow)'}
          </Text>
        </View>
      )}

      {/* Last Taken - Secondary */}
      {lastTaken && (
        <View style={styles.lastTakenRow}>
          <Ionicons name="checkmark-circle" size={14} color="#007AFF" />
          <Text style={[styles.lastTakenText, { color: theme.textTertiary }]}>
            {formatDateTime(lastTaken)}
          </Text>
        </View>
      )}

      {/* Primary Action */}
      <Button
        title="Mark as Taken"
        onPress={onMarkTaken}
        variant="primary"
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  medInfo: {
    flex: 1,
  },
  name: {
    ...typography.headline,
    marginBottom: 2,
  },
  dosage: {
    ...typography.subheadline,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    marginLeft: spacing.sm,
  },
  statusText: {
    ...typography.caption2,
    fontWeight: '600',
    fontSize: 11,
  },
  instructions: {
    ...typography.caption1,
    marginBottom: spacing.sm,
    fontStyle: 'italic',
  },
  doseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  doseLabel: {
    ...typography.subheadline,
    marginLeft: spacing.xs,
  },
  doseValue: {
    ...typography.headline,
    marginLeft: spacing.xs,
  },
  lastTakenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  lastTakenText: {
    ...typography.caption1,
    marginLeft: spacing.xs,
    fontSize: 12,
  },
  button: {
    width: '100%',
    height: 44,
  },
});
