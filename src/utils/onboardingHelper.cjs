/**
 * Pure logic helper for Gen Z Neo-Brutalism Onboarding flow
 */

const GOAL_CARDS = [
  {
    id: 'save_money',
    icon: '✈️',
    title: 'Du Lịch & Tự Thưởng',
    subtitle: 'Tích lũy vivu bung xõa không lo cháy túi',
    color: 'yellow',
  },
  {
    id: 'reduce_food_drink',
    icon: '🧋',
    title: 'Bớt Trà Sữa & Ăn Vặt',
    subtitle: 'Bớt 1 ly tà tưa, thêm 1 viên gạch tự do',
    color: 'mint',
  },
  {
    id: 'reduce_impulse_shopping',
    icon: '🛍️',
    title: 'Cai Nghiện Săn Sale',
    subtitle: 'Chặn đứng cơn ngứa tay chốt đơn lúc 0h',
    color: 'coral',
  },
  {
    id: 'reduce_sale_spending',
    icon: '🏷️',
    title: 'Thoát Bẫy Giảm Giá',
    subtitle: 'Không gom đồ rẻ vô dụng chỉ vì voucher',
    color: 'purple',
  },
  {
    id: 'emergency_fund',
    icon: '🛡️',
    title: 'Quỹ Sống Còn Khẩn Cấp',
    subtitle: 'Có tiền phòng thân, ốm đau biến cố không sợ',
    color: 'lime',
  },
];

const TARGET_AMOUNT_PRESETS = [
  { label: '2 Triệu', value: 2000000 },
  { label: '5 Triệu', value: 5000000 },
  { label: '10 Triệu', value: 10000000 },
  { label: '20 Triệu', value: 20000000 },
];

const MONTHLY_BUDGET_PRESETS = [
  { label: '3Tr (Sinh viên)', value: 3000000 },
  { label: '5Tr (Tiết kiệm)', value: 5000000 },
  { label: '8Tr (Thoải mái)', value: 8000000 },
  { label: '12Tr (Đi làm)', value: 12000000 },
];

const TIMEFRAME_PRESETS = [
  { id: '1m', label: '1 Tháng ⚡', months: 1 },
  { id: '3m', label: '3 Tháng 🎯', months: 3 },
  { id: '6m', label: '6 Tháng 🔥', months: 6 },
  { id: '1y', label: '1 Năm 🚀', months: 12 },
];

const TEMPTATION_TAGS = [
  { code: 'flash_sale', label: '🏷️ Flash Sale 9.9/11.11' },
  { code: 'emotional_spending', label: '😭 Buồn / Stress là chốt đơn' },
  { code: 'friends', label: '🍻 Bạn bè rủ rê cafe/quán xá' },
  { code: 'social_media', label: '📱 Lướt Shopee/TikTok đêm' },
  { code: 'payday', label: '💸 Lương vừa ting ting' },
  { code: 'social_comparison', label: '👀 Thấy người ta mua là thèm' },
  { code: 'food_craving', label: '🧋 Nghiện trà sữa / Ăn vặt' },
  { code: 'fomo', label: '😱 Sợ bỏ lỡ deal hời (FOMO)' },
  { code: 'self_reward', label: '🎁 Tự thưởng vì đã chăm chỉ' },
  { code: 'other', label: '🎲 Cám dỗ khó lường khác' },
];

const MASCOT_AVATARS = [
  { id: 'cat', emoji: '🐱', name: 'Mèo Mỏ Hỗn', desc: 'Sắc sảo, canh ví 24/7' },
  { id: 'fox', emoji: '🦊', name: 'Cáo Thông Thái', desc: 'Nhanh nhạy né bẫy sale' },
  { id: 'bear', emoji: '🐻', name: 'Gấu Kiên Định', desc: 'Chắc chắn, giữ tiền giỏi' },
  { id: 'tiger', emoji: '🐯', name: 'Hổ Kỷ Luật', desc: 'Mạnh mẽ, diệt sạch thèm muốn' },
];

