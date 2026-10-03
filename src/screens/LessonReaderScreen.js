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

export function LessonReaderScreen({
  lesson,
  allLessons = [],
  onBack,
  onFinishLesson,
  onNavigateLesson,
  onOpenRunner,
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  if (!lesson) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>Không tìm thấy nội dung bài học.</Text>
          <RetroButton label="QUAY LẠI" onPress={onBack} />
        </View>
      </SafeAreaView>
    );
  }

  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const quiz = lesson.quiz;
  const isCorrect = selectedOption !== null && selectedOption === quiz?.correctIndex;

  const handleSelectQuizOption = (idx) => {
    setSelectedOption(idx);
    setShowExplanation(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color={retroTokens.textPrimary} />
          <Text style={styles.backBtnText}>Danh sách bài</Text>
        </TouchableOpacity>

        <View style={styles.headerMeta}>
          <Text style={styles.durationBadge}>⏱ {lesson.duration || '5 phút'}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* TITLE SECTION */}
        <View style={styles.titleSection}>
          <View style={styles.chapterBadge}>
            <Text style={styles.chapterBadgeText}>CHƯƠNG 1 • BÀI {lesson.order || 1}</Text>
          </View>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          {lesson.subtitle ? (
            <Text style={styles.lessonSubtitle}>{lesson.subtitle}</Text>
          ) : null}
        </View>

        {/* PHẦN 1: TÌNH HUỐNG THỰC TẾ */}
        <RetroCard style={styles.sectionCard}>
          <View style={styles.sectionHeadingRow}>
            <Ionicons name="book-outline" size={18} color={retroTokens.accentBrick} />
            <Text style={styles.sectionHeading}>1. TÌNH HUỐNG ĐỜI THỰC</Text>
          </View>
          <View style={styles.storyBox}>
            <Text style={styles.storyText}>{lesson.story}</Text>
          </View>
        </RetroCard>

        {/* PHẦN 2: KHÁI NIỆM CỐT LÕI & CƠ CHẾ TÂM LÝ */}
        <RetroCard style={styles.sectionCard}>
          <View style={styles.sectionHeadingRow}>
            <Ionicons name="bulb-outline" size={18} color={retroTokens.accentAmber} />
            <Text style={styles.sectionHeading}>2. CƠ CHẾ TÂM LÝ & BẢN CHẤT</Text>
          </View>
          <Text style={styles.bodyText}>{lesson.coreConcept}</Text>
        </RetroCard>

        {/* PHẦN 3: VÍ DỤ SỐ LIỆU BẰNG VNĐ */}
        <RetroCard style={[styles.sectionCard, styles.exampleCard]}>
          <View style={styles.sectionHeadingRow}>
            <Ionicons name="calculator-outline" size={18} color={retroTokens.accentMoss} />
            <Text style={styles.sectionHeading}>3. BẢN ĐỒ SỐ LIỆU (VNĐ)</Text>
          </View>
          <View style={styles.exampleBox}>
            <Text style={styles.exampleText}>{lesson.exampleVnd}</Text>
          </View>
        </RetroCard>

        {/* PHẦN 4: SAI LẦM THƯỜNG GẶP */}
        {Array.isArray(lesson.mistakes) && lesson.mistakes.length > 0 && (
          <RetroCard style={styles.sectionCard}>
            <View style={styles.sectionHeadingRow}>
              <Ionicons name="alert-circle-outline" size={18} color={retroTokens.accentBrick} />
              <Text style={styles.sectionHeading}>4. SAI LẦM PHỔ BIẾN</Text>
            </View>
            <View style={styles.listWrap}>
              {lesson.mistakes.map((m, idx) => (
                <View key={idx} style={styles.listItem}>
                  <Text style={styles.bulletWarning}>✕</Text>
                  <Text style={styles.listText}>{m}</Text>
                </View>
              ))}
            </View>
          </RetroCard>
        )}

        {/* PHẦN 5: HÀNH ĐỘNG ÁP DỤNG TRONG APP */}
        <RetroCard style={[styles.sectionCard, styles.actionCard]}>
          <View style={styles.sectionHeadingRow}>
            <Ionicons name="phone-portrait-outline" size={18} color="#4F46E5" />
            <Text style={[styles.sectionHeading, { color: '#4F46E5' }]}>5. ÁP DỤNG NGAY TRONG VÍ MỎ HỖN</Text>
          </View>
          <Text style={styles.actionText}>{lesson.appAction}</Text>
        </RetroCard>

        {/* PHẦN 6: 3 ĐIỂM CỐT LÕI CẦN NHỚ */}
        {Array.isArray(lesson.keyTakeaways) && lesson.keyTakeaways.length > 0 && (
          <RetroCard style={[styles.sectionCard, styles.takeawayCard]}>
            <View style={styles.sectionHeadingRow}>
              <Ionicons name="key-outline" size={18} color={retroTokens.textPrimary} />
              <Text style={styles.sectionHeading}>6. ĐIỂM CỐT LÕI CẦN NHỚ</Text>
            </View>
            <View style={styles.listWrap}>
              {lesson.keyTakeaways.map((item, idx) => (
                <View key={idx} style={styles.listItem}>
                  <Text style={styles.bulletSuccess}>✓</Text>
                  <Text style={styles.takeawayText}>{item}</Text>
                </View>
              ))}
            </View>
          </RetroCard>
        )}

        {/* PHẦN 7: BÀI TẬP TRẮC NGHIỆM KIỂM TRA NHANH */}
        {quiz && (
          <RetroCard style={[styles.sectionCard, styles.quizCard]}>
            <View style={styles.sectionHeadingRow}>
              <Ionicons name="help-circle-outline" size={18} color={retroTokens.accentBrick} />
              <Text style={styles.sectionHeading}>7. KIỂM TRA KIẾN THỨC NHANH</Text>
            </View>
            <Text style={styles.quizQuestion}>{quiz.question}</Text>

            <View style={styles.quizOptionsWrap}>
              {quiz.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isRightOpt = idx === quiz.correctIndex;
                let optStyle = styles.quizOption;
                if (showExplanation) {
                  if (isRightOpt) optStyle = [styles.quizOption, styles.quizOptionCorrect];
                  else if (isSelected) optStyle = [styles.quizOption, styles.quizOptionWrong];
                } else if (isSelected) {
                  optStyle = [styles.quizOption, styles.quizOptionSelected];
                }

                return (
                  <TouchableOpacity
                    key={idx}
                    style={optStyle}
                    onPress={() => handleSelectQuizOption(idx)}
                    activeOpacity={0.7}
                    disabled={showExplanation}
                  >
                    <Text style={styles.quizOptionText}>{opt}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {showExplanation && (
              <View style={[styles.explanationBox, isCorrect ? styles.expSuccess : styles.expWarning]}>
                <Text style={styles.expTitle}>
                  {isCorrect ? '🎉 Chính xác!' : '💡 Chưa chính xác!'}
                </Text>
                <Text style={styles.expBody}>{quiz.explanation}</Text>
              </View>
            )}
          </RetroCard>
        )}

        {/* NGUỒN THAM KHẢO & TUYÊN BỐ PHÁP LÝ */}
        <View style={styles.footerSection}>
          <Text style={styles.referencesText}>📚 Nguồn tham khảo: {lesson.references}</Text>
          <Text style={styles.legalText}>⚖️ {lesson.legalDisclaimer}</Text>
        </View>

        {/* ACTION BUTTONS (PREV / NEXT / FINISH) */}
        <View style={styles.bottomNavRow}>
          {prevLesson ? (
            <RetroButton
              label="← BÀI TRƯỚC"
              variant="outline"
              size="medium"
              onPress={() => onNavigateLesson?.(prevLesson)}
              style={{ flex: 1 }}
            />
          ) : null}

          {nextLesson ? (
            <RetroButton
              label="BÀI TIẾP THEO →"
              variant="primary"
              size="medium"
              onPress={() => {
                onFinishLesson?.(lesson.id);
                onNavigateLesson?.(nextLesson);
              }}
              style={{ flex: 1.5 }}
            />
          ) : (
            <RetroButton
              label="HOÀN THÀNH CHƯƠNG"
              variant="moss"
              size="medium"
              onPress={() => {
                onFinishLesson?.(lesson.id);
                onBack?.();
              }}
              style={{ flex: 1.5 }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: '#1E293B',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: retroTokens.textPrimary,
  },
  headerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  durationBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4F46E5',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 60,
  },
  titleSection: {
    marginBottom: 16,
  },
  chapterBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFE600',
    borderWidth: 1.5,
    borderColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  chapterBadgeText: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#1E293B',
    letterSpacing: 0.5,
  },
  lessonTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: retroTokens.textPrimary,
    lineHeight: 26,
    marginBottom: 4,
  },
  lessonSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: retroTokens.textSecondary,
    lineHeight: 18,
  },
  sectionCard: {
    padding: 14,
    marginBottom: 14,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 6,
  },
  sectionHeading: {
    fontSize: 11.5,
    fontWeight: '900',
    color: retroTokens.textSecondary,
    letterSpacing: 0.5,
  },
  storyBox: {
    backgroundColor: '#FFFBEB',
    borderLeftWidth: 3,
    borderLeftColor: retroTokens.accentAmber,
    padding: 10,
    borderRadius: 6,
  },
  storyText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#78350F',
    fontStyle: 'italic',
    fontWeight: '600',
  },
  bodyText: {
    fontSize: 13.5,
    lineHeight: 21,
    color: retroTokens.textPrimary,
    fontWeight: '500',
  },
  exampleCard: {
    backgroundColor: '#F0FDF4',
    borderColor: '#166534',
  },
  exampleBox: {
    padding: 6,
  },
  exampleText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#14532D',
    fontWeight: '600',
  },
  listWrap: {
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletWarning: {
    fontSize: 12,
    fontWeight: '900',
    color: '#DC2626',
    marginTop: 2,
  },
  bulletSuccess: {
    fontSize: 12,
    fontWeight: '900',
    color: '#16A34A',
    marginTop: 2,
  },
  listText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
    color: retroTokens.textPrimary,
  },
  actionCard: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
  },
  actionText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#312E81',
    fontWeight: '600',
  },
  takeawayCard: {
    backgroundColor: '#FEF3C7',
    borderColor: '#D97706',
  },
  takeawayText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: '#92400E',
    fontWeight: '700',
  },
  quizCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#1E293B',
    borderWidth: 2,
  },
  quizQuestion: {
    fontSize: 14,
    fontWeight: '800',
    color: retroTokens.textPrimary,
    lineHeight: 20,
    marginBottom: 12,
  },
  quizOptionsWrap: {
    gap: 8,
    marginBottom: 12,
  },
  quizOption: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 10,
  },
  quizOptionSelected: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  quizOptionCorrect: {
    borderColor: '#16A34A',
    backgroundColor: '#DCFCE7',
  },
  quizOptionWrong: {
    borderColor: '#DC2626',
    backgroundColor: '#FEE2E2',
  },
  quizOptionText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: retroTokens.textPrimary,
    lineHeight: 18,
  },
  explanationBox: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 6,
  },
  expSuccess: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  expWarning: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  expTitle: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 2,
  },
  expBody: {
    fontSize: 12,
    lineHeight: 16,
    color: '#334155',
  },
  footerSection: {
    marginTop: 8,
    marginBottom: 16,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 8,
    gap: 6,
  },
  referencesText: {
    fontSize: 10.5,
    color: retroTokens.textMuted,
    lineHeight: 15,
  },
  legalText: {
    fontSize: 10,
    fontStyle: 'italic',
    color: retroTokens.textMuted,
    lineHeight: 14,
  },
  bottomNavRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  errorBox: {
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '700',
  },
});
