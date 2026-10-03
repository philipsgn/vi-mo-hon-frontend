import React, { useState, useEffect, useRef } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { neoColors, neoBorders, neoRadii, neoShadows } from '../design-system/tokens';
import { NeoCard, NeoBadge, NeoProgressBar, NeoButton } from '../design-system/components';
import { QuizletFlashcardDeck } from '../components/QuizletFlashcardDeck';
import RunnerScreenNeo from './RunnerScreenNeo';
import BossBattleScreenNeo from './BossBattleScreenNeo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiPost } from '../api/client';

const { CHAPTERS_DATA } = require('../utils/chapterConfig.cjs');
const {
  isBossDefeated,
  isChapterUnlocked,
  getChapterStatus,
  getChapterUnlockProgress,
  getActiveChapter,
  getRunnerConfigForChapter,
  canPurchaseLesson,
  purchaseLesson,
} = require('../utils/chapterHelper.cjs');
const {
  ULTIMATE_SKILLS,
  getSkillByChapter,
  getSkillsByChapter,
  calculateRealLifeImpact,
} = require('../utils/ultimateSkills.cjs');
const bossImage = require('../../assets/images/boss-tra-sua-cropped.png');

const CHAPTER_THEMES = {
  'chapter-1': {
    name: 'Trà Sữa Cám Dỗ',
    skyBg: '#FEF9C3',
    stageBg: '#FEF08A',
    cardBg: '#FFFBEB',
    border: '#121212',
    accent: '#F59E0B',
    icon: '🧋',
    silhouette: '🏬 🧋 🧋 🏪',
    stageTitle: 'PHỐ TRÀ SỮA HOÀNG HÔN',
  },
  'chapter-2': {
    name: 'Bão Sale Nửa Đêm',
    skyBg: '#EDE9FE',
    stageBg: '#DDD6FE',
    cardBg: '#F5F3FF',
    border: '#121212',
    accent: '#8B5CF6',
    icon: '📦',
    silhouette: '🛍️ 🏷️ 📦 🛒',
    stageTitle: 'ĐẠI LỘ BÃO SALE 0H',
  },
  'chapter-3': {
    name: 'FOMO Đu Trend',
    skyBg: '#CCFBF1',
    stageBg: '#99F6E4',
    cardBg: '#F0FDFA',
    border: '#121212',
    accent: '#0D9488',
    icon: '💳',
    silhouette: '📱 ⚡ 💳 📈',
    stageTitle: 'MA TRẬN CYBERPUNK FOMO',
  },
};

