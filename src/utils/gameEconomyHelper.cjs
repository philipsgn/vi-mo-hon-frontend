/**
 * VI-MO-HON Game Economy & RPG Progression Helper
 * Pure JavaScript logic for Daily Check-in, Level/XP, Coins Shop, and Discipline Points
 */

const COIN_SHOP_ITEMS = [
  {
    id: 'RUNNER_TICKET',
    title: '1 Vé Chơi 3D Runner',
    desc: 'Thêm 1 lượt chạy Subway Surfers né cám dỗ',
    cost: 50,
    icon: '🏃',
    rewardType: 'ticket',
    rewardAmount: 1,
  },
  {
    id: 'FREEZE_STREAK',
    title: '1 Lượt Đóng Băng Streak',
    desc: 'Bảo vệ chuỗi ngày nếu lỡ quên điểm danh',
    cost: 100,
    icon: '🧊',
    rewardType: 'freeze',
    rewardAmount: 1,
  },
];

const LEVEL_UP_GUIDE = [
  { action: 'Ghi chép chi tiêu 1-chạm', reward: '+5 XP', icon: '💸' },
  { action: 'Điểm danh ngày mới', reward: '+15 XP', icon: '🔥' },
  { action: 'Hoàn thành bài học tài chính', reward: '+20 XP', icon: '📚' },
  { action: 'Hoàn thành thử thách né cám dỗ', reward: '+30 ~ 50 XP', icon: '🎯' },
];

const DISCIPLINE_GUIDE = [
  { action: 'Hoàn thành thử thách hàng ngày', reward: '+5 ~ 8 Điểm Kỷ Luật', icon: '🎯' },
  { action: 'Duy trì chuỗi Streak 7 ngày liên tiếp', reward: '+10 Điểm Kỷ Luật', icon: '🔥' },
  { action: 'Nhịn mua thành công khi hỏi Mỏ Hỗn', reward: '+5 Điểm Kỷ Luật', icon: '😼' },
];

function getTodayString(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

/**
 * Checks whether user has already checked in today
 */
function checkDailyCheckinStatus(lastCheckinDateStr, todayStr = getTodayString()) {
  if (!lastCheckinDateStr) return false;
  return lastCheckinDateStr === todayStr;
}

/**
 * Calculates Level & progress percentage from total XP
 * Formula: Level = floor(xp / 100) + 1
 */
function calculateLevelProgress(totalXp = 0) {
  const safeXp = Math.max(0, Math.floor(Number(totalXp) || 0));
  const level = Math.floor(safeXp / 100) + 1;
  const xpInCurrentLevel = safeXp % 100;
  const nextLevelXp = 100;
  const progressRatio = xpInCurrentLevel / nextLevelXp;
  const xpToNextLevel = nextLevelXp - xpInCurrentLevel;

  return {
    level,
    totalXp: safeXp,
    xpInCurrentLevel,
    nextLevelXp,
    progressRatio,
    xpToNextLevel,
  };
}

/**
 * Executes a daily check-in
 * Returns updated metrics payload
 */
function executeDailyCheckin(currentProfile, todayStr = getTodayString()) {
  const profile = currentProfile || {};
  const currentStreak = Number(profile.streak || 1);
  const currentCoins = Number(profile.coins || 0);
  const currentXp = Number(profile.xp || 0);

  const newStreak = currentStreak + 1;
  const bonusCoins = 10;
  const bonusXp = 15;

  const newCoins = currentCoins + bonusCoins;
  const newXp = currentXp + bonusXp;
  const { level: newLevel } = calculateLevelProgress(newXp);

  return {
    success: true,
    lastCheckinDate: todayStr,
    streak: newStreak,
    coins: newCoins,
    xp: newXp,
    level: newLevel,
    bonusCoins,
    bonusXp,
  };
}

/**
 * Redeems an item from the Coin Shop
 */
function redeemCoinShopItem(currentCoins, itemId) {
  const item = COIN_SHOP_ITEMS.find((i) => i.id === itemId);
  if (!item) {
    return { success: false, message: 'Vật phẩm không tồn tại.' };
  }

  const coins = Number(currentCoins || 0);
  if (coins < item.cost) {
    return {
      success: false,
      message: `Bạn không đủ xu! Cần ${item.cost} xu (Hiện có: ${coins} xu).`,
    };
  }

  return {
    success: true,
    remainingCoins: coins - item.cost,
    item,
    message: `Đổi thành công ${item.title}!`,
  };
}

module.exports = {
  COIN_SHOP_ITEMS,
  LEVEL_UP_GUIDE,
  DISCIPLINE_GUIDE,
  getTodayString,
  checkDailyCheckinStatus,
  calculateLevelProgress,
  executeDailyCheckin,
  redeemCoinShopItem,
};
