/**
 * Helper tính toán tiến trình Chapter & Điều kiện mở khóa
 * Saga Progression Spec - Ví Mỏ Hỗn
 */

const { CHAPTERS_DATA } = require('./chapterConfig.cjs');

/**
 * Kiểm tra xem Boss tương ứng đã bị hạ gục chưa
 */
function isBossDefeated(bossId, bossStates) {
  if (!bossId) return true;
  if (!bossStates) return false;

  // Trường hợp bossStates là object đơn của boss hiện tại
  if (bossStates.bossId === bossId || bossStates.id === bossId) {
    return bossStates.status === 'defeated' || (Number(bossStates.currentHp) === 0);
  }

  // Trường hợp bossStates là map { [bossId]: { status, currentHp } }
  if (bossStates[bossId]) {
    const b = bossStates[bossId];
    return b.status === 'defeated' || (Number(b.currentHp) === 0);
  }

  return false;
}

/**
 * Kiểm tra xem Chapter có đủ điều kiện mở khóa không
 */
function isChapterUnlocked(chapter, userProgress = {}, bossStates = {}) {
  if (!chapter) return false;
  const req = chapter.unlockRequirements;
  if (!req) return true;

  // 1. Kiểm tra Boss trước đã bị diệt chưa
  if (req.requirePrevBoss) {
    if (!isBossDefeated(req.requirePrevBoss, bossStates)) {
      return false;
    }
  }

  // 2. Kiểm tra Điểm Kỷ Luật (Discipline)
  const userDiscipline = Number(userProgress.discipline) || 0;
  if (userDiscipline < req.minDiscipline) {
    return false;
  }

  // 3. Kiểm tra Điểm Kiến Thức (Knowledge)
  const userKnowledge = Number(userProgress.knowledge) || 0;
  if (userKnowledge < req.minKnowledge) {
    return false;
  }

  return true;
}

/**
 * Lấy trạng thái của Chapter: 'completed' | 'active' | 'locked'
 */
function getChapterStatus(chapter, userProgress = {}, bossStates = {}) {
  if (!chapter) return 'locked';

  // Nếu Boss của chính chapter này đã bị hạ ➔ completed
  if (isBossDefeated(chapter.bossId, bossStates)) {
    return 'completed';
  }

  // Nếu đủ điều kiện mở ➔ active
  if (isChapterUnlocked(chapter, userProgress, bossStates)) {
    return 'active';
  }

  return 'locked';
}

/**
 * Lấy chi tiết tiến trình mở khóa để hiển thị lên thẻ Unlock Gate
 */
function getChapterUnlockProgress(chapter, userProgress = {}, bossStates = {}) {
  if (!chapter) return { isUnlocked: false, requirements: [] };

  const req = chapter.unlockRequirements || { minDiscipline: 0, minKnowledge: 0, requirePrevBoss: null };
  const userDiscipline = Number(userProgress.discipline) || 0;
  const userKnowledge = Number(userProgress.knowledge) || 0;

  const requirements = [];

  // Yêu cầu diệt Boss trước
  if (req.requirePrevBoss) {
    const prevDefeated = isBossDefeated(req.requirePrevBoss, bossStates);
    requirements.push({
      id: 'prev_boss',
      label: 'Hạ gục Boss chương trước',
      current: prevDefeated ? 1 : 0,
      target: 1,
      isMet: prevDefeated,
      unit: ''
    });
  }

  // Yêu cầu Điểm Kỷ luật
  if (req.minDiscipline > 0) {
    requirements.push({
      id: 'discipline',
      label: 'Điểm Kỷ Luật (Discipline)',
      current: userDiscipline,
      target: req.minDiscipline,
      isMet: userDiscipline >= req.minDiscipline,
      unit: 'Điểm'
    });
  }

  // Yêu cầu Điểm Kiến thức
  if (req.minKnowledge > 0) {
    requirements.push({
      id: 'knowledge',
      label: 'Điểm Kiến Thức (Knowledge)',
      current: userKnowledge,
      target: req.minKnowledge,
      isMet: userKnowledge >= req.minKnowledge,
      unit: 'Điểm'
    });
  }

  const isUnlocked = requirements.every(r => r.isMet);

  return {
    isUnlocked,
    requirements
  };
}

