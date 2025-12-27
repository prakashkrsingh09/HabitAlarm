import notifee, {
  AndroidImportance,
  TriggerType,
  RepeatFrequency,
  AuthorizationStatus,
} from '@notifee/react-native';

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    const settings = await notifee.requestPermission();
    if (settings.authorizationStatus < AuthorizationStatus.AUTHORIZED) {
      console.warn('Notification permission denied or not granted');
      return false;
    }
    return true;
  } catch (error) {
    console.warn('Error requesting notification permission', error);
    return false;
  }
}

export async function createChannel() {
  return notifee.createChannel({
    id: 'daily',
    name: 'Daily Reminders',
    importance: AndroidImportance.HIGH,
    sound: 'default',
    vibration: true,
  });
}

export async function scheduleDailyNotification(
  title: string,
  body: string,
  hour: number,
  minute: number,
): Promise<string> {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    throw new Error('Notification permission denied');
  }

  try {
    await createChannel();
  } catch (error) {
    console.warn('Failed to create notification channel', error);
    // Continue anyway, channel might already exist
  }

  try {
    const notificationId = await notifee.createTriggerNotification(
      {
        title: title,
        body: body,
        android: {
          channelId: 'daily',
          smallIcon: 'ic_launcher_foreground', // Uses app launcher foreground icon
        },
        ios: {
          categoryId: 'daily',
        },
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp: getNextTrigger(hour, minute),
        repeatFrequency: RepeatFrequency.DAILY,
      },
    );

    return notificationId;
  } catch (error) {
    console.error('Failed to create trigger notification', error);
    throw error;
  }
}

export async function cancelNotification(notificationId: string) {
  try {
    await notifee.cancelNotification(notificationId);
  } catch (error) {
    console.warn('Failed to cancel notification', error);
  }
}

export async function cancelAllNotifications() {
  try {
    await notifee.cancelAllNotifications();
  } catch (error) {
    console.warn('Failed to cancel all notifications', error);
  }
}

export async function rescheduleAllNotifications(
  activities: Array<{
    id: string;
    title: string;
    reminderHour: number;
    reminderMinute: number;
    notificationId?: string;
    startDate: string;
    endDate?: string;
  }>,
): Promise<Record<string, string>> {
  // Request permission first
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) {
    console.warn('Notification permission not granted, cannot reschedule notifications');
    return {};
  }

  // Create channel
  try {
    await createChannel();
  } catch (error) {
    console.warn('Failed to create notification channel', error);
    // Continue anyway, channel might already exist
  }

  const notificationIds: Record<string, string> = {};

  // Cancel all existing notifications first to avoid duplicates
  try {
    await cancelAllNotifications();
  } catch (error) {
    console.warn('Failed to cancel existing notifications', error);
  }

  // Re-schedule notifications for all activities
  for (const activity of activities) {
    try {
      // Check if activity is still active (within date range)
      const today = new Date().toLocaleDateString('en-CA');
      if (activity.startDate > today) {
        // Activity hasn't started yet, skip
        continue;
      }
      if (activity.endDate && activity.endDate < today) {
        // Activity has ended, skip
        continue;
      }

      const notificationId = await scheduleDailyNotification(
        activity.title,
        'Time to complete your activity',
        activity.reminderHour,
        activity.reminderMinute,
      );
      notificationIds[activity.id] = notificationId;
    } catch (error) {
      console.warn(
        `Failed to reschedule notification for activity ${activity.id}:`,
        error,
      );
    }
  }

  return notificationIds;
}

function getNextTrigger(hour: number, minute: number) {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  if (date.getTime() <= Date.now()) {
    date.setDate(date.getDate() + 1);
  }
  return date.getTime();
}
