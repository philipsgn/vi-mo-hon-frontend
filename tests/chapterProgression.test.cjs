const test = require('node:test');
const assert = require('node:assert/strict');
const { CHAPTERS_DATA } = require('../src/utils/chapterConfig.cjs');
const {
  isBossDefeated,
  isChapterUnlocked,
  getChapterStatus,
  getChapterUnlockProgress,
  getActiveChapter,
  getRunnerConfigForChapter
} = require('../src/utils/chapterHelper.cjs');

test('CHAPTERS_DATA contains 3 sequential chapters with complete educational assets', () => {
  assert.equal(CHAPTERS_DATA.length, 3);

  CHAPTERS_DATA.forEach((ch, idx) => {
    assert.equal(ch.number, idx + 1);
    assert.ok(ch.title);
    assert.ok(ch.bossId);
    assert.ok(ch.bossName);
    assert.ok(ch.maxHp > 0);
    assert.ok(ch.lesson);
    assert.ok(ch.lesson.title);
    assert.ok(Array.isArray(ch.lesson.cards) && ch.lesson.cards.length >= 2);
    assert.ok(ch.lesson.quiz);
    assert.ok(ch.lesson.quiz.options.length >= 2);
    assert.ok(Array.isArray(ch.challenges) && ch.challenges.length >= 2);
    assert.ok(ch.runnerConfig && ch.runnerConfig.primaryObstacle && ch.runnerConfig.quizGate);
  });
});

test('Chapter 1 is always unlocked for new players', () => {
  const ch1 = CHAPTERS_DATA[0];
  const userProgress = { discipline: 0, knowledge: 0 };
  const bossStates = {};

  const unlocked = isChapterUnlocked(ch1, userProgress, bossStates);
  assert.equal(unlocked, true);

  const status = getChapterStatus(ch1, userProgress, bossStates);
  assert.equal(status, 'active');
});

test('Chapter 2 stays locked if Boss 1 is not defeated or requirements are not met', () => {
  const ch2 = CHAPTERS_DATA[1];

  // Case A: Boss 1 not defeated yet
  const res1 = isChapterUnlocked(ch2, { discipline: 20, knowledge: 20 }, { 'impulse-boss': { currentHp: 50, status: 'active' } });
  assert.equal(res1, false);

  // Case B: Boss 1 defeated but discipline < 15
  const res2 = isChapterUnlocked(ch2, { discipline: 10, knowledge: 20 }, { 'impulse-boss': { currentHp: 0, status: 'defeated' } });
  assert.equal(res2, false);

  // Case C: Boss 1 defeated and all requirements met
  const res3 = isChapterUnlocked(ch2, { discipline: 15, knowledge: 15 }, { 'impulse-boss': { currentHp: 0, status: 'defeated' } });
  assert.equal(res3, true);

  const status = getChapterStatus(ch2, { discipline: 15, knowledge: 15 }, { 'impulse-boss': { currentHp: 0, status: 'defeated' } });
  assert.equal(status, 'active');
});

test('getChapterUnlockProgress returns detailed checklist for UI card', () => {
  const ch2 = CHAPTERS_DATA[1];
  const progress = getChapterUnlockProgress(
    ch2,
    { discipline: 10, knowledge: 20 },
    { 'impulse-boss': { currentHp: 0, status: 'defeated' } }
  );

  assert.equal(progress.isUnlocked, false);
  assert.equal(progress.requirements.length, 3);

  // Boss requirement
  assert.equal(progress.requirements[0].id, 'prev_boss');
  assert.equal(progress.requirements[0].isMet, true);

  // Discipline requirement: 10/15 -> false
  assert.equal(progress.requirements[1].id, 'discipline');
  assert.equal(progress.requirements[1].current, 10);
  assert.equal(progress.requirements[1].target, 15);
  assert.equal(progress.requirements[1].isMet, false);

  // Knowledge requirement: 20/15 -> true
  assert.equal(progress.requirements[2].id, 'knowledge');
  assert.equal(progress.requirements[2].current, 20);
  assert.equal(progress.requirements[2].target, 15);
  assert.equal(progress.requirements[2].isMet, true);
});

test('getActiveChapter advances from Chapter 1 to Chapter 2 when Chapter 1 is completed', () => {
  // Scenario 1: New user -> Chapter 1
  const active1 = getActiveChapter({ discipline: 0, knowledge: 0 }, { 'impulse-boss': { currentHp: 100, status: 'active' } });
  assert.equal(active1.id, 'chapter-1');

  // Scenario 2: Defeated Boss 1, unlocked Chapter 2 -> Chapter 2
  const active2 = getActiveChapter(
    { discipline: 20, knowledge: 20 },
    { 'impulse-boss': { currentHp: 0, status: 'defeated' }, 'sale-goblin': { currentHp: 150, status: 'active' } }
  );
  assert.equal(active2.id, 'chapter-2');
});

test('getRunnerConfigForChapter returns specific quiz and obstacle configuration', () => {
  const cfg1 = getRunnerConfigForChapter('chapter-1');
  assert.equal(cfg1.primaryObstacle, 'cup');
  assert.ok(cfg1.quizGate.question.includes('Trà sữa'));

  const cfg2 = getRunnerConfigForChapter('chapter-2');
  assert.equal(cfg2.primaryObstacle, 'shopee');
  assert.ok(cfg2.quizGate.question.includes('freeship'));
});
