// Notification utilities
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Medication } from './storage';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

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

export const scheduleMedicationNotifications = async (medication: Medication): Promise<void> => {
  try {
    // Cancel existing notifications for this medication
    await cancelMedicationNotifications(medication.id);

    if (!medication.isActive) {
      return;
    }

    const daysOfWeek = medication.daysOfWeek || [0, 1, 2, 3, 4, 5, 6];

    for (const time of medication.timesPerDay) {
      const [hours, minutes] = time.split(':').map(Number);

      for (const dayOfWeek of daysOfWeek) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `Reminder: Take ${medication.name}`,
            body: medication.dosageText 
              ? `${medication.dosageText} • Tap to confirm`
              : 'Tap to confirm',
            data: { medicationId: medication.id },
          },
          trigger: {
            hour: hours,
            minute: minutes,
            weekday: dayOfWeek === 0 ? 1 : dayOfWeek + 1, // Expo uses 1-7 for Sun-Sat
            repeats: true,
          },
        });
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