/**
 * Tìm Chapter đang hoạt động (active) hiện tại của người chơi
 */
function getActiveChapter(userProgress = {}, bossStates = {}) {
  for (const ch of CHAPTERS_DATA) {
    const status = getChapterStatus(ch, userProgress, bossStates);
    if (status === 'active') {
      return ch;
    }
  }

  // Nếu tất cả đã hoàn thành, trả về Chapter cuối
  return CHAPTERS_DATA[CHAPTERS_DATA.length - 1];
}

/**
 * Lấy cấu hình runner cho một chapter cụ thể
 */
function getRunnerConfigForChapter(chapterId) {
  const chapter = CHAPTERS_DATA.find(c => c.id === chapterId) || CHAPTERS_DATA[0];
  return chapter.runnerConfig || CHAPTERS_DATA[0].runnerConfig;
}

/**
 * Kiểm tra xem người dùng có đủ Xu để mua mở khóa bài học không
 */
function canPurchaseLesson(chapter, userCoins = 0) {
  if (!chapter) return false;
  const cost = Number(chapter.coinCost) || 0;
  return Number(userCoins) >= cost;
}

/**
 * Mua mở khóa bài học, trừ Xu tương ứng
 */
function purchaseLesson(chapter, currentCoins = 0) {
  if (!canPurchaseLesson(chapter, currentCoins)) {
    throw new Error(`Bạn cần tối thiểu ${chapter.coinCost} Xu để mở khóa bài học này!`);
  }
  const cost = Number(chapter.coinCost) || 0;
  return {
    remainingCoins: Math.max(0, currentCoins - cost),
    unlockedLessonId: chapter.lesson.id,
    success: true,
  };
}

/**
 * Đánh giá kết quả ván chạy Stage Runner Subway Surfers theo 3 tiêu chí
 */
function evaluateStageRunResult(stageConfig = {}, runSummary = {}) {
  const targetDistance = Number(stageConfig.targetDistance) || 300;
  const targetCoins = Number(stageConfig.targetCoins) || 30;
  const requireQuizPass = Boolean(stageConfig.requireQuizPass);

  const actualDistance = Number(runSummary.distance) || 0;
  const actualCoins = Number(runSummary.coins) || 0;
  const crashed = Boolean(runSummary.crashed);
  const quizAnswersCorrect = Number(runSummary.quizAnswersCorrect) || 0;
  const quizGatesTotal = Number(runSummary.quizGatesTotal) || 0;

  // 1. Quãng đường & không va chạm
  const distanceCleared = actualDistance >= targetDistance && !crashed;

  // 2. Nhặt đủ Xu mục tiêu
  const coinsCleared = actualCoins >= targetCoins;

  // 3. Trả lời đúng 100% Cổng Quiz (nếu có yêu cầu)
  const quizCleared = !requireQuizPass || (quizGatesTotal > 0 && quizAnswersCorrect >= quizGatesTotal);

  // Qua màn thành công khi thỏa mãn cả 3 tiêu chí
  const isStagePassed = distanceCleared && coinsCleared && quizCleared;

  return {
    isStagePassed,
    criteria: {
      distance: {
        current: actualDistance,
        target: targetDistance,
        isMet: distanceCleared,
        crashed,
      },
      coins: {
        current: actualCoins,
        target: targetCoins,
        isMet: coinsCleared,
      },
      quiz: {
        current: quizAnswersCorrect,
        target: quizGatesTotal,
        required: requireQuizPass,
        isMet: quizCleared,
      },
    },
  };
}

module.exports = {
  isBossDefeated,
  isChapterUnlocked,
  getChapterStatus,
  getChapterUnlockProgress,
  getActiveChapter,
  getRunnerConfigForChapter,
  canPurchaseLesson,
  purchaseLesson,
  evaluateStageRunResult,
};
