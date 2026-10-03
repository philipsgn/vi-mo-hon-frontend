import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { retroTokens } from '../theme/retroTokens';
import { RetroProgressBar } from '../components/common/RetroProgressBar';
import { RetroEmptyState } from '../components/common/RetroEmptyState';
import {
  calculateLedgerBalance,
  calculateDailyBudgetScenarios,
  groupTransactionsByDate,
  filterTransactionsByTimeRange,
  calculateBalanceAdjustmentDiff,
} from '../utils/walletHelper.cjs';
import { apiPost, apiPatch } from '../api/client';

export function WalletScreen({
  dashboard,
  userId,
  onRefreshDashboard,
  onNavigateHome,
}) {
  const profile = dashboard?.data?.profile || dashboard?.profile || {};
  const recentExpenses = dashboard?.data?.recentExpenses || dashboard?.recentExpenses || [];

  // 1. Calculate Ledger Balance
  const initialWalletBalance = Number(profile?.monthly_limit || profile?.initial_balance || 2000000);
  const ledger = useMemo(() => {
    return calculateLedgerBalance(initialWalletBalance, recentExpenses);
  }, [initialWalletBalance, recentExpenses]);

  // 2. Goal 4-Field Model
  const targetGoalName = profile?.financial_goal || profile?.target_goal_name || 'Mua xe máy đi làm';
  const targetGoalAmount = Number(profile?.target_goal_amount || 5000000);
  const targetGoalDeadline = profile?.target_goal_deadline || '2026-12-31';
  const targetGoalWhy = profile?.target_goal_why || 'Để chủ động đi lại, không phụ thuộc ai!';
  const expectedMonthlyIncome = Number(profile?.monthly_income || 0);

  // 3. Scenario Daily Budget Calculation
  const budgetScenarios = useMemo(() => {
    return calculateDailyBudgetScenarios({
      currentBalance: ledger.currentBalance,
      targetAmountY: targetGoalAmount,
      targetDeadlineX: targetGoalDeadline,
      expectedIncome: expectedMonthlyIncome,
    });
  }, [ledger.currentBalance, targetGoalAmount, targetGoalDeadline, expectedMonthlyIncome]);

  // Filter State: ALL | TODAY | THIS_WEEK | THIS_MONTH
  const [timeFilter, setTimeFilter] = useState('ALL');

  const filteredExpenses = useMemo(() => {
    return filterTransactionsByTimeRange(recentExpenses, timeFilter);
  }, [recentExpenses, timeFilter]);

  const groupedDays = useMemo(() => {
    return groupTransactionsByDate(filteredExpenses);
  }, [filteredExpenses]);

  // Modal State: Sửa Số Dư / Khớp ví thật
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustAmountInput, setAdjustAmountInput] = useState('');
  const [adjustReasonInput, setAdjustReasonInput] = useState('');
  const [isSubmittingAdjust, setIsSubmittingAdjust] = useState(false);

  // Modal State: Sửa Mục Tiêu
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalNameInput, setGoalNameInput] = useState(targetGoalName);
  const [goalAmountInput, setGoalAmountInput] = useState(String(targetGoalAmount));
  const [goalDeadlineInput, setGoalDeadlineInput] = useState(targetGoalDeadline);
  const [goalWhyInput, setGoalWhyInput] = useState(targetGoalWhy);
  const [isSubmittingGoal, setIsSubmittingGoal] = useState(false);

  // Live calculation of balance adjustment difference
  const targetActualNum = Number(adjustAmountInput.replace(/[^0-9]/g, '')) || 0;
  const adjustmentPreview = useMemo(() => {
    if (!adjustAmountInput.trim()) return null;
    return calculateBalanceAdjustmentDiff(ledger.currentBalance, targetActualNum);
  }, [ledger.currentBalance, targetActualNum, adjustAmountInput]);

  const handleSaveBalanceAdjustment = async () => {
    const rawAmt = Number(adjustAmountInput.replace(/[^0-9]/g, ''));
    if (isNaN(rawAmt) || rawAmt < 0) return;

    const diffObj = calculateBalanceAdjustmentDiff(ledger.currentBalance, rawAmt);
    if (diffObj.diff === 0) {
      setShowAdjustModal(false);
      return;
    }

    setIsSubmittingAdjust(true);
    try {
      if (userId) {
        await apiPost('/expenses/quick-input', {
          userId,
          amount: diffObj.amount,
          category: 'OTHER',
          text: adjustReasonInput.trim() ? `${diffObj.note} - ${adjustReasonInput.trim()}` : diffObj.note,
        });
        await onRefreshDashboard?.();
      }
      setShowAdjustModal(false);
      setAdjustAmountInput('');
      setAdjustReasonInput('');
    } catch (err) {
      Alert.alert('Lỗi', err.message || 'Không thể điều chỉnh số dư.');
    } finally {
      setIsSubmittingAdjust(false);
    }
  };

  const handleSaveGoal = async () => {
    const rawAmt = Number(goalAmountInput.replace(/[^0-9]/g, '')) || targetGoalAmount;
    setIsSubmittingGoal(true);
    try {
      if (userId) {
        await apiPatch(`/profile/${userId}`, {
          financial_goal: goalNameInput.trim() || targetGoalName,
        });
        await onRefreshDashboard?.();
      }
      setShowGoalModal(false);
    } catch (err) {
      Alert.alert('Lỗi', err.message || 'Không thể cập nhật mục tiêu.');
    } finally {
      setIsSubmittingGoal(false);
    }
  };

  const goalProgress = targetGoalAmount > 0
    ? Math.min(1, Math.max(0, ledger.currentBalance / targetGoalAmount))
    : 0;

  const getCategoryIconDetails = (tx) => {
    const isIncome = tx.computedType === 'INCOME';
    const isAdjustment = tx.computedType === 'ADJUSTMENT' || (tx.text && tx.text.includes('Khớp ví')) || (tx.note && tx.note.includes('Khớp ví'));
    if (isAdjustment) return { icon: 'sync-outline', bg: '#FDE68A', color: '#B45309' };
    if (isIncome) return { icon: 'arrow-down-outline', bg: '#DCFCE7', color: '#15803D' };

    const cat = String(tx.category || '').toUpperCase();
    if (cat.includes('FOOD') || cat.includes('ĂN')) return { icon: 'restaurant', bg: '#FFEDD5', color: '#EA580C' };
    if (cat.includes('SHOPPING') || cat.includes('MUA')) return { icon: 'cart', bg: '#FCE7F3', color: '#DB2777' };
    if (cat.includes('TRANSPORT') || cat.includes('XE') || cat.includes('ĐI')) return { icon: 'car', bg: '#DBEAFE', color: '#2563EB' };
    if (cat.includes('BILLS') || cat.includes('HÓA ĐƠN')) return { icon: 'flash', bg: '#FEF9C3', color: '#CA8A04' };
    return { icon: 'arrow-up-outline', bg: '#FFE4E6', color: '#E11D48' };
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================================================= */}
        {/* 1. HERO SỔ VÍ GIẢ LẬP & SỐ DƯ HIỆN CÓ (Pastel Yellow Hero Card) */}
        {/* ========================================================================= */}
        <View style={styles.heroCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.titleBadgeDark}>
              <Ionicons name="wallet" size={14} color="#FFF" />
              <Text style={styles.titleBadgeDarkText}>SỔ VÍ GIẢ LẬP</Text>
            </View>
            <TouchableOpacity
              style={styles.actionPill}
              onPress={() => setShowAdjustModal(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="sync-outline" size={13} color="#0F172A" />
              <Text style={styles.actionPillText}>Sửa số dư (Khớp ví)</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.balanceLabel}>SỐ DƯ TIỀN MẶT / TÀI KHOẢN ƯỚC TÍNH</Text>
          <Text style={styles.balanceValue}>
            {Number(ledger.currentBalance || 0).toLocaleString('vi-VN')} đ
          </Text>

          {/* Quick Sub-Stats */}
          <View style={styles.subStatsRow}>
            <View style={styles.subStatBox}>
              <Text style={styles.subStatLabel}>Tổng thu (+)</Text>
              <Text style={[styles.subStatValue, { color: '#15803D' }]}>
                +{Number(ledger.totalIncome || 0).toLocaleString('vi-VN')} đ
              </Text>
            </View>

            <View style={styles.subStatDivider} />

            <View style={styles.subStatBox}>
              <Text style={styles.subStatLabel}>Tổng chi (-)</Text>
              <Text style={[styles.subStatValue, { color: '#E11D48' }]}>
                -{Number(ledger.totalExpense || 0).toLocaleString('vi-VN')} đ
              </Text>
            </View>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* 2. MỤC TIÊU TÍCH LŨY & KỊCH BẢN NGÂN SÁCH (Pastel White Card) */}
        {/* ========================================================================= */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.titleBadgeMint}>
              <Ionicons name="flag" size={14} color="#15803D" />
              <Text style={styles.titleBadgeMintText}>MỤC TIÊU TÀI CHÍNH</Text>
            </View>
            <TouchableOpacity
              style={styles.actionPill}
              onPress={() => setShowGoalModal(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="options-outline" size={13} color="#0F172A" />
              <Text style={styles.actionPillText}>Sửa mục tiêu</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.goalTitle}>{targetGoalName}</Text>
          <Text style={styles.goalWhy}>"{targetGoalWhy}"</Text>

          <View style={styles.goalProgressWrap}>
            <View style={styles.goalProgressLabels}>
              <Text style={styles.goalProgressLeft}>
                Đã có: {Number(ledger.currentBalance || 0).toLocaleString('vi-VN')} đ
              </Text>
              <Text style={styles.goalProgressRight}>
                Cần: {Number(targetGoalAmount || 0).toLocaleString('vi-VN')} đ
              </Text>
            </View>
            <RetroProgressBar current={ledger.currentBalance} max={targetGoalAmount} height={10} fillColor="#10B981" />
          </View>

          {/* Scenario Callout */}
          <View style={styles.scenarioBox}>
            <View style={styles.scenarioHeader}>
              <Ionicons name="bulb-outline" size={16} color="#B45309" />
              <Text style={styles.scenarioTitle}>{budgetScenarios.title}</Text>
            </View>
            <Text style={styles.scenarioDesc}>{budgetScenarios.description}</Text>
            <View style={styles.scenarioMetricRow}>
              <Text style={styles.scenarioMetricLabel}>Hạn mức ngày đề xuất:</Text>
              <Text style={styles.scenarioMetricValue}>
                {Number(budgetScenarios.dailyBudget || 0).toLocaleString('vi-VN')} đ/ngày
              </Text>
            </View>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* 3. GAMIFIED TIMELINE FEED (Nhật ký Thu / Chi) */}
        {/* ========================================================================= */}
        <View style={styles.timelineHeaderRow}>
          <View style={styles.titleBadgeIndigo}>
            <Ionicons name="journal" size={14} color="#4338CA" />
            <Text style={styles.titleBadgeIndigoText}>SAO KÊ & LỊCH SỬ THU / CHI GẦN ĐÂY</Text>
          </View>
        </View>

        {/* Time Filter Bar */}
        <View style={styles.filterBar}>
          {[
            { key: 'ALL', label: 'Tất cả' },
            { key: 'TODAY', label: 'Hôm nay' },
            { key: 'THIS_WEEK', label: 'Tuần này' },
            { key: 'THIS_MONTH', label: 'Tháng này' },
          ].map((tab) => {
            const isTabActive = timeFilter === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.filterTab, isTabActive && styles.filterTabActive]}
                onPress={() => setTimeFilter(tab.key)}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterTabText, isTabActive && styles.filterTabTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {groupedDays.length === 0 ? (
          <RetroEmptyState
            title="Chưa có giao dịch nào"
            subtitle="Chạm nút [+] bên dưới để ghi nhận khoản thu hoặc chi đầu tiên nhé!"
            iconName="receipt-outline"
          />
        ) : (
          <View style={styles.timelineContainer}>
            {groupedDays.map((group) => (
              <View key={group.dateKey} style={styles.dateGroupWrap}>
                {/* Date Header Capsule */}
                <View style={styles.dateGroupHeader}>
                  <View style={styles.datePill}>
                    <Text style={styles.dateGroupTitle}>{group.dayLabel}</Text>
                  </View>
                  <Text style={styles.dateGroupSummary}>
                    {group.totalIncome > 0 ? `+${group.totalIncome.toLocaleString('vi-VN')} đ ` : ''}
                    {group.totalExpense > 0 ? `-${group.totalExpense.toLocaleString('vi-VN')} đ` : ''}
                  </Text>
                </View>

                {/* Timeline Items with connecting line */}
                <View style={styles.timelineItemsWrapper}>
                  <View style={styles.timelineVerticalLine} />

                  {group.items.map((tx, idx) => {
                    const isIncome = tx.computedType === 'INCOME';
                    const isAdjustment = tx.computedType === 'ADJUSTMENT' || (tx.text && tx.text.includes('Khớp ví')) || (tx.note && tx.note.includes('Khớp ví'));
                    const amt = tx.displayAmount;
                    const catBadge = getCategoryIconDetails(tx);

                    return (
                      <View key={tx.id || `${group.dateKey}_${idx}`} style={styles.timelineRow}>
                        {/* Floating Round Category Badge */}
                        <View style={[styles.timelineNodeBadge, { backgroundColor: catBadge.bg, borderColor: '#0F172A' }]}>
                          <Ionicons name={catBadge.icon} size={15} color={catBadge.color} />
                        </View>

                        {/* Transaction Card */}
                        <View style={styles.timelineCard}>
                          <View style={styles.txDetails}>
                            <Text style={styles.txNote} numberOfLines={1}>
                              {tx.note || tx.raw_text || tx.text || tx.title || (isIncome ? 'Thu nhập' : 'Chi tiêu')}
                            </Text>
                            <View style={styles.txMetaRow}>
                              <Text style={styles.txTimeBadge}>🕒 {tx.timeStr}</Text>
                              {tx.category && tx.category !== 'OTHER' && (
                                <Text style={styles.txCatTag}>{tx.category}</Text>
                              )}
                            </View>
                          </View>

                          <Text
                            style={[
                              styles.txAmountText,
                              {
                                color: isIncome
                                  ? '#15803D'
                                  : isAdjustment
                                  ? '#B45309'
                                  : '#E11D48',
                              },
                            ]}
                          >
                            {isIncome ? '+' : '-'}{amt.toLocaleString('vi-VN')} đ
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* MODAL 1: SỬA SỐ DƯ CHO KHỚP VÍ THẬT */}
      <Modal
        visible={showAdjustModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAdjustModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeading}>KHỚP SỐ DƯ VÍ THẬT</Text>
            <Text style={styles.modalSub}>
              Ví Mỏ Hỗn không giữ tiền thật. Nhập số tiền thực tế bạn đang sở hữu để app tự tạo dòng điều chỉnh minh bạch.
            </Text>

            <View style={styles.currentBalanceCallout}>
              <Text style={styles.currentBalanceCalloutLabel}>Số dư trên sổ hiện tại:</Text>
              <Text style={styles.currentBalanceCalloutVal}>
                {Number(ledger.currentBalance || 0).toLocaleString('vi-VN')} đ
              </Text>
            </View>

            <Text style={styles.inputLabel}>SỐ DƯ THỰC TẾ NGOÀI ĐỜI (VNĐ)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="VD: 3.500.000"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={adjustAmountInput}
              onChangeText={setAdjustAmountInput}
              autoFocus
            />

            {adjustmentPreview ? (
              <View
                style={[
                  styles.adjustmentPreviewBox,
                  adjustmentPreview.isIncrease
                    ? styles.adjustmentPreviewIncome
                    : styles.adjustmentPreviewExpense,
                ]}
              >
                <Text style={styles.adjustmentPreviewTitle}>
                  {adjustmentPreview.isIncrease ? '📈 TĂNG SỐ DƯ' : '📉 GIẢM SỐ DƯ'}: {adjustmentPreview.diff >= 0 ? '+' : ''}{adjustmentPreview.diff.toLocaleString('vi-VN')} đ
                </Text>
                <Text style={styles.adjustmentPreviewSub}>
                  Sẽ tự động thêm 1 dòng giao dịch điều chỉnh khớp ví vào sao kê.
                </Text>
              </View>
            ) : null}

            <Text style={styles.inputLabel}>LÝ DO ĐIỀU CHỈNH (TÙY CHỌN)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="VD: Kiểm tra lại ví tiền mặt, Thưởng đột xuất..."
              placeholderTextColor="#94A3B8"
              value={adjustReasonInput}
              onChangeText={setAdjustReasonInput}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowAdjustModal(false)}
              >
                <Text style={styles.modalCancelBtnText}>HỦY</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleSaveBalanceAdjustment}
                disabled={!adjustAmountInput.trim() || isSubmittingAdjust}
              >
                <Text style={styles.modalConfirmBtnText}>
                  {isSubmittingAdjust ? 'ĐANG LƯU...' : 'XÁC NHẬN KHỚP'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: SỬA MỤC TIÊU 4 TRƯỜNG */}
      <Modal
        visible={showGoalModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGoalModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeading}>THIẾT LẬP MỤC TIÊU TÀI CHÍNH</Text>
            <Text style={styles.modalSub}>
              Quy tắc 4 trường: Đến ngày X, ví phải còn Y để làm Z (vì lý do gì).
            </Text>

            <Text style={styles.inputLabel}>1. MỤC ĐÍCH TÍCH LŨY (LÀM GÌ?)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="VD: Mua xe máy đi làm, Quỹ khẩn cấp..."
              placeholderTextColor="#94A3B8"
              value={goalNameInput}
              onChangeText={setGoalNameInput}
            />

            <Text style={styles.inputLabel}>2. SỐ TIỀN MỤC TIÊU CẦN GIỮ (VNĐ)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="5.000.000"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={goalAmountInput}
              onChangeText={setGoalAmountInput}
            />

            <Text style={styles.inputLabel}>3. THỜI HẠN (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="2026-12-31"
              placeholderTextColor="#94A3B8"
              value={goalDeadlineInput}
              onChangeText={setGoalDeadlineInput}
            />

            <Text style={styles.inputLabel}>4. ĐỘNG LỰC / LÝ DO (TẠI SAO?)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="VD: Để tự lập và không mượn nợ ai!"
              placeholderTextColor="#94A3B8"
              value={goalWhyInput}
              onChangeText={setGoalWhyInput}
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowGoalModal(false)}
              >
                <Text style={styles.modalCancelBtnText}>ĐÓNG</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveGoalBtn}
                onPress={handleSaveGoal}
                disabled={isSubmittingGoal}
              >
                <Text style={styles.modalSaveGoalBtnText}>
                  {isSubmittingGoal ? 'ĐANG LƯU...' : 'LƯU MỤC TIÊU'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 110,
    gap: 14,
  },
  heroCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 2,
    borderColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    gap: 10,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    gap: 10,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleBadgeDark: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  titleBadgeDarkText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  titleBadgeMint: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
    borderWidth: 1.5,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  titleBadgeMintText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#15803D',
    letterSpacing: 0.5,
  },
  titleBadgeIndigo: {
    backgroundColor: '#EEF2FF',
    borderColor: '#818CF8',
    borderWidth: 1.5,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  titleBadgeIndigoText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#4338CA',
    letterSpacing: 0.5,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#0F172A',
  },
  actionPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  balanceLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
  },
  subStatsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#0F172A',
    padding: 10,
    marginTop: 4,
  },
  subStatBox: {
    flex: 1,
  },
  subStatLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 2,
  },
  subStatValue: {
    fontSize: 13,
    fontWeight: '900',
  },
  subStatDivider: {
    width: 1.5,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 10,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  goalWhy: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#64748B',
    fontWeight: '600',
  },
  goalProgressWrap: {
    gap: 4,
  },
  goalProgressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalProgressLeft: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
  },
  goalProgressRight: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  scenarioBox: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#0F172A',
    borderRadius: 12,
    padding: 10,
    gap: 4,
  },
  scenarioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  scenarioTitle: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#92400E',
  },
  scenarioDesc: {
    fontSize: 11,
    color: '#78350F',
    lineHeight: 15,
    fontWeight: '600',
  },
  scenarioMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  scenarioMetricLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#78350F',
  },
  scenarioMetricValue: {
    fontSize: 13,
    fontWeight: '900',
    color: '#B45309',
  },
  timelineHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  filterBar: {
    flexDirection: 'row',
    gap: 6,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#0F172A',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabActive: {
    backgroundColor: '#FFE600',
    shadowColor: '#0F172A',
    shadowOffset: { width: 1.5, height: 1.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  filterTabTextActive: {
    color: '#0F172A',
    fontWeight: '900',
  },
  timelineContainer: {
    gap: 12,
  },
  dateGroupWrap: {
    gap: 8,
  },
  dateGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  datePill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  dateGroupTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0F172A',
  },
  dateGroupSummary: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  timelineItemsWrapper: {
    position: 'relative',
    gap: 10,
    paddingLeft: 4,
  },
  timelineVerticalLine: {
    position: 'absolute',
    left: 17,
    top: 10,
    bottom: 10,
    width: 2,
    backgroundColor: '#E2E8F0',
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  timelineNodeBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    shadowColor: '#0F172A',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  timelineCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#0F172A',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#0F172A',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  txDetails: {
    flex: 1,
  },
  txNote: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  txMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  txTimeBadge: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
  },
  txCatTag: {
    fontSize: 9.5,
    color: '#4338CA',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    fontWeight: '800',
  },
  txAmountText: {
    fontSize: 13.5,
    fontWeight: '900',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
    gap: 10,
  },
  modalHeading: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalSub: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    fontWeight: '600',
  },
  currentBalanceCallout: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 10,
  },
  currentBalanceCalloutLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  currentBalanceCalloutVal: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    marginTop: 2,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#0F172A',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  adjustmentPreviewBox: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  adjustmentPreviewIncome: {
    backgroundColor: '#DCFCE7',
    borderColor: '#15803D',
  },
  adjustmentPreviewExpense: {
    backgroundColor: '#FFE4E6',
    borderColor: '#E11D48',
  },
  adjustmentPreviewTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
  },
  adjustmentPreviewSub: {
    fontSize: 10.5,
    color: '#475569',
    marginTop: 2,
    fontWeight: '600',
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderWidth: 2,
    borderColor: '#0F172A',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalConfirmBtn: {
    flex: 1.5,
    backgroundColor: '#FFE600',
    borderWidth: 2,
    borderColor: '#0F172A',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  modalConfirmBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalSaveGoalBtn: {
    flex: 1.5,
    backgroundColor: '#FDA4AF',
    borderWidth: 2,
    borderColor: '#0F172A',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  modalSaveGoalBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
  },
});
