import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import uuid from 'react-native-uuid';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/Button';
import { useTheme, spacing, borderRadius, typography, shadows } from '../utils/theme';
import { Medication } from '../utils/storage';
import { wasRecentlyTaken } from '../utils/medicationLogic';
import { cancelRepeatNotificationsForDose } from '../utils/notifications';

interface MarkTakenModalProps {
  visible: boolean;
  medication: Medication | null;
  onClose: () => void;
}

export const MarkTakenModal: React.FC<MarkTakenModalProps> = ({
  visible,
  medication,
  onClose,
}) => {
  const theme = useTheme();
  const { addIntakeLog, intakeLogs } = useApp();
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  if (!medication) return null;

  const handleConfirm = async () => {
    // Check if recently taken
    if (wasRecentlyTaken(medication.id, intakeLogs)) {
      Alert.alert(
        'Recently Taken',
        'You marked this medication as taken within the last hour. Are you sure you want to mark it again?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Confirm',
            onPress: () => saveLog(),
          },
        ]
      );
    } else {
      await saveLog();
    }
  };

  const saveLog = async () => {
    setSaving(true);
    
    const log = {
      id: String(uuid.v4()),
      medicationId: medication.id,
      takenAt: new Date().toISOString(),
      note: note.trim() || undefined,
    };

    try {
      await addIntakeLog(log);
      
      // Cancel repeat notifications for this dose
      const nextDose = getNextDoseTime(medication);
      if (nextDose && nextDose.isToday) {
        await cancelRepeatNotificationsForDose(medication.id, nextDose.time);
      }
      
      setNote('');
      onClose();
      
      // Force refresh the data
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      Alert.alert('Error', 'Failed to log intake');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalKeyboard}
        >
          <SafeAreaView style={styles.modalSafeArea} edges={['bottom']}>
            <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
              <View style={styles.modalHeader}>
                <View style={styles.dragHandle} />
              </View>

              <View style={styles.modalBody}>
                <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
                  <Ionicons name="checkmark-circle" size={48} color={theme.primary} />
                </View>

                <Text style={[styles.modalTitle, { color: theme.text }]}>Confirm Intake</Text>
                <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
                  {medication.name}
                </Text>
                {medication.dosageText && (
                  <Text style={[styles.dosageText, { color: theme.textSecondary }]}>
                    {medication.dosageText}
                  </Text>
                )}

                <View style={styles.noteContainer}>
                  <Text style={[styles.noteLabel, { color: theme.textSecondary }]}>
                    Add a note (optional)
                  </Text>
                  <TextInput
                    style={[
                      styles.noteInput,
                      {
                        backgroundColor: theme.background,
                        color: theme.text,
                        borderColor: theme.border,
                      },
                    ]}
                    placeholder="e.g., Taken with food"
                    placeholderTextColor={theme.textLight}
                    value={note}
                    onChangeText={setNote}
                    multiline
                    numberOfLines={2}
                  />
                </View>

                <View style={styles.buttonContainer}>
                  <Button
                    title="Confirm Taken"
                    onPress={handleConfirm}
                    loading={saving}
                    style={styles.confirmButton}
                  />
                  <Button
                    title="Cancel"
                    onPress={onClose}
                    variant="outline"
                    disabled={saving}
                  />
                </View>
              </View>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalKeyboard: {
    justifyContent: 'flex-end',
  },
  modalSafeArea: {
    maxHeight: '90%',
  },
  modalContent: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingBottom: spacing.md,
  },
  modalHeader: {
    alignItems: 'center',
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
  },
  modalBody: {
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    ...typography.h2,
    marginBottom: spacing.xs,
  },
  modalSubtitle: {
    ...typography.bodyLarge,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  dosageText: {
    ...typography.body,
    marginBottom: spacing.lg,
  },
  noteContainer: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  noteLabel: {
    ...typography.caption,
    marginBottom: spacing.sm,
  },
  noteInput: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    width: '100%',
    gap: spacing.sm,
  },
  confirmButton: {
    width: '100%',
  },
});