const test = require('node:test');
const assert = require('node:assert/strict');

const {
  COIN_SHOP_ITEMS,
  LEVEL_UP_GUIDE,
  DISCIPLINE_GUIDE,
  checkDailyCheckinStatus,
  calculateLevelProgress,
  executeDailyCheckin,
  redeemCoinShopItem,
} = require('../src/utils/gameEconomyHelper.cjs');

test('calculateLevelProgress calculates level and XP in level accurately', () => {
  // 0 XP -> Lv.1, 0/100
  const p0 = calculateLevelProgress(0);
  assert.equal(p0.level, 1);
  assert.equal(p0.xpInCurrentLevel, 0);
  assert.equal(p0.xpToNextLevel, 100);

  // 45 XP -> Lv.1, 45/100
  const p1 = calculateLevelProgress(45);
  assert.equal(p1.level, 1);
  assert.equal(p1.xpInCurrentLevel, 45);
  assert.equal(p1.xpToNextLevel, 55);

  // 100 XP -> Lv.2, 0/100
  const p2 = calculateLevelProgress(100);
  assert.equal(p2.level, 2);
  assert.equal(p2.xpInCurrentLevel, 0);

  // 280 XP -> Lv.3, 80/100
  const p3 = calculateLevelProgress(280);
  assert.equal(p3.level, 3);
  assert.equal(p3.xpInCurrentLevel, 80);
  assert.equal(p3.xpToNextLevel, 20);
});

test('checkDailyCheckinStatus identifies whether user has checked in today', () => {
  const today = '2026-09-29';
  assert.equal(checkDailyCheckinStatus('2026-09-28', today), false);
  assert.equal(checkDailyCheckinStatus(null, today), false);
  assert.equal(checkDailyCheckinStatus('2026-09-29', today), true);
});

test('executeDailyCheckin rewards streak +1, +10 coins and +15 XP', () => {
  const initial = { streak: 1, coins: 0, xp: 85 };
  const res = executeDailyCheckin(initial, '2026-09-29');

  assert.equal(res.success, true);
  assert.equal(res.streak, 2);
  assert.equal(res.coins, 10);
  assert.equal(res.xp, 100);
  assert.equal(res.level, 2); // 85 + 15 = 100 XP -> Lv.2
  assert.equal(res.lastCheckinDate, '2026-09-29');
});

test('redeemCoinShopItem rejects if insufficient coins', () => {
  const res = redeemCoinShopItem(20, 'RUNNER_TICKET'); // Ticket costs 50
  assert.equal(res.success, false);
  assert.match(res.message, /không đủ xu/);
});

test('redeemCoinShopItem succeeds and deducts coins when balance is enough', () => {
  const res = redeemCoinShopItem(60, 'RUNNER_TICKET');
  assert.equal(res.success, true);
  assert.equal(res.remainingCoins, 10);
  assert.equal(res.item.id, 'RUNNER_TICKET');
});

test('redeemCoinShopItem handles Freeze Streak properly', () => {
  const res = redeemCoinShopItem(120, 'FREEZE_STREAK'); // Freeze costs 100
  assert.equal(res.success, true);
  assert.equal(res.remainingCoins, 20);
});

test('guides and shop items have valid non-empty collections', () => {
  assert.ok(COIN_SHOP_ITEMS.length >= 2);
  assert.ok(LEVEL_UP_GUIDE.length >= 3);
  assert.ok(DISCIPLINE_GUIDE.length >= 3);
});
