const test = require('node:test');
const assert = require('node:assert/strict');

const {
  GOAL_CARDS,
  TARGET_AMOUNT_PRESETS,
  MONTHLY_BUDGET_PRESETS,
  TIMEFRAME_PRESETS,
  TEMPTATION_TAGS,
  calculateFutureDate,
  calculateMonthlySavingsEstimate,
  validateOnboardingForm,
  calculateReadinessScore,
} = require('../src/utils/onboardingHelper.cjs');

test('onboarding presets have complete data structure', () => {
  assert.equal(GOAL_CARDS.length, 5);
  assert.ok(GOAL_CARDS.every(c => c.id && c.title && c.icon && c.color));

  assert.equal(TARGET_AMOUNT_PRESETS.length, 4);
  assert.equal(MONTHLY_BUDGET_PRESETS.length, 4);
  assert.equal(TIMEFRAME_PRESETS.length, 4);
  assert.ok(TEMPTATION_TAGS.length >= 8);
});

test('calculateFutureDate generates valid ISO date string in future', () => {
  const base = new Date('2026-09-29T10:00:00Z');
  const d1 = calculateFutureDate(1, base);
  assert.equal(d1, '2026-10-29');

  const d3 = calculateFutureDate(3, base);
  assert.equal(d3, '2026-12-29');

  const d12 = calculateFutureDate(12, base);
  assert.equal(d12, '2027-09-29');
});

test('calculateMonthlySavingsEstimate divides target amount over remaining months', () => {
  const base = new Date('2026-09-29T00:00:00Z');
  // 6M VND in ~3 months (90 days) -> ~2M / month
  const estimate = calculateMonthlySavingsEstimate(6000000, '2026-12-28', base);
  assert.ok(estimate >= 1900000 && estimate <= 2100000);
});

test('validateOnboardingForm catches empty display name', () => {
  const form = {
    displayName: '',
    mainGoal: 'save_money',
    targetAmount: 5000000,
    targetDate: '2026-12-31',
    monthlyBudget: 3000000,
    triggers: ['flash_sale'],
  };
  const err = validateOnboardingForm(form, true);
  assert.match(err, /tên hoặc biệt danh/);
});

test('validateOnboardingForm catches missing goal', () => {
  const form = {
    displayName: 'Minh Anh',
    mainGoal: '',
    targetAmount: 5000000,
    targetDate: '2026-12-31',
    monthlyBudget: 3000000,
    triggers: ['flash_sale'],
  };
  const err = validateOnboardingForm(form, true);
  assert.match(err, /mục tiêu tài chính/);
});

test('validateOnboardingForm catches non-confirmed age', () => {
  const form = {
    displayName: 'Minh Anh',
    mainGoal: 'save_money',
    targetAmount: 5000000,
    targetDate: '2026-12-31',
    monthlyBudget: 3000000,
    triggers: ['flash_sale'],
  };
  const err = validateOnboardingForm(form, false);
  assert.match(err, /đủ 16 tuổi/);
});

test('validateOnboardingForm passes with complete and valid data', () => {
  const form = {
    displayName: 'Chiến Thần Mỏ Hỗn',
    mainGoal: 'reduce_food_drink',
    targetAmount: 5000000,
    targetDate: '2026-12-31',
    monthlyBudget: 4000000,
    triggers: ['food_craving', 'flash_sale'],
  };
  const err = validateOnboardingForm(form, true);
  assert.equal(err, '');
});

test('calculateReadinessScore scales up to 100%', () => {
  const emptyForm = { displayName: '', mainGoal: '', targetAmount: '', targetDate: '', monthlyBudget: '', triggers: [] };
  assert.equal(calculateReadinessScore(emptyForm, false), 0);

  const fullForm = {
    displayName: 'Trùm Tiết Kiệm',
    mainGoal: 'save_money',
    targetAmount: '10000000',
    targetDate: '2026-12-31',
    monthlyBudget: '5000000',
    triggers: ['flash_sale'],
  };
  assert.equal(calculateReadinessScore(fullForm, true), 100);
});
