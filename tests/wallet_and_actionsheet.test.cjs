const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { calculateLedgerBalance, calculateDailyBudgetScenarios } = require('../src/utils/walletHelper.cjs');

test('calculateLedgerBalance: accurately calculates balance from income and expense transactions', () => {
  const initialBalance = 2000000;
  const transactions = [
    { amount: 50000, category: 'FOOD', type: 'EXPENSE' },
    { amount: 150000, category: 'SHOPPING', type: 'EXPENSE' },
    { amount: 500000, category: 'BONUS', type: 'INCOME' },
  ];

  const result = calculateLedgerBalance(initialBalance, transactions);
  assert.equal(result.initialBalance, 2000000);
  assert.equal(result.totalExpense, 200000);
  assert.equal(result.totalIncome, 500000);
  assert.equal(result.currentBalance, 2300000);
});

test('calculateDailyBudgetScenarios: handles Scenario A (Goal + Expected Income)', () => {
  const now = new Date('2026-10-01T00:00:00Z');
  const targetDeadlineX = new Date('2026-10-31T00:00:00Z');

  const result = calculateDailyBudgetScenarios({
    currentBalance: 2000000,
    expectedIncome: 5000000,
    targetAmountY: 4000000,
    targetDeadlineX,
    now,
  });

  assert.equal(result.scenario, 'A');
  assert.equal(result.dailyBudget, 100000);
  assert.equal(result.isDeficit, false);
});

test('calculateDailyBudgetScenarios: handles Scenario B (Goal without extra income)', () => {
  const now = new Date('2026-10-01T00:00:00Z');
  const targetDeadlineX = new Date('2026-10-21T00:00:00Z');

  const result = calculateDailyBudgetScenarios({
    currentBalance: 3000000,
    targetAmountY: 1000000,
    targetDeadlineX,
    now,
  });

  assert.equal(result.scenario, 'B');
  assert.equal(result.dailyBudget, 100000);
  assert.equal(result.isDeficit, false);
});

test('calculateDailyBudgetScenarios: handles Scenario C (No target, spend until month end)', () => {
  const now = new Date('2026-10-21T00:00:00Z');
  const result = calculateDailyBudgetScenarios({
    currentBalance: 1100000,
    now,
  });

  assert.equal(result.scenario, 'C');
  assert.ok(result.dailyBudget > 0);
});

test('PHASE 3: WalletScreen uses retroTokens and has no tainted baked UI assets', () => {
  const walletScreenPath = path.join(__dirname, '../src/screens/WalletScreen.js');
  const content = fs.readFileSync(walletScreenPath, 'utf8');

  assert.ok(content.includes('retroTokens'), 'WalletScreen must import retroTokens');
  assert.ok(content.includes('calculateLedgerBalance'), 'WalletScreen must use calculateLedgerBalance');
  assert.ok(content.includes('calculateDailyBudgetScenarios'), 'WalletScreen must use calculateDailyBudgetScenarios');

  const taintedAssets = [
    'island_main_waterfall.webp',
    'island_expense_base.webp',
    'panel_parchment_blank.webp',
    'capsule_metric_blue.webp',
    'tag_ribbon_chapter_red.webp',
  ];

  for (const asset of taintedAssets) {
    assert.ok(!content.includes(asset), `WalletScreen must not import tainted asset: ${asset}`);
  }
});

test('PHASE 3: QuickActionSheet supports 3 modes (EXPENSE, INCOME, COACH)', () => {
  const actionSheetPath = path.join(__dirname, '../src/components/QuickActionSheet.js');
  const content = fs.readFileSync(actionSheetPath, 'utf8');

  assert.ok(content.includes('Ghi Chi'), 'QuickActionSheet has Ghi Chi');
  assert.ok(content.includes('Ghi Thu'), 'QuickActionSheet has Ghi Thu');
  assert.ok(content.includes('Hỏi AI Coach'), 'QuickActionSheet has Hỏi AI Coach');
  assert.ok(content.includes('retroTokens'), 'QuickActionSheet uses retroTokens');
});
