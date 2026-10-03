import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  NOTIFICATION_TYPES,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_SCHEDULES,
  DEFAULT_NOTIFICATION_SETTINGS,
  parseNotificationSettings,
} from './notificationConfig.cjs';

const SETTINGS_STORAGE_KEY = 'vmh_notification_settings_v1';

// Setup foreground notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function ensureAndroidNotificationChannels() {
  if (Platform.OS !== 'android') {
    return;
  }

  // 1. Daily expense reminder channel
  await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNELS.DAILY, {
    name: 'Nhắc nhở ghi chi tiêu hằng ngày',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FFE600',
  });

  // 2. Financial discipline warning channel (Night sale FOMO)
  await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNELS.WARNINGS, {
    name: 'Cảnh báo kỷ luật & bão sale đêm',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 350, 150, 350],
    lightColor: '#FF5C5C',
  });
}

export async function requestNotificationPermission() {
  if (Platform.OS === 'web') {
    return { granted: true, status: 'granted' };
  }

  await ensureAndroidNotificationChannels();

  const currentPermissions = await Notifications.getPermissionsAsync();
  const finalPermissions = currentPermissions.granted
    ? currentPermissions
    : await Notifications.requestPermissionsAsync();

  return {
    granted: finalPermissions.granted,
    status: finalPermissions.status,
  };
}

export async function getNotificationSettings() {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
    return parseNotificationSettings(raw);
  } catch {
    return { ...DEFAULT_NOTIFICATION_SETTINGS };
  }
}

export async function saveNotificationSettings(settings) {
  const safe = {
    dailyExpense: Boolean(settings?.dailyExpense),
    nightSaleWarning: Boolean(settings?.nightSaleWarning),
  };
  try {
    await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(safe));
  } catch (err) {
    console.warn('[Notifications] Failed to persist settings:', err);
  }
  return safe;
}

export async function cancelNotificationByType(reminderType) {
  if (Platform.OS === 'web') return;

  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    const targets = scheduled.filter(
      (item) => item?.content?.data?.reminderType === reminderType
    );

    await Promise.all(
      targets.map((item) => Notifications.cancelScheduledNotificationAsync(item.identifier))
    );
  } catch (err) {
    console.warn('[Notifications] Cancel failed for type:', reminderType, err);
  }
}

export async function scheduleDailyExpenseReminder(customTime) {
  if (Platform.OS === 'web') return null;

  await ensureAndroidNotificationChannels();
  await cancelNotificationByType(NOTIFICATION_TYPES.DAILY_EXPENSE);

  const conf = NOTIFICATION_SCHEDULES.dailyExpense;
  const hour = customTime?.hour ?? conf.hour;
  const minute = customTime?.minute ?? conf.minute;

  return Notifications.scheduleNotificationAsync({
    content: {
      title: conf.title,
      body: conf.body,
      data: {
        reminderType: conf.type,
        hour,
        minute,
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      channelId: conf.channelId,
      hour,
      minute,
    },
  });
}

export async function scheduleNightSaleWarning(customTime) {
  if (Platform.OS === 'web') return null;

  await ensureAndroidNotificationChannels();
  await cancelNotificationByType(NOTIFICATION_TYPES.NIGHT_SALE_WARNING);

  const conf = NOTIFICATION_SCHEDULES.nightSaleWarning;
  const hour = customTime?.hour ?? conf.hour;
  const minute = customTime?.minute ?? conf.minute;

  return Notifications.scheduleNotificationAsync({
    content: {
      title: conf.title,
      body: conf.body,
      data: {
        reminderType: conf.type,
        hour,
        minute,
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      channelId: conf.channelId,
      hour,
      minute,
    },
  });
}

export async function scheduleTestReminder(type = 'daily') {
  if (Platform.OS === 'web') {
    return 'web-simulated-notification';
  }

  await ensureAndroidNotificationChannels();
  const isSale = type === 'sale';
  const conf = isSale
    ? NOTIFICATION_SCHEDULES.nightSaleWarning
    : NOTIFICATION_SCHEDULES.dailyExpense;

  return Notifications.scheduleNotificationAsync({
    content: {
      title: `[TEST 5S] ${conf.title}`,
      body: conf.body,
      data: {
        reminderType: NOTIFICATION_TYPES.TEST_REMINDER,
        originalType: conf.type,
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      channelId: conf.channelId,
      seconds: 5,
    },
  });
}

export async function syncAllDisciplineNotifications(settings) {
  const currentSettings = settings || (await getNotificationSettings());

  // 1. Daily expense reminder (20:00)
  if (currentSettings.dailyExpense) {
    await scheduleDailyExpenseReminder();
  } else {
    await cancelNotificationByType(NOTIFICATION_TYPES.DAILY_EXPENSE);
  }

  // 2. Night sale warning (22:45)
  if (currentSettings.nightSaleWarning) {
    await scheduleNightSaleWarning();
  } else {
    await cancelNotificationByType(NOTIFICATION_TYPES.NIGHT_SALE_WARNING);
  }

  return currentSettings;
}

export {
  NOTIFICATION_TYPES,
  NOTIFICATION_SCHEDULES,
  DEFAULT_NOTIFICATION_SETTINGS,
};
