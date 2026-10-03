/**
 * Pure helper logic for Premium subscription and Freeze Streak functionality.
 * Compatible with CommonJS for Node.js unit tests and React Native bundling.
 */

const PREMIUM_PLAN_INFO = {
  priceText: '29.000đ / tháng',
  price: 29000,
  benefits: [
    '5 vé chơi runner mỗi ngày (thay vì 3)',
    '2 lượt Đóng Băng Streak bảo vệ chuỗi ngày mỗi tháng',
    'Huy hiệu Premium VIP nổi bật',
    'Không gián đoạn kỷ luật tài chính',
  ],
};

function getPremiumBadge(isPremium) {
  if (isPremium) {
    return {
      isPremium: true,
      label: 'PREMIUM VIP',
      color: '#FFE600',
      textColor: '#000000',
      borderStyle: 'solid',
    };
  }
  return {
    isPremium: false,
    label: 'GÓI TIÊU CHUẨN',
    color: '#F1F5F9',
    textColor: '#475569',
    borderStyle: 'dashed',
  };
}

function getDailyTicketLimit(isPremium) {
  return isPremium ? 5 : 3;
}

function formatFreezeStreakStatus(isPremium, freezeStreakLeft = 0) {
  const left = Math.max(0, Number(freezeStreakLeft) || 0);

  if (!isPremium) {
    return {
      canFreeze: false,
      text: 'Nâng cấp Premium để nhận 2 lượt đóng băng streak bảo vệ chuỗi ngày lỡ quên!',
      buttonLabel: 'Nâng cấp Premium',
      badge: 'Khóa tính năng',
      left: 0,
      max: 2,
    };
  }

  if (left > 0) {
    return {
      canFreeze: true,
      text: `Bạn còn ${left}/2 lượt đóng băng chuỗi ngày trong tháng này.`,
      buttonLabel: 'Kích hoạt Đóng Băng Streak',
      badge: `${left}/2 lượt`,
      left,
      max: 2,
    };
  }

  return {
    canFreeze: false,
    text: 'Bạn đã dùng hết 2/2 lượt đóng băng chuỗi streak của tháng này.',
    buttonLabel: 'Hết lượt tháng này',
    badge: '0/2 lượt',
    left: 0,
    max: 2,
  };
}

module.exports = {
  PREMIUM_PLAN_INFO,
  getPremiumBadge,
  getDailyTicketLimit,
  formatFreezeStreakStatus,
};
