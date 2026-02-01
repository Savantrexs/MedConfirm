# MedConfirm - Medication Tracking App

## Overview
MedConfirm is a cross-platform mobile app (iOS + Android) designed to help users track medication intake, prevent double-dosing, and receive scheduled reminders.

## ✅ Completed Features

### Core Functionality
- **Offline-First Architecture**: All data stored locally using AsyncStorage
- **No Authentication Required**: Simple, privacy-focused design
- **Sample Data**: Pre-loaded with Vitamin D (1000 IU at 09:00) and Antibiotic (500mg at 08:00 and 20:00)

### Screens Implemented
1. **Onboarding Screen**
   - Welcome message and feature highlights
   - Option to enable/disable reminders
   - One-time setup flow
   - Beautiful, accessible design

2. **Home Screen (Today View)**
   - Displays all active medications as cards
   - Shows next scheduled dose time
   - Displays last taken timestamp
   - Status badges: "Due Soon", "Overdue", "Taken", "Scheduled"
   - "Mark as Taken" button for each medication
   - "History" button for each medication
   - Floating Action Button (FAB) to add new medications
   - Pull-to-refresh functionality
   - Empty state for no medications

3. **Add/Edit Medication Screen**
   - Medication name (required)
   - Dosage text (optional, e.g., "500mg")
   - Instructions (optional, e.g., "After food")
   - Multiple times per day (required, e.g., "08:00", "20:00")
   - Days of week selector (all days by default)
   - Active/Inactive toggle
   - Mock rewarded ad for adding >2 medications
   - Full form validation

4. **Mark as Taken Modal**
   - Bottom sheet modal with smooth animation
   - Shows medication name and dosage
   - Optional note field
   - Confirms scheduled time
   - Warning if taken within last 60 minutes (prevents double-dosing)
   - Clean, intuitive design

5. **History Screen**
   - Filter by medication (chips UI)
   - Grouped by date (Today, Yesterday, dates)
   - Shows all intake logs with timestamps
   - Optional notes displayed
   - Delete individual logs with confirmation
   - Empty state when no logs

6. **Settings Screen**
   - Toggle reminders on/off
   - Dark mode toggle
   - High contrast mode toggle
   - Export data to CSV (mock rewarded ad)
   - App version and disclaimer
   - Clean sections with icons

### Key Features

#### Medication Logic
- **Next Dose Calculation**: Shows next upcoming dose time
- **Dose Status Detection**:
  - "Due Soon" - within 30 minutes of scheduled time
  - "Overdue" - more than 30 minutes past scheduled time
  - "Taken" - logged within the dose window (-2 hours to +4 hours)
  - "Scheduled" - upcoming dose
- **Double-Dose Prevention**: Warns if marking as taken within 60 minutes of last intake
- **Timezone Aware**: All times respect device local timezone

#### Notifications
- **Full Notification Scheduling**: Using expo-notifications
- **Scheduled Local Notifications**: For each medication time and selected days
- **Custom Notification Format**: "Reminder: Take [Medication Name]" with dosage
- **Permission Handling**: Requests notification permissions on first launch
- **Cancellation**: Removes notifications when medications are deleted or reminders disabled

#### Monetization (Mock Ads)
- **Free Tier**: Up to 2 active medications
- **Rewarded Video Ads**:
  - Watch ad to unlock additional medication slots
  - Watch ad to export data to CSV
  - Mock implementation (shows alert dialogs)
- **No Ads on Critical Screens**: Mark as Taken screen is ad-free

