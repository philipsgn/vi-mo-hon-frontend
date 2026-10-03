/**
 * Pure configuration and formatting logic for Local Push Notifications.
 * CommonJS compatible for Node.js test runners and React Native bundlers.
 */

const NOTIFICATION_TYPES = {
  DAILY_EXPENSE: 'daily-expense-reminder',
  NIGHT_SALE_WARNING: 'night-sale-warning',
  TEST_REMINDER: 'test-reminder',
};

const NOTIFICATION_CHANNELS = {
  DAILY: 'daily-expense-reminders',
  WARNINGS: 'financial-discipline-warnings',
};

const NOTIFICATION_SCHEDULES = {
  dailyExpense: {
    type: NOTIFICATION_TYPES.DAILY_EXPENSE,
    channelId: NOTIFICATION_CHANNELS.DAILY,
    hour: 20,
    minute: 0,
    label: 'Nhắc ghi chi tiêu buổi tối (20:00)',
    title: 'Ví Mỏ Hỗn nhắc nhẹ ⏰',
    body: 'Hôm nay tiêu gì rồi hả chiến binh? Vào ghi nhanh trước khi não bạn xóa lịch sử nha!',
  },
  nightSaleWarning: {
    type: NOTIFICATION_TYPES.NIGHT_SALE_WARNING,
    channelId: NOTIFICATION_CHANNELS.WARNINGS,
    hour: 22,
    minute: 45,
    label: 'Cảnh báo bão sale đêm khuya (22:45)',
    title: 'CẢNH BÁO BÃO SALE ĐÊM ⚠️',
    body: 'Shopee/TikTok đang vẫy gọi đúng không? Đi ngủ ngay, đừng để sáng mai thức dậy với chiếc ví trống rỗng!',
  },
};

const DEFAULT_NOTIFICATION_SETTINGS = {
  dailyExpense: true,
  nightSaleWarning: true,
};

function formatTimeDisplay(hour, minute) {
  const h = Number.isFinite(hour) ? Math.max(0, Math.min(23, Number(hour))) : 0;
  const m = Number.isFinite(minute) ? Math.max(0, Math.min(59, Number(minute))) : 0;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function parseNotificationSettings(storedJson) {
  if (!storedJson || typeof storedJson !== 'string') {
    return { ...DEFAULT_NOTIFICATION_SETTINGS };
  }

  try {
    const parsed = JSON.parse(storedJson);
    return {
      dailyExpense: typeof parsed.dailyExpense === 'boolean' ? parsed.dailyExpense : DEFAULT_NOTIFICATION_SETTINGS.dailyExpense,
      nightSaleWarning: typeof parsed.nightSaleWarning === 'boolean' ? parsed.nightSaleWarning : DEFAULT_NOTIFICATION_SETTINGS.nightSaleWarning,
    };
  } catch {
    return { ...DEFAULT_NOTIFICATION_SETTINGS };
  }
}

function getNotificationSummary(settings) {
  const safe = settings || DEFAULT_NOTIFICATION_SETTINGS;
  const activeCount = (safe.dailyExpense ? 1 : 0) + (safe.nightSaleWarning ? 1 : 0);
  if (activeCount === 2) {
    return 'Đang bật cả 2 nhắc nhở kỷ luật (20:00 & 22:45)';
  }
  if (activeCount === 1) {
    return safe.dailyExpense ? 'Đang bật nhắc ghi chi tiêu (20:00)' : 'Đang bật cảnh báo bão sale (22:45)';
  }
  return 'Đang tắt toàn bộ thông báo nhắc nhở';
}

module.exports = {
  NOTIFICATION_TYPES,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_SCHEDULES,
  DEFAULT_NOTIFICATION_SETTINGS,
  formatTimeDisplay,
  parseNotificationSettings,
  getNotificationSummary,
};
