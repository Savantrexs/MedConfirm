import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { useApp } from '../../contexts/AppContext';
import { MedicationCard } from '../../components/MedicationCard';
import { MarkTakenModal } from '../../components/MarkTakenModal';
import { useTheme, spacing, typography, borderRadius } from '../../utils/theme';
import { Medication } from '../../utils/storage';
import { getDoseStatus } from '../../utils/medicationLogic';

export default function TodayScreen() {
  const theme = useTheme();
  const { medications, intakeLogs, refreshData } = useApp();
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const activeMedications = medications.filter(m => m.isActive);

  // Calculate daily adherence
  const getTodayAdherence = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    let totalDoses = 0;
    let takenDoses = 0;

    activeMedications.forEach(med => {
      const daysOfWeek = med.daysOfWeek || [0, 1, 2, 3, 4, 5, 6];
      const currentDay = new Date().getDay();
      
      if (daysOfWeek.includes(currentDay)) {
        totalDoses += med.timesPerDay.length;
        
        // Count taken doses for today
        const todayLogs = intakeLogs.filter(log => {
          const logDate = format(new Date(log.takenAt), 'yyyy-MM-dd');
          return log.medicationId === med.id && logDate === today;
        });
        
        takenDoses += Math.min(todayLogs.length, med.timesPerDay.length);
      }
    });

    return { takenDoses, totalDoses };
  };

  // Separate medications into "Due Now" and "Upcoming"
  const getDueNowMeds = () => {
    return activeMedications.filter(med => {
      const status = getDoseStatus(med, intakeLogs);
      return status === 'due-soon' || status === 'overdue';
    });
  };

  const getUpcomingMeds = () => {
    return activeMedications.filter(med => {
      const status = getDoseStatus(med, intakeLogs);
      return status !== 'due-soon' && status !== 'overdue';
    });
  };

  const dueNowMeds = getDueNowMeds();
  const upcomingMeds = getUpcomingMeds();
  const adherence = getTodayAdherence();

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const handleMarkTaken = (medication: Medication) => {
    setSelectedMedication(medication);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedMedication(null);
  };

  const handleDetails = (medication: Medication) => {
    // Navigate to details (placeholder for now)
    console.log('View details for:', medication.name);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Today</Text>
          <Text style={[styles.headerDate, { color: theme.textSecondary }]}>
            {format(new Date(), 'EEEE, MMMM d')}
          </Text>
        </View>
      </View>

      {/* Daily Adherence Summary */}
      {adherence.totalDoses > 0 && (
        <View style={[styles.adherenceCard, { backgroundColor: theme.surface }]}>
          <Text style={[styles.adherenceLabel, { color: theme.textSecondary }]}>
            Today's Progress
          </Text>
          <Text style={[styles.adherenceValue, { color: theme.primary }]}>
            {adherence.takenDoses} / {adherence.totalDoses} doses taken
          </Text>
        </View>
      )}

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.primary} />
        }
      >
        {/* Due Now Section */}
        {dueNowMeds.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionHeading, { color: theme.text }]}>Due Now</Text>
            {dueNowMeds.map((medication) => (
              <MedicationCard
                key={medication.id}
                medication={medication}
                intakeLogs={intakeLogs}
                onMarkTaken={() => handleMarkTaken(medication)}
                onDetails={() => handleDetails(medication)}
              />
            ))}
          </View>
        )}

        {/* Upcoming Section */}
        {upcomingMeds.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionHeading, { color: theme.text }]}>Upcoming</Text>
            {upcomingMeds.map((medication) => (
              <MedicationCard
                key={medication.id}
                medication={medication}
                intakeLogs={intakeLogs}
                onMarkTaken={() => handleMarkTaken(medication)}
                onDetails={() => handleDetails(medication)}
              />
            ))}
          </View>
        )}

        {/* Empty State */}
        {activeMedications.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>
              No Medications Yet
            </Text>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              Tap the Add tab to create your first medication
            </Text>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      <MarkTakenModal
        visible={modalVisible}
        medication={selectedMedication}
        onClose={handleCloseModal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  headerTitle: {
    ...typography.title,
  },
  headerDate: {
    ...typography.bodySecondary,
    marginTop: spacing.xs,
  },
  adherenceCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
  },
  adherenceLabel: {
    ...typography.bodySecondary,
    marginBottom: spacing.xs,
  },
  adherenceValue: {
    ...typography.sectionHeading,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeading: {
    ...typography.sectionHeading,
    marginBottom: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxxl * 2,
  },
  emptyTitle: {
    ...typography.sectionHeading,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.bodySecondary,
    textAlign: 'center',
  },
  bottomPadding: {
    height: 120,
  },
});