#### Design System
- **Calming Medical Theme**: Soft blues (#4A90E2) and whites
- **Large Text**: 16px+ body text for readability
- **Generous Spacing**: 8pt grid system (8px, 16px, 24px, 32px)
- **High Contrast Mode**: Enhanced visibility option
- **Dark Mode Support**: Automatic system detection + manual toggle
- **Accessible**: 44px minimum touch targets, clear icons
- **Responsive**: Works on all mobile screen sizes
- **Empty States**: Helpful messages when no data

### Technical Implementation

#### Tech Stack
- **React Native** with **Expo** (SDK 54)
- **Expo Router** for file-based navigation
- **TypeScript** for type safety
- **AsyncStorage** for local data persistence
- **expo-notifications** for scheduled reminders
- **date-fns** for date manipulation
- **react-native-uuid** for ID generation

#### Architecture
- **Context API**: AppContext for global state management
- **Utility Functions**: Separated logic for storage, notifications, date handling
- **Component-Based**: Reusable Button, MedicationCard, MarkTakenModal components
- **Theme System**: Centralized colors, typography, spacing, shadows

#### Data Models
```typescript
Medication {
  id: string
  name: string
  dosageText?: string
  instructions?: string
  timesPerDay: string[]  // ["08:00", "20:00"]
  daysOfWeek?: number[]  // [0-6] (Sun-Sat)
  startDate?: string
  isActive: boolean
}

IntakeLog {
  id: string
  medicationId: string
  takenAt: string  // ISO datetime
  note?: string
}

Settings {
  remindersEnabled: boolean
  darkMode: boolean
  highContrast: boolean
}
```

#### File Structure
```
/app/frontend/
├── app/
│   ├── _layout.tsx           # Root layout with AppProvider
│   ├── index.tsx             # Router (onboarding/home)
│   ├── onboarding.tsx        # Onboarding screen
│   ├── home.tsx              # Main home/today screen
│   ├── add-medication.tsx    # Add/edit medication form
│   ├── history.tsx           # Intake log history
│   └── settings.tsx          # Settings screen
├── components/
│   ├── Button.tsx            # Reusable button component
│   ├── MedicationCard.tsx    # Medication display card
│   └── MarkTakenModal.tsx    # Mark as taken modal
├── contexts/
│   └── AppContext.tsx        # Global state management
└── utils/
    ├── storage.ts            # AsyncStorage utilities
    ├── notifications.ts      # Notification scheduling
    ├── medicationLogic.ts    # Dose calculations
    └── theme.ts              # Design system
```

### Device Permissions (Configured in app.json)
- **iOS**: `NSUserNotificationsUsageDescription` - "Get reminders for your medication times"
- **Android**: 
  - `RECEIVE_BOOT_COMPLETED` - Restore notifications after reboot
  - `VIBRATE` - Vibrate on notification
  - `SCHEDULE_EXACT_ALARM` - Precise notification timing
  - `POST_NOTIFICATIONS` - Show notifications

## Testing

### Web Preview
The app is accessible via web preview at the configured URL. Core functionality works in web mode, though some features (like AsyncStorage persistence across sessions and notifications) work best on actual mobile devices.

### Mobile Testing
To test on a physical device:
1. Install Expo Go app from App Store or Google Play
2. Scan the QR code from the Expo dev server
3. App will load with full native functionality

## Known Limitations (Web Version)
- **AsyncStorage**: Data doesn't persist across page refreshes in web (works on mobile)
- **Notifications**: Not supported in web browser (works on mobile)
- **Navigation**: Some gesture-based navigation may not work in web

## Future Enhancements (Not Implemented)
- Real ad network integration (AdMob)
- Medication reminders with custom sounds
- Medication edit functionality
- Photo attachments for medications
- Export to other formats (PDF, JSON)
- Medication interaction warnings
- Pill counting/refill reminders
- Share data with healthcare providers

## Medical Disclaimer
This app is for tracking purposes only and does not provide medical advice. Users should consult healthcare professionals for medical decisions.

## App Version
**v1.0.0** - Complete MVP with all core features

---

## Development Notes

### Running the App
```bash
cd /app/frontend
yarn start
```

### Restarting Expo
```bash
sudo supervisorctl restart expo
```

### Key Design Decisions
1. **Offline-First**: No backend required, all data local for privacy and reliability
2. **Simple UX**: No complex onboarding, minimal taps to log medication
3. **Safety-First**: Double-dose warnings, clear visual status indicators
4. **Accessible**: Large text, high contrast option, clear icons
5. **Calming**: Medical blue theme to reduce anxiety around medication management
