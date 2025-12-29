# HabitAlarm 📱

A React Native mobile application for creating and managing habit reminders with scheduled notifications. Track your daily activities and get timely reminders to help build consistent habits.

## 📋 Features

- ✅ **Activity Management**: Create, view, and delete activities with custom titles and descriptions
- 📅 **Date Range Selection**: Set start and end dates for your activities using an intuitive calendar interface
- ⏰ **Custom Reminders**: Set specific reminder times (hour and minute) for each activity
- 🔔 **Push Notifications**: Receive daily recurring notifications at your specified times
- 💾 **Data Persistence**: All activities are saved locally and persist across app restarts
- 🔄 **Auto Re-scheduling**: Notifications are automatically re-scheduled when the app restarts
- 📊 **Activity Tracking**: Track completion status for each activity by date
- 🎨 **Modern UI**: Clean and user-friendly interface built with React Native Paper

## 🛠️ Tech Stack

- **Framework**: React Native 0.83.1
- **Language**: TypeScript 5.8.3
- **State Management**: Zustand 5.0.9 (with persistence)
- **Storage**: AsyncStorage
- **Notifications**: @notifee/react-native 9.1.8
- **UI Libraries**:
  - react-native-paper
  - react-native-vector-icons
  - react-native-calendars
  - @react-native-community/datetimepicker

## 📦 Prerequisites

- Node.js >= 20
- React Native development environment set up
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

## 🚀 Installation

1. **Clone the repository**
   ```sh
   git clone <repository-url>
   cd HabitAlarm
   ```

2. **Install dependencies**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **iOS Setup** (macOS only)
   ```sh
   # Install CocoaPods dependencies
   bundle install
   bundle exec pod install
   ```

## 🏃 Running the App

### Start Metro Bundler
```sh
npm start
# or
yarn start
```

### Run on Android
```sh
npm run android
# or
yarn android
```

### Run on iOS
```sh
npm run ios
# or
yarn ios
```

## 📱 Usage

### Creating an Activity

1. Tap the **+** button in the top right corner
2. Enter an activity title (required)
3. Add an optional description
4. Select a frequency (Daily, Weekly, or Hourly)
5. Choose start and end dates using the calendar picker
6. Set your reminder time
7. Tap "Save Activity"

### Managing Activities

- **View Details**: Tap on any activity to view its details
- **Delete Activity**: Tap the delete icon on any activity card
- **Notifications**: Notifications are automatically scheduled when you create an activity

### Notifications

- Notifications are scheduled daily at your specified reminder time
- Only active activities (within their date range) receive notifications
- Notifications are automatically re-scheduled when you restart the app
- Make sure to grant notification permissions when prompted

## 📁 Project Structure

```
HabitAlarm/
├── src/
│   ├── components/
│   │   ├── AddActivityModal.tsx      # Modal for creating activities
│   │   ├── DateRangeReminderModal.tsx # Calendar date range picker
│   │   ├── DatePickerInput.tsx        # Date picker component
│   │   └── TimePickerInput.tsx        # Time picker component
│   ├── service/
│   │   └── notificationService.ts     # Notification scheduling logic
│   ├── store/
│   │   └── activityStore.ts           # Zustand store with persistence
│   ├── types/
│   │   └── Activity.ts                # TypeScript type definitions
│   └── utils/
│       ├── date.ts                    # Date utility functions
│       └── themes.ts                  # App color themes
├── android/                           # Android native code
├── ios/                               # iOS native code
├── App.tsx                            # Main app component
└── package.json
```

## 🔧 Available Scripts

- `npm start` - Start Metro bundler
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS simulator/device
- `npm test` - Run tests
- `npm run lint` - Lint code with ESLint

## 🔔 Notification Features

- **Daily Recurring**: Notifications repeat every day at the specified time
- **Smart Scheduling**: Only schedules notifications for activities within their active date range
- **Auto Recovery**: Automatically re-schedules all notifications when the app restarts
- **Permission Handling**: Gracefully handles notification permission requests

## 💾 Data Storage

- All activities are stored locally using AsyncStorage
- Data persists across app restarts
- No internet connection required
- Data is stored in JSON format

## 🐛 Troubleshooting

### Notifications Not Firing

1. **Check Permissions**: Ensure notification permissions are granted in device settings
2. **Battery Optimization**: Disable battery optimization for the app (Android)
3. **Time Check**: Make sure the reminder time hasn't already passed for today (it will fire tomorrow)
4. **Date Range**: Verify the activity is within its start and end date range

### Build Issues

- **Android**: Clean build folder: `cd android && ./gradlew clean && cd ..`
- **iOS**: Clean build: `cd ios && rm -rf build && cd ..`
- **Metro**: Reset cache: `npm start -- --reset-cache`

### Common Issues

- **Pod Install**: If iOS build fails, run `bundle exec pod install` in the `ios` directory
- **Node Version**: Ensure you're using Node.js >= 20
- **Watchman**: Install Watchman for better file watching: `brew install watchman` (macOS)

## 📝 Development Notes

- Date format: Uses `toLocaleDateString('en-CA')` which returns `YYYY-MM-DD` format
- State management: Uses Zustand with persistence middleware
- Notifications: Uses Notifee for cross-platform notification support
- Icons: Material Icons from react-native-vector-icons

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- React Native community
- Notifee for notification support
- Zustand for state management

---

Made with ❤️ using React Native
