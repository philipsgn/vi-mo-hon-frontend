import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { extractGameMetrics, generateMorningRebalanceMessage } from '../utils/homeHelper.cjs';
import { retroColors } from '../theme/retroTokens.js';
import { RetroProgressBar } from '../components/common/index.js';

/**
 * HomeScreenGame: Giao diện Trang Chủ Game Hóa Neo-Brutalist Arcade (Phase 10)
 * Đồng bộ tone màu Pastel Game với Hồ Sơ, viên nang chỉ số nổi, không lạm dụng box thô ráp.
 */
export function HomeScreenGame({
  dashboard,
  onNavigateToCoach,
  onOpenRunner,
  onNavigateToLessons,
  onNavigateToWallet,
  onCheckin,
}) {
  const metrics = useMemo(() => extractGameMetrics(dashboard), [dashboard]);

  const spentRatio = metrics.dailyBudget > 0 ? metrics.todaySpent / metrics.dailyBudget : 0;
  const isOverBudget = spentRatio > 1.0;

  // Lời khuyên nhẹ nhàng, khích lệ từ AI Coach
  const coachReminder = useMemo(() => {
    const todaySpentNum = Number(metrics.todaySpent || 0);
    const todayRemainingNum = Number(metrics.todayRemaining || 0);
    const dailyBudgetNum = Number(metrics.dailyBudget || 0);

    if (todaySpentNum === 0 && metrics.rebalanceInfo?.hasOverspent) {
      return generateMorningRebalanceMessage({
        yesterdaySpent: metrics.yesterdaySpent,
        baseDailyBudget: metrics.baseDailyBudget,
        daysLeft: metrics.daysLeft,
      });
    }

    if (spentRatio <= 0) {
      return 'Hôm nay bạn chưa phát sinh chi tiêu. Bạn đang giữ nhịp rất tốt, tiếp tục phát huy nhé!';
    }
    if (spentRatio < 0.7) {
      return `Bạn đã chi ${todaySpentNum.toLocaleString('vi-VN')} đ (còn ${todayRemainingNum.toLocaleString('vi-VN')} đ). Nhịp độ chi tiêu hôm nay rất êm ái!`;
    }
    if (spentRatio <= 1.0) {
      return `Bạn đã chi ${Math.round(spentRatio * 100)}% ngân sách hôm nay. Cân nhắc chậm lại một chút trước khi chi thêm nha.`;
    }
    return `Đã chi vượt ngân sách ${(todaySpentNum - dailyBudgetNum).toLocaleString('vi-VN')} đ. Đừng lo lắng, khoản dư sẽ được dàn đều sang các ngày tới để ví phục hồi!`;
  }, [spentRatio, metrics.todaySpent, metrics.todayRemaining, metrics.dailyBudget, metrics.rebalanceInfo, metrics.yesterdaySpent, metrics.baseDailyBudget, metrics.daysLeft]);

  // Icons map cho danh mục chi tiêu
  const getCategoryIcon = (category) => {
    const cat = String(category || '').toUpperCase();
    if (cat.includes('FOOD') || cat.includes('ĂN')) return { icon: 'restaurant', color: '#F97316' };
    if (cat.includes('SHOPPING') || cat.includes('MUA')) return { icon: 'cart', color: '#EC4899' };
    if (cat.includes('TRANSPORT') || cat.includes('XE') || cat.includes('ĐI')) return { icon: 'car', color: '#3B82F6' };
    if (cat.includes('BILLS') || cat.includes('HÓA ĐƠN')) return { icon: 'flash', color: '#EAB308' };
    return { icon: 'wallet', color: '#10B981' };
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ========================================================================= */}
        {/* TOP FLOATING STAT CAPSULES (Streak, Vé, Kỷ Luật, Cấp Độ) */}
        {/* ========================================================================= */}
        <View style={styles.capsulesRow}>
          <View style={[styles.statCapsule, { backgroundColor: '#FEF3C7' }]}>
            <Text style={styles.capsuleIcon}>🔥</Text>
            <View>
              <Text style={styles.capsuleLabel}>STREAK</Text>
              <Text style={styles.capsuleValue}>{metrics.streak || 1} ngày</Text>
            </View>
          </View>

          <View style={[styles.statCapsule, { backgroundColor: '#EEF2FF' }]}>
            <Text style={styles.capsuleIcon}>🎟️</Text>
            <View>
              <Text style={styles.capsuleLabel}>VÉ CHƠI</Text>
              <Text style={styles.capsuleValue}>{metrics.tickets || 3}/5</Text>
            </View>
          </View>

          <View style={[styles.statCapsule, { backgroundColor: '#DCFCE7' }]}>
            <Text style={styles.capsuleIcon}>⭐</Text>
            <View>
              <Text style={styles.capsuleLabel}>KỶ LUẬT</Text>
              <Text style={styles.capsuleValue}>{metrics.disciplineScore || 95}%</Text>
            </View>
          </View>

          <View style={[styles.statCapsule, { backgroundColor: '#FDE68A' }]}>
            <Text style={styles.capsuleIcon}>👑</Text>
            <View>
              <Text style={styles.capsuleLabel}>CẤP ĐỘ</Text>
              <Text style={styles.capsuleValue}>Lv.{metrics.level || 1}</Text>
            </View>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* KHỐI 1: TỔNG QUAN TÀI CHÍNH & NGÂN SÁCH NGÀY (Pastel Arcade Card) */}
        {/* ========================================================================= */}
        <View style={styles.heroCard}>
          <View style={styles.cardHeader}>
            <View style={styles.badgePillDark}>
              <Text style={styles.badgePillDarkText}>💰 TỔNG QUAN HÔM NAY</Text>
            </View>
            <TouchableOpacity onPress={onNavigateToWallet} style={styles.linkButton} activeOpacity={0.8}>
              <Text style={styles.linkButtonText}>Sổ ví ›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.balanceSection}>
            <Text style={styles.balanceLabel}>Số dư ví ước tính</Text>
            <Text style={styles.balanceValue}>
              {Number(metrics.balance || 0).toLocaleString('vi-VN')} đ
            </Text>
          </View>

          {/* Hạn mức ngày */}
          <View style={styles.dailyBudgetBox}>
            <View style={styles.dailyBudgetHeader}>
              <View style={styles.dailyBudgetTitleRow}>
                <Ionicons name="shield-checkmark" size={16} color="#059669" />
                <Text style={styles.dailyBudgetLabel}>Hạn mức hôm nay</Text>
              </View>
              <Text style={styles.dailyBudgetValue}>
                {Number(metrics.dailyBudget || 0).toLocaleString('vi-VN')} đ
              </Text>
            </View>

            <RetroProgressBar
              current={Math.min(Number(metrics.todaySpent || 0), Number(metrics.dailyBudget || 1))}
              max={Math.max(Number(metrics.dailyBudget || 1), 1)}
              height={10}
              fillColor={isOverBudget ? '#EF4444' : spentRatio > 0.7 ? '#F59E0B' : '#10B981'}
            />

            <View style={styles.budgetFooter}>
              <Text style={styles.budgetSpentText}>
                Đã tiêu: {Number(metrics.todaySpent || 0).toLocaleString('vi-VN')} đ
              </Text>
              <Text style={[styles.budgetStatusText, isOverBudget && styles.textDanger]}>
                {isOverBudget
                  ? 'Vượt nhẹ ngân sách'
                  : `Còn lại: ${Number(metrics.todayRemaining || 0).toLocaleString('vi-VN')} đ`}
              </Text>
            </View>
          </View>
        </View>

        {/* ========================================================================= */}
        {/* KHỐI 2: NHẮC NHỞ TÀI CHÍNH TỪ AI COACH (Pastel Indigo) */}
        {/* ========================================================================= */}
        <View style={styles.coachCard}>
          <View style={styles.coachHeader}>
            <View style={styles.badgePillIndigo}>
              <Ionicons name="chatbubbles" size={13} color="#4338CA" style={{ marginRight: 4 }} />
              <Text style={styles.badgePillIndigoText}>AI COACH PHẢN BIỆN</Text>
            </View>
            <TouchableOpacity onPress={onNavigateToCoach} style={styles.coachAskBtn} activeOpacity={0.8}>
              <Text style={styles.coachAskBtnText}>Hỏi ý kiến ›</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.coachText}>"{coachReminder}"</Text>
        </View>

        {/* ========================================================================= */}
        {/* KHỐI 3: KHOẢN CHI TIÊU HÔM NAY (Floating Round Badges) */}
        {/* ========================================================================= */}
        <View style={styles.standardCard}>
          <View style={styles.cardHeader}>
            <View style={styles.badgePillCoral}>
              <Text style={styles.badgePillCoralText}>🧾 CHI TIÊU HÔM NAY</Text>
            </View>
            <TouchableOpacity onPress={onNavigateToWallet} style={styles.linkButton} activeOpacity={0.8}>
              <Text style={styles.linkButtonText}>Tất cả ›</Text>
            </TouchableOpacity>
          </View>

          {metrics.recentExpenses && metrics.recentExpenses.length > 0 ? (
            metrics.recentExpenses.slice(0, 3).map((exp, idx) => {
              const catInfo = getCategoryIcon(exp.category);
              return (
                <View key={exp.id || idx} style={styles.expenseItem}>
                  <View style={[styles.expenseIconBadge, { backgroundColor: catInfo.color }]}>
                    <Ionicons name={catInfo.icon} size={15} color="#FFF" />
                  </View>
                  <View style={styles.expenseInfo}>
                    <Text style={styles.expenseTitle} numberOfLines={1}>
                      {exp.description || exp.text || 'Chi tiêu'}
                    </Text>
                    <Text style={styles.expenseTime}>{exp.time || exp.category || 'Ăn uống'}</Text>
                  </View>
                  <Text style={styles.expenseAmount}>
                    -{Number(exp.amount || 0).toLocaleString('vi-VN')} đ
                  </Text>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyIcon}>🌱</Text>
              <Text style={styles.emptyText}>
                Hôm nay bạn chưa có chi tiêu nào. Chạm [+] để ghi nhanh khi cần nhé!
              </Text>
            </View>
          )}
        </View>

        {/* ========================================================================= */}
        {/* KHỐI 4: BÀI HỌC TIẾP THEO & RUNNER 3D (Pastel Game Card) */}
        {/* ========================================================================= */}
        <View style={styles.standardCard}>
          <View style={styles.cardHeader}>
            <View style={styles.badgePillMint}>
              <Text style={styles.badgePillMintText}>📚 HỌC TẬP & KIỂM TRA</Text>
            </View>
            <Text style={styles.chapterTag}>Chương 1</Text>
          </View>

          <Text style={styles.lessonHeading}>Quy tắc 24 giờ trước cám dỗ Mega Sale</Text>
          <Text style={styles.lessonSnippet}>
            Khám phá cơ chế giải phóng Dopamine khi thấy voucher giảm giá và bí quyết trì hoãn 24h để giữ trọn vẹn ngân sách.
          </Text>

          <View style={styles.lessonActionRow}>
            <TouchableOpacity
              style={styles.readLessonBtn}
              activeOpacity={0.85}
              onPress={onNavigateToLessons}
            >
              <Ionicons name="book-outline" size={16} color="#0F172A" style={{ marginRight: 6 }} />
              <Text style={styles.readLessonBtnText}>ĐỌC BÀI HỌC</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.runnerBtn}
              activeOpacity={0.85}
              onPress={onOpenRunner}
            >
              <Ionicons name="game-controller" size={16} color="#0F172A" style={{ marginRight: 6 }} />
              <Text style={styles.runnerBtnText}>THI RUNNER 3D</Text>
            </TouchableOpacity>
          </View>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
    gap: 14,
  },
  // Floating Stat Capsules Row
  capsulesRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  statCapsule: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: 7,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0F172A',
    shadowColor: '#0F172A',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  capsuleIcon: {
    fontSize: 15,
  },
  capsuleLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.3,
  },
  capsuleValue: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#0F172A',
  },

  // Hero Card (Pastel Yellow / Cream)
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
    gap: 12,
  },
  standardCard: {
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
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgePillDark: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgePillDarkText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  badgePillIndigo: {
    backgroundColor: '#EEF2FF',
    borderColor: '#818CF8',
    borderWidth: 1.5,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgePillIndigoText: {
    color: '#4338CA',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  badgePillCoral: {
    backgroundColor: '#FFE4E6',
    borderColor: '#FDA4AF',
    borderWidth: 1.5,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
  },
  badgePillCoralText: {
    color: '#BE123C',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  badgePillMint: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
    borderWidth: 1.5,
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
  },
  badgePillMintText: {
    color: '#15803D',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  linkButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#0F172A',
    borderWidth: 1.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  linkButtonText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  balanceSection: {
    marginTop: 2,
  },
  balanceLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
  },
  balanceValue: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  dailyBudgetBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  dailyBudgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dailyBudgetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dailyBudgetLabel: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '800',
  },
  dailyBudgetValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  budgetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetSpentText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
  },
  budgetStatusText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '800',
  },
  textDanger: {
    color: '#E11D48',
  },

  // Coach Card (Pastel Indigo)
  coachCard: {
    backgroundColor: '#EEF2FF',
    borderWidth: 2,
    borderColor: '#0F172A',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    gap: 10,
  },
  coachHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coachAskBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#0F172A',
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  coachAskBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  coachText: {
    fontSize: 13,
    color: '#1E293B',
    lineHeight: 19,
    fontWeight: '600',
  },

  // Expenses
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  expenseIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  expenseTime: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
    fontWeight: '600',
  },
  expenseAmount: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#E11D48',
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  emptyIcon: {
    fontSize: 24,
  },
  emptyText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    textAlign: 'center',
    fontWeight: '600',
  },

  // Lessons
  chapterTag: {
    fontSize: 10,
    fontWeight: '900',
    color: '#4338CA',
    backgroundColor: '#EEF2FF',
    borderColor: '#818CF8',
    borderWidth: 1.5,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  lessonHeading: {
    fontSize: 14.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  lessonSnippet: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    fontWeight: '600',
  },
  lessonActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  readLessonBtn: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#0F172A',
    borderRadius: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  readLessonBtnText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  runnerBtn: {
    flex: 1,
    backgroundColor: '#FFE600',
    borderWidth: 2,
    borderColor: '#0F172A',
    borderRadius: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  runnerBtnText: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#0F172A',
  },
});
