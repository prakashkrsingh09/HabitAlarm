import notifee, {
  AndroidImportance,
  TriggerType,
  RepeatFrequency,
  AuthorizationStatus,
} from '@notifee/react-native';

export async function requestNotificationPermission() {
  const settings = await notifee.requestPermission();

  console.log('Notification settings:', settings);
  console.log('Authorization status:', AuthorizationStatus);

  if (settings.authorizationStatus < AuthorizationStatus.AUTHORIZED) {
    throw new Error('Notification permission denied');
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
  await requestNotificationPermission();
  await createChannel();

  const notificationId = await notifee.createTriggerNotification(
    {
      title: title,
      body: body,
      android: {
        channelId: 'daily',
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

function getNextTrigger(hour: number, minute: number) {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  if (date.getTime() <= Date.now()) {
    date.setDate(date.getDate() + 1);
  }
  return date.getTime();
}
