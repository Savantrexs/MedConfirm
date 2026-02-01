import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Medication,
  IntakeLog,
  Settings,
  getMedications,
  saveMedications,
  getIntakeLogs,
  saveIntakeLogs,
  getSettings,
  saveSettings,
  getAdSlots,
  isOnboardingComplete,
  initializeSampleData,
} from '../utils/storage';
import {
  scheduleMedicationNotifications,
  cancelMedicationNotifications,
  rescheduleAllNotifications,
  cancelAllNotifications,
} from '../utils/notifications';

interface AppContextType {
  medications: Medication[];
  intakeLogs: IntakeLog[];
  settings: Settings;
  adSlots: number;
  loading: boolean;
  onboardingComplete: boolean;
  addMedication: (medication: Medication) => Promise<void>;
  updateMedication: (medication: Medication) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  addIntakeLog: (log: IntakeLog) => Promise<void>;
  deleteIntakeLog: (id: string) => Promise<void>;
  updateSettings: (newSettings: Settings) => Promise<void>;
  unlockAdSlot: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [intakeLogs, setIntakeLogs] = useState<IntakeLog[]>([]);
  const [settings, setSettings] = useState<Settings>({
    remindersEnabled: true,
    darkMode: false,
    highContrast: false,
  });
  const [adSlots, setAdSlots] = useState(0);
  const [loading, setLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [meds, logs, setts, slots, onboarding] = await Promise.all([
        getMedications(),
        getIntakeLogs(),
        getSettings(),
        getAdSlots(),
        isOnboardingComplete(),
      ]);
      
      setMedications(meds);
      setIntakeLogs(logs);
      setSettings(setts);
      setAdSlots(slots);
      setOnboardingComplete(onboarding);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await initializeSampleData();
      await loadData();
    };
    initialize();
  }, []);

  const addMedication = async (medication: Medication) => {
    const updated = [...medications, medication];
    await saveMedications(updated);
    setMedications(updated);
    
    if (settings.remindersEnabled && medication.isActive) {
      await scheduleMedicationNotifications(medication);
    }
  };

  const updateMedication = async (medication: Medication) => {
    const updated = medications.map(m => m.id === medication.id ? medication : m);
    await saveMedications(updated);
    setMedications(updated);
    
    if (settings.remindersEnabled) {
      await scheduleMedicationNotifications(medication);
    }
  };

  const deleteMedication = async (id: string) => {
    const updated = medications.filter(m => m.id !== id);
    await saveMedications(updated);
    setMedications(updated);
    
    await cancelMedicationNotifications(id);
    
    // Also delete associated logs
    const updatedLogs = intakeLogs.filter(log => log.medicationId !== id);
    await saveIntakeLogs(updatedLogs);
    setIntakeLogs(updatedLogs);
  };

  const addIntakeLog = async (log: IntakeLog) => {
    const updated = [...intakeLogs, log];
    await saveIntakeLogs(updated);
    setIntakeLogs(updated);
  };

  const deleteIntakeLog = async (id: string) => {
    const updated = intakeLogs.filter(log => log.id !== id);
    await saveIntakeLogs(updated);
    setIntakeLogs(updated);
  };

  const updateSettings = async (newSettings: Settings) => {
    await saveSettings(newSettings);
    setSettings(newSettings);
    
    // Handle notification settings changes
    if (newSettings.remindersEnabled && !settings.remindersEnabled) {
      await rescheduleAllNotifications(medications);
    } else if (!newSettings.remindersEnabled && settings.remindersEnabled) {
      await cancelAllNotifications();
    }
  };

  const unlockAdSlot = async () => {
    const newSlots = adSlots + 1;
    setAdSlots(newSlots);
  };

  const refreshData = async () => {
    await loadData();
  };

  return (
    <AppContext.Provider
      value={{
        medications,
        intakeLogs,
        settings,
        adSlots,
        loading,
        onboardingComplete,
        addMedication,
        updateMedication,
        deleteMedication,
        addIntakeLog,
        deleteIntakeLog,
        updateSettings,
        unlockAdSlot,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};