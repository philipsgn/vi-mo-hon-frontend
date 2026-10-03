/**
 * Helper for Wallet Ledger Balance & Daily Budget 3 Scenarios (IA-03 & Phase 4)
 */

function parseNumber(val, fallback = 0) {
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Calculates current ledger balance from transactions
 * @param {number} initialBalance
 * @param {Array} transactions
 */
function calculateLedgerBalance(initialBalance = 0, transactions = []) {
  let balance = parseNumber(initialBalance, 0);
  let totalIncome = 0;
  let totalExpense = 0;

  for (const tx of transactions) {
    const amount = parseNumber(tx?.amount, 0);
    const type = tx?.type?.toUpperCase?.() || (amount < 0 ? 'EXPENSE' : (tx?.category === 'INCOME' ? 'INCOME' : 'EXPENSE'));

    if (type === 'INCOME' || (tx?.is_income && amount > 0)) {
      const positiveAmt = Math.abs(amount);
      totalIncome += positiveAmt;
      balance += positiveAmt;
    } else {
      const expenseAmt = Math.abs(amount);
      totalExpense += expenseAmt;
      balance -= expenseAmt;
    }
  }

  return {
    initialBalance: parseNumber(initialBalance, 0),
    currentBalance: Math.max(0, balance),
    rawBalance: balance,
    totalIncome,
    totalExpense,
  };
}

/**
 * Calculates daily budget under 3 distinct scenarios (A, B, C)
 */
function calculateDailyBudgetScenarios({
  currentBalance = 0,
  targetAmountY = 0,
  targetDeadlineX = null,
  expectedIncome = 0,
  now = new Date(),
} = {}) {
  const balance = Math.max(0, parseNumber(currentBalance, 0));
  const goalY = Math.max(0, parseNumber(targetAmountY, 0));
  const income = Math.max(0, parseNumber(expectedIncome, 0));

  const currentDate = new Date(now);
  currentDate.setHours(0, 0, 0, 0);

  // Calculate days left in current month for Scenario C
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const daysLeftInMonth = Math.max(1, Math.ceil((endOfMonth - currentDate) / (1000 * 60 * 60 * 24)) + 1);

  // If there is a target deadline
  let daysToTarget = null;
  if (targetDeadlineX) {
    const targetDate = new Date(targetDeadlineX);
    targetDate.setHours(0, 0, 0, 0);
    const diffMs = targetDate - currentDate;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    daysToTarget = Math.max(1, diffDays);
  }

  // Scenario A: Has Target + Deadline + Expected Income
  if (goalY > 0 && daysToTarget && income > 0) {
    const totalPool = balance + income;
    const availableToSpend = totalPool - goalY;
    const dailyBudget = Math.max(0, Math.floor(availableToSpend / daysToTarget));
    const isDeficit = availableToSpend < 0;

    return {
      scenario: 'A',
      title: 'Kịch Bản A: Có Thu Nhập Dự Kiến & Mục Tiêu Cố Định',
      daysRemaining: daysToTarget,
      dailyBudget,
      isDeficit,
      savingsNeededTotal: goalY,
      dailySavingsNeeded: Math.ceil(goalY / daysToTarget),
      totalAvailable: Math.max(0, availableToSpend),
      description: isDeficit
        ? 'Thu nhập + Số dư hiện tại không đủ mục tiêu. Cần cắt giảm chi tiêu!'
        : `Ngân sách mỗi ngày để vẫn đạt mục tiêu tiết kiệm ${goalY.toLocaleString('vi-VN')} đ.`,
    };
  }

  // Scenario B: Has Target + Deadline (No extra income, spend within balance)
  if (goalY > 0 && daysToTarget) {
    const availableToSpend = balance - goalY;
    const dailyBudget = Math.max(0, Math.floor(availableToSpend / daysToTarget));
    const isDeficit = availableToSpend < 0;

    return {
      scenario: 'B',
      title: 'Kịch Bản B: Tích Lũy Từ Số Dư Hiện Có',
      daysRemaining: daysToTarget,
      dailyBudget,
      isDeficit,
      savingsNeededTotal: goalY,
      dailySavingsNeeded: Math.ceil(goalY / daysToTarget),
      totalAvailable: Math.max(0, availableToSpend),
      description: isDeficit
        ? 'Số dư hiện tại thấp hơn mục tiêu. Bạn cần thêm thu nhập hoặc kéo dài thời hạn!'
        : `Ngân sách mỗi ngày để bảo toàn khoản tích lũy ${goalY.toLocaleString('vi-VN')} đ.`,
    };
  }

  // Scenario C: No Target or Standard Monthly Pace
  const dailyBudget = Math.max(0, Math.floor(balance / daysLeftInMonth));
  return {
    scenario: 'C',
    title: 'Kịch Bản C: Tiêu Đều Đến Cuối Tháng',
    daysRemaining: daysLeftInMonth,
    dailyBudget,
    isDeficit: balance <= 0,
    savingsNeededTotal: 0,
    dailySavingsNeeded: 0,
    totalAvailable: balance,
    description: `Chi tiêu đều đặn trong ${daysLeftInMonth} ngày còn lại của tháng.`,
  };
}

/**
 * Format Vietnam Date and Time in Asia/Ho_Chi_Minh (UTC+7)
 * @param {string|Date} dateVal
 * @param {Date} [baseNow=new Date()]
 */
function formatVietnamDateTime(dateVal, baseNow = new Date()) {
  const d = dateVal ? new Date(dateVal) : new Date();
  if (isNaN(d.getTime())) {
    return {
      dateKey: 'unknown',
      dayLabel: 'GIAO DỊCH KHÁC',
      timeStr: '00:00',
      displayDate: '',
    };
  }

  // Normalize to UTC+7 for consistent display
  const vnTime = new Date(d.getTime() + (7 * 60 + d.getTimezoneOffset()) * 60000);
  const nowVn = new Date(baseNow.getTime() + (7 * 60 + baseNow.getTimezoneOffset()) * 60000);

  const year = vnTime.getFullYear();
  const month = String(vnTime.getMonth() + 1).padStart(2, '0');
  const day = String(vnTime.getDate()).padStart(2, '0');
  const hours = String(vnTime.getHours()).padStart(2, '0');
  const minutes = String(vnTime.getMinutes()).padStart(2, '0');

  const dateKey = `${year}-${month}-${day}`;
  const displayDate = `${day}/${month}/${year}`;
  const timeStr = `${hours}:${minutes}`;

  // Check today / yesterday
  const nowYear = nowVn.getFullYear();
  const nowMonth = String(nowVn.getMonth() + 1).padStart(2, '0');
  const nowDay = String(nowVn.getDate()).padStart(2, '0');
  const nowDateKey = `${nowYear}-${nowMonth}-${nowDay}`;

  const yesterdayVn = new Date(nowVn);
  yesterdayVn.setDate(yesterdayVn.getDate() - 1);
  const yYear = yesterdayVn.getFullYear();
  const yMonth = String(yesterdayVn.getMonth() + 1).padStart(2, '0');
  const yDay = String(yesterdayVn.getDate()).padStart(2, '0');
  const yDateKey = `${yYear}-${yMonth}-${yDay}`;

  let dayLabel = `${day}/${month}/${year}`;
  if (dateKey === nowDateKey) {
    dayLabel = `HÔM NAY (${day}/${month})`;
  } else if (dateKey === yDateKey) {
    dayLabel = `HÔM QUA (${day}/${month})`;
  }

  return {
    dateKey,
    dayLabel,
    timeStr,
    displayDate,
  };
}

/**
 * Groups transactions by date (Newest first)
 * @param {Array} transactions
 * @param {Date} [baseNow=new Date()]
 */
function groupTransactionsByDate(transactions = [], baseNow = new Date()) {
  if (!Array.isArray(transactions) || transactions.length === 0) return [];

  // Sort newest first
  const sorted = [...transactions].sort((a, b) => {
    const timeA = new Date(a.occurredAt || a.occurred_at || a.spent_at || a.created_at || 0).getTime();
    const timeB = new Date(b.occurredAt || b.occurred_at || b.spent_at || b.created_at || 0).getTime();
    return timeB - timeA;
  });

  const groupMap = new Map();

  for (const tx of sorted) {
    const rawDate = tx.occurredAt || tx.occurred_at || tx.spent_at || tx.created_at;
    const { dateKey, dayLabel, timeStr, displayDate } = formatVietnamDateTime(rawDate, baseNow);

    if (!groupMap.has(dateKey)) {
      groupMap.set(dateKey, {
        dateKey,
        dayLabel,
        displayDate,
        totalIncome: 0,
        totalExpense: 0,
        items: [],
      });
    }

    const group = groupMap.get(dateKey);
    const amount = Math.abs(parseNumber(tx.amount, 0));
    const type = tx.type?.toUpperCase?.() || (tx.category === 'INCOME' || tx.is_income ? 'INCOME' : (tx.is_adjustment ? 'ADJUSTMENT' : 'EXPENSE'));

    if (type === 'INCOME') {
      group.totalIncome += amount;
    } else if (type === 'EXPENSE') {
      group.totalExpense += amount;
    }

    group.items.push({
      ...tx,
      timeStr,
      displayAmount: amount,
      computedType: type,
    });
  }

  return Array.from(groupMap.values());
}

/**
 * Filter transactions by time range
 * @param {Array} transactions
 * @param {'ALL'|'TODAY'|'THIS_WEEK'|'THIS_MONTH'} filter
 * @param {Date} [baseNow=new Date()]
 */
function filterTransactionsByTimeRange(transactions = [], filter = 'ALL', baseNow = new Date()) {
  if (!Array.isArray(transactions) || transactions.length === 0) return [];
  if (filter === 'ALL') return transactions;

  const now = new Date(baseNow);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);

  // Start of week (Monday)
  const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1; // 0 for Mon, 6 for Sun
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

  // Start of month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);

  return transactions.filter((tx) => {
    const rawDate = tx.occurredAt || tx.occurred_at || tx.spent_at || tx.created_at;
    const txTime = rawDate ? new Date(rawDate).getTime() : 0;

    if (filter === 'TODAY') {
      return txTime >= startOfDay.getTime();
    }
    if (filter === 'THIS_WEEK') {
      return txTime >= startOfWeek.getTime();
    }
    if (filter === 'THIS_MONTH') {
      return txTime >= startOfMonth.getTime();
    }
    return true;
  });
}

