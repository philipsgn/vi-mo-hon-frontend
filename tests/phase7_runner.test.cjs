const test = require('node:test');
const assert = require('node:assert/strict');
const { createRunnerInitMessage, parseRunnerMessage } = require('../src/utils/runnerBridge.cjs');
const { CHAPTER_1_LESSONS } = require('../src/data/chapter1Lessons');

test('Phase 7: Runner Quiz v2 & Fallback Bridge Integration', async (t) => {
  await t.test('createRunnerInitMessage formats outbound message with Chapter 1 quizzes and 20 target coins', () => {
    const chapter1Quizzes = CHAPTER_1_LESSONS.map((l) => ({ ...l.quiz, lessonTitle: l.title }));
    const payloadStr = createRunnerInitMessage({
      targetBossHp: 2000,
      ticketsRemaining: 3,
      chapterId: 'chapter-1',
      runnerQuizzes: chapter1Quizzes,
      targetCoins: 20,
    });

    const parsed = JSON.parse(payloadStr);
    assert.equal(parsed.type, 'START_RUNNER_GAME');
    assert.equal(parsed.targetBossHp, 2000);
    assert.equal(parsed.chapterId, 'chapter-1');
    assert.equal(parsed.targetCoins, 20);
    assert.equal(parsed.runnerQuizzes.length, 4);
    assert.equal(parsed.runnerQuizzes[0].id, 'q_1_1');
  });

  await t.test('createRunnerInitMessage sets targetCoins to default 20 if omitted', () => {
    const payloadStr = createRunnerInitMessage();
    const parsed = JSON.parse(payloadStr);
    assert.equal(parsed.targetCoins, 20);
  });

  await t.test('parseRunnerMessage parses RUNNER_SESSION_END for 100% quiz pass and rewards', () => {
    const rawData = JSON.stringify({
      type: 'RUNNER_SESSION_END',
      distance: 120,
      coins: 25,
      savingsPoints: 25,
      knowledgePoints: 20,
      damageToBoss: 60,
      isStagePassed: true,
      reason: 'passed',
    });

    const parsed = parseRunnerMessage(rawData);
    assert.ok(parsed);
    assert.equal(parsed.type, 'RUNNER_SESSION_END');
    assert.equal(parsed.isStagePassed, true);
    assert.equal(parsed.coins, 25);
    assert.equal(parsed.knowledgePoints, 20);
    assert.equal(parsed.damageToBoss, 60);
  });

  await t.test('parseRunnerMessage clamps invalid or excessive damage', () => {
    const rawData = JSON.stringify({
      type: 'RUNNER_SESSION_END',
      distance: 50,
      coins: 5,
      savingsPoints: 500, // Should be clamped
      damageToBoss: 999, // Should be clamped
      isStagePassed: false,
    });

    const parsed = parseRunnerMessage(rawData);
    assert.ok(parsed);
    assert.equal(parsed.savingsPoints, 50); // maxSavingsPerRun
    assert.equal(parsed.damageToBoss, 20); // maxBossDamagePerRun when not passed
  });

  await t.test('Chapter 1 Lessons quiz questions are complete and ready for Runner Quiz Gate', () => {
    assert.equal(CHAPTER_1_LESSONS.length, 4);
    CHAPTER_1_LESSONS.forEach((lesson, index) => {
      assert.ok(lesson.quiz);
      assert.ok(lesson.quiz.id);
      assert.ok(lesson.quiz.question.length > 10);
      assert.equal(lesson.quiz.options.length, 4);
      assert.ok(lesson.quiz.correctIndex >= 0 && lesson.quiz.correctIndex < 4);
      assert.ok(lesson.quiz.explanation.length > 10);
    });
  });

  await t.test('QuizFallbackScreen source has 100% pass condition and retry options', () => {
    const fs = require('fs');
    const path = require('path');
    const fallbackSrc = fs.readFileSync(
      path.join(__dirname, '../src/screens/QuizFallbackScreen.js'),
      'utf8'
    );

    assert.ok(fallbackSrc.includes('QuizFallbackScreen'));
    assert.ok(fallbackSrc.includes('totalCorrect === quizList.length'));
    assert.ok(fallbackSrc.includes('isStagePassed: passed'));
    assert.ok(fallbackSrc.includes('TRẮC NGHIỆM TỔNG KẾT'));
    assert.ok(fallbackSrc.includes('THỬ LẠI TỪ ĐẦU'));
  });

  await t.test('RunnerScreenNeo source includes 6s timeout and fallback to QuizFallbackScreen', () => {
    const fs = require('fs');
    const path = require('path');
    const runnerSrc = fs.readFileSync(
      path.join(__dirname, '../src/screens/RunnerScreenNeo.js'),
      'utf8'
    );

    assert.ok(runnerSrc.includes('QuizFallbackScreen'));
    assert.ok(runnerSrc.includes('showTextFallback'));
    assert.ok(runnerSrc.includes('6000')); // 6s timeout
    assert.ok(runnerSrc.includes('LÀM BÀI TRẮC NGHIỆM CHỮ'));
  });
});
