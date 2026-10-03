/**
 * VI-MO-HON Home Game Companion Helper
 * Bóc tách và định dạng an toàn các chỉ số RPG từ dashboard payload
 */

/**
 * Trích xuất chỉ số sinh tồn và trạng thái Game từ payload dashboard
 * @param {object} dashboard
 * @returns {object}
 */
function extractGameMetrics(dashboard) {
  const data = dashboard?.data ?? dashboard ?? {};
  const profile = data.profile ?? {};
  const boss = data.boss ?? {};
  const todayChallenge = data.todayChallenge ?? null;
  const activeChallenges = data.activeChallenges ?? [];
  const recentExpenses = data.recentExpenses ?? [];

  // Streak, Level, Coins, XP, Discipline, Display Name
  const displayName = profile.displayName || profile.name || 'Chiến Binh';
  const streak = Number(profile.streak ?? profile.currentStreak ?? 1);
  const xp = Number(profile.xp ?? 0);
  const level = Number(profile.level ?? (Math.floor(xp / 100) + 1));
  const coins = Number(profile.coins ?? profile.rewardCoins ?? 0);
  const discipline = Number(profile.discipline ?? 0);
  const tickets = Number(profile.runnerTickets ?? profile.tickets ?? 3);
  const disciplineScore = Number(profile.disciplineScore ?? profile.discipline ?? 95);

  // Boss HP & Status
  const bossName = boss.name || 'Quái Vật Trà Sữa';
  const bossMaxHp = Number(boss.maxHp || boss.totalHp || 100);
  const bossCurrentHp = Math.max(0, Math.min(bossMaxHp, Number(boss.currentHp ?? boss.hp ?? 65)));
  const bossHpPercentage = bossMaxHp > 0 ? bossCurrentHp / bossMaxHp : 0;
  const isBossDefeated = bossCurrentHp <= 0 || boss.status === 'defeated';

  // Monthly Budget & Daily Budget
  const monthlyBudget = Number(profile.monthlyBudget ?? profile.budget ?? 0);
  const monthlySpent = Number(profile.monthlySpent ?? 0);
  const remainingBudget = Math.max(0, monthlyBudget - monthlySpent);

  // Daily budget estimate (30 days)
  const baseDailyBudget = monthlyBudget > 0 ? Math.round(monthlyBudget / 30) : 150000;

  // Calculate today & yesterday spent from recent expenses list
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);

  let todaySpent = 0;
  let yesterdaySpent = 0;

  for (const exp of recentExpenses) {
    const isExpense = exp.type === 'EXPENSE' || (exp.category !== 'INCOME' && !exp.is_income);
    if (!isExpense) continue;
    const expDate = String(exp.occurredAt || exp.spent_at || exp.createdAt || exp.created_at || '').slice(0, 10);
    const amount = Number(exp.amount || 0);

    if (expDate === todayStr) {
      todaySpent += amount;
    } else if (expDate === yesterdayStr) {
      yesterdaySpent += amount;
    }
  }

  // Days remaining for target
  const targetDate = profile.target_date || profile.targetDate || '2027-12-31';
  const targetDiffMs = new Date(targetDate).getTime() - new Date().getTime();
  const daysLeft = Math.max(1, Math.ceil(targetDiffMs / (1000 * 60 * 60 * 24)));

  const { calculateOverspendRebalance } = require('./walletHelper.cjs');
  const rebalanceInfo = calculateOverspendRebalance({
    yesterdaySpent,
    yesterdayBudget: baseDailyBudget,
    daysRemaining: daysLeft,
    currentDailyBudget: baseDailyBudget,
    floorDailyBudget: 50000,
  });

  const dailyBudget = rebalanceInfo.adjustedDailyBudget;
  const todayRemaining = Math.max(0, dailyBudget - todaySpent);

  // Target Goal (4 Fields)
  const financialGoal = profile.financial_goal || profile.mainGoal || 'Tiết kiệm phòng thân';
  const targetAmount = Number(profile.target_amount || profile.targetAmount || 10000000);
  const targetReason = profile.target_reason || profile.reason || 'Để tự chủ tài chính và phòng ngừa rủi ro.';

  const { getActiveChapter } = require('./chapterHelper.cjs');
  const activeChapter = getActiveChapter(
    { discipline, knowledge: Number(profile.knowledge || 0), xp, level },
    { [boss.bossId || 'impulse-boss']: boss }
  );

  // Simulated balance or initial budget
  const balance = Number(profile.balance ?? profile.simulated_balance ?? profile.monthly_limit ?? profile.monthlyBudget ?? 5000000);

  return {
    displayName,
    balance,
    streak,
    level,
    xp,
    coins,
    discipline,
    tickets,
    disciplineScore,
    bossName,
    bossMaxHp,
    bossCurrentHp,
    bossHpPercentage,
    isBossDefeated,
    monthlyBudget,
    monthlySpent,
    remainingBudget,
    baseDailyBudget,
    dailyBudget,
    todaySpent,
    todayRemaining,
    yesterdaySpent,
    rebalanceInfo,
    financialGoal,
    targetAmount,
    targetDate,
    targetReason,
    daysLeft,
    todayChallenge,
    activeChallenges,
    activeChapter,
  };
}

/**
 * Generate morning financial reminder message
 */
function generateMorningRebalanceMessage({ yesterdaySpent = 0, baseDailyBudget = 150000, daysLeft = 30 } = {}) {
  const spent = Number(yesterdaySpent || 0);
  const budget = Number(baseDailyBudget || 150000);

  if (spent <= 0) {
    return 'Hôm nay bạn chưa phát sinh chi tiêu. Hãy giữ vững kỷ luật để bảo vệ mục tiêu tháng nhé!';
  }

  const overspend = spent - budget;
  if (overspend > 0) {
    const spread = Math.ceil(overspend / Math.max(1, daysLeft));
    return `Hôm qua bạn chi vượt ${overspend.toLocaleString('vi-VN')} đ. Số tiền này đã được tự động dàn đều (-${spread.toLocaleString('vi-VN')} đ/ngày) sang các ngày tới để bảo vệ mục tiêu!`;
  }

  return `Hôm qua bạn đã chi tiêu rất an toàn (${spent.toLocaleString('vi-VN')} đ / ${budget.toLocaleString('vi-VN')} đ). Tiếp tục phát huy nhé!`;
}

module.exports = {
  extractGameMetrics,
  generateMorningRebalanceMessage,
};