export function BossScreenNeo({
  dashboard,
  userId,
  completingChallengeId,
  onCompleteChallenge,
  onSelectLesson,
  lessonRefreshKey,
  onRefreshDashboard,
  onOpenRunner,
}) {
  const [showRunner, setShowRunner] = useState(false);
  const [showBossBattle, setShowBossBattle] = useState(false);
  const [userSkills, setUserSkills] = useState([]);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [quizAnswerState, setQuizAnswerState] = useState({});
  const [userCoins, setUserCoins] = useState(0);
  const [purchasedChapterIds, setPurchasedChapterIds] = useState(['chapter-1']);
  const [purchaseFeedback, setPurchaseFeedback] = useState(null);

  // HUD & Bottom Sheet State
  const [activeSheet, setActiveSheet] = useState(null); // 'deck' | 'ultimate' | 'lesson' | 'saga' | null
  const [showRoastBubble, setShowRoastBubble] = useState(true);

  // Idle Breathing Animation for Center Boss
  const breathAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, {
          toValue: -7,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(breathAnim, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [breathAnim]);

  const data = dashboard?.data ?? dashboard ?? {};
  const boss = data.boss ?? {};

  // Extract user core RPG metrics
  const userProgress = {
    discipline: Number(data.discipline ?? data.userProgress?.discipline ?? 5),
    knowledge: Number(data.knowledge ?? data.userProgress?.knowledge ?? 10),
    xp: Number(data.xp ?? data.userProgress?.xp ?? 0),
    level: Number(data.level ?? data.userProgress?.level ?? 1),
  };

  const bossStates = {
    'impulse-boss': boss,
  };

  const activeChapter = getActiveChapter(userProgress, bossStates);
  const [selectedChapterId, setSelectedChapterId] = useState(activeChapter.id);

  // Load persistent user data: completed lessons, coins, and purchased decks
  useEffect(() => {
    if (userId) {
      AsyncStorage.getItem(`vmh_lessons_${userId}`)
        .then((res) => {
          if (res) {
            try {
              setCompletedLessonIds(JSON.parse(res));
            } catch (e) {}
          }
        })
        .catch(() => {});

      AsyncStorage.getItem(`vmh_coins_${userId}`)
        .then((res) => {
          if (res) setUserCoins(parseInt(res, 10) || 0);
        })
        .catch(() => {});

      AsyncStorage.getItem(`vmh_purchased_lessons_${userId}`)
        .then((res) => {
          if (res) {
            try {
              const list = JSON.parse(res);
              if (Array.isArray(list) && list.length > 0) {
                setPurchasedChapterIds(list);
              }
            } catch (e) {}
          }
        })
        .catch(() => {});

      AsyncStorage.getItem(`vmh_skills_${userId}`)
        .then((res) => {
          if (res) {
            try {
              const list = JSON.parse(res);
              if (Array.isArray(list) && list.length > 0) {
                setUserSkills(list);
              }
            } catch (e) {}
          }
        })
        .catch(() => {});
    }
  }, [userId, lessonRefreshKey]);

  const selectedChapter =
    CHAPTERS_DATA.find((c) => c.id === selectedChapterId) || CHAPTERS_DATA[0];
  const selectedStatus = getChapterStatus(selectedChapter, userProgress, bossStates);
  const unlockProgress = getChapterUnlockProgress(selectedChapter, userProgress, bossStates);

  // Ultimate Skill & Stage Configuration
  const ultimateSkill = getSkillByChapter(selectedChapter.id);
  const stageConfig = selectedChapter.stageConfig || {
    targetDistance: 300,
    targetCoins: 30,
    requireQuizPass: false,
  };

  // 2-Way Real Life Impact & Berserk Mode
  const userExpense = Number(data.todayExpense || data.monthlyExpense || 0);
  const userBudget = Number(data.monthlyBudget || 3000000);
  const realLifeImpact = calculateRealLifeImpact(userExpense, userBudget);

  // Boss HP & stats calculation for selected chapter
  const isSelectedActive = selectedChapter.id === activeChapter.id;
  const currentHp = isSelectedActive
    ? Number(boss?.currentHp ?? boss?.hpRemaining ?? selectedChapter.maxHp)
    : selectedStatus === 'completed'
    ? 0
    : selectedChapter.maxHp;
  const maxHp = Number(selectedChapter.maxHp);
  const isDefeated = selectedStatus === 'completed' || (maxHp > 0 && currentHp === 0);
  const hpProgress = maxHp > 0 ? Math.max(0, Math.min(1, currentHp / maxHp)) : 0;

  const hasShieldForChapter = completedLessonIds.includes(selectedChapter.lesson.id);
  const isLessonPurchased =
    purchasedChapterIds.includes(selectedChapter.id) || (selectedChapter.coinCost || 0) === 0;

  const currentTheme = CHAPTER_THEMES[selectedChapter.id] || CHAPTER_THEMES['chapter-1'];

  const handlePurchaseLesson = async () => {
    const res = purchaseLesson(selectedChapter, userCoins);
    if (!res.success) {
      setPurchaseFeedback({
        success: false,
        message: `⚠️ Bạn còn thiếu ${res.missingCoins} Xu! Hãy chạy 3D Runner để nhặt thêm Xu nhé.`,
      });
      return;
    }

    const nextPurchased = [...purchasedChapterIds, selectedChapter.id];
    setPurchasedChapterIds(nextPurchased);
    setUserCoins(res.remainingCoins);
    setPurchaseFeedback({
      success: true,
      message: `🎉 Mở khóa thành công bộ Flashcard Quizlet cho ${selectedChapter.title}!`,
    });
    if (userId) {
      try {
        await AsyncStorage.setItem(`vmh_coins_${userId}`, String(res.remainingCoins));
        await AsyncStorage.setItem(
          `vmh_purchased_lessons_${userId}`,
          JSON.stringify(nextPurchased)
        );
      } catch (e) {}
    }
  };

  const handleSelectQuizOption = async (optionIdx) => {
    const isCorrect = optionIdx === selectedChapter.lesson.quiz.correctIndex;
    const lessonId = selectedChapter.lesson.id;

    setQuizAnswerState((prev) => ({
      ...prev,
      [lessonId]: {
        selected: optionIdx,
        isCorrect,
        message: isCorrect
          ? `🎉 CHÍNH XÁC! Bạn đã nhận +${selectedChapter.lesson.knowledgeReward} Điểm Kiến Thức và MỞ KHÓA KHIÊN KHẮC CHẾ!`
          : '❌ Chưa đúng rồi! Hãy đọc lại mẹo 24 Giờ bên trên và chọn lại nhé.',
      },
    }));

    if (isCorrect && !completedLessonIds.includes(lessonId)) {
      const nextList = [...completedLessonIds, lessonId];
      setCompletedLessonIds(nextList);
      if (userId) {
        try {
          await AsyncStorage.setItem(`vmh_lessons_${userId}`, JSON.stringify(nextList));
        } catch (e) {}
      }
    }
  };

  const handleFinishRun = async (res) => {
    setShowRunner(false);
    if (userId && res) {
      try {
        if (
          res.collectedSkills &&
          Array.isArray(res.collectedSkills) &&
          res.collectedSkills.length > 0
        ) {
          const merged = Array.from(new Set([...userSkills, ...res.collectedSkills]));
          setUserSkills(merged);
          await AsyncStorage.setItem(`vmh_skills_${userId}`, JSON.stringify(merged));
        }
        if (res.coins && Number(res.coins) > 0) {
          const currentStr = await AsyncStorage.getItem(`vmh_coins_${userId}`);
          const currentCoins = parseInt(currentStr, 10) || 0;
          const newCoins = currentCoins + Number(res.coins);
          await AsyncStorage.setItem(`vmh_coins_${userId}`, String(newCoins));
          setUserCoins(newCoins);
        }
        await apiPost('/game/end-session', {
          userId,
          damageToBoss: res.damageToBoss || 0,
          coins: res.coins || 0,
          savingsPoints: res.savingsPoints || 0,
          knowledgePoints: res.knowledgePoints || 0,
          durationSeconds: res.duration || 0,
          reason: res.reason || 'completed',
        });
        if (onRefreshDashboard) {
          onRefreshDashboard();
        }
      } catch (err) {
        console.warn('[Runner] Failed to sync session to backend:', err);
      }
    }
  };

  const handleFinishBossBattle = async (res) => {
    setShowBossBattle(false);
    if (userId && res) {
      try {
        await apiPost('/game/end-session', {
          userId,
          damageToBoss: res.damageToBoss || 0,
          coins: 0,
          savingsPoints: res.savingsPoints || 0,
          knowledgePoints: 0,
          durationSeconds: res.duration || 0,
          reason: res.reason || 'boss_battle_ended',
        });
        if (onRefreshDashboard) {
          onRefreshDashboard();
        }
      } catch (err) {
        console.warn('[BossBattle] Failed to sync session to backend:', err);
      }
    }
  };

  return (
    <View style={styles.hudContainer}>
      {/* ========================================================== */}
      {/* 1. TOP HUD STATUS BAR (BOSS INFO, HP BAR & METRICS) */}
      {/* ========================================================== */}
      <View style={styles.topHudBar}>
        <View style={styles.topHudRow}>
          <TouchableOpacity
            style={styles.chapterSelectorPill}
            onPress={() => setActiveSheet('saga')}
            activeOpacity={0.8}
          >
            <Text style={styles.chapterSelectorIcon}>{currentTheme.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.chapterSelectorTitle} numberOfLines={1}>
                Chương {selectedChapter.number}: {selectedChapter.bossName}
              </Text>
              <Text style={styles.chapterSelectorSubtitle} numberOfLines={1}>
                {isDefeated ? '🏆 ĐÃ BỊ DIỆT' : selectedStatus === 'locked' ? '🔒 BỊ KHÓA' : '⚔️ ĐANG CHIẾN'}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={16} color={neoColors.black} />
          </TouchableOpacity>

          <View style={styles.topHudRightStats}>
            <TouchableOpacity
              style={styles.coinStatPill}
              onPress={() => setActiveSheet('lesson')}
              activeOpacity={0.8}
            >
              <Text style={styles.coinStatText}>🪙 {userCoins}</Text>
            </TouchableOpacity>

            {hasShieldForChapter && (
              <View style={styles.shieldStatPill}>
                <Text style={styles.shieldStatText}>🛡️ SẴN SÀNG</Text>
              </View>
            )}
          </View>
        </View>

        {/* Sleek Boss HP Bar */}
        <View style={styles.hpBarContainer}>
          <View style={styles.hpLabelRow}>
            <Text style={styles.hpBarLabel}>
              {isDefeated ? 'BOSS ĐÃ BỊ HẠ GỤC!' : 'MÁU BOSS (HP):'}
            </Text>
            <Text style={styles.hpBarValue}>
              {currentHp.toLocaleString('vi-VN')} / {maxHp.toLocaleString('vi-VN')} HP
            </Text>
          </View>
          <NeoProgressBar
            progress={hpProgress}
            fillColor={hpProgress > 0.35 ? 'coral' : hpProgress > 0 ? 'yellow' : 'mint'}
            height={12}
          />
        </View>

        {/* Berserk Banner Warning if active */}
        {realLifeImpact.isBerserk && (
          <View style={styles.berserkAuraBar}>
            <Text style={styles.berserkAuraIcon}>🔥</Text>
            <Text style={styles.berserkAuraText} numberOfLines={1}>
              BOSS CUỒNG NỘ: Vượt định mức chi tiêu! Boss hồi +{realLifeImpact.hpHealed} HP, giảm 50% dmg!
            </Text>
          </View>
        )}
      </View>

      {/* ========================================================== */}
      {/* 2. CENTER ANIMATED VISUAL STAGE (PHÔNG CẢNH & BOSS IDLE) */}
      {/* ========================================================== */}
      <View
        style={[
          styles.arenaStageContainer,
          { backgroundColor: currentTheme.skyBg, borderColor: currentTheme.border },
        ]}
      >
        {/* Stage Header Vibe Ribbon */}
        <View style={[styles.stageHeaderRibbon, { backgroundColor: currentTheme.stageBg }]}>
          <Text style={styles.stageSilhouetteText}>{currentTheme.silhouette}</Text>
          <Text style={styles.stageTitleText}>{currentTheme.stageTitle}</Text>
          <Text style={styles.stageSilhouetteText}>{currentTheme.silhouette}</Text>
        </View>

        {/* The 3-Column Arena Layout: Left Wing, Boss Center, Right Wing */}
        <View style={styles.stageColumnsRow}>
          {/* LEFT WING HUD (Trang Bị & Tuyệt Chiêu) */}
          <View style={styles.hudWingColumn}>
            {/* 🎒 Túi Thẻ Kỹ Năng */}
            <TouchableOpacity
              style={[styles.floatingHudBtn, styles.hudBtnYellow]}
              onPress={() => setActiveSheet('deck')}
              activeOpacity={0.8}
            >
              <View style={styles.floatingBadgeBox}>
                <Text style={styles.floatingBadgeText}>{userSkills.length}/3</Text>
              </View>
              <Text style={styles.floatingIcon}>🎒</Text>
              <Text style={styles.floatingBtnLabel}>TÚI THẺ</Text>
            </TouchableOpacity>

            {/* ⚡ Tuyệt Chiêu */}
            <TouchableOpacity
              style={[styles.floatingHudBtn, styles.hudBtnMint]}
              onPress={() => setActiveSheet('ultimate')}
              activeOpacity={0.8}
            >
              <View style={[styles.floatingBadgeBox, { backgroundColor: '#EF4444' }]}>
                <Text style={styles.floatingBadgeText}>CHÍ MẠNG</Text>
              </View>
              <Text style={styles.floatingIcon}>⚡</Text>
              <Text style={styles.floatingBtnLabel}>CHIÊU CUỐI</Text>
            </TouchableOpacity>
          </View>

          {/* CENTER BOSS CHARACTER (Animated Idle Stance) */}
          <View style={styles.centerBossArea}>
            {/* Speech Roast Bubble */}
            {showRoastBubble && (
              <TouchableOpacity
                style={styles.roastBubbleBox}
                onPress={() => setShowRoastBubble(!showRoastBubble)}
                activeOpacity={0.9}
              >
                <Text style={styles.roastBubbleText}>"{selectedChapter.roast}"</Text>
                <View style={styles.roastBubbleArrow} />
              </TouchableOpacity>
            )}

            {/* Breathing Boss Model */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setShowRoastBubble((prev) => !prev)}
            >
              <Animated.View
                style={[
                  styles.animatedBossWrapper,
                  { transform: [{ translateY: breathAnim }] },
                ]}
              >
                {selectedChapter.id === 'chapter-1' ? (
                  <Image source={bossImage} style={styles.bossMainGraphic} resizeMode="contain" />
                ) : (
                  <View style={styles.bossProceduralBox}>
                    <Text style={{ fontSize: 68 }}>{selectedChapter.bossIcon}</Text>
                  </View>
                )}
              </Animated.View>
            </TouchableOpacity>

            {/* Ground Shadow underneath Boss */}
            <View style={styles.bossGroundShadow} />

            {/* Tappable Hint */}
            <TouchableOpacity
              onPress={() => setShowRoastBubble((prev) => !prev)}
              style={styles.bossTapHintPill}
            >
              <Text style={styles.bossTapHintText}>
                {isDefeated ? '🏆 Đã Chém Gục' : '💬 Chạm để Boss khịa'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* RIGHT WING HUD (Tri Thức & Hành Trình) */}
          <View style={styles.hudWingColumn}>
            {/* 📚 Sách Bài Học & Quizlet */}
            <TouchableOpacity
              style={[styles.floatingHudBtn, styles.hudBtnCream]}
              onPress={() => setActiveSheet('lesson')}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.floatingBadgeBox,
                  { backgroundColor: hasShieldForChapter ? '#10B981' : isLessonPurchased ? '#F59E0B' : '#EF4444' },
                ]}
              >
                <Text style={styles.floatingBadgeText}>
                  {hasShieldForChapter ? '🛡️ XONG' : isLessonPurchased ? 'HỌC' : '30 XU'}
                </Text>
              </View>
              <Text style={styles.floatingIcon}>📚</Text>
              <Text style={styles.floatingBtnLabel}>BÀI HỌC</Text>
            </TouchableOpacity>

            {/* 🗺️ Bản Đồ Chapter */}
            <TouchableOpacity
              style={[styles.floatingHudBtn, styles.hudBtnCoral]}
              onPress={() => setActiveSheet('saga')}
              activeOpacity={0.8}
            >
              <View style={[styles.floatingBadgeBox, { backgroundColor: '#121212' }]}>
                <Text style={styles.floatingBadgeText}>CH.{selectedChapter.number}</Text>
              </View>
              <Text style={styles.floatingIcon}>🗺️</Text>
              <Text style={styles.floatingBtnLabel}>BẢN ĐỒ</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stage Target Indicator Footer */}
        <View style={styles.stageTargetBar}>
          <Text style={styles.stageTargetBarText}>
            🎯 <Text style={{ fontWeight: '900' }}>Phòng Thi:</Text> Cự ly {stageConfig.targetDistance}m • Nhặt ≥{stageConfig.targetCoins} Xu • {stageConfig.requireQuizPass ? 'Đúng Quiz 100%' : 'Chỉ cần nhặt Xu'}
          </Text>
        </View>
      </View>

      {/* ========================================================== */}
      {/* 3. BOTTOM DUAL ACTION DOCK (RUNNER 3D & BOSS ARENA 3D) */}
      {/* ========================================================== */}
      <View style={styles.dualActionDock}>
        <View style={styles.dockButtonsRow}>
          <TouchableOpacity
            style={[styles.dockBtn, styles.dockBtnRunner]}
            onPress={() => {
              if (onOpenRunner) {
                onOpenRunner();
              } else {
                setShowRunner(true);
              }
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.dockBtnIcon}>🏃</Text>
            <View style={styles.dockBtnTextCol}>
              <Text style={styles.dockBtnMainLabel}>RUNNER 3D</Text>
              <Text style={styles.dockBtnSubLabel}>Săn Thẻ & Cày Xu</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.dockBtn,
              userSkills.length > 0 ? styles.dockBtnBossActive : styles.dockBtnBossLocked,
            ]}
            disabled={userSkills.length === 0}
            onPress={() => {
              if (userSkills.length > 0) setShowBossBattle(true);
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.dockBtnIcon}>{userSkills.length > 0 ? '⚔️' : '🔒'}</Text>
            <View style={styles.dockBtnTextCol}>
              <Text
                style={[
                  styles.dockBtnMainLabel,
                  userSkills.length === 0 && { color: '#64748B' },
                ]}
              >
                {userSkills.length > 0 ? 'ĐẤU BOSS 3D' : 'KHÓA ĐẤU BOSS'}
              </Text>
              <Text
                style={[
                  styles.dockBtnSubLabel,
                  userSkills.length === 0 && { color: '#94A3B8' },
                ]}
              >
                {userSkills.length > 0 ? 'Quyết Đấu RPG Theo Lượt' : 'Cần ít nhất 1 Thẻ Kỹ Năng'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* ========================================================== */}
      {/* 4. GAME BOTTOM SHEET MODAL (NEO-BRUTALIST DRAWER) */}
      {/* ========================================================== */}
      <Modal
        visible={activeSheet !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setActiveSheet(null)}
      >
        <View style={styles.sheetOverlay}>
          <TouchableOpacity
            style={styles.sheetBackdropTouch}
            activeOpacity={1}
            onPress={() => setActiveSheet(null)}
          />

          <View style={styles.sheetDialog}>
            {/* Sheet Handle */}
            <View style={styles.sheetHandleBar} />

            {/* Sheet Header */}
            <View style={styles.sheetHeader}>
              <View style={styles.sheetHeaderLeft}>
                <Text style={styles.sheetHeaderIcon}>
                  {activeSheet === 'deck'
                    ? '🎒'
                    : activeSheet === 'ultimate'
                    ? '⚡'
                    : activeSheet === 'lesson'
                    ? '📚'
                    : '🗺️'}
                </Text>
                <View>
                  <Text style={styles.sheetHeaderTitle}>
                    {activeSheet === 'deck'
                      ? `KHO THẺ KỸ NĂNG ĐÃ THU THẬP (${userSkills.length})`
                      : activeSheet === 'ultimate'
                      ? 'VŨ KHÍ TỐI THƯỢNG (ULTIMATE)'
                      : activeSheet === 'lesson'
                      ? 'HỌC VIỆN TÀI CHÍNH (QUIZLET)'
                      : 'BẢN ĐỒ HÀNH TRÌNH CÁM DỖ (SAGA)'}
                  </Text>
                  <Text style={styles.sheetHeaderSubtitle}>
                    {activeSheet === 'deck'
                      ? 'Trang bị thẻ khắc chế điểm yếu Boss'
                      : activeSheet === 'ultimate'
                      ? 'Chiêu kết liễu chí mạng ở 50m cuối ván chạy'
                      : activeSheet === 'lesson'
                      ? 'Kiến thức thực tế & Bộ thẻ Quizlet 2 mặt'
                      : 'Chọn Chương để đối đầu với các loại cám dỗ'}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.sheetCloseBtn}
                onPress={() => setActiveSheet(null)}
                activeOpacity={0.8}
              >
                <Ionicons name="close" size={20} color={neoColors.black} />
              </TouchableOpacity>
            </View>

            {/* Sheet Scrollable Content */}
            <ScrollView
              style={styles.sheetScrollView}
              contentContainerStyle={styles.sheetScrollContent}
              showsVerticalScrollIndicator={false}
            >
              {/* ---------------------------------------------------- */}
              {/* SHEET 1: KHO THẺ KỸ NĂNG (DECK) */}
              {/* ---------------------------------------------------- */}
              {activeSheet === 'deck' && (
                <View style={{ gap: 12 }}>
                  <Text style={styles.sheetSectionDesc}>
                    Các thẻ kỹ năng được săn từ Cổng Quiz khi chơi Runner 3D. Trang bị vào Đấu Trường 3D để kích hoạt đòn khắc chế điểm yếu Boss ({selectedChapter.bossName})!
                  </Text>

                  {userSkills.length === 0 ? (
                    <View style={styles.skillsEmptyBox}>
                      <Text style={{ fontSize: 44 }}>🎒</Text>
                      <Text style={styles.skillsEmptyTitle}>TÚI THẺ KỸ NĂNG TRỐNG TRƠN!</Text>
                      <Text style={styles.skillsEmptyDesc}>
                        Bạn chưa có Thẻ Kỹ Năng nào. Hãy bấm nút <Text style={{ fontWeight: '900', color: neoColors.black }}>[ 🏃 VÀO RUNNER 3D ]</Text>, né cám dỗ và chọn đúng Cổng Quiz để săn Thẻ Kỹ Năng bỏ vào túi đồ trước khi vào Đấu Boss nhé!
                      </Text>
                      <NeoButton
                        label="🏃 CHẠY RUNNER SĂN THẺ NGAY"
                        bg="mint"
                        onPress={() => {
                          setActiveSheet(null);
                          if (onOpenRunner) {
                            onOpenRunner();
                          } else {
                            setShowRunner(true);
                          }
                        }}
                        style={{ marginTop: 8 }}
                      />
                    </View>
                  ) : (
                    <View style={styles.skillsInventoryGrid}>
                      {userSkills.map((sId) => {
                        const skill = ULTIMATE_SKILLS[sId];
                        if (!skill) return null;
                        const isCounter = skill.weaknessChapterId === selectedChapter.id;
                        return (
                          <View
                            key={sId}
                            style={[
                              styles.skillInventoryCard,
                              isCounter && styles.skillInventoryCardCounter,
                            ]}
                          >
                            {isCounter && (
                              <View style={styles.skillCounterBadge}>
                                <Text style={styles.skillCounterBadgeText}>💥 X2 SÁT THƯƠNG</Text>
                              </View>
                            )}
                            <Text style={{ fontSize: 28, textAlign: 'center' }}>{skill.icon}</Text>
                            <Text style={styles.skillInventoryName}>{skill.name}</Text>
                            <View style={styles.skillInventoryDmgPill}>
                              <Text style={styles.skillInventoryDmgText}>
                                {skill.damage} DMG {skill.defense > 0 ? `• +${skill.defense} 🛡️` : ''}
                              </Text>
                            </View>
                            <Text style={styles.skillInventoryDesc} numberOfLines={2}>
                              {skill.description}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              )}

              {/* ---------------------------------------------------- */}
              {/* SHEET 2: VŨ KHÍ TỐI THƯỢNG (ULTIMATE) */}
              {/* ---------------------------------------------------- */}
              {activeSheet === 'ultimate' && (
                <View style={{ gap: 14 }}>
                  <View style={styles.ultimateHeaderCard}>
                    <Text style={{ fontSize: 44 }}>{ultimateSkill.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.ultimateNameText}>{ultimateSkill.name}</Text>
                      <Text style={styles.ultimateDamageBadgeText}>
                        💥 SÁT THƯƠNG: -{ultimateSkill.damage} HP (CHÍ MẠNG)
                      </Text>
                    </View>
                  </View>

                  <View style={styles.ultimateChantBox}>
                    <Text style={styles.ultimateChantText}>"{ultimateSkill.chant}"</Text>
                  </View>

                  <Text style={styles.ultimateDescText}>{ultimateSkill.description}</Text>

                  <View style={styles.ultimateHowToBox}>
                    <Text style={styles.ultimateHowToText}>
                      🎮 <Text style={{ fontWeight: '900' }}>Cơ chế kích hoạt:</Text> {ultimateSkill.triggerCondition}. Đến 50m cuối đường chạy Runner, bấm nút <Text style={{ fontWeight: '900' }}>[ ⚡ TUNG TUYỆT CHIÊU ]</Text> để kết liễu Boss ngay tức khắc!
                    </Text>
                  </View>
                </View>
              )}

              {/* ---------------------------------------------------- */}
              {/* SHEET 3: BÀI HỌC GIÁO DỤC TÀI CHÍNH (LESSON & QUIZLET) */}
              {/* ---------------------------------------------------- */}
              {activeSheet === 'lesson' && (
                <View style={{ gap: 14 }}>
                  {!isLessonPurchased ? (
                    <View style={styles.lessonUnlockInfoBox}>
                      <Text style={styles.lessonFreeNotice}>
                        🎓 <Text style={{ fontWeight: '900' }}>Khóa học này hoàn toàn MIỄN PHÍ!</Text>
                      </Text>
                      <Text style={styles.lessonUnlockDesc}>
                        Để mở khóa bộ thẻ Quizlet bí kíp khắc chế Boss, bạn chỉ cần dùng <Text style={{ fontWeight: '900', color: neoColors.coral }}>{selectedChapter.coinCost || 30} Xu</Text> nhặt được từ các ván chạy 3D Runner.
                      </Text>

                      <View style={styles.coinBalanceRow}>
                        <Text style={styles.coinBalanceLabel}>🪙 Số Xu hiện có trong ví:</Text>
                        <Text style={styles.coinBalanceValue}>{userCoins} Xu</Text>
                      </View>

                      {purchaseFeedback && (
                        <View
                          style={[
                            styles.quizFeedbackBox,
                            purchaseFeedback.success
                              ? styles.quizFeedbackSuccess
                              : styles.quizFeedbackError,
                          ]}
                        >
                          <Text style={styles.quizFeedbackText}>{purchaseFeedback.message}</Text>
                        </View>
                      )}

                      <NeoButton
                        label={
                          userCoins >= (selectedChapter.coinCost || 30)
                            ? `🔓 DÙNG ${selectedChapter.coinCost || 30} XU MỞ KHÓA BÀI HỌC`
                            : `🔒 THIẾU XU - CẦN ${selectedChapter.coinCost || 30} XU (HÃY CHẠY RUNNER)`
                        }
                        bg={userCoins >= (selectedChapter.coinCost || 30) ? 'mint' : 'white'}
                        disabled={userCoins < (selectedChapter.coinCost || 30)}
                        onPress={handlePurchaseLesson}
                        style={{ marginTop: 8 }}
                      />
                    </View>
                  ) : (
                    <View style={{ gap: 16 }}>
                      {/* Storytelling Section */}
                      <View style={styles.storyContainer}>
                        <View style={styles.storyHeaderRow}>
                          <Text style={styles.storyIcon}>📖</Text>
                          <Text style={styles.storyTitleText}>
                            {selectedChapter.lesson.storyTitle || selectedChapter.lesson.title}
                          </Text>
                        </View>
                        <Text style={styles.storyNarrativeText}>
                          {selectedChapter.lesson.story || selectedChapter.lesson.summary}
                        </Text>

                        {selectedChapter.lesson.analysis && (
                          <View style={styles.analysisBox}>
                            <Text style={styles.analysisLabel}>📊 BÀI TOÁN TÀI CHÍNH THỰC TẾ:</Text>
                            <Text style={styles.analysisText}>
                              {selectedChapter.lesson.analysis}
                            </Text>
                          </View>
                        )}

                        {selectedChapter.lesson.takeaway && (
                          <View style={styles.takeawayBox}>
                            <Text style={styles.takeawayLabel}>💡 BÍ KÍP KHẮC CHẾ ĐỜI THỰC:</Text>
                            <Text style={styles.takeawayText}>
                              {selectedChapter.lesson.takeaway}
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* Quizlet Interactive 2-Sided Flashcards Deck */}
                      <QuizletFlashcardDeck
                        deckTitle={selectedChapter.lesson.title}
                        flashcards={selectedChapter.flashcards || []}
                        onComplete={() => {
                          if (!completedLessonIds.includes(selectedChapter.lesson.id)) {
                            const nextList = [...completedLessonIds, selectedChapter.lesson.id];
                            setCompletedLessonIds(nextList);
                            if (userId) {
                              AsyncStorage.setItem(
                                `vmh_lessons_${userId}`,
                                JSON.stringify(nextList)
                              ).catch(() => {});
                            }
                          }
                        }}
                      />

                      {/* Interactive Quiz Box */}
                      <View style={styles.quizBox}>
                        <View style={styles.quizHeader}>
                          <Text style={styles.quizTag}>🧠 CÂU HỎI BẺ GÃY ĐÒN TÂM LÝ</Text>
                          <Text style={styles.quizQuestion}>
                            {selectedChapter.lesson.quiz.question}
                          </Text>
                        </View>

                        <View style={styles.quizOptionsList}>
                          {selectedChapter.lesson.quiz.options.map((option, idx) => {
                            const quizState = quizAnswerState[selectedChapter.lesson.id];
                            const isSelectedOption = quizState?.selected === idx;
                            return (
                              <TouchableOpacity
                                key={idx}
                                style={[
                                  styles.quizOptionBtn,
                                  isSelectedOption &&
                                    (quizState.isCorrect
                                      ? styles.quizOptionCorrect
                                      : styles.quizOptionWrong),
                                ]}
                                onPress={() => handleSelectQuizOption(idx)}
                                activeOpacity={0.8}
                              >
                                <Text style={styles.quizOptionLetter}>
                                  {idx === 0 ? 'A' : idx === 1 ? 'B' : 'C'}.
                                </Text>
                                <Text style={styles.quizOptionText}>{option}</Text>
                              </TouchableOpacity>
                            );
                          })}
                        </View>

                        {quizAnswerState[selectedChapter.lesson.id]?.message && (
                          <View
                            style={[
                              styles.quizFeedbackBox,
                              quizAnswerState[selectedChapter.lesson.id].isCorrect
                                ? styles.quizFeedbackSuccess
                                : styles.quizFeedbackError,
                            ]}
                          >
                            <Text style={styles.quizFeedbackText}>
                              {quizAnswerState[selectedChapter.lesson.id].message}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  )}
                </View>
              )}

              {/* ---------------------------------------------------- */}
              {/* SHEET 4: BẢN ĐỒ HÀNH TRÌNH CÁM DỖ (SAGA MAP) */}
              {/* ---------------------------------------------------- */}
              {activeSheet === 'saga' && (
                <View style={{ gap: 14 }}>
                  <Text style={styles.sheetSectionDesc}>
                    Hành trình gồm 3 Chương đối đầu với 3 loại cám dỗ lớn của giới trẻ. Vượt qua điều kiện Kỷ Luật & Kiến Thức để mở khóa từng Chương!
                  </Text>

                  <View style={styles.sagaChaptersList}>
                    {CHAPTERS_DATA.map((ch) => {
                      const status = getChapterStatus(ch, userProgress, bossStates);
                      const isSelected = ch.id === selectedChapterId;
                      const progress = getChapterUnlockProgress(ch, userProgress, bossStates);

                      let badgeBg = 'white';
                      let statusText = '🔒 Đang Khóa';
                      if (status === 'completed') {
                        badgeBg = 'yellow';
                        statusText = '🏆 Đã Tiêu Diệt';
                      } else if (status === 'active') {
                        badgeBg = 'lime';
                        statusText = '⚔️ Đang Chiến Đấu';
                      }

                      return (
                        <TouchableOpacity
                          key={ch.id}
                          style={[
                            styles.sagaChapterCard,
                            isSelected && styles.sagaChapterCardSelected,
                            status === 'locked' && styles.sagaChapterCardLocked,
                          ]}
                          onPress={() => {
                            setSelectedChapterId(ch.id);
                            if (status !== 'locked') {
                              setActiveSheet(null);
                            }
                          }}
                          activeOpacity={0.85}
                        >
                          <View style={styles.sagaCardTopRow}>
                            <View style={styles.sagaCardIconBox}>
                              <Text style={{ fontSize: 24 }}>{ch.bossIcon}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.sagaCardTitle}>{ch.title}</Text>
                              <Text style={styles.sagaCardSubtitle}>{ch.subtitle}</Text>
                            </View>
                            <NeoBadge bg={badgeBg}>
                              <Text style={styles.sagaCardBadgeText}>{statusText}</Text>
                            </NeoBadge>
                          </View>

                          {status === 'locked' && (
                            <View style={styles.sagaCardRequirementsBox}>
                              <Text style={styles.sagaReqHeader}>Điều kiện mở khóa:</Text>
                              {progress.requirements.map((req) => (
                                <View key={req.id} style={styles.sagaReqRow}>
                                  <Text style={styles.sagaReqIcon}>
                                    {req.isMet ? '✅' : '⏳'}
                                  </Text>
                                  <Text style={styles.sagaReqText}>
                                    {req.label}: {req.current} / {req.target} {req.unit}
                                  </Text>
                                </View>
                              ))}
                            </View>
                          )}

                          {isSelected && (
                            <View style={styles.sagaSelectedTag}>
                              <Text style={styles.sagaSelectedTagText}>
                                🎯 ĐANG CHỌN TRÊN SÀN ĐẤU
                              </Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ========================================================== */}
      {/* 5. FULLSCREEN 3D RUNNER GAME MODAL */}
      {/* ========================================================== */}
      <Modal
        visible={showRunner}
        animationType="slide"
        presentationStyle="fullScreen"
        statusBarTranslucent={true}
        onRequestClose={() => setShowRunner(false)}
      >
        <RunnerScreenNeo
          onClose={() => setShowRunner(false)}
          targetBoss={{
            name: selectedChapter.bossName,
            currentHp,
            totalHp: maxHp,
          }}
          chapterId={selectedChapter.id}
          hasShield={hasShieldForChapter}
          runnerConfig={getRunnerConfigForChapter(selectedChapter.id)}
          stageConfig={stageConfig}
          ultimateSkill={ultimateSkill}
          runnerQuizzes={selectedChapter.runnerQuizzes}
          onFinishRun={handleFinishRun}
        />
      </Modal>

      {/* ========================================================== */}
      {/* 6. FULLSCREEN 3D BOSS BATTLE ARENA MODAL */}
      {/* ========================================================== */}
      <Modal
        visible={showBossBattle}
        animationType="slide"
        presentationStyle="fullScreen"
        statusBarTranslucent={true}
        onRequestClose={() => setShowBossBattle(false)}
      >
        <BossBattleScreenNeo
          onClose={() => setShowBossBattle(false)}
          chapter={selectedChapter}
          avatarId={data.avatarId || data.userProgress?.avatarId || 'cat'}
          userSkills={userSkills}
          onFinishBattle={handleFinishBossBattle}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  hudContainer: {
    gap: 12,
  },

  // 1. TOP HUD STATUS BAR
  topHudBar: {
    backgroundColor: neoColors.white,
    borderColor: neoColors.black,
    borderWidth: 2,
    borderRadius: neoRadii.sm,
    padding: 10,
    gap: 8,
    shadowColor: neoColors.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  topHudRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  chapterSelectorPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: neoColors.cream,
    borderColor: neoColors.black,
    borderWidth: 1.5,
    borderRadius: neoRadii.xs,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  chapterSelectorIcon: {
    fontSize: 18,
  },
  chapterSelectorTitle: {
    color: neoColors.black,
    fontSize: 11,
    fontWeight: '900',
  },
  chapterSelectorSubtitle: {
    color: neoColors.coral,
    fontSize: 9,
    fontWeight: '800',
  },
  topHudRightStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  coinStatPill: {
    backgroundColor: '#FEF08A',
    borderColor: '#CA8A04',
    borderWidth: 1.5,
    borderRadius: neoRadii.xs,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  coinStatText: {
    color: '#854D0E',
    fontSize: 12,
    fontWeight: '900',
  },
  shieldStatPill: {
    backgroundColor: '#DCFCE7',
    borderColor: '#16A34A',
    borderWidth: 1.5,
    borderRadius: neoRadii.xs,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  shieldStatText: {
    color: '#16A34A',
    fontSize: 10,
    fontWeight: '900',
  },
  hpBarContainer: {
    gap: 3,
  },
  hpLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hpBarLabel: {
    color: neoColors.black,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  hpBarValue: {
    color: neoColors.black,
    fontSize: 10,
    fontWeight: '900',
  },
  berserkAuraBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  berserkAuraIcon: {
    fontSize: 12,
  },
  berserkAuraText: {
    flex: 1,
    color: '#DC2626',
    fontSize: 10,
    fontWeight: '800',
  },

  // 2. CENTER ANIMATED VISUAL STAGE
  arenaStageContainer: {
    borderWidth: 2.5,
    borderRadius: neoRadii.md,
    overflow: 'hidden',
    shadowColor: neoColors.black,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    minHeight: 280,
    justifyContent: 'space-between',
  },
  stageHeaderRibbon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1.5,
    borderBottomColor: neoColors.black,
  },
  stageTitleText: {
    color: neoColors.black,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  stageSilhouetteText: {
    fontSize: 10,
    opacity: 0.6,
  },
  stageColumnsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  hudWingColumn: {
    width: 68,
    gap: 14,
    alignItems: 'center',
    zIndex: 10,
  },
  floatingHudBtn: {
    width: 64,
    height: 64,
    borderRadius: neoRadii.sm,
    borderWidth: 2,
    borderColor: neoColors.black,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: neoColors.black,
    shadowOffset: { width: 2.5, height: 2.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    position: 'relative',
  },
  hudBtnYellow: {
    backgroundColor: '#FEF08A',
  },
  hudBtnMint: {
    backgroundColor: '#A7F3D0',
  },
  hudBtnCream: {
    backgroundColor: '#FFFBEB',
  },
  hudBtnCoral: {
    backgroundColor: '#FECDD3',
  },
  floatingBadgeBox: {
    position: 'absolute',
    top: -7,
    right: -4,
    backgroundColor: neoColors.coral,
    borderColor: neoColors.black,
    borderWidth: 1.2,
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
    zIndex: 12,
  },
  floatingBadgeText: {
    color: neoColors.white,
    fontSize: 8,
    fontWeight: '900',
  },
  floatingIcon: {
    fontSize: 22,
  },
  floatingBtnLabel: {
    color: neoColors.black,
    fontSize: 8.5,
    fontWeight: '900',
    marginTop: 2,
  },

  // Center Boss Visuals
  centerBossArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 8,
  },
  roastBubbleBox: {
    backgroundColor: neoColors.white,
    borderColor: neoColors.black,
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
    maxWidth: 200,
    position: 'relative',
    shadowColor: neoColors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  roastBubbleText: {
    color: neoColors.black,
    fontSize: 10.5,
    fontWeight: '700',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  roastBubbleArrow: {
    position: 'absolute',
    bottom: -6,
    left: '50%',
    marginLeft: -5,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: neoColors.black,
  },
  animatedBossWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bossMainGraphic: {
    width: 125,
    height: 125,
  },
  bossProceduralBox: {
    width: 110,
    height: 110,
    backgroundColor: neoColors.white,
    borderColor: neoColors.black,
    borderWidth: 2.5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: neoColors.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  bossGroundShadow: {
    width: 80,
    height: 12,
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 20,
    marginTop: 4,
  },
  bossTapHintPill: {
    marginTop: 6,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderColor: neoColors.black,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  bossTapHintText: {
    color: neoColors.black,
    fontSize: 9,
    fontWeight: '800',
  },
  stageTargetBar: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderTopWidth: 1.5,
    borderTopColor: neoColors.black,
    paddingVertical: 5,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  stageTargetBarText: {
    color: neoColors.black,
    fontSize: 9.5,
    fontWeight: '600',
    textAlign: 'center',
  },

  // 3. BOTTOM DUAL ACTION DOCK
  dualActionDock: {
    backgroundColor: neoColors.white,
    borderColor: neoColors.black,
    borderWidth: 2,
    borderRadius: neoRadii.sm,
    padding: 8,
    shadowColor: neoColors.black,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  dockButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dockBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: neoRadii.xs,
    borderWidth: 2,
    borderColor: neoColors.black,
    shadowColor: neoColors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  dockBtnRunner: {
    backgroundColor: neoColors.mint,
  },
  dockBtnBossActive: {
    backgroundColor: neoColors.yellow,
  },
  dockBtnBossLocked: {
    backgroundColor: '#F1F5F9',
    borderColor: '#94A3B8',
  },
  dockBtnIcon: {
    fontSize: 22,
  },
  dockBtnTextCol: {
    flex: 1,
  },
  dockBtnMainLabel: {
    color: neoColors.black,
    fontSize: 11.5,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  dockBtnSubLabel: {
    color: neoColors.black,
    fontSize: 9,
    fontWeight: '600',
  },

  // 4. GAME BOTTOM SHEET MODAL
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheetBackdropTouch: {
    flex: 1,
  },
  sheetDialog: {
    backgroundColor: '#FFFDF8',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 2.5,
    borderBottomWidth: 0,
    borderColor: neoColors.black,
    maxHeight: '85%',
    paddingBottom: 24,
  },
  sheetHandleBar: {
    width: 44,
    height: 5,
    backgroundColor: '#CBD5E1',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: neoColors.black,
    backgroundColor: neoColors.cream,
  },
  sheetHeaderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sheetHeaderIcon: {
    fontSize: 24,
  },
  sheetHeaderTitle: {
    color: neoColors.black,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  sheetHeaderSubtitle: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '600',
  },
  sheetCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: neoRadii.xs,
    backgroundColor: neoColors.white,
    borderColor: neoColors.black,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: neoColors.black,
    shadowOffset: { width: 1.5, height: 1.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  sheetScrollView: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  sheetScrollContent: {
    paddingBottom: 24,
  },
  sheetSectionDesc: {
    color: '#475569',
    fontSize: 11.5,
    lineHeight: 16,
    fontWeight: '600',
  },

  // Sheet Content Styles (Skills, Ultimates, Lessons, Saga)
  skillsEmptyBox: {
    backgroundColor: neoColors.white,
    borderColor: neoColors.black,
    borderWidth: 2,
    borderRadius: neoRadii.sm,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    marginTop: 6,
  },
  skillsEmptyTitle: {
    color: neoColors.black,
    fontSize: 13,
    fontWeight: '900',
  },
  skillsEmptyDesc: {
    color: '#64748B',
    fontSize: 11.5,
    fontWeight: '600',
    lineHeight: 17,
    textAlign: 'center',
  },
  skillsInventoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillInventoryCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: neoColors.white,
    borderColor: neoColors.black,
    borderWidth: 1.5,
    borderRadius: neoRadii.xs,
    padding: 10,
    gap: 4,
    position: 'relative',
  },
  skillInventoryCardCounter: {
    borderColor: neoColors.coral,
    borderWidth: 2,
    backgroundColor: '#FFF1F2',
  },
  skillCounterBadge: {
    position: 'absolute',
    top: -8,
    right: 4,
    backgroundColor: neoColors.coral,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  skillCounterBadgeText: {
    color: neoColors.white,
    fontSize: 8.5,
    fontWeight: '900',
  },
  skillInventoryName: {
    color: neoColors.black,
    fontSize: 11.5,
    fontWeight: '900',
    textAlign: 'center',
  },
  skillInventoryDmgPill: {
    backgroundColor: '#FEF08A',
    borderRadius: 4,
    paddingVertical: 2,
    alignItems: 'center',
  },
  skillInventoryDmgText: {
    color: '#854D0E',
    fontSize: 10,
    fontWeight: '900',
  },
  skillInventoryDesc: {
    color: '#64748B',
    fontSize: 10,
    lineHeight: 14,
    textAlign: 'center',
  },

  // Ultimate Styles
  ultimateHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 2,
    borderRadius: neoRadii.sm,
    padding: 12,
  },
  ultimateNameText: {
    color: neoColors.black,
    fontSize: 15,
    fontWeight: '900',
  },
  ultimateDamageBadgeText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '900',
    marginTop: 2,
  },
  ultimateChantBox: {
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: neoRadii.xs,
    padding: 10,
  },
  ultimateChantText: {
    color: neoColors.black,
    fontSize: 12,
    fontStyle: 'italic',
    fontWeight: '800',
    textAlign: 'center',
  },
  ultimateDescText: {
    color: neoColors.black,
    fontSize: 11.5,
    fontWeight: '600',
    lineHeight: 17,
  },
  ultimateHowToBox: {
    backgroundColor: '#FEF08A',
    borderColor: '#CA8A04',
    borderWidth: 1.5,
    borderRadius: neoRadii.xs,
    padding: 10,
  },
  ultimateHowToText: {
    color: '#854D0E',
    fontSize: 11,
    lineHeight: 16,
  },

  // Lesson & Quizlet Styles
  lessonUnlockInfoBox: {
    gap: 10,
    backgroundColor: neoColors.cream,
    padding: 12,
    borderRadius: neoRadii.sm,
    borderWidth: 1.5,
    borderColor: neoColors.black,
  },
  lessonFreeNotice: {
    color: neoColors.black,
    fontSize: 12.5,
  },
  lessonUnlockDesc: {
    color: neoColors.black,
    fontSize: 11.5,
    lineHeight: 16,
    fontWeight: '600',
  },
  coinBalanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FEF08A',
    borderColor: '#CA8A04',
    borderWidth: 1.5,
    borderRadius: neoRadii.xs,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  coinBalanceLabel: {
    color: '#854D0E',
    fontSize: 11.5,
    fontWeight: '800',
  },
  coinBalanceValue: {
    color: '#854D0E',
    fontSize: 13,
    fontWeight: '900',
  },
  storyContainer: {
    backgroundColor: '#FEF3C7',
    borderColor: neoColors.black,
    borderWidth: 2,
    borderRadius: neoRadii.sm,
    padding: 12,
    gap: 8,
  },
  storyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  storyIcon: {
    fontSize: 18,
  },
  storyTitleText: {
    flex: 1,
    color: '#92400E',
    fontSize: 12.5,
    fontWeight: '900',
  },
  storyNarrativeText: {
    color: neoColors.black,
    fontSize: 11.5,
    fontWeight: '600',
    lineHeight: 17,
    fontStyle: 'italic',
  },
  analysisBox: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
    borderWidth: 1.5,
    borderRadius: neoRadii.xs,
    padding: 10,
    gap: 4,
  },
  analysisLabel: {
    color: '#DC2626',
    fontSize: 9.5,
    fontWeight: '900',
  },
  analysisText: {
    color: '#991B1B',
    fontSize: 10.5,
    fontWeight: '700',
    lineHeight: 15,
  },
  takeawayBox: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 1.5,
    borderRadius: neoRadii.xs,
    padding: 10,
    gap: 4,
  },
  takeawayLabel: {
    color: '#059669',
    fontSize: 9.5,
    fontWeight: '900',
  },
  takeawayText: {
    color: '#065F46',
    fontSize: 10.5,
    fontWeight: '700',
    lineHeight: 15,
  },
  quizBox: {
    backgroundColor: neoColors.white,
    borderColor: neoColors.black,
    borderWidth: 1.5,
    borderRadius: neoRadii.sm,
    padding: 12,
    gap: 10,
  },
  quizHeader: {
    gap: 4,
  },
  quizTag: {
    color: neoColors.coral,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  quizQuestion: {
    color: neoColors.black,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 17,
  },
  quizOptionsList: {
    gap: 6,
  },
  quizOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: neoColors.white,
    borderColor: neoColors.black,
    borderWidth: 1.5,
    borderRadius: neoRadii.xs,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  quizOptionCorrect: {
    backgroundColor: '#DCFCE7',
    borderColor: '#16A34A',
  },
  quizOptionWrong: {
    backgroundColor: '#FEE2E2',
    borderColor: '#DC2626',
  },
  quizOptionLetter: {
    color: neoColors.black,
    fontSize: 11.5,
    fontWeight: '900',
  },
  quizOptionText: {
    flex: 1,
    color: neoColors.black,
    fontSize: 11.5,
    fontWeight: '600',
  },
  quizFeedbackBox: {
    borderRadius: neoRadii.xs,
    padding: 8,
    borderWidth: 1.5,
  },
  quizFeedbackSuccess: {
    backgroundColor: '#DCFCE7',
    borderColor: '#16A34A',
  },
  quizFeedbackError: {
    backgroundColor: '#FEE2E2',
    borderColor: '#DC2626',
  },
  quizFeedbackText: {
    color: neoColors.black,
    fontSize: 10.5,
    fontWeight: '700',
    lineHeight: 15,
  },

  // Saga Chapters List Styles
  sagaChaptersList: {
    gap: 10,
  },
  sagaChapterCard: {
    backgroundColor: neoColors.white,
    borderColor: neoColors.black,
    borderWidth: 1.5,
    borderRadius: neoRadii.sm,
    padding: 12,
    gap: 8,
    shadowColor: neoColors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  sagaChapterCardSelected: {
    borderColor: neoColors.yellow,
    borderWidth: 2.5,
    backgroundColor: '#FFFDF0',
  },
  sagaChapterCardLocked: {
    opacity: 0.85,
    backgroundColor: '#F8FAFC',
  },
  sagaCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sagaCardIconBox: {
    width: 40,
    height: 40,
    borderRadius: neoRadii.xs,
    backgroundColor: neoColors.cream,
    borderColor: neoColors.black,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sagaCardTitle: {
    color: neoColors.black,
    fontSize: 12.5,
    fontWeight: '900',
  },
  sagaCardSubtitle: {
    color: '#64748B',
    fontSize: 10.5,
    fontWeight: '600',
  },
  sagaCardBadgeText: {
    color: neoColors.black,
    fontSize: 9,
    fontWeight: '800',
  },
  sagaCardRequirementsBox: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: neoRadii.xs,
    padding: 8,
    gap: 4,
  },
  sagaReqHeader: {
    color: '#DC2626',
    fontSize: 10,
    fontWeight: '900',
  },
  sagaReqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sagaReqIcon: {
    fontSize: 12,
  },
  sagaReqText: {
    color: '#991B1B',
    fontSize: 10,
    fontWeight: '600',
  },
  sagaSelectedTag: {
    backgroundColor: '#FEF08A',
    borderColor: '#CA8A04',
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 3,
    alignItems: 'center',
  },
  sagaSelectedTagText: {
    color: '#854D0E',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
});
