import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CURRICULUM_CHAPTERS } from '../data/curriculumData.js';

export default function LessonsScreen({ onOpenRunner, onSelectLesson, completedLessonIds = [] }) {
  const [activeChapterId, setActiveChapterId] = useState(1);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Title */}
        <View style={styles.header}>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>GIÁO TRÌNH 7 CHƯƠNG THỰC HÀNH</Text>
          </View>
          <Text style={styles.headerTitle}>BÀI HỌC TÀI CHÍNH</Text>
          <Text style={styles.headerDesc}>
            Khám phá các bài học thực tế, làm chủ kiến thức và vượt bài thi Runner 3D / Trắc nghiệm để mở khóa trọn vẹn 7 chương nhé!
          </Text>
        </View>

        {/* Chapters List */}
        {CURRICULUM_CHAPTERS.map((chapter) => {
          const isExpanded = activeChapterId === chapter.id;
          const chapterLessons = chapter.lessons || [];
          const readCount = chapterLessons.filter((l) => completedLessonIds.includes(l.id)).length;
          const isCompleted = readCount === chapterLessons.length && chapterLessons.length > 0;

          return (
            <View
              key={chapter.id}
              style={[
                styles.chapterCard,
                isExpanded && styles.chapterCardActive,
              ]}
            >
              {/* CHAPTER HEADER CLICKABLE */}
              <TouchableOpacity
                style={styles.chapterHeaderTouch}
                onPress={() => setActiveChapterId(isExpanded ? null : chapter.id)}
                activeOpacity={0.8}
              >
                <View style={styles.chapterHeader}>
                  <View style={styles.chapterBadgeRow}>
                    <View style={styles.chapterBadge}>
                      <Text style={styles.chapterBadgeText}>CHƯƠNG {chapter.id}</Text>
                    </View>
                    <View style={[styles.progressBadge, isCompleted && styles.progressBadgeCompleted]}>
                      <Text style={[styles.progressBadgeText, isCompleted && styles.progressBadgeCompletedText]}>
                        {readCount}/{chapter.lessonsCount} BÀI
                      </Text>
                    </View>
                  </View>

                  <Ionicons
                    name={isExpanded ? 'chevron-up-circle' : 'chevron-down-circle'}
                    size={22}
                    color="#0F172A"
                  />
                </View>

                <Text style={styles.chapterTitle}>{chapter.title}</Text>
                <Text style={styles.chapterDesc}>{chapter.subtitle}</Text>
              </TouchableOpacity>

              {/* EXPANDED LESSONS LIST */}
              {isExpanded && Array.isArray(chapterLessons) && (
                <View style={styles.lessonsList}>
                  <View style={styles.divider} />

                  {chapterLessons.map((lesson) => {
                    const isRead = completedLessonIds.includes(lesson.id);

                    return (
                      <TouchableOpacity
                        key={lesson.id}
                        style={styles.lessonItem}
                        onPress={() => onSelectLesson?.(lesson)}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name={isRead ? 'checkmark-circle' : 'ellipse-outline'}
                          size={18}
                          color={isRead ? '#10B981' : '#94A3B8'}
                          style={{ marginRight: 8 }}
                        />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.lessonItemText} numberOfLines={1}>
                            {lesson.id}. {lesson.title}
                          </Text>
                          {lesson.subtitle ? (
                            <Text style={styles.lessonItemSub} numberOfLines={1}>
                              {lesson.subtitle}
                            </Text>
                          ) : null}
                        </View>
                        <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                        <Ionicons name="chevron-forward" size={14} color="#94A3B8" style={{ marginLeft: 4 }} />
                      </TouchableOpacity>
                    );
                  })}

                  {/* Action: Run 3D Test / Quiz for this chapter */}
                  <TouchableOpacity
                    style={styles.runnerExamBtn}
                    activeOpacity={0.85}
                    onPress={() => onOpenRunner?.(chapter)}
                  >
                    <Ionicons name="game-controller" size={18} color="#0F172A" style={{ marginRight: 6 }} />
                    <Text style={styles.runnerExamBtnText}>
                      THI TỔNG KẾT CHƯƠNG {chapter.id} (RUNNER / TRẮC NGHIỆM)
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
    gap: 12,
  },
  header: {
    marginBottom: 4,
    gap: 4,
  },
  headerBadge: {
    backgroundColor: '#EEF2FF',
    borderColor: '#818CF8',
    borderWidth: 1.5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  headerBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#4338CA',
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
  },
  headerDesc: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
    fontWeight: '600',
  },
  chapterCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#0F172A',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  chapterCardActive: {
    borderColor: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  chapterHeaderTouch: {
    width: '100%',
  },
  chapterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chapterBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chapterBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#0F172A',
  },
  chapterBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#4338CA',
  },
  progressBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#0F172A',
  },
  progressBadgeCompleted: {
    backgroundColor: '#FFE600',
  },
  progressBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#15803D',
  },
  progressBadgeCompletedText: {
    color: '#0F172A',
  },
  chapterTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  chapterDesc: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    lineHeight: 17,
  },
  divider: {
    height: 1.5,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  lessonsList: {
    marginTop: 4,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#0F172A',
    marginBottom: 8,
  },
  lessonItemText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  lessonItemSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  lessonDuration: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4338CA',
    marginLeft: 6,
  },
  runnerExamBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE600',
    borderWidth: 2,
    borderColor: '#0F172A',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  runnerExamBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
});
