import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useApp } from '../../contexts/AppContext';
import { MedicationCard } from '../../components/MedicationCard';
import { MarkTakenModal } from '../../components/MarkTakenModal';
import { useTheme, spacing, typography } from '../../utils/theme';
import { Medication } from '../../utils/storage';

export default function HomeScreen() {
  const theme = useTheme();
  const { medications, intakeLogs, refreshData, loading } = useApp();
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const activeMedications = medications.filter(m => m.isActive);

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Today</Text>
          <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
            {format(new Date(), 'EEEE, MMM d')}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={\n          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />\n        }
      >
        {activeMedications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="medical-outline" size={64} color={theme.textTertiary} />
            <Text style={[styles.emptyTitle, { color: theme.text }]}>\n              No Medications Yet\n            </Text>
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>\n              Tap Add tab to create your first medication\n            </Text>
          </View>
        ) : (
          <View style={styles.medicationsList}>
            {activeMedications.map((medication) => (
              <MedicationCard
                key={medication.id}
                medication={medication}
                intakeLogs={intakeLogs}
                onMarkTaken={() => handleMarkTaken(medication)}
                onViewHistory={() => {}}
              />
            ))}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    ...typography.h1,
  },
  headerSubtitle: {
    ...typography.body,
    marginTop: spacing.xs,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
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
  medicationsList: {
    paddingTop: spacing.sm,
  },
  bottomPadding: {
    height: 100,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 64,
    height: 64,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});