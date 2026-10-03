const test = require('node:test');
const assert = require('node:assert/strict');
const { extractGameMetrics } = require('../src/utils/homeHelper.cjs');

test('extractGameMetrics correctly parses full dashboard payload', () => {
  const mockDashboard = {
    profile: {
      streak: 7,
      level: 5,
      coins: 850,
      discipline: 90,
      monthlyBudget: 3000000,
      monthlySpent: 1200000,
    },
    boss: {
      name: 'Quái Vật Trà Sữa',
      currentHp: 4000,
      maxHp: 10000,
      status: 'active',
    },
    todayChallenge: {
      id: 'c1',
      title: 'Không uống trà sữa',
      rewardXp: 50,
      bossDamage: 500,
    },
  };

  const metrics = extractGameMetrics(mockDashboard);

  assert.equal(metrics.streak, 7);
  assert.equal(metrics.level, 5);
  assert.equal(metrics.coins, 850);
  assert.equal(metrics.discipline, 90);
  assert.equal(metrics.bossName, 'Quái Vật Trà Sữa');
  assert.equal(metrics.bossCurrentHp, 4000);
  assert.equal(metrics.bossHpPercentage, 0.4);
  assert.equal(metrics.isBossDefeated, false);
  assert.equal(metrics.remainingBudget, 1800000);
});

test('extractGameMetrics handles null or empty dashboard with safe RPG defaults', () => {
  const metrics = extractGameMetrics(null);

  assert.equal(metrics.streak, 1);
  assert.equal(metrics.level, 1);
  assert.equal(metrics.coins, 0);
  assert.equal(metrics.bossName, 'Quái Vật Trà Sữa');
  assert.equal(metrics.isBossDefeated, false);
  assert.equal(metrics.remainingBudget, 0);
});
