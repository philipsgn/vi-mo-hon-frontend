import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { neoColors, neoBorders, neoRadii, neoShadows } from '../design-system/tokens';
import { NeoCard, NeoBadge } from '../design-system/components';

const { CATEGORY_LABELS } = require('../utils/expenseCategory.cjs');

const QUICK_EXPENSE_CATEGORIES = [
  'FOOD_DRINK',
  'SHOPPING',
  'TRANSPORT',
  'ENTERTAINMENT',
  'EDUCATION',
  'SAVING',
  'OTHER',
];

const PRESETS = [
  '45k trà sữa',
  '35k bún bò',
  '50k đổ xăng',
  '120k Shopee',
];

/**
 * QuickExpenseNeo - Thanh ghi chi tiêu thần tốc chuẩn Game HUD Neo-Brutalism
 */
export function QuickExpenseNeo({
  expenseText = '',
  isLoading = false,
  selectedExpenseCategory = 'OTHER',
  onChangeExpenseText,
  onSelectExpenseCategory,
  onSubmitExpense,
  onNavigateToCoach,
}) {
  const canSubmit = Boolean(expenseText.trim()) && !isLoading;

  return (
    <NeoCard bg="white" style={styles.card}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <NeoBadge bg="yellow">
            <Text style={styles.badgeText}>⚡ GHI NHANH</Text>
          </NeoBadge>
          <Text style={styles.headerTitle}>Lại tiêu gì rồi? Khai mau!</Text>
        </View>
        <Ionicons name="receipt-outline" size={20} color={neoColors.black} />
      </View>

      {/* 1-Line Smart Input Bar with Integrated Submit */}
      <View style={styles.smartInputRow}>
        <View style={styles.inputShell}>
          <Ionicons
            name="cash-outline"
            size={18}
            color={neoColors.black}
            style={styles.inputIcon}
          />
          <TextInput
            autoCapitalize="none"
            editable={!isLoading}
            onChangeText={onChangeExpenseText}
            placeholder="Ví dụ: 45k bún bò, 30k cafe..."
            placeholderTextColor={neoColors.grayMuted}
            style={styles.input}
            value={expenseText}
            onSubmitEditing={canSubmit ? onSubmitExpense : undefined}
            returnKeyType="done"
          />
          {expenseText.length > 0 ? (
            <TouchableOpacity
              onPress={() => onChangeExpenseText?.('')}
              style={styles.clearBtn}
            >
              <Ionicons name="close-circle" size={16} color={neoColors.grayMuted} />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          style={[
            styles.sendBtn,
            canSubmit ? styles.sendBtnActive : styles.sendBtnDisabled,
          ]}
          onPress={canSubmit ? onSubmitExpense : undefined}
          disabled={!canSubmit}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={neoColors.white} />
          ) : (
            <Text style={[styles.sendBtnText, canSubmit && styles.sendBtnTextActive]}>
              LƯU 💸
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Quick Suggestion Chips (Horizontal Scroll) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.presetScroll}
      >
        {PRESETS.map((preset) => (
          <TouchableOpacity
            key={preset}
            disabled={isLoading}
            onPress={() => onChangeExpenseText?.(preset)}
            style={styles.presetChip}
            activeOpacity={0.7}
          >
            <Text style={styles.presetText}>{preset}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Category Mini Pills (Horizontal Scroll) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {QUICK_EXPENSE_CATEGORIES.map((category) => {
          const isSelected = selectedExpenseCategory === category;
          return (
            <TouchableOpacity
              key={category}
              disabled={isLoading}
              onPress={() => onSelectExpenseCategory?.(category)}
              style={[
                styles.categoryChip,
                isSelected && styles.categoryChipSelected,
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  isSelected && styles.categoryChipTextSelected,
                ]}
              >
                {CATEGORY_LABELS[category] || category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Mini Anti-Regret Coach Banner */}
      {onNavigateToCoach ? (
        <TouchableOpacity
          style={styles.heroCoachBtn}
          onPress={onNavigateToCoach}
          activeOpacity={0.85}
        >
          <View style={styles.heroCoachLeft}>
            <Text style={styles.heroCoachEmoji}>😼</Text>
            <Text style={styles.heroCoachTitle}>Đang tính quẹt thẻ? Hỏi Mỏ Hỗn cản FOMO ngay!</Text>
          </View>
          <Ionicons name="arrow-forward-circle" size={20} color={neoColors.black} />
        </TouchableOpacity>
      ) : null}
    </NeoCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: neoColors.black,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: neoColors.black,
  },
  smartInputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  inputShell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: neoColors.bgCanvas,
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
    borderRadius: neoRadii.md,
    paddingHorizontal: 10,
    height: 44,
  },
  inputIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: neoColors.black,
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  sendBtn: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: neoRadii.md,
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: neoColors.grayLight,
    opacity: 0.6,
  },
  sendBtnActive: {
    backgroundColor: neoColors.coral,
    ...neoShadows.default,
  },
  sendBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: neoColors.grayMuted,
  },
  sendBtnTextActive: {
    color: neoColors.white,
    fontWeight: '900',
  },
  presetScroll: {
    gap: 6,
    paddingVertical: 2,
  },
  presetChip: {
    backgroundColor: neoColors.bgCanvas,
    borderColor: neoColors.black,
    borderWidth: neoBorders.thin,
    borderRadius: neoRadii.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  presetText: {
    fontSize: 11,
    fontWeight: '700',
    color: neoColors.black,
  },
  categoryScroll: {
    gap: 6,
    paddingVertical: 2,
  },
  categoryChip: {
    backgroundColor: neoColors.bgCanvas,
    borderColor: neoColors.black,
    borderWidth: neoBorders.thin,
    borderRadius: neoRadii.sm,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  categoryChipSelected: {
    backgroundColor: neoColors.yellow,
    borderWidth: neoBorders.default,
    ...neoShadows.default,
  },
  categoryChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: neoColors.grayMuted,
  },
  categoryChipTextSelected: {
    fontWeight: '900',
    color: neoColors.black,
  },
  heroCoachBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: neoColors.yellow,
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
    borderRadius: neoRadii.md,
    paddingHorizontal: 10,
    paddingVertical: 8,
    ...neoShadows.default,
  },
  heroCoachLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  heroCoachEmoji: {
    fontSize: 18,
  },
  heroCoachTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: neoColors.black,
    flex: 1,
  },
});
