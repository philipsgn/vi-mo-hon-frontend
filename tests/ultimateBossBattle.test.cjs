const test = require('node:test');
const assert = require('node:assert/strict');
const { CHAPTERS_DATA } = require('../src/utils/chapterConfig.cjs');
const {
  ULTIMATE_SKILLS,
  getSkillByChapter,
  calculateRealLifeImpact,
} = require('../src/utils/ultimateSkills.cjs');
const {
  canPurchaseLesson,
  purchaseLesson,
  evaluateStageRunResult,
} = require('../src/utils/chapterHelper.cjs');

test('ULTIMATE_SKILLS defines distinct skills for each chapter with substantial damage', () => {
  assert.ok(ULTIMATE_SKILLS.water_splash);
  assert.equal(ULTIMATE_SKILLS.water_splash.chapterId, 'chapter-1');
  assert.equal(ULTIMATE_SKILLS.water_splash.damage, 35);

  assert.ok(ULTIMATE_SKILLS.cart_purge);
  assert.equal(ULTIMATE_SKILLS.cart_purge.chapterId, 'chapter-2');
  assert.equal(ULTIMATE_SKILLS.cart_purge.damage, 45);

  assert.ok(ULTIMATE_SKILLS.golden_slash);
  assert.equal(ULTIMATE_SKILLS.golden_slash.chapterId, 'chapter-3');
  assert.equal(ULTIMATE_SKILLS.golden_slash.damage, 60);

  const s1 = getSkillByChapter('chapter-1');
  assert.equal(s1.id, 'water_splash');

  const s2 = getSkillByChapter('chapter-2');
  assert.equal(s2.id, 'cart_purge');

  const s3 = getSkillByChapter('chapter-3');
  assert.equal(s3.id, 'golden_slash');
});

test('calculateRealLifeImpact triggers boss heal and enrage on overspending', () => {
  // Scenario 1: Spending within budget
  const safe = calculateRealLifeImpact(100000, 500000);
  assert.equal(safe.bossHeal, 0);
  assert.equal(safe.isEnraged, false);

  // Scenario 2: Overspending beyond budget
  const over = calculateRealLifeImpact(600000, 100000);
  assert.ok(over.bossHeal > 0);
  assert.equal(over.isEnraged, true);
  assert.match(over.message, /Cuồng Nộ/);
});

test('canPurchaseLesson and purchaseLesson deduct in-game coins properly', () => {
  const ch1 = CHAPTERS_DATA[0]; // coinCost: 30
  assert.equal(ch1.coinCost, 30);

  // Insufficient coins
  assert.equal(canPurchaseLesson(ch1, 20), false);
  assert.throws(() => purchaseLesson(ch1, 20), /30 Xu/);

  // Sufficient coins
  assert.equal(canPurchaseLesson(ch1, 50), true);
  const result = purchaseLesson(ch1, 50);
  assert.equal(result.remainingCoins, 20);
  assert.equal(result.unlockedLessonId, 'lesson-ch1');
  assert.equal(result.success, true);
});

test('CHAPTERS_DATA contains rich Quizlet 2-sided flashcards', () => {
  CHAPTERS_DATA.forEach((ch) => {
    assert.ok(Array.isArray(ch.lesson.flashcards) && ch.lesson.flashcards.length >= 3);
    ch.lesson.flashcards.forEach((fc) => {
      assert.ok(fc.front, 'Flashcard must have front text');
      assert.ok(fc.back, 'Flashcard must have back text');
      assert.ok(fc.icon, 'Flashcard must have icon');
      assert.ok(fc.actionTip, 'Flashcard must have actionable tip');
    });
  });
});

test('evaluateStageRunResult accurately checks 3-star clear conditions', () => {
  const stageConfig = {
    targetDistance: 400,
    targetCoins: 30,
    requireQuizPass: true,
  };

  // Case 1: Perfect Run -> Passed
  const perfect = evaluateStageRunResult(stageConfig, {
    distance: 420,
    coins: 35,
    crashed: false,
    quizAnswersCorrect: 1,
    quizGatesTotal: 1,
  });
  assert.equal(perfect.isStagePassed, true);
  assert.equal(perfect.criteria.distance.isMet, true);
  assert.equal(perfect.criteria.coins.isMet, true);
  assert.equal(perfect.criteria.quiz.isMet, true);

  // Case 2: Crashed at 350m -> Failed
  const crashedRun = evaluateStageRunResult(stageConfig, {
    distance: 350,
    coins: 35,
    crashed: true,
    quizAnswersCorrect: 1,
    quizGatesTotal: 1,
  });
  assert.equal(crashedRun.isStagePassed, false);
  assert.equal(crashedRun.criteria.distance.isMet, false);

  // Case 3: Reached 400m without crash but failed quiz -> Failed
  const wrongQuizRun = evaluateStageRunResult(stageConfig, {
    distance: 400,
    coins: 35,
    crashed: false,
    quizAnswersCorrect: 0,
    quizGatesTotal: 1,
  });
  assert.equal(wrongQuizRun.isStagePassed, false);
  assert.equal(wrongQuizRun.criteria.quiz.isMet, false);

  // Case 4: Reached 400m, correct quiz, but insufficient coins -> Failed
  const lowCoinRun = evaluateStageRunResult(stageConfig, {
    distance: 400,
    coins: 15,
    crashed: false,
    quizAnswersCorrect: 1,
    quizGatesTotal: 1,
  });
  assert.equal(lowCoinRun.isStagePassed, false);
  assert.equal(lowCoinRun.criteria.coins.isMet, false);
});