function padZero(num) {
  return String(num).padStart(2, '0');
}

/**
 * Calculates a future date by adding a given number of months.
 * Returns ISO date string 'YYYY-MM-DD'.
 */
function calculateFutureDate(months, baseDate = new Date()) {
  const date = new Date(baseDate.getTime());
  date.setMonth(date.getMonth() + months);
  return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`;
}

/**
 * Calculates days remaining from baseDate to targetDate string.
 */
function getDaysRemaining(targetDateStr, baseDate = new Date()) {
  if (!targetDateStr || !/^\d{4}-\d{2}-\d{2}$/.test(targetDateStr)) return 0;
  const [y, m, d] = targetDateStr.split('-').map(Number);
  const target = new Date(y, m - 1, d);
  const diffTime = target.getTime() - baseDate.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

/**
 * Estimates monthly savings needed to reach targetAmount by targetDate.
 */
function calculateMonthlySavingsEstimate(targetAmount, targetDateStr, baseDate = new Date()) {
  const amount = Number(targetAmount);
  if (!amount || amount <= 0) return 0;
  const days = getDaysRemaining(targetDateStr, baseDate);
  if (days <= 0) return amount;
  const months = Math.max(0.5, days / 30);
  return Math.round(amount / months);
}

/**
 * Validates the full single-page onboarding payload.
 */
function validateOnboardingForm(form, isOver16Confirmed = true) {
  if (!form.displayName || !form.displayName.trim()) {
    return 'Vui lòng đặt tên hoặc biệt danh chiến thần của bạn.';
  }
  if (form.displayName.trim().length > 80) {
    return 'Tên hiển thị tối đa 80 ký tự.';
  }
  if (!form.mainGoal) {
    return 'Vui lòng chọn 1 mục tiêu tài chính để chiến đấu.';
  }
  const targetAmountNum = Number(form.targetAmount);
  if (!targetAmountNum || targetAmountNum <= 0 || !Number.isInteger(targetAmountNum)) {
    return 'Số tiền mục tiêu phải là số nguyên lớn hơn 0.';
  }
  if (!form.targetDate || !/^\d{4}-\d{2}-\d{2}$/.test(form.targetDate)) {
    return 'Vui lòng chọn thời hạn hoàn thành hợp lệ.';
  }
  const monthlyBudgetNum = Number(form.monthlyBudget);
  if (!monthlyBudgetNum || monthlyBudgetNum <= 0 || !Number.isInteger(monthlyBudgetNum)) {
    return 'Hạn mức chi tiêu mỗi tháng phải là số nguyên lớn hơn 0.';
  }
  if (!Array.isArray(form.triggers) || form.triggers.length === 0) {
    return 'Hãy chọn ít nhất 1 cám dỗ dễ khiến bạn vung tay.';
  }
  if (!isOver16Confirmed) {
    return 'Bạn cần xác nhận từ đủ 16 tuổi trở lên để tham gia.';
  }
  return '';
}

/**
 * Calculate readiness percentage (0-100%) for visual game indicator
 */
function calculateReadinessScore(form, isOver16Confirmed) {
  let score = 0;
  if (form.displayName && form.displayName.trim()) score += 20;
  if (form.mainGoal) score += 25;
  if (Number(form.targetAmount) > 0 && form.targetDate) score += 25;
  if (Number(form.monthlyBudget) > 0) score += 15;
  if (Array.isArray(form.triggers) && form.triggers.length > 0) score += 10;
  if (isOver16Confirmed) score += 5;
  return Math.min(100, score);
}

module.exports = {
  GOAL_CARDS,
  TARGET_AMOUNT_PRESETS,
  MONTHLY_BUDGET_PRESETS,
  TIMEFRAME_PRESETS,
  TEMPTATION_TAGS,
  MASCOT_AVATARS,
  calculateFutureDate,
  getDaysRemaining,
  calculateMonthlySavingsEstimate,
  validateOnboardingForm,
  calculateReadinessScore,
};
