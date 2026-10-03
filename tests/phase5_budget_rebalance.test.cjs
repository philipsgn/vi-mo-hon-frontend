const test = require('node:test');
const assert = require('node:assert');
const {
  calculateDailyBudgetScenarios,
  calculateOverspendRebalance,
} = require('../src/utils/walletHelper.cjs');
const {
  extractGameMetrics,
  generateMorningRebalanceMessage,
} = require('../src/utils/homeHelper.cjs');

test('Phase 5 - T-P5-01: calculateDailyBudgetScenarios handles Scenario A, B, C with floor bounds', () => {
  // Scenario A: Balance 2M + Income 5M - Goal 3M (Target in 20 days) -> Pool 4M / 20 = 200k/day
  const resA = calculateDailyBudgetScenarios({
    currentBalance: 2000000,
    expectedIncome: 5000000,
    targetAmountY: 3000000,
    targetDeadlineX: '2026-10-20',
    now: new Date('2026-09-30T00:00:00.000Z'),
  });
  assert.equal(resA.scenario, 'A');
  assert.equal(resA.dailyBudget, 200000);
  assert.equal(resA.isDeficit, false);

  // Scenario B: Balance 3M - Goal 2M (Target in 10 days) -> 1M / 10 = 100k/day
  const resB = calculateDailyBudgetScenarios({
    currentBalance: 3000000,
    targetAmountY: 2000000,
    targetDeadlineX: '2026-10-10',
    now: new Date('2026-09-30T00:00:00.000Z'),
  });
  assert.equal(resB.scenario, 'B');
  assert.equal(resB.dailyBudget, 100000);
  assert.equal(resB.isDeficit, false);

  // Scenario C: Balance 3M (No target, spend until end of month)
  const resC = calculateDailyBudgetScenarios({
    currentBalance: 3000000,
    now: new Date('2026-09-20T00:00:00.000Z'), // 11 days left in September
  });
  assert.equal(resC.scenario, 'C');
  assert.ok(resC.dailyBudget > 0);
});

test('Phase 5 - T-P5-02: calculateOverspendRebalance spreads overspent amount and respects floor budget', () => {
  // Yesterday spent 250k on a 150k budget (overspent 100k) with 10 days remaining
  // Adjustment per day: 100k / 10 = 10k/day -> New daily budget: 150k - 10k = 140k
  const rebalance1 = calculateOverspendRebalance({
    yesterdaySpent: 250000,
    yesterdayBudget: 150000,
    daysRemaining: 10,
    currentDailyBudget: 150000,
    floorDailyBudget: 50000,
  });
  assert.equal(rebalance1.hasOverspent, true);
  assert.equal(rebalance1.overspendAmount, 100000);
  assert.equal(rebalance1.dailyAdjustment, 10000);
  assert.equal(rebalance1.adjustedDailyBudget, 140000);

  // Large overspend that hits the floor limit (50k)
  const rebalanceFloor = calculateOverspendRebalance({
    yesterdaySpent: 1500000, // Overspent 1.35M
    yesterdayBudget: 150000,
    daysRemaining: 5,
    currentDailyBudget: 150000,
    floorDailyBudget: 50000,
  });
  assert.equal(rebalanceFloor.hasOverspent, true);
  assert.equal(rebalanceFloor.adjustedDailyBudget, 50000, 'Must clamp to floor budget');

  // No overspend
  const rebalanceNo = calculateOverspendRebalance({
    yesterdaySpent: 100000,
    yesterdayBudget: 150000,
    daysRemaining: 10,
    currentDailyBudget: 150000,
  });
  assert.equal(rebalanceNo.hasOverspent, false);
  assert.equal(rebalanceNo.adjustedDailyBudget, 150000);
});

test('Phase 5 - T-P5-02: generateMorningRebalanceMessage gives friendly advice', () => {
  const overspendMsg = generateMorningRebalanceMessage({
    yesterdaySpent: 200000,
    baseDailyBudget: 150000,
    daysLeft: 10,
  });
  assert.match(overspendMsg, /chi vượt 50\.000 đ/);
  assert.match(overspendMsg, /tự động dàn đều/);

  const safeMsg = generateMorningRebalanceMessage({
    yesterdaySpent: 80000,
    baseDailyBudget: 150000,
  });
  assert.match(safeMsg, /rất an toàn/);

  const zeroMsg = generateMorningRebalanceMessage({
    yesterdaySpent: 0,
    baseDailyBudget: 150000,
  });
  assert.match(zeroMsg, /chưa phát sinh chi tiêu/);
});

test('Phase 5 - T-P5-02: extractGameMetrics parses yesterdaySpent and applies rebalance', () => {
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);

  const mockDashboard = {
    profile: {
      monthlyBudget: 3000000, // 100k/day
      financial_goal: 'Mua Laptop',
      target_amount: 15000000,
      target_date: '2026-12-31',
    },
    recentExpenses: [
      { amount: 180000, category: 'FOOD', occurredAt: yesterdayDate.toISOString() }, // overspent 80k yesterday
    ],
  };

  const metrics = extractGameMetrics(mockDashboard);
  assert.equal(metrics.yesterdaySpent, 180000);
  assert.equal(metrics.rebalanceInfo.hasOverspent, true);
  assert.ok(metrics.dailyBudget < metrics.baseDailyBudget, 'Daily budget must be rebalanced downwards');
});
