const test = require('node:test');
const assert = require('node:assert/strict');

const { CHAPTERS_DATA } = require('../src/utils/chapterConfig.cjs');
const {
  ULTIMATE_SKILLS,
  getSkillByChapter,
  getSkillsByChapter,
  calculateBattleTurn
} = require('../src/utils/ultimateSkills.cjs');
const { parseRunnerMessage, createRunnerInitMessage } = require('../src/utils/runnerBridge.cjs');
const { parseBattleMessage, createBattleInitMessage } = require('../src/utils/bossBattleBridge.cjs');

test('Dual 3D Games Ecosystem - 3 Chapters Data & Real-life Quizzes', async (t) => {
  await t.test('all 3 chapters exist with proper themes and configs', () => {
    assert.strictEqual(CHAPTERS_DATA.length, 3);
    const [ch1, ch2, ch3] = CHAPTERS_DATA;

    assert.strictEqual(ch1.id, 'chapter-1');
    assert.strictEqual(ch1.bossName, 'Quái Vật Trà Sữa');
    assert.strictEqual(ch1.environmentTheme, 'boba_street');
    assert.strictEqual(ch1.maxHp, 100);

    assert.strictEqual(ch2.id, 'chapter-2');
    assert.strictEqual(ch2.bossName, 'Chiến Thần Chốt Đơn Shopee');
    assert.strictEqual(ch2.environmentTheme, 'sale_avenue');
    assert.strictEqual(ch2.maxHp, 150);

    assert.strictEqual(ch3.id, 'chapter-3');
    assert.strictEqual(ch3.bossName, 'Quỷ Vương FOMO Đu Trend');
    assert.strictEqual(ch3.environmentTheme, 'cyber_lounge');
    assert.strictEqual(ch3.maxHp, 200);
  });

  await t.test('each chapter contains 3 realistic runner quizzes mapped to skill rewards', () => {
    CHAPTERS_DATA.forEach(ch => {
      assert.ok(Array.isArray(ch.runnerQuizzes), `${ch.id} must have runnerQuizzes array`);
      assert.strictEqual(ch.runnerQuizzes.length, 3, `${ch.id} must have exactly 3 runner quizzes`);

      ch.runnerQuizzes.forEach(q => {
        assert.ok(q.question && q.question.length > 5, 'Quiz must have a question');
        assert.ok(q.laneLeft && q.laneRight, 'Quiz must have laneLeft and laneRight options');
        assert.ok(q.correctLane === 0 || q.correctLane === 1 || q.correctLane === 2, 'correctLane must be valid lane');
        assert.ok(q.rewardSkillId, 'Quiz must provide rewardSkillId');
        assert.ok(ULTIMATE_SKILLS[q.rewardSkillId], `rewardSkillId ${q.rewardSkillId} must exist in registry`);
      });
    });
  });
});

test('Dual 3D Games Ecosystem - 9 Ultimate Skills Registry & 3D Arena RPG Logic', async (t) => {
  await t.test('all 9 skills are registered across 3 chapters', () => {
    const skillKeys = Object.keys(ULTIMATE_SKILLS);
    assert.strictEqual(skillKeys.length, 9);

    const ch1Skills = getSkillsByChapter('chapter-1');
    assert.strictEqual(ch1Skills.length, 3);
    assert.deepStrictEqual(ch1Skills.map(s => s.id), ['water_splash', 'cold_tumbler', 'freeze_delay']);

    const ch2Skills = getSkillsByChapter('chapter-2');
    assert.strictEqual(ch2Skills.length, 3);
    assert.deepStrictEqual(ch2Skills.map(s => s.id), ['cart_purge', 'freeship_breaker', 'order_cancel']);

    const ch3Skills = getSkillsByChapter('chapter-3');
    assert.strictEqual(ch3Skills.length, 3);
    assert.deepStrictEqual(ch3Skills.map(s => s.id), ['golden_slash', 'credit_cut', 'emergency_fund']);
  });

  await t.test('weakness counter triggers x2 damage in battle turn', () => {
    // Chapter 1 Boss vs Water Splash (Counter)
    const turn1 = calculateBattleTurn('water_splash', { hp: 100, attack: 18 }, { hp: 100, shield: 0 }, 'chapter-1');
    assert.strictEqual(turn1.isCriticalCounter, true);
    assert.strictEqual(turn1.damageDealt, 70); // 35 * 2
    assert.strictEqual(turn1.newBossHp, 30); // 100 - 70

    // Chapter 2 Boss vs Water Splash (Not Counter)
    const turn2 = calculateBattleTurn('water_splash', { hp: 150, attack: 26 }, { hp: 100, shield: 0 }, 'chapter-2');
    assert.strictEqual(turn2.isCriticalCounter, false);
    assert.strictEqual(turn2.damageDealt, 35);
    assert.strictEqual(turn2.newBossHp, 115); // 150 - 35
  });

  await t.test('shield absorbs boss damage', () => {
    // Mascot uses Cold Tumbler (+30 Shield, 15 DMG)
    const turn = calculateBattleTurn('cold_tumbler', { hp: 100, attack: 20 }, { hp: 100, shield: 0 }, 'chapter-1');
    assert.strictEqual(turn.damageDealt, 15);
    assert.strictEqual(turn.newBossHp, 85);
    // Boss attacks with 20, but Mascot gained 30 shield => shield absorbs all 20, 10 shield remains, mascot hp intact (100)
    assert.strictEqual(turn.bossDamageDealt, 0);
    assert.strictEqual(turn.newShield, 10);
    assert.strictEqual(turn.newMascotHp, 100);
  });

  await t.test('stun freeze cancels boss attack', () => {
    const turn = calculateBattleTurn('freeze_delay', { hp: 100, attack: 25 }, { hp: 100, shield: 0 }, 'chapter-1');
    assert.strictEqual(turn.stunTriggered, true);
    assert.strictEqual(turn.bossDamageDealt, 0);
    assert.strictEqual(turn.newMascotHp, 100);
  });

  await t.test('boss defeat condition verified', () => {
    // Boss has 50 HP, Player uses Water Splash on Ch1 (70 DMG)
    const turn = calculateBattleTurn('water_splash', { hp: 50, attack: 18 }, { hp: 100, shield: 0 }, 'chapter-1');
    assert.strictEqual(turn.newBossHp, 0);
    assert.strictEqual(turn.isBossDefeated, true);
  });
});