/**
 * Calculate Adjustment Difference for Real Wallet Sync
 * @param {number} currentBalance
 * @param {number} actualBalance
 */
function calculateBalanceAdjustmentDiff(currentBalance = 0, actualBalance = 0) {
  const current = parseNumber(currentBalance, 0);
  const actual = parseNumber(actualBalance, 0);
  const diff = actual - current;

  return {
    diff,
    isIncrease: diff >= 0,
    type: diff >= 0 ? 'INCOME' : 'EXPENSE',
    isAdjustment: true,
    amount: Math.abs(diff),
    note: `Điều chỉnh khớp ví thật (${diff >= 0 ? '+' : ''}${diff.toLocaleString('vi-VN')} đ)`,
  };
}

/**
 * Calculate Morning Overspend Rebalance across remaining days
 * @param {Object} params
 * @param {number} params.yesterdaySpent
 * @param {number} params.yesterdayBudget
 * @param {number} params.daysRemaining
 * @param {number} params.currentDailyBudget
 * @param {number} [params.floorDailyBudget=50000]
 */
function calculateOverspendRebalance({
  yesterdaySpent = 0,
  yesterdayBudget = 150000,
  daysRemaining = 30,
  currentDailyBudget = 150000,
  floorDailyBudget = 50000,
} = {}) {
  const spent = parseNumber(yesterdaySpent, 0);
  const budget = parseNumber(yesterdayBudget, 150000);
  const days = Math.max(1, parseNumber(daysRemaining, 30));
  const curBudget = Math.max(floorDailyBudget, parseNumber(currentDailyBudget, 150000));
  const floor = parseNumber(floorDailyBudget, 50000);

  const overspend = Math.max(0, spent - budget);
  if (overspend <= 0 || days <= 1) {
    return {
      hasOverspent: false,
      overspendAmount: 0,
      dailyAdjustment: 0,
      adjustedDailyBudget: curBudget,
    };
  }

  const spreadPerDay = Math.ceil(overspend / days);
  const adjusted = Math.max(floor, curBudget - spreadPerDay);

  return {
    hasOverspent: true,
    overspendAmount: overspend,
    dailyAdjustment: spreadPerDay,
    adjustedDailyBudget: adjusted,
  };
}

module.exports = {
  calculateLedgerBalance,
  calculateDailyBudgetScenarios,
  formatVietnamDateTime,
  groupTransactionsByDate,
  filterTransactionsByTimeRange,
  calculateBalanceAdjustmentDiff,
  calculateOverspendRebalance,
};
