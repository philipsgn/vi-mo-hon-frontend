const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const {
  formatVietnamDateTime,
  groupTransactionsByDate,
  filterTransactionsByTimeRange,
  calculateBalanceAdjustmentDiff,
} = require('../src/utils/walletHelper.cjs');

test('Phase 4 - T-P4-01: formatVietnamDateTime formats properly in Asia/Ho_Chi_Minh', () => {
  const baseNow = new Date('2026-09-30T10:00:00.000Z'); // 17:00 in UTC+7
  const todayDate = new Date('2026-09-30T05:30:00.000Z'); // 12:30 in UTC+7
  const yesterdayDate = new Date('2026-09-29T08:00:00.000Z');

  const todayFormatted = formatVietnamDateTime(todayDate, baseNow);
  assert.equal(todayFormatted.timeStr, '12:30');
  assert.match(todayFormatted.dayLabel, /HÔM NAY/);

  const yesterdayFormatted = formatVietnamDateTime(yesterdayDate, baseNow);
  assert.match(yesterdayFormatted.dayLabel, /HÔM QUA/);
});

test('Phase 4 - T-P4-01: groupTransactionsByDate groups transactions by date and computes daily subtotals', () => {
  const baseNow = new Date('2026-09-30T12:00:00.000Z');
  const transactions = [
    { id: '1', amount: 35000, category: 'FOOD', occurredAt: '2026-09-30T05:30:00.000Z', note: 'Cơm tấm' },
    { id: '2', amount: 20000, category: 'FOOD', occurredAt: '2026-09-30T01:15:00.000Z', note: 'Cà phê' },
    { id: '3', amount: 50000, category: 'TRANSPORT', occurredAt: '2026-09-29T12:45:00.000Z', note: 'Đổ xăng' },
    { id: '4', amount: 200000, category: 'INCOME', occurredAt: '2026-09-29T07:00:00.000Z', note: 'Thưởng đồ án' },
  ];

  const grouped = groupTransactionsByDate(transactions, baseNow);
  assert.equal(grouped.length, 2, 'Should produce 2 date groups');

  const todayGroup = grouped[0];
  assert.match(todayGroup.dayLabel, /HÔM NAY/);
  assert.equal(todayGroup.items.length, 2);
  assert.equal(todayGroup.totalExpense, 55000);
  assert.equal(todayGroup.totalIncome, 0);

  const yesterdayGroup = grouped[1];
  assert.match(yesterdayGroup.dayLabel, /HÔM QUA/);
  assert.equal(yesterdayGroup.items.length, 2);
  assert.equal(yesterdayGroup.totalExpense, 50000);
  assert.equal(yesterdayGroup.totalIncome, 200000);
});

test('Phase 4 - T-P4-02: filterTransactionsByTimeRange correctly filters TODAY, THIS_WEEK, THIS_MONTH', () => {
  const baseNow = new Date('2026-09-30T10:00:00.000Z'); // Wednesday
  const transactions = [
    { id: 't1', amount: 10000, occurredAt: '2026-09-30T05:00:00.000Z' }, // Today
    { id: 't2', amount: 20000, occurredAt: '2026-09-29T05:00:00.000Z' }, // Yesterday (This week & this month)
    { id: 't3', amount: 30000, occurredAt: '2026-09-10T05:00:00.000Z' }, // This month, not this week
    { id: 't4', amount: 40000, occurredAt: '2026-08-20T05:00:00.000Z' }, // Last month
  ];

  const allList = filterTransactionsByTimeRange(transactions, 'ALL', baseNow);
  assert.equal(allList.length, 4);

  const todayList = filterTransactionsByTimeRange(transactions, 'TODAY', baseNow);
  assert.equal(todayList.length, 1);
  assert.equal(todayList[0].id, 't1');

  const weekList = filterTransactionsByTimeRange(transactions, 'THIS_WEEK', baseNow);
  assert.equal(weekList.length, 2);

  const monthList = filterTransactionsByTimeRange(transactions, 'THIS_MONTH', baseNow);
  assert.equal(monthList.length, 3);
});

test('Phase 4 - T-P4-02: calculateBalanceAdjustmentDiff calculates positive and negative balance sync diffs', () => {
  // Current: 2.000.000 đ, Actual: 2.500.000 đ -> +500.000 đ (Income adjustment)
  const incDiff = calculateBalanceAdjustmentDiff(2000000, 2500000);
  assert.equal(incDiff.diff, 500000);
  assert.equal(incDiff.isIncrease, true);
  assert.equal(incDiff.type, 'INCOME');
  assert.equal(incDiff.amount, 500000);

  // Current: 2.000.000 đ, Actual: 1.800.000 đ -> -200.000 đ (Expense adjustment)
  const decDiff = calculateBalanceAdjustmentDiff(2000000, 1800000);
  assert.equal(decDiff.diff, -200000);
  assert.equal(decDiff.isIncrease, false);
  assert.equal(decDiff.type, 'EXPENSE');
  assert.equal(decDiff.amount, 200000);
});

test('Phase 4 UI Integrity: WalletScreen and QuickActionSheet have required Phase 4 elements', () => {
  const walletCode = fs.readFileSync(path.join(__dirname, '../src/screens/WalletScreen.js'), 'utf8');
  assert.match(walletCode, /SAO KÊ & LỊCH SỬ THU \/ CHI/, 'WalletScreen must have statement ledger header');
  assert.match(walletCode, /filterBar/, 'WalletScreen must have time filter bar');
  assert.match(walletCode, /Sửa số dư \(Khớp ví\)/, 'WalletScreen must have real wallet sync button');
  assert.match(walletCode, /groupTransactionsByDate/, 'WalletScreen must group transactions by date');

  const quickActionCode = fs.readFileSync(path.join(__dirname, '../src/components/QuickActionSheet.js'), 'utf8');
  assert.match(quickActionCode, /GHI BÙ TỐI ĐA 7 NGÀY/, 'QuickActionSheet must support up to 7 days backdating');
  assert.match(quickActionCode, /occurredAt/, 'QuickActionSheet must pass occurredAt');
  assert.match(quickActionCode, /Giờ phát sinh/, 'QuickActionSheet must have hour/minute selector');
  assert.match(quickActionCode, /ScrollView/, 'QuickActionSheet must import ScrollView');
});
