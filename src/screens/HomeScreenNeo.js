import React, { useState, useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { neoColors, neoBorders, neoRadii, neoShadows } from '../design-system/tokens';
import { NeoCard, NeoBadge, NeoProgressBar, NeoButton } from '../design-system/components';
import { QuickExpenseNeo } from '../components/QuickExpenseNeo';
import { extractGameMetrics } from '../utils/homeHelper.cjs';
import {
  COIN_SHOP_ITEMS,
  LEVEL_UP_GUIDE,
  DISCIPLINE_GUIDE,
  getTodayString,
  checkDailyCheckinStatus,
  calculateLevelProgress,
  executeDailyCheckin,
  redeemCoinShopItem,
} from '../utils/gameEconomyHelper.cjs';

export function HomeScreenNeo({
  dashboard,
  expenseText = '',
  isLoading = false,
  selectedExpenseCategory = 'OTHER',
  completingChallengeId = null,
  onChangeExpenseText,
  onSelectExpenseCategory,
  onSubmitExpense,
  onCompleteChallenge,
  onNavigateToCoach,
  onNavigateToBoss,
  onOpenLeaderboard,
  onOpenRunner,
  userId = 'default_user',
  onRefreshDashboard,
}) {
  const metrics = extractGameMetrics(dashboard);

  const {
    streak: baseStreak,
    level: baseLevel,
    xp: baseXp,
    coins: baseCoins,
    discipline,
    bossName,
    bossMaxHp,
    bossCurrentHp,
    bossHpPercentage,
    isBossDefeated,
    monthlyBudget,
    monthlySpent,
    remainingBudget,
    todayChallenge,
    activeChapter,
  } = metrics;

  // Local synced RPG state
  const [localStreak, setLocalStreak] = useState(baseStreak);
  const [localCoins, setLocalCoins] = useState(baseCoins);
  const [localXp, setLocalXp] = useState(baseXp);
  const [lastCheckinDate, setLastCheckinDate] = useState(null);
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);

  // Modals state
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showCoinShopModal, setShowCoinShopModal] = useState(false);
  const [showDisciplineModal, setShowDisciplineModal] = useState(false);

  const todayStr = useMemo(() => getTodayString(), []);

  // Load persistent coins and check-in status from AsyncStorage
  useEffect(() => {
    async function loadStorageState() {
      try {
        const storedCoins = await AsyncStorage.getItem(`vmh_coins_${userId}`);
        if (storedCoins !== null) {
          setLocalCoins(Math.max(baseCoins, Number(storedCoins) || 0));
        }

        const storedCheckin = await AsyncStorage.getItem(`vmh_last_checkin_${userId}`);
        setLastCheckinDate(storedCheckin);

        const isChecked = checkDailyCheckinStatus(storedCheckin, todayStr);
        setHasCheckedInToday(isChecked);

        // Auto trigger daily check-in popup if opening app for the first time today
        if (!isChecked) {
          setShowCheckinModal(true);
        }
      } catch (err) {
        // Safe fallback
      }
    }
    loadStorageState();
  }, [userId, baseCoins, todayStr]);

  // Sync state if metrics change from backend
  useEffect(() => {
    setLocalStreak((prev) => Math.max(prev, baseStreak));
    setLocalXp((prev) => Math.max(prev, baseXp));
  }, [baseStreak, baseXp]);

  const levelProgress = useMemo(() => {
    return calculateLevelProgress(localXp);
  }, [localXp]);

  // Handle daily checkin action
  const handleCheckin = async () => {
    const result = executeDailyCheckin(
      { streak: localStreak, coins: localCoins, xp: localXp },
      todayStr
    );

    setLocalStreak(result.streak);
    setLocalCoins(result.coins);
    setLocalXp(result.xp);
    setLastCheckinDate(todayStr);
    setHasCheckedInToday(true);

    try {
      await AsyncStorage.setItem(`vmh_coins_${userId}`, String(result.coins));
      await AsyncStorage.setItem(`vmh_last_checkin_${userId}`, todayStr);
    } catch (err) {
      // Ignore
    }

    Alert.alert(
      'Điểm Danh Thành Công! 🎉',
      `Bạn đã duy trì chuỗi Streak ${result.streak} Ngày!\n• Nhận: +${result.bonusCoins} Xu 🪙\n• Nhận: +${result.bonusXp} XP ⚡`
    );
    setShowCheckinModal(false);
  };

  // Handle Coin Shop item redemption
  const handleRedeemItem = async (itemId) => {
    const result = redeemCoinShopItem(localCoins, itemId);
    if (!result.success) {
      Alert.alert('Chưa Thể Đổi', result.message);
      return;
    }

    setLocalCoins(result.remainingCoins);
    try {
      await AsyncStorage.setItem(`vmh_coins_${userId}`, String(result.remainingCoins));
    } catch (err) {
      // Ignore
    }

    if (itemId === 'RUNNER_TICKET') {
      Alert.alert(
        'Đổi Thưởng Thành Công! 🎉',
        'Bạn đã nhận được 1 Vé Chơi 3D Runner! Bạn có muốn vào chạy ngay không?',
        [
          { text: 'Để sau', style: 'cancel' },
          { text: 'Chạy Ngay 🏃', onPress: () => { setShowCoinShopModal(false); onOpenRunner?.(); } },
        ]
      );
    } else if (itemId === 'FREEZE_STREAK') {
      Alert.alert(
        'Đổi Thưởng Thành Công! 🧊',
        'Bạn đã nhận được 1 Lượt Đóng Băng Streak! Chuỗi ngày của bạn sẽ được bảo vệ an toàn.'
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. Game Status HUD Bar */}
      <View style={styles.statusBar}>
        {/* Streak Chiplet */}
        <TouchableOpacity
          style={styles.statusPill}
          onPress={() => setShowCheckinModal(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.statusIcon}>🔥</Text>
          <View>
            <Text style={styles.statusValue}>{localStreak} Ngày</Text>
            <Text style={styles.statusSub}>
              {hasCheckedInToday ? 'Đã điểm danh' : 'Chưa điểm danh'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Level & XP Chiplet */}
        <TouchableOpacity
          style={styles.statusPill}
          onPress={() => setShowLevelModal(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.statusIcon}>⭐</Text>
          <View>
            <Text style={styles.statusValue}>Lv.{levelProgress.level}</Text>
            <Text style={styles.statusSub}>{levelProgress.xpInCurrentLevel}/100 XP</Text>
          </View>
        </TouchableOpacity>

        {/* Coins Chiplet */}
        <TouchableOpacity
          style={styles.statusPill}
          onPress={() => setShowCoinShopModal(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.statusIcon}>🪙</Text>
          <View>
            <Text style={styles.statusValue}>{localCoins} Xu</Text>
            <Text style={styles.statusSub}>Đổi quà</Text>
          </View>
        </TouchableOpacity>

        {/* Discipline Points Chiplet */}
        <TouchableOpacity
          style={styles.statusPill}
          onPress={() => setShowDisciplineModal(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.statusIcon}>🛡️</Text>
          <View>
            <Text style={styles.statusValue}>{discipline} Điểm</Text>
            <Text style={styles.statusSub}>Kỷ luật</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 2. Compact Boss Arena Battle Frame */}
      <NeoCard bg="yellow" style={styles.bossCard}>
        <View style={styles.bossHeader}>
          <NeoBadge bg="coral">
            <Text style={styles.bossTagText}>
              {activeChapter ? `${activeChapter.bossIcon} CHƯƠNG ${activeChapter.number}` : '⚔️ ĐẤU TRƯỜNG BOSS'}
            </Text>
          </NeoBadge>
          <Text style={styles.bossHpBadge}>
            {bossCurrentHp.toLocaleString('vi-VN')} / {bossMaxHp.toLocaleString('vi-VN')} HP
          </Text>
        </View>

        <View style={styles.bossBody}>
          <View style={styles.bossAvatarBox}>
            <Text style={styles.bossAvatarEmoji}>{activeChapter?.bossIcon || '🧋'}</Text>
          </View>

          <View style={styles.bossInfo}>
            <Text style={styles.bossName}>{activeChapter?.bossName || bossName}</Text>
            <NeoProgressBar
              progress={bossHpPercentage}
              fillColor={bossHpPercentage > 0.3 ? 'coral' : 'lime'}
              height={12}
            />
          </View>
        </View>

        {isBossDefeated ? (
          <View style={styles.bossDefeatedBox}>
            <Text style={styles.bossDefeatedText}>🎉 BOSS ĐÃ BỊ HẠ GỤC HÔM NAY! TIẾT KIỆM THÀNH CÔNG!</Text>
          </View>
        ) : (
          <View style={styles.bossActionRow}>
            <TouchableOpacity
              style={styles.gameRunBtn}
              onPress={onOpenRunner || onNavigateToBoss}
              activeOpacity={0.8}
            >
              <Text style={styles.gameRunBtnText}>🏃 VÀO TRẬN 3D</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.gameDetailBtn}
              onPress={onNavigateToBoss}
              activeOpacity={0.8}
            >
              <Text style={styles.gameDetailBtnText}>⚔️ CHI TIẾT BOSS</Text>
            </TouchableOpacity>
          </View>
        )}
      </NeoCard>

      {/* 3. Quick Expense Smart Bar */}
      <QuickExpenseNeo
        expenseText={expenseText}
        isLoading={isLoading}
        selectedExpenseCategory={selectedExpenseCategory}
        onChangeExpenseText={onChangeExpenseText}
        onSelectExpenseCategory={onSelectExpenseCategory}
        onSubmitExpense={onSubmitExpense}
        onNavigateToCoach={onNavigateToCoach}
      />

      {/* 4. Dual Game Tiles (Nhiệm Vụ & Ví Sinh Tồn) */}
      <View style={styles.dualTilesRow}>
        {/* Left Tile: Today Quest */}
        <NeoCard bg="white" style={styles.tileCard}>
          <View style={styles.tileHeader}>
            <Text style={styles.tileIcon}>🎯</Text>
            <Text style={styles.tileTitle}>NHIỆM VỤ</Text>
          </View>

          <Text numberOfLines={2} style={styles.questTitleText}>
            {todayChallenge?.title || 'Không chi tiêu bốc đồng'}
          </Text>

          <View style={styles.questRewardRow}>
            <Text style={styles.questRewardBadge}>+{todayChallenge?.rewardXp || 30} XP</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.questActionBtn,
              todayChallenge?.status === 'completed'
                ? styles.questActionBtnCompleted
                : styles.questActionBtnActive,
            ]}
            onPress={() => todayChallenge && onCompleteChallenge?.(todayChallenge.id)}
            disabled={isLoading || completingChallengeId === todayChallenge?.id || todayChallenge?.status === 'completed'}
            activeOpacity={0.8}
          >
            {completingChallengeId === todayChallenge?.id ? (
              <ActivityIndicator size="small" color={neoColors.black} />
            ) : todayChallenge?.status === 'completed' ? (
              <Text style={styles.questActionBtnText}>✅ ĐÃ XONG</Text>
            ) : (
              <Text style={styles.questActionBtnText}>NHẬN XP ⚡</Text>
            )}
          </TouchableOpacity>
        </NeoCard>

        {/* Right Tile: Budget Survival */}
        <NeoCard bg="white" style={styles.tileCard}>
          <View style={styles.tileHeader}>
            <Text style={styles.tileIcon}>🛡️</Text>
            <Text style={styles.tileTitle}>VÍ SINH TỒN</Text>
          </View>

          <View style={styles.budgetAmountBox}>
            <Text style={styles.budgetAmountLabel}>Còn sống sót với</Text>
            <Text numberOfLines={1} style={styles.budgetAmountValue}>
              {remainingBudget.toLocaleString('vi-VN')} đ
            </Text>
          </View>

          <View style={styles.budgetProgressBox}>
            <NeoProgressBar
              progress={monthlyBudget > 0 ? Math.max(0, 1 - (monthlySpent / monthlyBudget)) : 1}
              fillColor={remainingBudget > 0 ? 'mint' : 'coral'}
              height={8}
            />
            <Text numberOfLines={1} style={styles.budgetLimitLabel}>
              Hạn mức: {monthlyBudget.toLocaleString('vi-VN')} đ
            </Text>
          </View>
        </NeoCard>
      </View>

      {/* ========================================================== */}
      {/* 5. MODAL 1: ĐIỂM DANH NGÀY MỚI (DAILY CHECK-IN) */}
      {/* ========================================================== */}
      <Modal
        visible={showCheckinModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCheckinModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalDialog}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <Text style={styles.modalHeaderIcon}>🔥</Text>
                <Text style={styles.modalHeaderTitle}>ĐIỂM DANH NGÀY MỚI</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowCheckinModal(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={18} color={neoColors.black} />
              </TouchableOpacity>
            </View>

            <View style={styles.checkinHeroBox}>
              <Text style={styles.checkinFireIcon}>🔥</Text>
              <Text style={styles.checkinStreakBig}>Chuỗi {localStreak} Ngày</Text>
              <Text style={styles.checkinDesc}>
                {hasCheckedInToday
                  ? 'Hôm nay bạn đã điểm danh xuất sắc! Hãy tiếp tục duy trì kỷ luật nhé.'
                  : 'Điểm danh ngay để duy trì chuỗi lửa và nhận phần thưởng chiến thần!'}
              </Text>
            </View>

            <View style={styles.rewardBox}>
              <Text style={styles.rewardBoxTitle}>🎁 PHẦN THƯỞNG ĐIỂM DANH:</Text>
              <View style={styles.rewardRow}>
                <Text style={styles.rewardItem}>🔥 +1 Ngày Streak</Text>
                <Text style={styles.rewardItem}>🪙 +10 Xu Ví</Text>
                <Text style={styles.rewardItem}>⚡ +15 XP Cấp Độ</Text>
              </View>
            </View>

            {hasCheckedInToday ? (
              <NeoButton
                variant="black"
                size="md"
                onPress={() => setShowCheckinModal(false)}
              >
                ĐÃ ĐIỂM DANH HÔM NAY ✅
              </NeoButton>
            ) : (
              <NeoButton
                variant="yellow"
                size="md"
                onPress={handleCheckin}
              >
                ĐIỂM DANH & NHẬN THƯỞNG ➔
              </NeoButton>
            )}
          </View>
        </View>
      </Modal>

      {/* ========================================================== */}
      {/* 6. MODAL 2: TIẾN TRÌNH CẤP ĐỘ & CÀY XP (LEVEL PROGRESS) */}
      {/* ========================================================== */}
      <Modal
        visible={showLevelModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLevelModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalDialog}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <Text style={styles.modalHeaderIcon}>⭐</Text>
                <Text style={styles.modalHeaderTitle}>TIẾN TRÌNH CẤP ĐỘ</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowLevelModal(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={18} color={neoColors.black} />
              </TouchableOpacity>
            </View>

            <View style={styles.levelCardTop}>
              <Text style={styles.levelBigText}>CẤP ĐỘ: Lv.{levelProgress.level}</Text>
              <Text style={styles.levelXpSub}>
                {levelProgress.xpInCurrentLevel} / {levelProgress.nextLevelXp} XP (Tổng: {levelProgress.totalXp} XP)
              </Text>
              <NeoProgressBar
                progress={levelProgress.progressRatio}
                fillColor="yellow"
                height={14}
              />
              <Text style={styles.levelTargetNotice}>
                ⚡ Còn thiếu <Text style={{ fontWeight: '900' }}>{levelProgress.xpToNextLevel} XP</Text> để thăng cấp lên Lv.{levelProgress.level + 1}!
              </Text>
            </View>

            <Text style={styles.guideTitle}>📜 CÁCH CÀY KINH NGHIỆM (XP GUIDE):</Text>
            <View style={styles.guideList}>
              {LEVEL_UP_GUIDE.map((g, idx) => (
                <View key={idx} style={styles.guideRow}>
                  <Text style={styles.guideRowIcon}>{g.icon}</Text>
                  <Text style={styles.guideRowAction}>{g.action}</Text>
                  <Text style={styles.guideRowReward}>{g.reward}</Text>
                </View>
              ))}
            </View>

            <NeoButton
              variant="black"
              size="sm"
              onPress={() => setShowLevelModal(false)}
            >
              ĐÃ HIỂU ➔
            </NeoButton>
          </View>
        </View>
      </Modal>

      {/* ========================================================== */}
      {/* 7. MODAL 3: CỬA HÀNG ĐỔI THƯỞNG XU (COIN SHOP) */}
      {/* ========================================================== */}
      <Modal
        visible={showCoinShopModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCoinShopModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalDialog}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <Text style={styles.modalHeaderIcon}>🪙</Text>
                <Text style={styles.modalHeaderTitle}>CỬA HÀNG ĐỔI THƯỞNG</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowCoinShopModal(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={18} color={neoColors.black} />
              </TouchableOpacity>
            </View>

            <View style={styles.coinBalanceBox}>
              <Text style={styles.coinBalanceLabel}>Ví Xu Hiện Có:</Text>
              <Text style={styles.coinBalanceValue}>🪙 {localCoins} Xu</Text>
            </View>

            <View style={styles.shopItemList}>
              {COIN_SHOP_ITEMS.map((item) => {
                const canAfford = localCoins >= item.cost;
                return (
                  <View key={item.id} style={styles.shopCard}>
                    <View style={styles.shopCardLeft}>
                      <Text style={styles.shopCardIcon}>{item.icon}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.shopCardTitle}>{item.title}</Text>
                        <Text style={styles.shopCardDesc}>{item.desc}</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.shopRedeemBtn,
                        canAfford ? styles.shopRedeemBtnActive : styles.shopRedeemBtnDisabled,
                      ]}
                      onPress={() => handleRedeemItem(item.id)}
                      disabled={!canAfford}
                    >
                      <Text style={[styles.shopRedeemText, canAfford && styles.shopRedeemTextActive]}>
                        {item.cost} Xu
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>

            <View style={styles.coinTipBox}>
              <Text style={styles.coinTipTitle}>💡 Cách kiếm thêm Xu:</Text>
              <Text style={styles.coinTipText}>
                • Điểm danh mỗi ngày: <Text style={{ fontWeight: '800' }}>+10 Xu</Text>{'\n'}
                • Nhặt trên đường chạy 3D Runner: <Text style={{ fontWeight: '800' }}>Lên tới 50 Xu/ván</Text>{'\n'}
                • Hoàn thành thử thách: <Text style={{ fontWeight: '800' }}>+20 Xu</Text>
              </Text>
            </View>

            <NeoButton
              variant="black"
              size="sm"
              onPress={() => setShowCoinShopModal(false)}
            >
              ĐÓNG CỬA HÀNG
            </NeoButton>
          </View>
        </View>
      </Modal>

      {/* ========================================================== */}
      {/* 8. MODAL 4: GIẢI THÍCH ĐIỂM KỶ LUẬT (DISCIPLINE INFO) */}
      {/* ========================================================== */}
      <Modal
        visible={showDisciplineModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDisciplineModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalDialog}>
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleRow}>
                <Text style={styles.modalHeaderIcon}>🛡️</Text>
                <Text style={styles.modalHeaderTitle}>ĐIỂM KỶ LUẬT CHIẾN BINH</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowDisciplineModal(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={18} color={neoColors.black} />
              </TouchableOpacity>
            </View>

            <View style={styles.disciplineScoreCard}>
              <Text style={styles.disciplineScoreValue}>🛡️ {discipline} Điểm</Text>
              <Text style={styles.disciplineScoreSub}>
                Điểm Kỷ Luật là thước đo độ kiên định của bạn để đua top trên Bảng Xếp Hạng toàn cầu!
              </Text>
            </View>

            <Text style={styles.guideTitle}>📜 CÁCH TĂNG ĐIỂM KỶ LUẬT:</Text>
            <View style={styles.guideList}>
              {DISCIPLINE_GUIDE.map((g, idx) => (
                <View key={idx} style={styles.guideRow}>
                  <Text style={styles.guideRowIcon}>{g.icon}</Text>
                  <Text style={styles.guideRowAction}>{g.action}</Text>
                  <Text style={styles.guideRowReward}>{g.reward}</Text>
                </View>
              ))}
            </View>

            <NeoButton
              variant="yellow"
              size="md"
              onPress={() => {
                setShowDisciplineModal(false);
                onOpenLeaderboard?.();
              }}
            >
              XEM BẢNG XẾP HẠNG 🏆
            </NeoButton>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    width: '100%',
  },
  statusBar: {
    flexDirection: 'row',
    gap: 6,
  },
  statusPill: {
    flex: 1,
    backgroundColor: neoColors.white,
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
    borderRadius: neoRadii.md,
    paddingVertical: 6,
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    ...neoShadows.default,
  },
  statusIcon: {
    fontSize: 16,
  },
  statusValue: {
    fontSize: 11,
    fontWeight: '900',
    color: neoColors.black,
  },
  statusSub: {
    fontSize: 8,
    fontWeight: '700',
    color: neoColors.grayMuted,
    marginTop: 1,
  },
  bossCard: {
    padding: 12,
    gap: 10,
  },
  bossHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bossTagText: {
    fontSize: 10,
    fontWeight: '900',
    color: neoColors.white,
  },
  bossHpBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: neoColors.black,
  },
  bossBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bossAvatarBox: {
    width: 48,
    height: 48,
    borderRadius: neoRadii.md,
    backgroundColor: neoColors.white,
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
    alignItems: 'center',
    justifyContent: 'center',
    ...neoShadows.default,
  },
  bossAvatarEmoji: {
    fontSize: 26,
  },
  bossInfo: {
    flex: 1,
    gap: 4,
  },
  bossName: {
    fontSize: 15,
    fontWeight: '900',
    color: neoColors.black,
  },
  bossDefeatedBox: {
    padding: 8,
    backgroundColor: neoColors.lime,
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
    borderRadius: neoRadii.md,
    alignItems: 'center',
  },
  bossDefeatedText: {
    fontSize: 11,
    fontWeight: '900',
    color: neoColors.black,
  },
  bossActionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  gameRunBtn: {
    flex: 1,
    height: 38,
    backgroundColor: '#00F0FF',
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
    borderRadius: neoRadii.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...neoShadows.default,
  },
  gameRunBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: neoColors.black,
  },
  gameDetailBtn: {
    flex: 1,
    height: 38,
    backgroundColor: neoColors.black,
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
    borderRadius: neoRadii.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...neoShadows.default,
  },
  gameDetailBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: neoColors.white,
  },
  dualTilesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tileCard: {
    flex: 1,
    padding: 10,
    gap: 8,
    justifyContent: 'space-between',
  },
  tileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 4,
    borderBottomWidth: 1.5,
    borderBottomColor: neoColors.grayLight,
  },
  tileIcon: {
    fontSize: 14,
  },
  tileTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: neoColors.black,
    letterSpacing: 0.5,
  },
  questTitleText: {
    fontSize: 12,
    fontWeight: '800',
    color: neoColors.black,
    lineHeight: 16,
    minHeight: 32,
  },
  questRewardRow: {
    flexDirection: 'row',
  },
  questRewardBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#059669',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  questActionBtn: {
    height: 32,
    borderRadius: neoRadii.sm,
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questActionBtnActive: {
    backgroundColor: neoColors.lime,
    ...neoShadows.default,
  },
  questActionBtnCompleted: {
    backgroundColor: neoColors.grayLight,
  },
  questActionBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: neoColors.black,
  },
  budgetAmountBox: {
    gap: 2,
    minHeight: 32,
  },
  budgetAmountLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: neoColors.grayMuted,
  },
  budgetAmountValue: {
    fontSize: 13,
    fontWeight: '900',
    color: '#059669',
  },
  budgetProgressBox: {
    gap: 4,
  },
  budgetLimitLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: neoColors.grayMuted,
  },

  /* MODAL STYLES */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalDialog: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: neoColors.white,
    borderColor: neoColors.black,
    borderWidth: 3,
    borderRadius: 14,
    padding: 18,
    gap: 12,
    ...neoShadows.card,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: neoColors.black,
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modalHeaderIcon: {
    fontSize: 18,
  },
  modalHeaderTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: neoColors.black,
  },
  modalCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: neoColors.grayLight,
    borderColor: neoColors.black,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkinHeroBox: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FEF9C3',
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
    borderRadius: neoRadii.md,
    gap: 4,
  },
  checkinFireIcon: {
    fontSize: 36,
  },
  checkinStreakBig: {
    fontSize: 22,
    fontWeight: '900',
    color: neoColors.black,
  },
  checkinDesc: {
    fontSize: 11,
    fontWeight: '600',
    color: neoColors.black,
    textAlign: 'center',
    paddingHorizontal: 12,
    lineHeight: 16,
  },
  rewardBox: {
    padding: 10,
    backgroundColor: neoColors.bgCanvas,
    borderColor: neoColors.black,
    borderWidth: 1.5,
    borderRadius: neoRadii.md,
    gap: 6,
  },
  rewardBoxTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: neoColors.black,
  },
  rewardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rewardItem: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  levelCardTop: {
    padding: 12,
    backgroundColor: neoColors.bgCanvas,
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
    borderRadius: neoRadii.md,
    gap: 6,
  },
  levelBigText: {
    fontSize: 16,
    fontWeight: '900',
    color: neoColors.black,
  },
  levelXpSub: {
    fontSize: 11,
    fontWeight: '700',
    color: neoColors.grayMuted,
  },
  levelTargetNotice: {
    fontSize: 11,
    fontWeight: '600',
    color: neoColors.black,
    marginTop: 2,
  },
  guideTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: neoColors.black,
    marginTop: 4,
  },
  guideList: {
    gap: 6,
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    backgroundColor: neoColors.bgCanvas,
    borderColor: neoColors.black,
    borderWidth: 1.5,
    borderRadius: neoRadii.sm,
  },
  guideRowIcon: {
    fontSize: 16,
  },
  guideRowAction: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: neoColors.black,
  },
  guideRowReward: {
    fontSize: 11,
    fontWeight: '900',
    color: '#D97706',
  },
  coinBalanceBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FEF9C3',
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
    borderRadius: neoRadii.md,
  },
  coinBalanceLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: neoColors.black,
  },
  coinBalanceValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#D97706',
  },
  shopItemList: {
    gap: 8,
  },
  shopCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: neoColors.bgCanvas,
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
    borderRadius: neoRadii.md,
    gap: 8,
  },
  shopCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  shopCardIcon: {
    fontSize: 22,
  },
  shopCardTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: neoColors.black,
  },
  shopCardDesc: {
    fontSize: 10,
    fontWeight: '600',
    color: neoColors.grayMuted,
    marginTop: 1,
  },
  shopRedeemBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: neoRadii.sm,
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
  },
  shopRedeemBtnActive: {
    backgroundColor: neoColors.yellow,
    ...neoShadows.default,
  },
  shopRedeemBtnDisabled: {
    backgroundColor: neoColors.grayLight,
    opacity: 0.6,
  },
  shopRedeemText: {
    fontSize: 11,
    fontWeight: '800',
    color: neoColors.grayMuted,
  },
  shopRedeemTextActive: {
    color: neoColors.black,
    fontWeight: '900',
  },
  coinTipBox: {
    padding: 8,
    backgroundColor: '#E0F2FE',
    borderColor: neoColors.black,
    borderWidth: 1.5,
    borderRadius: neoRadii.md,
    gap: 2,
  },
  coinTipTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: neoColors.black,
  },
  coinTipText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#0F172A',
    lineHeight: 15,
  },
  disciplineScoreCard: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#DCFCE7',
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
    borderRadius: neoRadii.md,
    gap: 4,
  },
  disciplineScoreValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#059669',
  },
  disciplineScoreSub: {
    fontSize: 11,
    fontWeight: '600',
    color: neoColors.black,
    textAlign: 'center',
    paddingHorizontal: 12,
    lineHeight: 16,
  },
});
