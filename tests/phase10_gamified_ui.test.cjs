const test = require('node:test');
const assert = require('node:assert/strict');
const { retroColors, retroTokens } = require('../src/theme/retroTokens.cjs');
const { extractGameMetrics, generateMorningRebalanceMessage } = require('../src/utils/homeHelper.cjs');
const {
  calculateLedgerBalance,
  calculateDailyBudgetScenarios,
  groupTransactionsByDate,
  filterTransactionsByTimeRange,
  calculateBalanceAdjustmentDiff,
} = require('../src/utils/walletHelper.cjs');
const { checkDailyCoachUsage, calculateEquivalents, COACH_LEGAL_DISCLAIMER } = require('../src/utils/coachHelper.cjs');
const { CURRICULUM_CHAPTERS } = require('../src/data/curriculumData.js');

test('Phase 10: Gamified UI Tokens verification', (t) => {
  assert.equal(retroColors.gameYellow, '#FFE600', 'gameYellow should be #FFE600');
  assert.equal(retroColors.gameMint, '#A7F3D0', 'gameMint should be #A7F3D0');
  assert.equal(retroColors.gameCoral, '#FDA4AF', 'gameCoral should be #FDA4AF');
  assert.equal(retroColors.gameIndigo, '#818CF8', 'gameIndigo should be #818CF8');
  assert.equal(retroColors.gameSand, '#FDE68A', 'gameSand should be #FDE68A');
  assert.equal(retroColors.gameDark, '#0F172A', 'gameDark should be #0F172A');
  assert.equal(retroColors.gameBorder, '#0F172A', 'gameBorder should be #0F172A');
  assert.equal(retroTokens.gameYellow, '#FFE600');
});

test('Phase 10: HomeScreen metrics and gentle copywriting', (t) => {
  const mockDashboard = {
    profile: {
      streak: 7,
      runnerTickets: 4,
      disciplineScore: 98,
      level: 3,
      balance: 1500000,
      monthlyBudget: 6000000,
    },
    recentExpenses: [
      { amount: 50000, occurredAt: new Date().toISOString(), type: 'EXPENSE' },
    ],
  };

  const metrics = extractGameMetrics(mockDashboard);
  assert.equal(metrics.streak, 7);
  assert.equal(metrics.tickets, 4);
  assert.equal(metrics.balance, 1500000);
  assert.equal(metrics.dailyBudget, 200000);
  assert.equal(metrics.todaySpent, 50000);
  assert.equal(metrics.todayRemaining, 150000);

  // Gentle morning rebalance message check
  const morningMsg = generateMorningRebalanceMessage({
    yesterdaySpent: 300000,
    baseDailyBudget: 200000,
    daysLeft: 10,
  });
  assert.ok(morningMsg.includes('chi vượt'), 'Message should note overspending gently');
  assert.ok(morningMsg.includes('dàn đều'), 'Message should mention automatic rebalancing');
});

test('Phase 10: Wallet Gamified Timeline Feed grouping and balance adjustment', (t) => {
  const initialBalance = 2000000;
  const transactions = [
    { id: 1, amount: 50000, type: 'EXPENSE', category: 'FOOD', text: 'Cơm trưa', occurred_at: '2026-10-01T12:00:00Z' },
    { id: 2, amount: 200000, type: 'INCOME', category: 'SALARY', text: 'Thưởng mini', occurred_at: '2026-10-01T14:00:00Z' },
    { id: 3, amount: 30000, type: 'EXPENSE', category: 'TRANSPORT', text: 'Gửi xe', occurred_at: '2026-09-30T09:00:00Z' },
  ];

  const ledger = calculateLedgerBalance(initialBalance, transactions);
  assert.equal(ledger.totalExpense, 80000);
  assert.equal(ledger.totalIncome, 200000);
  assert.equal(ledger.currentBalance, 2120000);

  const grouped = groupTransactionsByDate(transactions);
  assert.equal(grouped.length, 2, 'Should group into 2 distinct dates');
  assert.equal(grouped[0].items.length, 2, 'Today should have 2 items');

  // Balance adjustment calculation
  const adjustDiff = calculateBalanceAdjustmentDiff(2120000, 2500000);
  assert.equal(adjustDiff.isIncrease, true);
  assert.equal(adjustDiff.diff, 380000);
  assert.equal(adjustDiff.amount, 380000);
});

test('Phase 10: Coach Quota and 7-Chapter Curriculum verification', (t) => {
  const usageStatus = checkDailyCoachUsage(
    { date: new Date().toISOString().slice(0, 10), count: 2 },
    false,
  );
  assert.equal(usageStatus.canAsk, true);
  assert.equal(usageStatus.remaining, 3);

  const equivalents = calculateEquivalents(105000);
  assert.equal(equivalents.phoCount, 3);

  assert.equal(CURRICULUM_CHAPTERS.length, 7, 'Should have all 7 curriculum chapters');
  const totalLessons = CURRICULUM_CHAPTERS.reduce((sum, c) => sum + (c.lessons?.length || 0), 0);
  assert.equal(totalLessons, 30, 'Should have 30 total lessons across 7 chapters');
});
