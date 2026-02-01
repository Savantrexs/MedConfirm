// Date and medication logic utilities
import { format, parseISO, addMinutes, isAfter, isBefore, isWithinInterval } from 'date-fns';
import { Medication, IntakeLog } from './storage';

export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes);
  return format(date, 'h:mm a');
};

export const formatDateTime = (dateTimeString: string): string => {
  return format(parseISO(dateTimeString), 'MMM d, h:mm a');
};

export const formatDate = (dateTimeString: string): string => {
  return format(parseISO(dateTimeString), 'MMM d, yyyy');
};

export const getTimeInMinutes = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

export const getCurrentTimeString = (): string => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
};

export const getNextDoseTime = (medication: Medication): { time: string; isToday: boolean } | null => {
  const now = new Date();
  const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
  const currentDay = now.getDay();
  
  const daysOfWeek = medication.daysOfWeek || [0, 1, 2, 3, 4, 5, 6];
  
  // Check if today is a valid day
  const isTodayValid = daysOfWeek.includes(currentDay);
  
  if (isTodayValid) {
    // Find next dose today
    for (const time of medication.timesPerDay) {
      const timeInMinutes = getTimeInMinutes(time);
      if (timeInMinutes > currentTimeInMinutes) {
        return { time, isToday: true };
      }
    }
  }
  
  // No more doses today, return first dose of next valid day
  if (medication.timesPerDay.length > 0) {
    return { time: medication.timesPerDay[0], isToday: false };
  }
  
  return null;
};

export const getDoseStatus = (
  medication: Medication,
  intakeLogs: IntakeLog[]
): 'due-soon' | 'overdue' | 'taken' | 'scheduled' => {
  const now = new Date();
  const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
  const currentDay = now.getDay();
  
  const daysOfWeek = medication.daysOfWeek || [0, 1, 2, 3, 4, 5, 6];
  
  if (!daysOfWeek.includes(currentDay)) {
    return 'scheduled';
  }
  
  // Find the closest scheduled time
  let closestTime: string | null = null;
  let closestDiff = Infinity;
  
  for (const time of medication.timesPerDay) {
    const timeInMinutes = getTimeInMinutes(time);
    const diff = Math.abs(timeInMinutes - currentTimeInMinutes);
    
    if (diff < closestDiff) {
      closestDiff = diff;
      closestTime = time;
    }
  }
  
  if (!closestTime) {
    return 'scheduled';
  }
  
  const closestTimeInMinutes = getTimeInMinutes(closestTime);
  
  // Check if taken within the window (-2 hours to +4 hours)
  const todayLogs = intakeLogs.filter(log => {
    const logDate = parseISO(log.takenAt);
    return (
      log.medicationId === medication.id &&
      format(logDate, 'yyyy-MM-dd') === format(now, 'yyyy-MM-dd')
    );
  });
  
  for (const log of todayLogs) {
    const logDate = parseISO(log.takenAt);
    const logTimeInMinutes = logDate.getHours() * 60 + logDate.getMinutes();
    
    // Check if log is within window of this dose time (-2 hours to +4 hours)
    if (
      logTimeInMinutes >= closestTimeInMinutes - 120 &&
      logTimeInMinutes <= closestTimeInMinutes + 240
    ) {
      return 'taken';
    }
  }
  
  // Check if due soon (within 30 minutes)
  if (closestTimeInMinutes >= currentTimeInMinutes - 30 && closestTimeInMinutes <= currentTimeInMinutes + 30) {
    return 'due-soon';
  }
  
  // Check if overdue (more than 30 minutes past)
  if (closestTimeInMinutes < currentTimeInMinutes - 30) {
    return 'overdue';
  }
  
  return 'scheduled';
};

export const getLastTakenTime = (medicationId: string, intakeLogs: IntakeLog[]): string | null => {
  const medLogs = intakeLogs
    .filter(log => log.medicationId === medicationId)
    .sort((a, b) => parseISO(b.takenAt).getTime() - parseISO(a.takenAt).getTime());
  
  return medLogs.length > 0 ? medLogs[0].takenAt : null;
};

export const wasRecentlyTaken = (medicationId: string, intakeLogs: IntakeLog[]): boolean => {
  const lastTaken = getLastTakenTime(medicationId, intakeLogs);
  if (!lastTaken) return false;
  
  const lastTakenDate = parseISO(lastTaken);
  const now = new Date();
  const diffInMinutes = (now.getTime() - lastTakenDate.getTime()) / 1000 / 60;
  
  return diffInMinutes < 60;
};

export const getDayOfWeekName = (day: number): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[day];
};

export const groupLogsByDate = (logs: IntakeLog[]): { [key: string]: IntakeLog[] } => {
  const grouped: { [key: string]: IntakeLog[] } = {};
  
  const sortedLogs = [...logs].sort((a, b) => 
    parseISO(b.takenAt).getTime() - parseISO(a.takenAt).getTime()
  );
  
  for (const log of sortedLogs) {
    const dateKey = format(parseISO(log.takenAt), 'yyyy-MM-dd');
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(log);
  }
  
  return grouped;
};

export const getDateLabel = (dateString: string): string => {
  const date = parseISO(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
    return 'Today';
  } else if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
    return 'Yesterday';
  } else {
    return format(date, 'EEEE, MMM d');
  }
};
