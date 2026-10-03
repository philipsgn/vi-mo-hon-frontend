const test = require('node:test');
const assert = require('node:assert/strict');
const {
  PREMIUM_PLAN_INFO,
  getPremiumBadge,
  getDailyTicketLimit,
  formatFreezeStreakStatus,
} = require('../src/utils/premiumHelper.cjs');

test('PREMIUM_PLAN_INFO has correct price and benefits', () => {
  assert.equal(PREMIUM_PLAN_INFO.price, 29000);
  assert.equal(PREMIUM_PLAN_INFO.priceText, '29.000đ / tháng');
  assert.ok(PREMIUM_PLAN_INFO.benefits.length >= 3);
  assert.ok(PREMIUM_PLAN_INFO.benefits.some((b) => b.includes('5 vé')));
  assert.ok(PREMIUM_PLAN_INFO.benefits.some((b) => b.includes('Đóng Băng Streak')));
});

test('getPremiumBadge distinguishes free vs premium', () => {
  const freeBadge = getPremiumBadge(false);
  assert.equal(freeBadge.isPremium, false);
  assert.equal(freeBadge.label, 'GÓI TIÊU CHUẨN');

  const premiumBadge = getPremiumBadge(true);
  assert.equal(premiumBadge.isPremium, true);
  assert.equal(premiumBadge.label, 'PREMIUM VIP');
  assert.equal(premiumBadge.color, '#FFE600');
});

test('getDailyTicketLimit grants 3 for free and 5 for premium', () => {
  assert.equal(getDailyTicketLimit(false), 3);
  assert.equal(getDailyTicketLimit(true), 5);
});

test('formatFreezeStreakStatus locks for free users', () => {
  const status = formatFreezeStreakStatus(false, 0);
  assert.equal(status.canFreeze, false);
  assert.equal(status.badge, 'Khóa tính năng');
  assert.match(status.text, /Nâng cấp Premium/i);
});

test('formatFreezeStreakStatus allows freezing for premium user with remaining uses', () => {
  const status2 = formatFreezeStreakStatus(true, 2);
  assert.equal(status2.canFreeze, true);
  assert.equal(status2.left, 2);
  assert.equal(status2.badge, '2/2 lượt');
  assert.equal(status2.buttonLabel, 'Kích hoạt Đóng Băng Streak');

  const status1 = formatFreezeStreakStatus(true, 1);
  assert.equal(status1.canFreeze, true);
  assert.equal(status1.left, 1);
  assert.equal(status1.badge, '1/2 lượt');
});

test('formatFreezeStreakStatus blocks freezing when premium user exhausts quota', () => {
  const status0 = formatFreezeStreakStatus(true, 0);
  assert.equal(status0.canFreeze, false);
  assert.equal(status0.left, 0);
  assert.equal(status0.badge, '0/2 lượt');
  assert.match(status0.text, /hết 2\/2 lượt/i);
});