test('Dual 3D Games Ecosystem - Bridges Communication & Capped Validation', async (t) => {
  await t.test('runnerBridge decodes collected skills and stage configs', () => {
    const rawPayload = JSON.stringify({
      type: 'RUNNER_SESSION_END',
      distance: 310,
      coins: 35,
      isStagePassed: true,
      hasUltimateSkill: true,
      collectedSkills: ['water_splash', 'cold_tumbler'],
      damageToBoss: 50,
      reason: 'stage_clear'
    });

    const parsed = parseRunnerMessage(rawPayload);
    assert.strictEqual(parsed.type, 'RUNNER_SESSION_END');
    assert.strictEqual(parsed.isStagePassed, true);
    assert.deepStrictEqual(parsed.collectedSkills, ['water_splash', 'cold_tumbler']);
    assert.strictEqual(parsed.coins, 35);
    assert.strictEqual(parsed.damageToBoss, 50);

    const initMsg = JSON.parse(createRunnerInitMessage({
      chapterId: 'chapter-2',
      runnerQuizzes: [{ question: 'Test Q' }]
    }));
    assert.strictEqual(initMsg.type, 'START_RUNNER_GAME');
    assert.strictEqual(initMsg.chapterId, 'chapter-2');
    assert.strictEqual(initMsg.runnerQuizzes.length, 1);
  });

  await t.test('bossBattleBridge parses actions and enforces 300 HP damage cap', () => {
    const actionPayload = JSON.stringify({
      type: 'BATTLE_ACTION',
      actor: 'player',
      skillId: 'cart_purge',
      damageDealt: 90,
      isCritical: true,
      bossHpLeft: 60,
      playerHpLeft: 100
    });
    const parsedAction = parseBattleMessage(actionPayload);
    assert.strictEqual(parsedAction.type, 'BATTLE_ACTION');
    assert.strictEqual(parsedAction.isCritical, true);
    assert.strictEqual(parsedAction.damageDealt, 90);

    // Over-capped damage test
    const endPayload = JSON.stringify({
      type: 'BATTLE_END',
      result: 'victory',
      turnsTaken: 4,
      damageDealtTotal: 999999, // Attempted cheat or bug
      bossHpRemaining: 0,
      playerHpRemaining: 70
    });
    const parsedEnd = parseBattleMessage(endPayload);
    assert.strictEqual(parsedEnd.result, 'victory');
    assert.strictEqual(parsedEnd.damageDealtTotal, 300); // Enforces 300 cap
    assert.strictEqual(parsedEnd.turnsTaken, 4);

    const initMsg = JSON.parse(createBattleInitMessage({
      chapterId: 'chapter-3',
      avatarId: 'fox',
      bossHp: 200,
      bossAttack: 32,
      equippedSkills: ['golden_slash', 'credit_cut']
    }));
    assert.strictEqual(initMsg.type, 'START_BATTLE');
    assert.strictEqual(initMsg.chapterId, 'chapter-3');
    assert.strictEqual(initMsg.avatarId, 'fox');
    assert.strictEqual(initMsg.bossHp, 200);
    assert.deepStrictEqual(initMsg.equippedSkills, ['golden_slash', 'credit_cut']);
  });
});
