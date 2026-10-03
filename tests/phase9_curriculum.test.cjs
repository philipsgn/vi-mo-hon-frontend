const test = require('node:test');
const assert = require('node:assert/strict');
const {
  CURRICULUM_CHAPTERS,
  ALL_CURRICULUM_LESSONS,
  getLessonsByChapter,
  getChapterById,
} = require('../src/data/curriculumData');

test('Phase 9 - T-P9-01: Full 7-Chapter Curriculum Structure Verification', async (t) => {
  await t.test('CURRICULUM_CHAPTERS contains exactly 7 chapters with correct metadata', () => {
    assert.equal(CURRICULUM_CHAPTERS.length, 7);
    const expectedIds = [1, 2, 3, 4, 5, 6, 7];
    assert.deepEqual(
      CURRICULUM_CHAPTERS.map((c) => c.id),
      expectedIds
    );

    CURRICULUM_CHAPTERS.forEach((chapter) => {
      assert.ok(chapter.title);
      assert.ok(chapter.subtitle);
      assert.ok(chapter.icon);
      assert.ok(chapter.badgeTitle);
      assert.ok(chapter.lessonsCount > 0);
      assert.equal(chapter.lessons.length, chapter.lessonsCount);
    });
  });

  await t.test('ALL_CURRICULUM_LESSONS contains exactly 30 specialized financial lessons', () => {
    assert.equal(ALL_CURRICULUM_LESSONS.length, 30);
  });

  await t.test('All 30 lessons across all 7 chapters conform strictly to the 7-part schema in LESSONS.md', () => {
    ALL_CURRICULUM_LESSONS.forEach((lesson) => {
      // 1. Tình huống đời thực tại VN
      assert.ok(lesson.story, `Lesson ${lesson.id} must have story`);
      assert.ok(lesson.story.length > 30, `Lesson ${lesson.id} story should be detailed`);

      // 2. Khái niệm cốt lõi & Cơ chế tâm lý
      assert.ok(lesson.coreConcept, `Lesson ${lesson.id} must have coreConcept`);
      assert.ok(lesson.coreConcept.length > 30, `Lesson ${lesson.id} coreConcept should be detailed`);

      // 3. Ví dụ số liệu cụ thể bằng VNĐ
      assert.ok(lesson.exampleVnd, `Lesson ${lesson.id} must have exampleVnd`);
      assert.match(lesson.exampleVnd, /000|đ|VNĐ/i, `Lesson ${lesson.id} must contain VNĐ numbers`);

      // 4. Sai lầm thường gặp
      assert.ok(Array.isArray(lesson.mistakes), `Lesson ${lesson.id} mistakes must be array`);
      assert.ok(lesson.mistakes.length >= 2, `Lesson ${lesson.id} must have at least 2 mistakes`);

      // 5. Hành động áp dụng ngay trong App
      assert.ok(lesson.appAction, `Lesson ${lesson.id} must have appAction`);
      assert.ok(lesson.appAction.length > 15, `Lesson ${lesson.id} appAction should be actionable`);

      // 6. 3 Điểm cốt lõi cần nhớ
      assert.ok(Array.isArray(lesson.keyTakeaways), `Lesson ${lesson.id} keyTakeaways must be array`);
      assert.equal(lesson.keyTakeaways.length, 3, `Lesson ${lesson.id} must have exactly 3 key takeaways`);

      // 7. Nguồn tham khảo & Tuyên bố pháp lý giáo dục
      assert.ok(lesson.references, `Lesson ${lesson.id} must have references`);
      assert.ok(lesson.legalDisclaimer, `Lesson ${lesson.id} must have legalDisclaimer`);
      assert.match(
        lesson.legalDisclaimer,
        /mục đích giáo dục.*không phải là lời khuyên đầu tư tài chính chuyên nghiệp/i
      );

      // Quiz Gate verification
      assert.ok(lesson.quiz, `Lesson ${lesson.id} must have quiz`);
      assert.ok(lesson.quiz.id);
      assert.ok(lesson.quiz.question.length > 10);
      assert.equal(lesson.quiz.options.length, 4, `Quiz in ${lesson.id} must have 4 options`);
      assert.ok(
        typeof lesson.quiz.correctIndex === 'number' &&
        lesson.quiz.correctIndex >= 0 &&
        lesson.quiz.correctIndex < 4
      );
      assert.ok(lesson.quiz.explanation.length > 10);
    });
  });

  await t.test('Helper functions getLessonsByChapter and getChapterById work accurately', () => {
    const ch2Lessons = getLessonsByChapter(2);
    assert.equal(ch2Lessons.length, 5);
    assert.equal(ch2Lessons[0].id, '2.1');

    const ch4 = getChapterById(4);
    assert.equal(ch4.id, 4);
    assert.equal(ch4.lessonsCount, 5);
  });
});

test('Phase 9 - T-P9-02: LessonsScreen UI and Chapter Navigation Verification', async (t) => {
  await t.test('LessonsScreen source code includes 7 chapters expansion and runner triggers', () => {
    const fs = require('fs');
    const path = require('path');
    const screenSrc = fs.readFileSync(
      path.join(__dirname, '../src/screens/LessonsScreen.js'),
      'utf8'
    );

    assert.ok(screenSrc.includes('LessonsScreen'));
    assert.ok(screenSrc.includes('CURRICULUM_CHAPTERS'));
    assert.ok(screenSrc.includes('activeChapterId'));
    assert.ok(screenSrc.includes('THI TỔNG KẾT CHƯƠNG'));
    assert.ok(screenSrc.includes('completedLessonIds'));
  });
});
