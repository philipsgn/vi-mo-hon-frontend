const test = require('node:test');
const assert = require('node:assert/strict');
const {
  NOTIFICATION_TYPES,
  NOTIFICATION_SCHEDULES,
  DEFAULT_NOTIFICATION_SETTINGS,
  formatTimeDisplay,
  parseNotificationSettings,
  getNotificationSummary,
} = require('../src/utils/notificationConfig.cjs');

test('NOTIFICATION_SCHEDULES has 20:00 daily reminder and 22:45 sale warning', () => {
  const daily = NOTIFICATION_SCHEDULES.dailyExpense;
  assert.equal(daily.hour, 20);
  assert.equal(daily.minute, 0);
  assert.equal(daily.type, NOTIFICATION_TYPES.DAILY_EXPENSE);
  assert.ok(daily.title.includes('nhắc nhẹ'));
  assert.ok(daily.body.includes('não bạn xóa lịch sử'));

  const sale = NOTIFICATION_SCHEDULES.nightSaleWarning;
  assert.equal(sale.hour, 22);
  assert.equal(sale.minute, 45);
  assert.equal(sale.type, NOTIFICATION_TYPES.NIGHT_SALE_WARNING);
  assert.ok(sale.title.includes('BÃO SALE ĐÊM'));
  assert.ok(sale.body.includes('Shopee/TikTok'));
});

test('formatTimeDisplay formats hours and minutes properly with padding', () => {
  assert.equal(formatTimeDisplay(20, 0), '20:00');
  assert.equal(formatTimeDisplay(22, 45), '22:45');
  assert.equal(formatTimeDisplay(9, 5), '09:05');
  assert.equal(formatTimeDisplay(null, undefined), '00:00');
});

test('parseNotificationSettings handles valid, invalid, and empty storage', () => {
  // Empty
  assert.deepEqual(parseNotificationSettings(null), DEFAULT_NOTIFICATION_SETTINGS);
  assert.deepEqual(parseNotificationSettings(''), DEFAULT_NOTIFICATION_SETTINGS);

  // Invalid JSON
  assert.deepEqual(parseNotificationSettings('{bad-json'), DEFAULT_NOTIFICATION_SETTINGS);

  // Partial or customized JSON
  const custom = JSON.stringify({ dailyExpense: false, nightSaleWarning: true });
  assert.deepEqual(parseNotificationSettings(custom), {
    dailyExpense: false,
    nightSaleWarning: true,
  });
});

test('getNotificationSummary generates friendly Vietnamese summary string', () => {
  assert.equal(
    getNotificationSummary({ dailyExpense: true, nightSaleWarning: true }),
    'Đang bật cả 2 nhắc nhở kỷ luật (20:00 & 22:45)'
  );
  assert.equal(
    getNotificationSummary({ dailyExpense: true, nightSaleWarning: false }),
    'Đang bật nhắc ghi chi tiêu (20:00)'
  );
  assert.equal(
    getNotificationSummary({ dailyExpense: false, nightSaleWarning: true }),
    'Đang bật cảnh báo bão sale (22:45)'
  );
  assert.equal(
    getNotificationSummary({ dailyExpense: false, nightSaleWarning: false }),
    'Đang tắt toàn bộ thông báo nhắc nhở'
  );
});
