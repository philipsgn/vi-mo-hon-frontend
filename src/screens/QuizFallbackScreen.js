import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { retroTokens } from '../theme/retroTokens';
import { RetroCard } from '../components/common/RetroCard';
import { RetroButton } from '../components/common/RetroButton';
import { CHAPTER_1_LESSONS } from '../data/chapter1Lessons';

/**
 * QuizFallbackScreen: Text-based Quiz exam fallback (T-P7-02)
 * Provides full educational completion path when 3D WebGL is unavailable or user chooses text mode.
 */
export function QuizFallbackScreen({
  quizzes,
  chapterTitle = 'Chương 1: Giải Mã Dòng Tiền & Bản Đồ Thu Chi',
  onClose,
  onComplete,
  onOpenLesson,
}) {
  const quizList = quizzes && quizzes.length > 0
    ? quizzes
    : CHAPTER_1_LESSONS.map((l) => ({
        ...l.quiz,
        lessonId: l.id,
        lessonTitle: l.title,
      }));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]); // [{ index, isCorrect }]
  const [isFinished, setIsFinished] = useState(false);

  const currentQuiz = quizList[currentIndex];
  const isAnswered = selectedOption !== null;
  const isCorrect = isAnswered && selectedOption === currentQuiz?.correctIndex;

  const handleSelectOption = (optIdx) => {
    if (isAnswered) return;
    setSelectedOption(optIdx);
    const correct = optIdx === currentQuiz.correctIndex;
    setAnswers((prev) => [...prev, { questionIndex: currentIndex, selectedIndex: optIdx, isCorrect: correct }]);
  };

  const handleNext = () => {
    if (currentIndex < quizList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
      const totalCorrect = answers.filter((a) => a.isCorrect).length + (isCorrect ? 1 : 0);
      const passed = totalCorrect === quizList.length;
      if (onComplete) {
        onComplete({
          type: 'RUNNER_SESSION_END',
          isStagePassed: passed,
          score: Math.round((totalCorrect / quizList.length) * 100),
          correctCount: totalCorrect,
          totalQuestions: quizList.length,
          coins: passed ? 20 : totalCorrect * 5,
          savingsPoints: passed ? 20 : 10,
          knowledgePoints: totalCorrect * 5,
          damageToBoss: passed ? 60 : totalCorrect * 10,
        });
      }
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setIsFinished(false);
  };

  const totalCorrect = answers.filter((a) => a.isCorrect).length;
  const isPassed = isFinished && totalCorrect === quizList.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* HEADER */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onClose} activeOpacity={0.7}>
          <Ionicons name="close" size={22} color={retroTokens.textPrimary} />
          <Text style={styles.backBtnText}>Đóng</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerBadge}>TRẮC NGHIỆM TỔNG KẾT</Text>
        </View>

        <View style={styles.progressCounter}>
          <Text style={styles.progressText}>
            {isFinished ? `${quizList.length}/${quizList.length}` : `${currentIndex + 1}/${quizList.length}`}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!isFinished ? (
          <>
            {/* PROGRESS BAR */}
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${((currentIndex + 1) / quizList.length) * 100}%` },
                ]}
              />
            </View>

            {/* QUESTION CARD */}
            <RetroCard style={styles.questionCard}>
              <View style={styles.questionMetaRow}>
                <Text style={styles.questionOrderText}>CÂU HỎI {currentIndex + 1}</Text>
                {currentQuiz.lessonTitle ? (
                  <Text style={styles.lessonTag} numberOfLines={1}>
                    📖 {currentQuiz.lessonTitle}
                  </Text>
                ) : null}
              </View>

              <Text style={styles.questionTitle}>{currentQuiz.question}</Text>
            </RetroCard>

            {/* OPTIONS LIST */}
            <View style={styles.optionsWrap}>
              {currentQuiz.options.map((optText, optIdx) => {
                let cardStyle = styles.optionCard;
                let textStyle = styles.optionText;
                let badgeStyle = styles.optionBadge;

                if (isAnswered) {
                  if (optIdx === currentQuiz.correctIndex) {
                    cardStyle = [styles.optionCard, styles.optionCardCorrect];
                    textStyle = [styles.optionText, styles.optionTextCorrect];
                    badgeStyle = [styles.optionBadge, styles.optionBadgeCorrect];
                  } else if (optIdx === selectedOption) {
                    cardStyle = [styles.optionCard, styles.optionCardWrong];
                    textStyle = [styles.optionText, styles.optionTextWrong];
                    badgeStyle = [styles.optionBadge, styles.optionBadgeWrong];
                  }
                }

                return (
                  <TouchableOpacity
                    key={optIdx}
                    style={cardStyle}
                    onPress={() => handleSelectOption(optIdx)}
                    disabled={isAnswered}
                    activeOpacity={0.8}
                  >
                    <View style={badgeStyle}>
                      <Text style={styles.optionLetter}>
                        {['A', 'B', 'C', 'D'][optIdx]}
                      </Text>
                    </View>
                    <Text style={textStyle}>{optText}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* EXPLANATION / FEEDBACK BOX */}
            {isAnswered && (
              <RetroCard
                style={[
                  styles.explanationCard,
                  isCorrect ? styles.explanationCardCorrect : styles.explanationCardWrong,
                ]}
              >
                <View style={styles.explanationHeaderRow}>
                  <Ionicons
                    name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                    size={22}
                    color={isCorrect ? retroTokens.accentMoss : retroTokens.accentBrick}
                  />
                  <Text
                    style={[
                      styles.explanationTitle,
                      { color: isCorrect ? retroTokens.accentMoss : retroTokens.accentBrick },
                    ]}
                  >
                    {isCorrect ? 'CHÍNH XÁC!' : 'CHƯA CHÍNH XÁC!'}
                  </Text>
                </View>
                <Text style={styles.explanationBody}>{currentQuiz.explanation}</Text>

                <View style={styles.nextBtnWrap}>
                  <RetroButton
                    label={currentIndex < quizList.length - 1 ? 'CÂU TIẾP THEO ▶' : 'XEM KẾT QUẢ 🏆'}
                    onPress={handleNext}
                    variant={isCorrect ? 'primary' : 'warning'}
                  />
                </View>
              </RetroCard>
            )}
          </>
        ) : (
          /* RESULT SUMMARY SCREEN */
          <View style={styles.resultContainer}>
            <RetroCard
              style={[
                styles.resultCard,
                isPassed ? styles.resultCardPassed : styles.resultCardFailed,
              ]}
            >
              <View style={styles.resultIconWrap}>
                <Text style={styles.resultIcon}>{isPassed ? '🏆' : '📚'}</Text>
              </View>

              <Text style={styles.resultTitle}>
                {isPassed ? 'XUẤT SẮC! ĐÃ HOÀN THÀNH' : 'CẦN ÔN TẬP THÊM'}
              </Text>

              <Text style={styles.resultScoreText}>
                {totalCorrect} / {quizList.length} CÂU ĐÚNG
              </Text>

              <Text style={styles.resultDesc}>
                {isPassed
                  ? 'Bạn đã nắm vững toàn bộ kiến thức Chương 1 và đủ điều kiện mở khóa chương tiếp theo!'
                  : 'Để vượt qua bài thi tổng kết chương, bạn cần trả lời đúng 100% câu hỏi. Hãy xem lại bài học và thử lại nhé!'}
              </Text>

              {isPassed ? (
                <View style={styles.rewardsBox}>
                  <Text style={styles.rewardItem}>⚡ +60 Sát thương Boss</Text>
                  <Text style={styles.rewardItem}>🪙 +20 Xu ngân sách</Text>
                  <Text style={styles.rewardItem}>🎓 +20 Điểm tri thức</Text>
                </View>
              ) : null}

              <View style={styles.resultActions}>
                {isPassed ? (
                  <RetroButton label="HOÀN THÀNH & TIẾP TỤC" onPress={onClose} variant="primary" />
                ) : (
                  <>
                    <RetroButton label="THỬ LẠI TỪ ĐẦU 🔄" onPress={handleRetry} variant="primary" />
                    <View style={{ height: 10 }} />
                    <RetroButton label="QUAY LẠI HỌC THÊM" onPress={onClose} variant="neutral" />
                  </>
                )}
              </View>
            </RetroCard>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: retroTokens.bgCanvas,
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: retroTokens.bgSurface,
    borderBottomWidth: retroTokens.borderWidth,
    borderBottomColor: retroTokens.borderDark,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: retroTokens.textPrimary,
  },
  headerCenter: {
    backgroundColor: retroTokens.accentSand,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: retroTokens.borderDark,
  },
  headerBadge: {
    fontSize: 11,
    fontWeight: '900',
    color: retroTokens.textPrimary,
    letterSpacing: 0.5,
  },
  progressCounter: {
    backgroundColor: retroTokens.bgSurface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: retroTokens.borderDark,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '900',
    color: retroTokens.accentBrick,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: retroTokens.borderDark,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: retroTokens.accentMoss,
  },
  questionCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: retroTokens.bgSurface,
  },
  questionMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionOrderText: {
    fontSize: 11,
    fontWeight: '900',
    color: retroTokens.textMuted,
    letterSpacing: 0.5,
  },
  lessonTag: {
    fontSize: 11,
    fontWeight: '700',
    color: retroTokens.accentBrick,
    maxWidth: '60%',
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: retroTokens.textPrimary,
    lineHeight: 22,
  },
  optionsWrap: {
    gap: 12,
    marginBottom: 16,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: retroTokens.bgSurface,
    borderWidth: retroTokens.borderWidth,
    borderColor: retroTokens.borderDark,
    borderRadius: 10,
    ...retroTokens.shadowOffset,
  },
  optionCardCorrect: {
    backgroundColor: '#DCFCE7',
    borderColor: retroTokens.accentMoss,
  },
  optionCardWrong: {
    backgroundColor: '#FEE2E2',
    borderColor: retroTokens.accentBrick,
  },
  optionBadge: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: retroTokens.accentSand,
    borderWidth: 1.5,
    borderColor: retroTokens.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionBadgeCorrect: {
    backgroundColor: retroTokens.accentMoss,
    borderColor: retroTokens.borderDark,
  },
  optionBadgeWrong: {
    backgroundColor: retroTokens.accentBrick,
    borderColor: retroTokens.borderDark,
  },
  optionLetter: {
    fontSize: 14,
    fontWeight: '900',
    color: retroTokens.textPrimary,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: retroTokens.textPrimary,
    lineHeight: 20,
  },
  optionTextCorrect: {
    color: '#14532D',
  },
  optionTextWrong: {
    color: '#7F1D1D',
  },
  explanationCard: {
    padding: 16,
    borderWidth: 2,
    marginTop: 4,
  },
  explanationCardCorrect: {
    borderColor: retroTokens.accentMoss,
    backgroundColor: '#F0FDF4',
  },
  explanationCardWrong: {
    borderColor: retroTokens.accentBrick,
    backgroundColor: '#FEF2F2',
  },
  explanationHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  explanationTitle: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  explanationBody: {
    fontSize: 13,
    fontWeight: '600',
    color: retroTokens.textPrimary,
    lineHeight: 19,
    marginBottom: 16,
  },
  nextBtnWrap: {
    marginTop: 4,
  },
  resultContainer: {
    paddingTop: 20,
  },
  resultCard: {
    padding: 24,
    alignItems: 'center',
    textAlign: 'center',
  },
  resultCardPassed: {
    borderColor: retroTokens.accentMoss,
  },
  resultCardFailed: {
    borderColor: retroTokens.accentBrick,
  },
  resultIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: retroTokens.accentSand,
    borderWidth: 2,
    borderColor: retroTokens.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  resultIcon: {
    fontSize: 36,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: retroTokens.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  resultScoreText: {
    fontSize: 22,
    fontWeight: '900',
    color: retroTokens.accentBrick,
    marginBottom: 12,
  },
  resultDesc: {
    fontSize: 13,
    fontWeight: '600',
    color: retroTokens.textMuted,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  rewardsBox: {
    width: '100%',
    backgroundColor: '#DCFCE7',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: retroTokens.accentMoss,
    gap: 6,
    marginBottom: 20,
  },
  rewardItem: {
    fontSize: 13,
    fontWeight: '800',
    color: '#14532D',
  },
  resultActions: {
    width: '100%',
  },
});
