// Storage utilities for medications and intake logs
import AsyncStorage from '@react-native-async-storage/async-storage';

const MEDICATIONS_KEY = '@medconfirm_medications';
const INTAKE_LOGS_KEY = '@medconfirm_intake_logs';
const ONBOARDING_KEY = '@medconfirm_onboarding_complete';
const SETTINGS_KEY = '@medconfirm_settings';
const AD_SLOTS_KEY = '@medconfirm_ad_slots';

export interface Medication {
  id: string;
  name: string;
  dosageText?: string;
  instructions?: string;
  timesPerDay: string[]; // e.g., ["08:00", "20:00"]
  daysOfWeek?: number[]; // 0-6 (Sun-Sat), default all days
  startDate?: string;
  isActive: boolean;
  reminderMode?: 'once' | 'every5' | 'every10' | 'every15'; // Notification repeat mode
}

export interface IntakeLog {
  id: string;
  medicationId: string;
  takenAt: string; // ISO datetime
  note?: string;
}

export interface Settings {
  remindersEnabled: boolean;
  darkMode: boolean;
  highContrast: boolean;
}

// Medications
export const saveMedications = async (medications: Medication[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(MEDICATIONS_KEY, JSON.stringify(medications));
  } catch (error) {
    console.error('Error saving medications:', error);
  }
};

export const getMedications = async (): Promise<Medication[]> => {
  try {
    const data = await AsyncStorage.getItem(MEDICATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting medications:', error);
    return [];
  }
};

// Intake Logs
export const saveIntakeLogs = async (logs: IntakeLog[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(INTAKE_LOGS_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error('Error saving intake logs:', error);
  }
};

export const getIntakeLogs = async (): Promise<IntakeLog[]> => {
  try {
    const data = await AsyncStorage.getItem(INTAKE_LOGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting intake logs:', error);
    return [];
  }
};

// Onboarding
export const setOnboardingComplete = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  } catch (error) {
    console.error('Error setting onboarding complete:', error);
  }
};

export const isOnboardingComplete = async (): Promise<boolean> => {
  try {
    const data = await AsyncStorage.getItem(ONBOARDING_KEY);
    return data === 'true';
  } catch (error) {
    console.error('Error checking onboarding:', error);
    return false;
  }
};

// Settings
export const saveSettings = async (settings: Settings): Promise<void> => {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export const getSettings = async (): Promise<Settings> => {
  try {
    const data = await AsyncStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : {
      remindersEnabled: true,
      darkMode: false,
      highContrast: false,
    };
  } catch (error) {
    console.error('Error getting settings:', error);
    return {
      remindersEnabled: true,
      darkMode: false,
      highContrast: false,
    };
  }
};

// Ad Slots (number of additional medication slots unlocked)
export const getAdSlots = async (): Promise<number> => {
  try {
    const data = await AsyncStorage.getItem(AD_SLOTS_KEY);
    return data ? parseInt(data, 10) : 0;
  } catch (error) {
    console.error('Error getting ad slots:', error);
    return 0;
  }
};

export const addAdSlot = async (): Promise<void> => {
  try {
    const current = await getAdSlots();
    await AsyncStorage.setItem(AD_SLOTS_KEY, String(current + 1));
  } catch (error) {
    console.error('Error adding ad slot:', error);
  }
};

// Initialize sample data
export const initializeSampleData = async (): Promise<void> => {
  const meds = await getMedications();
  if (meds.length === 0) {
    const sampleMedications: Medication[] = [
      {
        id: 'sample-1',
        name: 'Vitamin D',
        dosageText: '1000 IU',
        instructions: '',
        timesPerDay: ['09:00'],
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        isActive: true,
        reminderMode: 'once',
      },
      {
        id: 'sample-2',
        name: 'Antibiotic',
        dosageText: '500mg',
        instructions: 'After food',
        timesPerDay: ['08:00', '20:00'],
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        isActive: true,
        reminderMode: 'every5',
      },
    ];
    await saveMedications(sampleMedications);
  }
};
