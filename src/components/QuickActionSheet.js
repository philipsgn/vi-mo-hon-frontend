import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Switch,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { retroTokens } from '../theme/retroTokens';

const EXPENSE_CATEGORIES = [
  { key: 'FOOD', label: 'Ăn uống', icon: 'restaurant', color: '#F97316', bg: '#FFEDD5' },
  { key: 'SHOPPING', label: 'Mua sắm', icon: 'cart', color: '#EC4899', bg: '#FCE7F3' },
  { key: 'TRANSPORT', label: 'Đi lại', icon: 'car', color: '#3B82F6', bg: '#DBEAFE' },
  { key: 'BILLS', label: 'Hóa đơn', icon: 'flash', color: '#EAB308', bg: '#FEF9C3' },
  { key: 'OTHER', label: 'Khác', icon: 'ellipsis-horizontal', color: '#6B7280', bg: '#F3F4F6' },
];

export function QuickActionSheet({
  visible = false,
  onClose,
  onSubmitExpense,
  onSubmitIncome,
  onAskCoach,
  dailyBudgetRemaining = 100000,
}) {
  const [activeMode, setActiveMode] = useState('EXPENSE'); // 'EXPENSE' | 'INCOME' | 'COACH'

  // Expense form state
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseNote, setExpenseNote] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('FOOD');
  const [isExcluded, setIsExcluded] = useState(false);

  // Date & Time state for backdating (up to 7 days)
  const now = new Date();
  const [dayOffset, setDayOffset] = useState(0);
  const [hourInput, setHourInput] = useState(String(now.getHours()).padStart(2, '0'));
  const [minuteInput, setMinuteInput] = useState(String(now.getMinutes()).padStart(2, '0'));

  // Income form state
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeNote, setIncomeNote] = useState('');

  // Coach query state
  const [coachQuestion, setCoachQuestion] = useState('');
  const [coachPrice, setCoachPrice] = useState('');

  const getOccurredAtIso = () => {
    const d = new Date();
    d.setDate(d.getDate() - dayOffset);
    const h = Math.min(23, Math.max(0, parseInt(hourInput, 10) || 0));
    const m = Math.min(59, Math.max(0, parseInt(minuteInput, 10) || 0));
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  };

  const resetForms = () => {
    const cur = new Date();
    setExpenseAmount('');
    setExpenseNote('');
    setExpenseCategory('FOOD');
    setIsExcluded(false);
    setDayOffset(0);
    setHourInput(String(cur.getHours()).padStart(2, '0'));
    setMinuteInput(String(cur.getMinutes()).padStart(2, '0'));
    setIncomeAmount('');
    setIncomeNote('');
    setCoachQuestion('');
    setCoachPrice('');
  };

  const handleClose = () => {
    resetForms();
    onClose?.();
  };

  const handleSaveExpense = () => {
    const rawAmt = Number(expenseAmount.replace(/[^0-9]/g, ''));
    if (!rawAmt || rawAmt <= 0) return;

    onSubmitExpense?.({
      amount: rawAmt,
      note: expenseNote.trim() || 'Chi tiêu',
      category: expenseCategory,
      isExcluded,
      occurredAt: getOccurredAtIso(),
    });
    handleClose();
  };

  const handleSaveIncome = () => {
    const rawAmt = Number(incomeAmount.replace(/[^0-9]/g, ''));
    if (!rawAmt || rawAmt <= 0) return;

    onSubmitIncome?.({
      amount: rawAmt,
      note: incomeNote.trim() || 'Thu nhập',
      occurredAt: getOccurredAtIso(),
    });
    handleClose();
  };

  const handleConsultCoach = () => {
    const priceNum = Number(coachPrice.replace(/[^0-9]/g, '')) || 0;
    const q = coachQuestion.trim();
    if (!q) return;

    onAskCoach?.({
      question: q,
      estimatedPrice: priceNum,
      percentOfDaily: dailyBudgetRemaining > 0 ? Math.round((priceNum / dailyBudgetRemaining) * 100) : 100,
    });
    handleClose();
  };

  const priceNum = Number(coachPrice.replace(/[^0-9]/g, '')) || 0;
  const percentDaily = dailyBudgetRemaining > 0 ? Math.round((priceNum / dailyBudgetRemaining) * 100) : 0;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.avoidingWrap}
        >
          <Pressable style={styles.sheetContainer} onPress={(e) => e.stopPropagation()}>
            {/* Grab Handle */}
            <View style={styles.grabPill} />

            {/* Mode Switcher */}
            <View style={styles.modeTabs}>
              <TouchableOpacity
                style={[styles.modeTab, activeMode === 'EXPENSE' && styles.modeTabActiveExpense]}
                onPress={() => setActiveMode('EXPENSE')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="arrow-up-circle"
                  size={16}
                  color={activeMode === 'EXPENSE' ? '#FFF' : '#E11D48'}
                />
                <Text
                  style={[
                    styles.modeTabText,
                    activeMode === 'EXPENSE' && styles.modeTabTextActive,
                  ]}
                >
                  Ghi Chi
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modeTab, activeMode === 'INCOME' && styles.modeTabActiveIncome]}
                onPress={() => setActiveMode('INCOME')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="arrow-down-circle"
                  size={16}
                  color={activeMode === 'INCOME' ? '#FFF' : '#15803D'}
                />
                <Text
                  style={[
                    styles.modeTabText,
                    activeMode === 'INCOME' && styles.modeTabTextActive,
                  ]}
                >
                  Ghi Thu
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modeTab, activeMode === 'COACH' && styles.modeTabActiveCoach]}
                onPress={() => setActiveMode('COACH')}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="chatbubble-ellipses"
                  size={16}
                  color={activeMode === 'COACH' ? '#0F172A' : '#4338CA'}
                />
                <Text
                  style={[
                    styles.modeTabText,
                    activeMode === 'COACH' && styles.modeTabTextActiveCoach,
                  ]}
                >
                  Hỏi AI Coach
                </Text>
              </TouchableOpacity>
            </View>

            {/* MODE 1: GHI CHI TIÊU */}
            {activeMode === 'EXPENSE' && (
              <View style={styles.formBody}>
                <Text style={styles.inputLabel}>SỐ TIỀN CHI (VNĐ)</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0 đ"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={expenseAmount}
                  onChangeText={setExpenseAmount}
                  autoFocus
                />

                <Text style={styles.inputLabel}>NỘI DUNG CHI TIÊU</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="VD: Cơm trưa, Cà phê muối, Sách hay..."
                  placeholderTextColor="#94A3B8"
                  value={expenseNote}
                  onChangeText={setExpenseNote}
                />

                {/* Floating Round Category Badges */}
                <Text style={styles.inputLabel}>CHỌN DANH MỤC</Text>
                <View style={styles.categoriesRow}>
                  {EXPENSE_CATEGORIES.map((cat) => {
                    const isSelected = expenseCategory === cat.key;
                    return (
                      <TouchableOpacity
                        key={cat.key}
                        style={[
                          styles.catBadgeItem,
                          isSelected && styles.catBadgeItemSelected,
                        ]}
                        onPress={() => setExpenseCategory(cat.key)}
                        activeOpacity={0.8}
                      >
                        <View
                          style={[
                            styles.catBadgeCircle,
                            { backgroundColor: cat.bg },
                            isSelected && { backgroundColor: cat.color },
                          ]}
                        >
                          <Ionicons
                            name={cat.icon}
                            size={18}
                            color={isSelected ? '#FFF' : cat.color}
                          />
                        </View>
                        <Text
                          style={[
                            styles.catBadgeLabel,
                            isSelected && styles.catBadgeLabelSelected,
                          ]}
                        >
                          {cat.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Date Picker (Backdating up to 7 days) */}
                <Text style={styles.inputLabel}>THỜI ĐIỂM PHÁT SINH (GHI BÙ TỐI ĐA 7 NGÀY)</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll} contentContainerStyle={styles.dayScrollContent}>
                  {[
                    { offset: 0, label: 'Hôm nay' },
                    { offset: 1, label: 'Hôm qua' },
                    { offset: 2, label: '2 ngày trước' },
                    { offset: 3, label: '3 ngày trước' },
                    { offset: 4, label: '4 ngày trước' },
                    { offset: 5, label: '5 ngày trước' },
                    { offset: 6, label: '6 ngày trước' },
                    { offset: 7, label: '7 ngày trước' },
                  ].map((item) => {
                    const isSel = dayOffset === item.offset;
                    return (
                      <TouchableOpacity
                        key={item.offset}
                        style={[styles.dayPill, isSel && styles.dayPillSelected]}
                        onPress={() => setDayOffset(item.offset)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.dayPillText, isSel && styles.dayPillTextSelected]}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                <View style={styles.timeInputRow}>
                  <Ionicons name="time-outline" size={16} color="#475569" />
                  <Text style={styles.timeLabel}>Giờ phát sinh:</Text>
                  <TextInput
                    style={styles.timeBox}
                    value={hourInput}
                    onChangeText={(val) => setHourInput(val.replace(/[^0-9]/g, '').slice(0, 2))}
                    keyboardType="numeric"
                    maxLength={2}
                    placeholder="12"
                  />
                  <Text style={styles.timeColon}>:</Text>
                  <TextInput
                    style={styles.timeBox}
                    value={minuteInput}
                    onChangeText={(val) => setMinuteInput(val.replace(/[^0-9]/g, '').slice(0, 2))}
                    keyboardType="numeric"
                    maxLength={2}
                    placeholder="00"
                  />
                </View>

                {/* Exclude Toggle */}
                <View style={styles.toggleRow}>
                  <View style={styles.toggleLabelWrap}>
                    <Text style={styles.toggleTitle}>Khoản chi ngoại lệ</Text>
                    <Text style={styles.toggleSub}>
                      Không tính vào hạn mức ngày hôm nay (tiền nhà, học phí...).
                    </Text>
                  </View>
                  <Switch
                    value={isExcluded}
                    onValueChange={setIsExcluded}
                    trackColor={{ false: '#E2E8F0', true: '#FDA4AF' }}
                    thumbColor={isExcluded ? '#E11D48' : '#FFF'}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.submitBtn, styles.submitBtnExpense]}
                  onPress={handleSaveExpense}
                  disabled={!expenseAmount.trim()}
                  activeOpacity={0.85}
                >
                  <Text style={styles.submitBtnTextWhite}>XÁC NHẬN GHI CHI</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* MODE 2: GHI THU NHẬP */}
            {activeMode === 'INCOME' && (
              <View style={styles.formBody}>
                <Text style={styles.inputLabel}>SỐ TIỀN NHẬN ĐƯỢC (VNĐ)</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0 đ"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={incomeAmount}
                  onChangeText={setIncomeAmount}
                  autoFocus
                />

                <Text style={styles.inputLabel}>NGUỒN THU</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="VD: Lương, Thưởng, Bán đồ cũ..."
                  placeholderTextColor="#94A3B8"
                  value={incomeNote}
                  onChangeText={setIncomeNote}
                />

                <Text style={styles.inputLabel}>THỜI ĐIỂM NHẬN TIỀN</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll} contentContainerStyle={styles.dayScrollContent}>
                  {[
                    { offset: 0, label: 'Hôm nay' },
                    { offset: 1, label: 'Hôm qua' },
                    { offset: 2, label: '2 ngày trước' },
                    { offset: 3, label: '3 ngày trước' },
                    { offset: 4, label: '4 ngày trước' },
                    { offset: 5, label: '5 ngày trước' },
                    { offset: 6, label: '6 ngày trước' },
                    { offset: 7, label: '7 ngày trước' },
                  ].map((item) => {
                    const isSel = dayOffset === item.offset;
                    return (
                      <TouchableOpacity
                        key={item.offset}
                        style={[styles.dayPill, isSel && styles.dayPillSelectedMint]}
                        onPress={() => setDayOffset(item.offset)}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.dayPillText, isSel && styles.dayPillTextSelected]}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                <View style={styles.timeInputRow}>
                  <Ionicons name="time-outline" size={16} color="#475569" />
                  <Text style={styles.timeLabel}>Giờ:</Text>
                  <TextInput
                    style={styles.timeBox}
                    value={hourInput}
                    onChangeText={(val) => setHourInput(val.replace(/[^0-9]/g, '').slice(0, 2))}
                    keyboardType="numeric"
                    maxLength={2}
                    placeholder="12"
                  />
                  <Text style={styles.timeColon}>:</Text>
                  <TextInput
                    style={styles.timeBox}
                    value={minuteInput}
                    onChangeText={(val) => setMinuteInput(val.replace(/[^0-9]/g, '').slice(0, 2))}
                    keyboardType="numeric"
                    maxLength={2}
                    placeholder="00"
                  />
                </View>

                <View style={styles.hintCardMint}>
                  <Text style={styles.hintCardMintText}>
                    🌱 Khoản thu sẽ trực tiếp tăng số dư sổ ví và tăng ngân sách trung bình mỗi ngày cho bạn!
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.submitBtn, styles.submitBtnIncome]}
                  onPress={handleSaveIncome}
                  disabled={!incomeAmount.trim()}
                  activeOpacity={0.85}
                >
                  <Text style={styles.submitBtnTextWhite}>XÁC NHẬN GHI THU</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* MODE 3: HỎI MỎ HỖN */}
            {activeMode === 'COACH' && (
              <View style={styles.formBody}>
                <Text style={styles.inputLabel}>BẠN ĐANG ĐỊNH MUA MÓN GÌ?</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="VD: Đôi giày sneaker mới, Cốc trà sữa size L..."
                  placeholderTextColor="#94A3B8"
                  value={coachQuestion}
                  onChangeText={setCoachQuestion}
                  autoFocus
                />

                <Text style={styles.inputLabel}>GIÁ DỰ KIẾN (VNĐ)</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0 đ"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={coachPrice}
                  onChangeText={setCoachPrice}
                />

                {priceNum > 0 ? (
                  <View
                    style={[
                      styles.impactBox,
                      percentDaily > 50 && styles.impactBoxHigh,
                    ]}
                  >
                    <Text style={styles.impactTitle}>
                      Món đồ này chiếm {percentDaily}% hạn mức ngày hôm nay!
                    </Text>
                    <Text style={styles.impactSub}>
                      {percentDaily > 100
                        ? '🔥 Khoản này vượt quá ngân sách cả ngày, bạn hãy cân nhắc thật kỹ nhé!'
                        : percentDaily > 50
                        ? '⚠️ Chiếm hơn nửa ngân sách ăn uống, thử đợi 24 giờ xem sao nha.'
                        : '✅ Vẫn nằm trong ngưỡng an toàn tương đối.'}
                    </Text>
                  </View>
                ) : null}

                <TouchableOpacity
                  style={[styles.submitBtn, styles.submitBtnCoach]}
                  onPress={handleConsultCoach}
                  disabled={!coachQuestion.trim()}
                  activeOpacity={0.85}
                >
                  <Text style={styles.submitBtnTextDark}>XIN Ý KIẾN TỪ AI COACH</Text>
                </TouchableOpacity>
              </View>
            )}
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  avoidingWrap: {
    width: '100%',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#0F172A',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  grabPill: {
    width: 44,
    height: 5,
    backgroundColor: '#CBD5E1',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 14,
  },
  modeTabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  modeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  modeTabActiveExpense: {
    backgroundColor: '#E11D48',
    borderColor: '#0F172A',
  },
  modeTabActiveIncome: {
    backgroundColor: '#15803D',
    borderColor: '#0F172A',
  },
  modeTabActiveCoach: {
    backgroundColor: '#FFE600',
    borderColor: '#0F172A',
  },
  modeTabText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  modeTabTextActive: {
    color: '#FFFFFF',
  },
  modeTabTextActiveCoach: {
    color: '#0F172A',
  },
  formBody: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  amountInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#0F172A',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#0F172A',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 12,
  },
  // Floating Round Category Badges
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  catBadgeItem: {
    alignItems: 'center',
    gap: 4,
  },
  catBadgeItemSelected: {},
  catBadgeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 1.5, height: 1.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  catBadgeLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
  },
  catBadgeLabelSelected: {
    color: '#0F172A',
    fontWeight: '900',
  },
  dayScroll: {
    marginBottom: 10,
  },
  dayScrollContent: {
    gap: 6,
    paddingVertical: 2,
  },
  dayPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },
  dayPillSelected: {
    backgroundColor: '#E11D48',
    borderColor: '#0F172A',
  },
  dayPillSelectedMint: {
    backgroundColor: '#15803D',
    borderColor: '#0F172A',
  },
  dayPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  dayPillTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    marginBottom: 12,
  },
  timeLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  timeBox: {
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#0F172A',
    borderRadius: 6,
    width: 36,
    height: 30,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  timeColon: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    marginBottom: 14,
  },
  toggleLabelWrap: {
    flex: 1,
    paddingRight: 10,
  },
  toggleTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  toggleSub: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 14,
  },
  hintCardMint: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1.5,
    borderColor: '#15803D',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  hintCardMintText: {
    fontSize: 11.5,
    color: '#15803D',
    fontWeight: '700',
    lineHeight: 16,
  },
  impactBox: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#0F172A',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  impactBoxHigh: {
    backgroundColor: '#FFE4E6',
    borderColor: '#E11D48',
  },
  impactTitle: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 3,
  },
  impactSub: {
    fontSize: 11,
    color: '#475569',
    lineHeight: 15,
  },
  submitBtn: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0F172A',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  submitBtnExpense: {
    backgroundColor: '#E11D48',
  },
  submitBtnIncome: {
    backgroundColor: '#15803D',
  },
  submitBtnCoach: {
    backgroundColor: '#FFE600',
  },
  submitBtnTextWhite: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  submitBtnTextDark: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
});
