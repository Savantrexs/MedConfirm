import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import uuid from 'react-native-uuid';
import { useApp } from '../contexts/AppContext';
import { Button } from '../components/Button';
import { useTheme, spacing, borderRadius, typography, shadows } from '../utils/theme';
import { Medication } from '../utils/storage';

export default function AddEditMedicationScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { addMedication, updateMedication, adSlots, medications, unlockAdSlot } = useApp();
  
  const [name, setName] = useState('');
  const [dosageText, setDosageText] = useState('');
  const [instructions, setInstructions] = useState('');
  const [times, setTimes] = useState<string[]>(['09:00']);
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const daysOfWeek = [
    { label: 'Sun', value: 0 },
    { label: 'Mon', value: 1 },
    { label: 'Tue', value: 2 },
    { label: 'Wed', value: 3 },
    { label: 'Thu', value: 4 },
    { label: 'Fri', value: 5 },
    { label: 'Sat', value: 6 },
  ];

  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day].sort());
    }
  };

  const addTimeSlot = () => {
    setTimes([...times, '09:00']);
  };

  const updateTime = (index: number, value: string) => {
    const updated = [...times];
    updated[index] = value;
    setTimes(updated);
  };

  const removeTime = (index: number) => {
    if (times.length > 1) {
      setTimes(times.filter((_, i) => i !== index));
    }
  };

  const checkAdRequired = (): boolean => {
    const activeMeds = medications.filter(m => m.isActive).length;
    const maxAllowed = 2 + adSlots;
    return activeMeds >= maxAllowed;
  };

  const showMockRewardedAd = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      Alert.alert(
        'Mock Rewarded Ad',
        'Watch a video ad to unlock an additional medication slot?',
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
                Alert.alert('Ad Complete!', 'You unlocked 1 medication slot!');
                resolve(true);
              }, 1000);
            },
          },
        ]
      );
    });
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a medication name');
      return;
    }

    if (times.length === 0) {
      Alert.alert('Error', 'Please add at least one dose time');
      return;
    }

    if (selectedDays.length === 0) {
      Alert.alert('Error', 'Please select at least one day');
      return;
    }

    // Check if ad is needed
    if (isActive && checkAdRequired()) {
      const watched = await showMockRewardedAd();
      if (!watched) {
        return;
      }
      await unlockAdSlot();
    }

    setSaving(true);

    const medication: Medication = {
      id: String(uuid.v4()),
      name: name.trim(),
      dosageText: dosageText.trim() || undefined,
      instructions: instructions.trim() || undefined,
      timesPerDay: times.sort(),
      daysOfWeek: selectedDays,
      isActive,
    };

    try {
      await addMedication(medication);
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to save medication');
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Add Medication</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.section, { backgroundColor: theme.surface }, shadows.small]}>
            <Text style={[styles.label, { color: theme.text }]}>Medication Name *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
              placeholder="e.g., Aspirin"
              placeholderTextColor={theme.textLight}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={[styles.section, { backgroundColor: theme.surface }, shadows.small]}>
            <Text style={[styles.label, { color: theme.text }]}>Dosage</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
              placeholder="e.g., 500mg"
              placeholderTextColor={theme.textLight}
              value={dosageText}
              onChangeText={setDosageText}
            />
          </View>

          <View style={[styles.section, { backgroundColor: theme.surface }, shadows.small]}>
            <Text style={[styles.label, { color: theme.text }]}>Instructions</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
              placeholder="e.g., Take after food"
              placeholderTextColor={theme.textLight}
              value={instructions}
              onChangeText={setInstructions}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={[styles.section, { backgroundColor: theme.surface }, shadows.small]}>
            <Text style={[styles.label, { color: theme.text }]}>Times Per Day *</Text>
            {times.map((time, index) => (
              <View key={index} style={styles.timeRow}>
                <TextInput
                  style={[styles.timeInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                  value={time}
                  onChangeText={(value) => updateTime(index, value)}
                  placeholder="HH:MM"
                  placeholderTextColor={theme.textLight}
                />
                {times.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeTime(index)}
                    style={styles.removeButton}
                  >
                    <Ionicons name="close-circle" size={24} color={theme.danger} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.primary + '20' }]}
              onPress={addTimeSlot}
            >
              <Ionicons name="add" size={20} color={theme.primary} />
              <Text style={[styles.addButtonText, { color: theme.primary }]}>Add Time</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.section, { backgroundColor: theme.surface }, shadows.small]}>
            <Text style={[styles.label, { color: theme.text }]}>Days of Week *</Text>
            <View style={styles.daysContainer}>
              {daysOfWeek.map((day) => (
                <TouchableOpacity
                  key={day.value}
                  style={[
                    styles.dayButton,
                    {
                      backgroundColor: selectedDays.includes(day.value)
                        ? theme.primary
                        : theme.background,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => toggleDay(day.value)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      {
                        color: selectedDays.includes(day.value) ? '#FFFFFF' : theme.text,
                      },
                    ]}
                  >
                    {day.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={[styles.section, { backgroundColor: theme.surface }, shadows.small]}>
            <View style={styles.toggleRow}>
              <Text style={[styles.label, { color: theme.text }]}>Active</Text>
              <TouchableOpacity
                style={[
                  styles.toggle,
                  { backgroundColor: isActive ? theme.primary : theme.disabled },
                ]}
                onPress={() => setIsActive(!isActive)}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    { transform: [{ translateX: isActive ? 22 : 2 }] },
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottomPadding} />
        </ScrollView>

        <View style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
          <Button
            title="Save Medication"
            onPress={handleSave}
            loading={saving}
            style={styles.saveButton}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
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
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  label: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  timeInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
  },
  removeButton: {
    marginLeft: spacing.sm,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.xs,
  },
  addButtonText: {
    ...typography.body,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  dayButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  dayText: {
    ...typography.caption,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
  },
  saveButton: {
    width: '100%',
  },
  bottomPadding: {
    height: spacing.xxl,
  },
});