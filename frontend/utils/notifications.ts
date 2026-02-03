// Enhanced notification utilities with repeat logic
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Medication } from './storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REPEAT_NOTIFICATION_KEY = '@medconfirm_repeat_notifications';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

interface RepeatNotificationState {
  medicationId: string;
  scheduledTime: string;
  repeatInterval: number; // in minutes
  notificationIds: string[];
}

export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === 'granted';
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

// Save repeat notification state
const saveRepeatState = async (state: RepeatNotificationState[]) => {
  try {
    await AsyncStorage.setItem(REPEAT_NOTIFICATION_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving repeat state:', error);
  }
};

// Get repeat notification state
const getRepeatState = async (): Promise<RepeatNotificationState[]> => {
  try {
    const data = await AsyncStorage.getItem(REPEAT_NOTIFICATION_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting repeat state:', error);
    return [];
  }
};

// Get repeat interval in minutes
const getRepeatInterval = (reminderMode?: string): number | null => {
  switch (reminderMode) {
    case 'every5':
      return 5;
    case 'every10':
      return 10;
    case 'every15':
      return 15;
    default:
      return null; // 'once' mode
  }
};

export const scheduleMedicationNotifications = async (medication: Medication): Promise<void> => {
  try {
    // Cancel existing notifications for this medication
    await cancelMedicationNotifications(medication.id);

    if (!medication.isActive) {
      return;
    }

    const daysOfWeek = medication.daysOfWeek || [0, 1, 2, 3, 4, 5, 6];
    const repeatInterval = getRepeatInterval(medication.reminderMode);

    for (const time of medication.timesPerDay) {
      const [hours, minutes] = time.split(':').map(Number);

      for (const dayOfWeek of daysOfWeek) {
        // Schedule initial notification
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Medication Reminder',
            body: `Have you taken ${medication.name}?`,
            data: { 
              medicationId: medication.id,
              scheduledTime: time,
              isRepeat: false,
            },
          },
          trigger: {
            hour: hours,
            minute: minutes,
            weekday: dayOfWeek === 0 ? 1 : dayOfWeek + 1, // Expo uses 1-7 for Sun-Sat
            repeats: true,
          },
        });

        // If repeat mode is enabled, schedule repeat notifications
        if (repeatInterval) {
          // Schedule up to 12 repeats (1 hour max for 5 min intervals)
          for (let i = 1; i <= 12; i++) {
            const repeatMinute = (minutes + (i * repeatInterval)) % 60;
            const repeatHour = hours + Math.floor((minutes + (i * repeatInterval)) / 60);
            
            if (repeatHour < 24) {
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: 'Medication Reminder',
                  body: `Have you taken ${medication.name}?`,
                  data: { 
                    medicationId: medication.id,
                    scheduledTime: time,
                    isRepeat: true,
                    repeatNumber: i,
                  },
                },
                trigger: {
                  hour: repeatHour,
                  minute: repeatMinute,
                  weekday: dayOfWeek === 0 ? 1 : dayOfWeek + 1,
                  repeats: true,
                },
              });
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error scheduling notifications:', error);
  }
};

export const cancelMedicationNotifications = async (medicationId: string): Promise<void> => {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const toCancel = scheduled.filter(
      (notification) => notification.content.data?.medicationId === medicationId
    );
    
    for (const notification of toCancel) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  } catch (error) {
    console.error('Error canceling notifications:', error);
  }
};

// Cancel repeat notifications for a specific dose time after medication is taken
export const cancelRepeatNotificationsForDose = async (
  medicationId: string, 
  scheduledTime: string
): Promise<void> => {
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Find all repeat notifications for this medication and scheduled time
    const toCancel = scheduled.filter((notification) => {
      const data = notification.content.data;
      if (!data) return false;
      
      return (
        data.medicationId === medicationId &&
        data.scheduledTime === scheduledTime &&
        data.isRepeat === true
      );
    });
    
    // Cancel all repeat notifications
    for (const notification of toCancel) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
    
    console.log(`Cancelled ${toCancel.length} repeat notifications for ${medicationId} at ${scheduledTime}`);
  } catch (error) {
    console.error('Error canceling repeat notifications:', error);
  }
};

export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error canceling all notifications:', error);
  }
};

export const rescheduleAllNotifications = async (medications: Medication[]): Promise<void> => {
  try {
    await cancelAllNotifications();
    for (const medication of medications) {
      if (medication.isActive) {
        await scheduleMedicationNotifications(medication);
      }
    }
  } catch (error) {
    console.error('Error rescheduling notifications:', error);
  }
};
