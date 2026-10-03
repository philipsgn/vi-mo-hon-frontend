const test = require('node:test');
const assert = require('node:assert/strict');
const {
  checkDailyCoachUsage,
  buildCoachSystemContext,
  getOfflineCoachVerdict,
  getDailyTipByDate,
  COACH_DAILY_FREE_LIMIT,
  COACH_LEGAL_DISCLAIMER,
} = require('../src/utils/coachHelper.cjs');
const { DAILY_TIPS, DAILY_QUESTS } = require('../src/data/dailyTips');

test('Phase 8 - T-P8-01: AI Coach Quota & Prompt Verification', async (t) => {
  await t.test('COACH_DAILY_FREE_LIMIT is set to 5 queries per day for free users', () => {
    assert.equal(COACH_DAILY_FREE_LIMIT, 5);
  });

  await t.test('checkDailyCoachUsage tracks daily free usage and allows exactly 5 queries', () => {
    const todayStr = new Date().toISOString().slice(0, 10);

    // Initial usage (0 queries)
    let status = checkDailyCoachUsage({ date: todayStr, count: 0 }, false);
    assert.equal(status.remaining, 5);
    assert.equal(status.canAsk, true);
    assert.equal(status.isUnlimited, false);

    // 4 queries used
    status = checkDailyCoachUsage({ date: todayStr, count: 4 }, false);
    assert.equal(status.remaining, 1);
    assert.equal(status.canAsk, true);

    // 5 queries used (limit reached)
    status = checkDailyCoachUsage({ date: todayStr, count: 5 }, false);
    assert.equal(status.remaining, 0);
    assert.equal(status.canAsk, false);

    // Premium user has unlimited queries
    const premiumStatus = checkDailyCoachUsage({ date: todayStr, count: 10 }, true);
    assert.equal(premiumStatus.canAsk, true);
    assert.equal(premiumStatus.isUnlimited, true);
  });

  await t.test('COACH_LEGAL_DISCLAIMER contains required educational disclaimer', () => {
    assert.match(COACH_LEGAL_DISCLAIMER, /không phải là lời khuyên đầu tư tài chính chuyên nghiệp/i);
  });

  await t.test('buildCoachSystemContext properly structures 4-field goal and budget context', () => {
    const ctx = buildCoachSystemContext({
      balance: 1500000,
      targetAmount: 2000000,
      targetDeadline: '2026-10-31',
      targetReason: 'Mua laptop học tập',
      dailyBudget: 75000,
      spentToday: 40000,
    });

    assert.equal(ctx.balance, 1500000);
    assert.equal(ctx.targetAmount, 2000000);
    assert.equal(ctx.targetReason, 'Mua laptop học tập');
    assert.equal(ctx.dailyBudget, 75000);
  });

  await t.test('getOfflineCoachVerdict returns prompt copy with equivalents', () => {
    const verdict = getOfflineCoachVerdict('Áo khoác Shopee', 350000, 'roast');
    assert.ok(typeof verdict === 'string');
    assert.ok(verdict.includes('Áo khoác Shopee'));
    assert.ok(verdict.includes('350.000'));
  });
});

test('Phase 8 - T-P8-02: Daily Tips & Daily Quests Verification', async (t) => {
  await t.test('DAILY_TIPS contains at least 8 verified financial tips with sources and VNĐ examples', () => {
    assert.ok(DAILY_TIPS.length >= 8);
    DAILY_TIPS.forEach((tip) => {
      assert.ok(tip.id);
      assert.ok(tip.title);
      assert.ok(tip.category);
      assert.ok(tip.content.length > 20);
      assert.ok(tip.exampleVnd);
      assert.ok(tip.source);
    });
  });

  await t.test('DAILY_QUESTS contains 4 daily discipline missions with XP rewards', () => {
    assert.equal(DAILY_QUESTS.length, 4);
    DAILY_QUESTS.forEach((quest) => {
      assert.ok(quest.id);
      assert.ok(quest.title);
      assert.ok(quest.rewardXp >= 15);
      assert.ok(quest.rewardDiscipline >= 5);
    });
  });

  await t.test('getDailyTipByDate returns a valid deterministic tip based on date string', () => {
    const tip1 = getDailyTipByDate('2026-10-01', DAILY_TIPS);
    const tip2 = getDailyTipByDate('2026-10-01', DAILY_TIPS);
    assert.ok(tip1);
    assert.equal(tip1.id, tip2.id);
  });

  await t.test('CoachScreenNeo source contains 3 tabs, legal disclaimer, and daily quests', () => {
    const fs = require('fs');
    const path = require('path');
    const screenSrc = fs.readFileSync(
      path.join(__dirname, '../src/screens/CoachScreenNeo.js'),
      'utf8'
    );

    assert.ok(screenSrc.includes('CoachScreenNeo'));
    assert.ok(screenSrc.includes('Phán Quyết'));
    assert.ok(screenSrc.includes('Chat AI'));
    assert.ok(screenSrc.includes('Thẻ Mẹo & Nhiệm Vụ'));
    assert.ok(screenSrc.includes('COACH_LEGAL_DISCLAIMER'));
    assert.ok(screenSrc.includes('DAILY_QUESTS'));
  });
});
