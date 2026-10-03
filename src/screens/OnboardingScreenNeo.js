import React, { useState, useMemo } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiPost } from '../api/client';
import { neoColors, neoBorders, neoRadii, neoShadows } from '../design-system/tokens';
import { NeoButton, NeoCard, NeoBadge, NeoProgressBar } from '../design-system/components';
import { TargetDateField } from '../components/TargetDateField';
import { formatVnd, formatTargetDate } from '../utils/profile';
import {
  GOAL_CARDS,
  TARGET_AMOUNT_PRESETS,
  MONTHLY_BUDGET_PRESETS,
  TIMEFRAME_PRESETS,
  TEMPTATION_TAGS,
  calculateFutureDate,
  calculateMonthlySavingsEstimate,
  validateOnboardingForm,
  calculateReadinessScore,
} from '../utils/onboardingHelper.cjs';

export function OnboardingScreenNeo({ userId, initialProfile, onFinish }) {
  const [displayName, setDisplayName] = useState(initialProfile?.displayName || initialProfile?.name || 'Chiến thần tiết kiệm');
  const [mainGoal, setMainGoal] = useState(initialProfile?.mainGoal || 'emergency_fund');

  // Target amount presets & custom input
  const [targetAmount, setTargetAmount] = useState(
    initialProfile?.targetAmount ? String(initialProfile.targetAmount) : '10000000'
  );
  const [isCustomAmount, setIsCustomAmount] = useState(false);

  // Timeframe presets & custom date
  const [selectedTimeframe, setSelectedTimeframe] = useState('3m');
  const [targetDate, setTargetDate] = useState(() => {
    if (initialProfile?.targetDate) return initialProfile.targetDate;
    return calculateFutureDate(3);
  });

  // Monthly budget presets & custom input
  const [monthlyBudget, setMonthlyBudget] = useState(
    initialProfile?.monthlyBudget ? String(initialProfile.monthlyBudget) : '6000000'
  );
  const [isCustomBudget, setIsCustomBudget] = useState(false);

  // Temptation triggers
  const [triggers, setTriggers] = useState(
    Array.isArray(initialProfile?.triggers) && initialProfile.triggers.length > 0
      ? initialProfile.triggers
      : ['flash_sale', 'food_craving']
  );

  // Age confirmation check
  const [isOver16Confirmed, setIsOver16Confirmed] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Handle timeframe preset selection
  const handleSelectTimeframe = (preset) => {
    setSelectedTimeframe(preset.id);
    const newDate = calculateFutureDate(preset.months);
    setTargetDate(newDate);
    setError('');
  };

  // Handle amount preset selection
  const handleSelectAmountPreset = (val) => {
    setIsCustomAmount(false);
    setTargetAmount(String(val));
    setError('');
  };

  // Handle budget preset selection
  const handleSelectBudgetPreset = (val) => {
    setIsCustomBudget(false);
    setMonthlyBudget(String(val));
    setError('');
  };

  // Toggle trigger selection
  const handleToggleTrigger = (code) => {
    setError('');
    setTriggers((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const formPayload = useMemo(() => ({
    displayName,
    mainGoal,
    targetAmount,
    targetDate,
    monthlyBudget,
    triggers,
  }), [displayName, mainGoal, targetAmount, targetDate, monthlyBudget, triggers]);

  const readinessScore = useMemo(() => {
    return calculateReadinessScore(formPayload, isOver16Confirmed);
  }, [formPayload, isOver16Confirmed]);

  const monthlySavingsEstimate = useMemo(() => {
    return calculateMonthlySavingsEstimate(targetAmount, targetDate);
  }, [targetAmount, targetDate]);

  // Safe daily budget: Monthly budget / 30
  const dailySafeBudget = useMemo(() => {
    const mb = Number(monthlyBudget) || 0;
    return Math.round(mb / 30);
  }, [monthlyBudget]);

  const currentGoalCard = useMemo(() => {
    return GOAL_CARDS.find((g) => g.id === mainGoal) || GOAL_CARDS[0];
  }, [mainGoal]);

  const handleSubmit = async () => {
    const validationError = validateOnboardingForm(formPayload, isOver16Confirmed);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await apiPost('/profile', {
        userId,
        name: displayName.trim(),
        displayName: displayName.trim(),
        monthly_limit: Number(monthlyBudget),
        monthlyBudget: Number(monthlyBudget),
        monthly_income: Number(monthlyBudget) + monthlySavingsEstimate,
        financial_goal: currentGoalCard.title,
        mainGoal,
        targetAmount: Number(targetAmount),
        targetDate,
        triggers,
        confirmed_age: isOver16Confirmed,
        preferredTone: 'funny',
      });

      const nextProfile = response?.data?.profile ?? response?.profile ?? response?.data ?? response;
      onFinish(nextProfile);
    } catch (submitError) {
      setError(submitError.message || 'Không thể lưu kế hoạch. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* HERO HEADER */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <NeoBadge bg="yellow">
              <Text style={styles.badgeText}>⚡ KẾ HOẠCH QUẢN LÝ CHI TIÊU</Text>
            </NeoBadge>
            <View style={styles.scorePill}>
              <Text style={styles.scorePillText}>🎯 {readinessScore}% HOÀN THIỆN</Text>
            </View>
          </View>

          <Text style={styles.heroTitle}>Thiết Lập Kế Hoạch Tài Chính 📊</Text>
          <Text style={styles.heroSubtitle}>
            Xác lập mục tiêu tiết kiệm, tính toán hạn mức ngày an toàn để làm chủ dòng tiền cùng Ví Mỏ Hỗn.
          </Text>

          <View style={styles.progressContainer}>
            <NeoProgressBar
              progress={readinessScore / 100}
              fillColor={readinessScore === 100 ? 'lime' : 'yellow'}
              height={10}
            />
          </View>
        </View>

        {/* SECTION 1: USER DISPLAY NAME */}
        <NeoCard bg="white" style={styles.sectionCard}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="person-circle-outline" size={24} color="#4F46E5" />
            <View>
              <Text style={styles.sectionTitle}>1. Tên Người Dùng</Text>
              <Text style={styles.sectionSub}>Tên gọi hiển thị trong báo cáo tài chính</Text>
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={displayName}
              onChangeText={(text) => {
                setDisplayName(text);
                setError('');
              }}
              placeholder="Nhập tên của bạn (VD: Minh Anh)"
              placeholderTextColor={neoColors.grayMuted}
              maxLength={40}
            />
          </View>
        </NeoCard>

        {/* SECTION 2: CHOOSE FINANCIAL GOAL */}
        <NeoCard bg="white" style={styles.sectionCard}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="flag-outline" size={22} color="#4F46E5" />
            <View>
              <Text style={styles.sectionTitle}>2. Chọn Mục Tiêu Tài Chính</Text>
              <Text style={styles.sectionSub}>Đích đến ưu tiên hàng đầu của bạn hiện tại</Text>
            </View>
          </View>

          <View style={styles.goalsContainer}>
            {GOAL_CARDS.map((goal) => {
              const isSelected = mainGoal === goal.id;
              return (
                <TouchableOpacity
                  key={goal.id}
                  style={[
                    styles.goalCard,
                    isSelected && {
                      backgroundColor: neoColors[goal.color] || neoColors.yellow,
                      borderColor: neoColors.black,
                      ...neoShadows.card,
                    },
                  ]}
                  onPress={() => {
                    setMainGoal(goal.id);
                    setError('');
                  }}
                  activeOpacity={0.8}
                >
                  <View style={styles.goalCardIconBox}>
                    <Text style={styles.goalCardIcon}>{goal.icon}</Text>
                  </View>
                  <View style={styles.goalCardContent}>
                    <View style={styles.goalTitleRow}>
                      <Text style={[styles.goalTitle, isSelected && styles.goalTitleSelected]}>
                        {goal.title}
                      </Text>
                      {isSelected ? (
                        <View style={styles.checkPill}>
                          <Ionicons name="checkmark-sharp" size={14} color={neoColors.black} />
                        </View>
                      ) : null}
                    </View>
                    <Text style={[styles.goalSub, isSelected && styles.goalSubSelected]}>
                      {goal.subtitle}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </NeoCard>

        {/* SECTION 3: TARGET AMOUNT & MONTHLY BUDGET */}
        <NeoCard bg="white" style={styles.sectionCard}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="calculator-outline" size={22} color="#4F46E5" />
            <View>
              <Text style={styles.sectionTitle}>3. Hạn Mức & Dự Toán Dòng Tiền</Text>
              <Text style={styles.sectionSub}>Thiết lập số tiền muốn tích lũy và hạn mức tháng</Text>
            </View>
          </View>

          {/* Target Amount */}
          <Text style={styles.inputLabel}>
            Số tiền mục tiêu tích lũy:{' '}
            <Text style={styles.highlightText}>{formatVnd(targetAmount)}</Text>
          </Text>

          <View style={styles.chipRow}>
            {TARGET_AMOUNT_PRESETS.map((preset) => {
              const isSelected = !isCustomAmount && Number(targetAmount) === preset.value;
              return (
                <TouchableOpacity
                  key={preset.value}
                  style={[styles.chip, isSelected && styles.chipSelectedYellow]}
                  onPress={() => handleSelectAmountPreset(preset.value)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {preset.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              style={[styles.chip, isCustomAmount && styles.chipSelectedYellow]}
              onPress={() => setIsCustomAmount(true)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, isCustomAmount && styles.chipTextSelected]}>
                ✏️ Tự nhập
              </Text>
            </TouchableOpacity>
          </View>

          {isCustomAmount ? (
            <View style={styles.customInputBox}>
              <TextInput
                style={styles.textInput}
                value={targetAmount}
                onChangeText={(val) => {
                  setTargetAmount(val.replace(/\D/g, ''));
                  setError('');
                }}
                keyboardType="numeric"
                placeholder="Nhập số tiền mục tiêu (VD: 15000000)"
                placeholderTextColor={neoColors.grayMuted}
              />
            </View>
          ) : null}

          {/* Timeframe Presets */}
          <Text style={[styles.inputLabel, { marginTop: 16 }]}>
            Thời hạn hoàn thành dự kiến:{' '}
            <Text style={styles.highlightText}>{formatTargetDate(targetDate)}</Text>
          </Text>

          <View style={styles.chipRow}>
            {TIMEFRAME_PRESETS.map((tf) => {
              const isSelected = selectedTimeframe === tf.id;
              return (
                <TouchableOpacity
                  key={tf.id}
                  style={[styles.chip, isSelected && styles.chipSelectedMint]}
                  onPress={() => handleSelectTimeframe(tf)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {tf.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Target Date Picker */}
          <View style={styles.datePickerRow}>
            <TargetDateField
              disabled={isSubmitting}
              value={targetDate}
              onChange={(val) => {
                setSelectedTimeframe('custom');
                setTargetDate(val);
                setError('');
              }}
            />
          </View>

          {/* Monthly Budget */}
          <Text style={[styles.inputLabel, { marginTop: 16 }]}>
            Hạn mức chi tiêu mỗi tháng:{' '}
            <Text style={styles.highlightText}>{formatVnd(monthlyBudget)}</Text>
          </Text>

          <View style={styles.chipRow}>
            {MONTHLY_BUDGET_PRESETS.map((preset) => {
              const isSelected = !isCustomBudget && Number(monthlyBudget) === preset.value;
              return (
                <TouchableOpacity
                  key={preset.value}
                  style={[styles.chip, isSelected && styles.chipSelectedCoral]}
                  onPress={() => handleSelectBudgetPreset(preset.value)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {preset.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              style={[styles.chip, isCustomBudget && styles.chipSelectedCoral]}
              onPress={() => setIsCustomBudget(true)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, isCustomBudget && styles.chipTextSelected]}>
                ✏️ Tự nhập
              </Text>
            </TouchableOpacity>
          </View>

          {isCustomBudget ? (
            <View style={styles.customInputBox}>
              <TextInput
                style={styles.textInput}
                value={monthlyBudget}
                onChangeText={(val) => {
                  setMonthlyBudget(val.replace(/\D/g, ''));
                  setError('');
                }}
                keyboardType="numeric"
                placeholder="Nhập hạn mức tháng (VD: 6000000)"
                placeholderTextColor={neoColors.grayMuted}
              />
            </View>
          ) : null}

          {/* Dynamic Budget Allocation Summary */}
          <View style={styles.calcBox}>
            <View style={styles.calcHeaderRow}>
              <Ionicons name="pie-chart-outline" size={18} color="#0F172A" />
              <Text style={styles.calcTitle}>NGÂN SÁCH AN TOÀN TÍNH TOÁN TỰ ĐỘNG</Text>
            </View>
            <View style={styles.calcMetricRow}>
              <Text style={styles.calcMetricLabel}>• Ngân sách chi tiêu mỗi ngày:</Text>
              <Text style={styles.calcMetricValue}>{formatVnd(dailySafeBudget)} / ngày</Text>
            </View>
            <View style={styles.calcMetricRow}>
              <Text style={styles.calcMetricLabel}>• Tích lũy mỗi tháng để đạt mục tiêu:</Text>
              <Text style={styles.calcMetricValue}>~{formatVnd(monthlySavingsEstimate)} / tháng</Text>
            </View>
            <Text style={styles.calcFooterNote}>
              💡 Khi chi tiêu trong ngày vượt quá 70% ({formatVnd(Math.round(dailySafeBudget * 0.7))}), AI Coach sẽ cảnh báo để bảo vệ mục tiêu tháng!
            </Text>
          </View>
        </NeoCard>

        {/* SECTION 4: TEMPTATION TRIGGERS */}
        <NeoCard bg="white" style={styles.sectionCard}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="warning-outline" size={22} color="#F59E0B" />
            <View>
              <Text style={styles.sectionTitle}>4. Cám Dỗ Dễ Khiến Bạn Vung Tay</Text>
              <Text style={styles.sectionSub}>Chọn ít nhất 1 cám dỗ để AI Coach nhắc nhở phòng thủ</Text>
            </View>
          </View>

          <View style={styles.triggersWrapper}>
            {TEMPTATION_TAGS.map((tag) => {
              const isSelected = triggers.includes(tag.code);
              return (
                <TouchableOpacity
                  key={tag.code}
                  style={[
                    styles.triggerTag,
                    isSelected && styles.triggerTagSelected,
                  ]}
                  onPress={() => handleToggleTrigger(tag.code)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.triggerText, isSelected && styles.triggerTextSelected]}>
                    {tag.label}
                  </Text>
                  {isSelected ? (
                    <View style={styles.triggerBadge}>
                      <Ionicons name="checkmark" size={12} color={neoColors.black} />
                    </View>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
        </NeoCard>

        {/* AGE CONFIRMATION */}
        <TouchableOpacity
          testID="checkbox-age-16"
          style={styles.safetyBox}
          onPress={() => setIsOver16Confirmed(!isOver16Confirmed)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, isOver16Confirmed && styles.checkboxActive]}>
            {isOver16Confirmed ? (
              <Ionicons name="checkmark-sharp" size={16} color={neoColors.black} />
            ) : null}
          </View>
          <Text style={styles.safetyText}>
            Tôi xác nhận từ <Text style={styles.safetyBold}>đủ 16 tuổi trở lên</Text> và sẵn sàng tuân thủ kế hoạch tài chính (NĐ 13/2023).
          </Text>
        </TouchableOpacity>

        {/* ERROR DISPLAY */}
        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={18} color="#991B1B" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* ACTION CTA */}
        <View style={styles.ctaWrapper}>
          <NeoButton
            testID="btn-submit-onboarding"
            variant="yellow"
            size="lg"
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={styles.submitBtn}
          >
            {isSubmitting ? (
              <ActivityIndicator color={neoColors.black} />
            ) : (
              '🚀 KÍCH HOẠT KẾ HOẠCH & VÀO TRANG CHỦ ➔'
            )}
          </NeoButton>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: neoColors.bgCanvas,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 50,
    paddingBottom: 48,
    gap: 16,
  },
  header: {
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: neoColors.black,
  },
  scorePill: {
    backgroundColor: neoColors.white,
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
    borderRadius: neoRadii.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    ...neoShadows.default,
  },
  scorePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: neoColors.black,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: neoColors.black,
    lineHeight: 30,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: neoColors.grayMuted,
    lineHeight: 18,
    marginBottom: 10,
  },
  progressContainer: {
    marginTop: 2,
  },
  sectionCard: {
    padding: 16,
    gap: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 4,
    borderBottomWidth: 1.5,
    borderBottomColor: neoColors.grayLight,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: neoColors.black,
  },
  sectionSub: {
    fontSize: 11,
    fontWeight: '600',
    color: neoColors.grayMuted,
    marginTop: 2,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: neoColors.black,
    marginTop: 2,
  },
  highlightText: {
    color: '#D97706',
    fontWeight: '900',
  },
  inputWrapper: {
    marginTop: 2,
  },
  textInput: {
    backgroundColor: neoColors.bgCanvas,
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
    borderRadius: neoRadii.md,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    fontWeight: '700',
    color: neoColors.black,
  },
  goalsContainer: {
    gap: 8,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    backgroundColor: neoColors.bgCanvas,
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
    borderRadius: neoRadii.md,
  },
  goalCardIconBox: {
    width: 40,
    height: 40,
    borderRadius: neoRadii.md,
    backgroundColor: neoColors.white,
    borderColor: neoColors.black,
    borderWidth: neoBorders.thin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalCardIcon: {
    fontSize: 20,
  },
  goalCardContent: {
    flex: 1,
  },
  goalTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: neoColors.black,
  },
  goalTitleSelected: {
    fontWeight: '900',
  },
  checkPill: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: neoColors.white,
    borderColor: neoColors.black,
    borderWidth: neoBorders.thin,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalSub: {
    fontSize: 11,
    fontWeight: '600',
    color: neoColors.grayMuted,
    marginTop: 2,
  },
  goalSubSelected: {
    color: neoColors.black,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: neoColors.bgCanvas,
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
    borderRadius: neoRadii.md,
  },
  chipSelectedYellow: {
    backgroundColor: neoColors.yellow,
    ...neoShadows.default,
  },
  chipSelectedMint: {
    backgroundColor: neoColors.mint,
    ...neoShadows.default,
  },
  chipSelectedCoral: {
    backgroundColor: neoColors.coral,
    ...neoShadows.default,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: neoColors.black,
  },
  chipTextSelected: {
    fontWeight: '900',
  },
  customInputBox: {
    marginTop: 6,
  },
  datePickerRow: {
    marginTop: 8,
  },
  calcBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
    borderWidth: neoBorders.default,
    borderRadius: neoRadii.md,
    gap: 6,
    ...neoShadows.default,
  },
  calcHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  calcTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#4F46E5',
    letterSpacing: 0.5,
  },
  calcMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calcMetricLabel: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
  calcMetricValue: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },
  calcFooterNote: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
    lineHeight: 16,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 6,
  },
  triggersWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  triggerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: neoColors.bgCanvas,
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
    borderRadius: neoRadii.md,
  },
  triggerTagSelected: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
    ...neoShadows.default,
  },
  triggerText: {
    fontSize: 12,
    fontWeight: '700',
    color: neoColors.black,
  },
  triggerTextSelected: {
    fontWeight: '900',
    color: '#92400E',
  },
  triggerBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safetyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    backgroundColor: neoColors.white,
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
    borderRadius: neoRadii.md,
    ...neoShadows.default,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: neoRadii.sm,
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
    backgroundColor: neoColors.bgCanvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: neoColors.lime,
  },
  safetyText: {
    fontSize: 11,
    color: neoColors.black,
    fontWeight: '600',
    flex: 1,
    lineHeight: 16,
  },
  safetyBold: {
    fontWeight: '900',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
    borderWidth: 1.5,
    borderRadius: neoRadii.md,
  },
  errorText: {
    fontSize: 12,
    color: '#991B1B',
    fontWeight: '700',
    flex: 1,
  },
  ctaWrapper: {
    marginTop: 8,
  },
  submitBtn: {
    width: '100%',
  },
});
