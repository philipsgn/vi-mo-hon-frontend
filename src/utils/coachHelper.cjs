/**
 * VI-MO-HON Coach Helper Logic (Phase 8: T-P8-01 & T-P8-02)
 * Tuân thủ AI_COACH_SPEC.md: Đối chiếu ngân sách thật, kiểm soát hạn mức 5 lượt/ngày, tuyên bố pháp lý
 */

const PHO_AVERAGE_PRICE = 35000;    // 35,000 đ / bát phở
const PART_TIME_HOURLY_WAGE = 25000; // 25,000 đ / giờ làm thêm sinh viên
const COACH_DAILY_FREE_LIMIT = 5;

const COACH_LEGAL_DISCLAIMER =
  'Nhận định trên dựa trên số liệu ngân sách bạn cung cấp, không phải là lời khuyên đầu tư tài chính chuyên nghiệp.';

/**
 * Quy đổi số tiền sang số bát phở và giờ làm thêm tương đương
 */
function calculateEquivalents(amount) {
  const numericAmount = Math.max(0, Number(amount) || 0);
  if (numericAmount <= 0) {
    return {
      phoCount: 0,
      workHours: 0,
      readableSummary: '0đ (Miễn phí)',
    };
  }

  const phoCount = Math.round((numericAmount / PHO_AVERAGE_PRICE) * 10) / 10;
  const workHours = Math.round((numericAmount / PART_TIME_HOURLY_WAGE) * 10) / 10;

  const phoText = phoCount >= 1 ? `${phoCount} bát phở` : 'gần 1 bát phở';
  const workText = workHours >= 1 ? `${workHours} giờ cày việc` : 'gần 1 giờ làm việc';

  return {
    phoCount,
    workHours,
    readableSummary: `${numericAmount.toLocaleString('vi-VN')}đ ≈ ${phoText} hoặc ${workText}`,
  };
}

/**
 * Kiểm tra hạn mức hỏi AI Coach trong ngày
 * @param {object} usageRecord - { date: 'YYYY-MM-DD', count: number }
 * @param {boolean} isPremium
 * @returns {{ remaining: number, canAsk: boolean, isUnlimited: boolean }}
 */
function checkDailyCoachUsage(usageRecord, isPremium = false) {
  if (isPremium) {
    return { remaining: Infinity, canAsk: true, isUnlimited: true };
  }

  const todayStr = new Date().toISOString().slice(0, 10);
  const currentCount = usageRecord && usageRecord.date === todayStr ? usageRecord.count || 0 : 0;
  const remaining = Math.max(0, COACH_DAILY_FREE_LIMIT - currentCount);

  return {
    remaining,
    canAsk: remaining > 0,
    isUnlimited: false,
    usedToday: currentCount,
  };
}

/**
 * Tạo prompt dữ liệu thực tế người dùng theo đặc tả AI_COACH_SPEC.md
 */
function buildCoachSystemContext({
  balance = 0,
  targetAmount = 0,
  targetDeadline = '',
  targetReason = '',
  dailyBudget = 0,
  spentToday = 0,
}) {
  return {
    balance: Number(balance) || 0,
    targetAmount: Number(targetAmount) || 0,
    targetDeadline: targetDeadline || 'cuối tháng',
    targetReason: targetReason || 'quỹ dự phòng',
    dailyBudget: Number(dailyBudget) || 0,
    spentToday: Number(spentToday) || 0,
  };
}

/**
 * Tạo phản hồi dự phòng offline sắc bén đối chiếu trực tiếp với số dư thật và ngân sách ngày
 */
function getOfflineCoachVerdict(item, amount, attitude = 'roast', context = {}) {
  const { readableSummary } = calculateEquivalents(amount);
  const itemName = item || 'món đồ này';
  const numAmount = Number(amount) || 0;

  if (attitude === 'gentle') {
    return `Bạn ơi, ${itemName} có giá ${readableSummary}. Thử hoãn mua 24 giờ xem mình có thực sự cần nó không nhé!`;
  }

  return `Ê tính quẹt thẻ mua "${itemName}" hả? ${readableSummary} đó má! Tiền không tự đẻ ra đâu, nhịn ngay đi con sen!`;
}

/**
 * Lấy Thẻ Mẹo trong ngày theo ngày hiện tại
 */
function getDailyTipByDate(dateStr, tipsList = []) {
  if (!tipsList || tipsList.length === 0) return null;
  const dateKey = dateStr || new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) % tipsList.length;
  }
  return tipsList[Math.abs(hash)];
}

module.exports = {
  PHO_AVERAGE_PRICE,
  PART_TIME_HOURLY_WAGE,
  COACH_DAILY_FREE_LIMIT,
  COACH_LEGAL_DISCLAIMER,
  calculateEquivalents,
  checkDailyCoachUsage,
  buildCoachSystemContext,
  getOfflineCoachVerdict,
  getDailyTipByDate,
};
