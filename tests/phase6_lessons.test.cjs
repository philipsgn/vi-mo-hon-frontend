const test = require('node:test');
const assert = require('node:assert/strict');
const { CHAPTER_1_LESSONS } = require('../src/data/chapter1Lessons');

test('Phase 6: Chapter 1 Lessons Structure & 7-Part Schema', async (t) => {
  await t.test('CHAPTER_1_LESSONS contains exactly 4 lessons for Chapter 1', () => {
    assert.equal(CHAPTER_1_LESSONS.length, 4);
    assert.deepEqual(
      CHAPTER_1_LESSONS.map((l) => l.id),
      ['1.1', '1.2', '1.3', '1.4']
    );
  });

  await t.test('All 4 lessons conform strictly to the 7-part educational schema in LESSONS.md', () => {
    CHAPTER_1_LESSONS.forEach((lesson) => {
      // 1. Tình huống đời thực tại VN (Real Vietnamese scenario)
      assert.ok(lesson.story, `Lesson ${lesson.id} must have story`);
      assert.ok(
        typeof lesson.story === 'string' ? lesson.story.length > 30 : lesson.story.content.length > 30,
        `Story in ${lesson.id} should be sufficiently detailed`
      );

      // 2. Khái niệm cốt lõi & Cơ chế tâm lý
      assert.ok(lesson.coreConcept, `Lesson ${lesson.id} must have coreConcept`);
      assert.ok(
        typeof lesson.coreConcept === 'string'
          ? lesson.coreConcept.length > 30
          : lesson.coreConcept.explanation.length > 30,
        `coreConcept in ${lesson.id} should be sufficiently detailed`
      );

      // 3. Ví dụ số liệu cụ thể bằng VNĐ
      assert.ok(lesson.exampleVnd || lesson.vndExample, `Lesson ${lesson.id} must have exampleVnd`);
      const exampleText = lesson.exampleVnd || lesson.vndExample;
      assert.ok(typeof exampleText === 'string' ? exampleText.includes('000') : true);

      // 4. Sai lầm thường gặp
      const mistakes = lesson.mistakes || lesson.commonMistakes;
      assert.ok(Array.isArray(mistakes), `Lesson ${lesson.id} mistakes must be array`);
      assert.ok(mistakes.length >= 2, `Lesson ${lesson.id} needs at least 2 common mistakes`);

      // 5. Hành động áp dụng ngay trong App
      assert.ok(lesson.appAction || lesson.appActions, `Lesson ${lesson.id} appAction must exist`);

      // 6. 3 Điểm cốt lõi cần nhớ
      assert.ok(Array.isArray(lesson.keyTakeaways), `Lesson ${lesson.id} keyTakeaways must be array`);
      assert.equal(lesson.keyTakeaways.length, 3, `Lesson ${lesson.id} must have exactly 3 key takeaways`);

      // 7. Nguồn tham khảo & Tuyên bố pháp lý giáo dục
      assert.ok(lesson.references, `Lesson ${lesson.id} references must exist`);
      assert.ok(lesson.legalDisclaimer || lesson.disclaimer, `Lesson ${lesson.id} must have legal disclaimer`);
      const disc = lesson.legalDisclaimer || lesson.disclaimer;
      assert.match(disc, /mục đích giáo dục|không phải lời khuyên đầu tư/i);
    });
  });

  await t.test('All lessons have valid interactive quiz questions with 4 options and explanations', () => {
    CHAPTER_1_LESSONS.forEach((lesson) => {
      assert.ok(lesson.quiz, `Lesson ${lesson.id} must have quiz`);
      assert.ok(lesson.quiz.question, `Lesson ${lesson.id} quiz must have question`);
      assert.equal(lesson.quiz.options.length, 4, `Lesson ${lesson.id} quiz must have 4 options`);
      assert.ok(
        typeof lesson.quiz.correctIndex === 'number' &&
        lesson.quiz.correctIndex >= 0 &&
        lesson.quiz.correctIndex < 4,
        `Lesson ${lesson.id} correctIndex must be 0, 1, 2, or 3`
      );
      assert.ok(lesson.quiz.explanation, `Lesson ${lesson.id} quiz must have explanation`);
    });
  });

  await t.test('Lesson metadata includes estimated duration, chapterId, and ordering', () => {
    CHAPTER_1_LESSONS.forEach((lesson) => {
      assert.equal(lesson.chapterId, 1);
      assert.ok(lesson.order >= 1 && lesson.order <= 4);
      assert.ok(lesson.duration);
      assert.ok(lesson.title);
    });
  });
});
