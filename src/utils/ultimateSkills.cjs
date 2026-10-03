/**
 * Danh mục Thẻ Kỹ Năng Độc Lạ & Logic Đối Kháng 3D Arena
 * Gamified Economic Boss Battle - Ví Mỏ Hỗn
 */

const ULTIMATE_SKILLS = {
  // CHAPTER 1 SKILLS (Ẩm thực & Cám dỗ ăn uống)
  water_splash: {
    id: 'water_splash',
    name: 'Cú Tát Nước Lọc 💧',
    chapterId: 'chapter-1',
    weaknessChapterId: 'chapter-1',
    damage: 35,
    defense: 0,
    stun: false,
    description: 'Hất văng ly trà sữa trân châu full topping, làm tan chảy cơn thèm ngọt tức thì!',
    chant: 'NƯỚC LỌC 0 ĐỒNG THẦN THÁNH, GIẢI CỨU VÍ TIỀN!',
    icon: '💧',
    color: '#38BDF8',
    specialEffect: 'x2_damage_ch1',
  },
  cold_tumbler: {
    id: 'cold_tumbler',
    name: 'Bình Giữ Nhiệt Tự Pha 🥤',
    chapterId: 'chapter-1',
    weaknessChapterId: null,
    damage: 15,
    defense: 30,
    stun: false,
    description: 'Tự pha cà phê/trà túi lọc mang đi, dựng khiên chắn 30 HP bảo vệ ví tiền!',
    chant: 'BÌNH NƯỚC CÁ NHÂN, CHẶN ĐỨNG THẤT THOÁT TIỀN LẺ!',
    icon: '🥤',
    color: '#10B981',
    specialEffect: 'shield_30',
  },
  freeze_delay: {
    id: 'freeze_delay',
    name: 'Đóng Băng 24 Giờ ❄️',
    chapterId: 'chapter-1',
    weaknessChapterId: null,
    damage: 20,
    defense: 10,
    stun: true,
    description: 'Đóng băng cơn thèm bốc đồng trong 24 giờ, khiến Boss bị choáng bỏ lượt!',
    chant: 'CHỜ 24 GIỜ! ĐÓNG BĂNG MỌI CÁM DỖ!',
    icon: '❄️',
    color: '#60A5FA',
    specialEffect: 'stun_boss',
  },

  // CHAPTER 2 SKILLS (Săn sale TMĐT & Bẫy bưu kiện)
  cart_purge: {
    id: 'cart_purge',
    name: 'Lá Chắn Xóa Giỏ Hàng 🗑️',
    chapterId: 'chapter-2',
    weaknessChapterId: 'chapter-2',
    damage: 45,
    defense: 10,
    stun: false,
    description: 'Quét sạch mọi đơn hàng mồi trong giỏ, dội đòn chí mạng phá giáp bão sale!',
    chant: 'XÓA GIỎ HÀNG NGAY! KHÔNG MUA THÌ LỜI 100%!',
    icon: '🗑️',
    color: '#F87171',
    specialEffect: 'x2_damage_ch2',
  },
  freeship_breaker: {
    id: 'freeship_breaker',
    name: 'Búa Phá Bẫy Freeship 🔨',
    chapterId: 'chapter-2',
    weaknessChapterId: null,
    damage: 40,
    defense: 0,
    stun: false,
    description: 'Đập tan bẫy mua thêm 70k để được freeship 15k! Giảm 30% giáp Boss.',
    chant: 'MUA THÊM 70K LÀ LỖ 55K, ĐẬP TAN BẪY SHIP!',
    icon: '🔨',
    color: '#FBBF24',
    specialEffect: 'weaken_boss',
  },
  order_cancel: {
    id: 'order_cancel',
    name: 'Tẩy Não Hủy Đơn ❌',
    chapterId: 'chapter-2',
    weaknessChapterId: null,
    damage: 25,
    defense: 25,
    stun: false,
    description: 'Hủy đơn hàng mồi trước khi người bán bấm chuẩn bị hàng! Phản đòn cám dỗ.',
    chant: 'QUYẾT ĐỊNH HỦY ĐƠN KỊP THỜI, GIẢI CỨU LƯƠNG THÁNG!',
    icon: '❌',
    color: '#A855F7',
    specialEffect: 'counter_damage',
  },

  // CHAPTER 3 SKILLS (Quản lý dòng tiền & Chống bẫy tín dụng)
  golden_slash: {
    id: 'golden_slash',
    name: 'Nhát Chém 50/30/20 ⚔️',
    chapterId: 'chapter-3',
    weaknessChapterId: 'chapter-3',
    damage: 60,
    defense: 0,
    stun: false,
    description: 'Phân chia dòng tiền chuẩn mực, đòn bạo kích dứt điểm Trùm Cuối FOMO!',
    chant: '50% THIẾT YẾU, 30% SỞ THÍCH, 20% TÍCH LŨY! TRẢM!',
    icon: '⚔️',
    color: '#FFE600',
    specialEffect: 'x2_damage_ch3',
  },
  credit_cut: {
    id: 'credit_cut',
    name: 'Kéo Cắt Phăng Thẻ Tín Dụng ✂️',
    chapterId: 'chapter-3',
    weaknessChapterId: null,
    damage: 35,
    defense: 15,
    stun: false,
    description: 'Cắt đứt chu kỳ nợ lãi kép! Giảm 50% sức tấn công của Boss trong 2 hiệp.',
    chant: 'CẮT PHĂNG THẺ TÍN DỤNG, NÓI KHÔNG VỚI LÃI MẸ ĐẺ LÃI CON!',
    icon: '✂️',
    color: '#EC4899',
    specialEffect: 'weaken_attack',
  },
  emergency_fund: {
    id: 'emergency_fund',
    name: 'Quỹ Khẩn Cấp Bất Tử 🛡️',
    chapterId: 'chapter-3',
    weaknessChapterId: null,
    damage: 20,
    defense: 50,
    stun: false,
    description: 'Giải phóng quỹ dự phòng 3 tháng sinh tồn, hồi phục 50 HP và tạo lá chắn thép!',
    chant: 'CÓ QUỸ KHẨN CẤP, TỰ TIN BẤT TỬ TRƯỚC MỌI BÃO GIÔNG!',
    icon: '🛡️',
    color: '#06B6D4',
    specialEffect: 'heal_50',
  },
};

/**
 * Lấy danh sách kỹ năng cho 1 Chapter
 */
function getSkillsByChapter(chapterId) {
  return Object.values(ULTIMATE_SKILLS).filter((s) => s.chapterId === chapterId);
}

/**
 * Lấy Tuyệt Chiêu đại diện tương ứng cho Chapter
 */
function getSkillByChapter(chapterId) {
  switch (chapterId) {
    case 'chapter-2':
      return ULTIMATE_SKILLS.cart_purge;
    case 'chapter-3':
      return ULTIMATE_SKILLS.golden_slash;
    case 'chapter-1':
    default:
      return ULTIMATE_SKILLS.water_splash;
  }
}

/**
 * Tính toán tác động 2 chiều từ chi tiêu thực tế đến Máu và Trạng thái của Boss
 */
function calculateRealLifeImpact(expenseAmount, budgetRemaining) {
  const expense = Number(expenseAmount) || 0;
  const remaining = Number(budgetRemaining) || 0;

  if (expense > remaining && remaining >= 0) {
    const healAmount = Math.min(25, Math.max(5, Math.floor(expense / 50000) * 5));
    return {
      bossHeal: healAmount,
      isEnraged: true,
      message: `Cảnh báo: Bạn vừa chi tiêu vượt định mức! Boss được tiếp thêm +${healAmount} HP và hóa Cuồng Nộ!`,
    };
  }

  return {
    bossHeal: 0,
    isEnraged: false,
    message: 'Chi tiêu có kế hoạch! Boss không thể hồi phục sinh lực.',
  };
}

/**
 * Tính toán 1 hiệp đấu trong Đấu Trường Boss 3D Arena
 * @param {string} skillId
 * @param {object} bossState { hp, maxHp, attack, isEnraged }
 * @param {object} mascotState { hp, maxHp, shield }
 * @param {string} chapterId
 */
function calculateBattleTurn(skillId, bossState, mascotState, chapterId) {
  const skill = ULTIMATE_SKILLS[skillId] || ULTIMATE_SKILLS.water_splash;
  const isEnraged = Boolean(bossState.isEnraged);

  // 1. Tính toán sát thương của người chơi lên Boss
  let damageDealt = skill.damage;
  let isCriticalCounter = false;

  // Kiểm tra hệ tương khắc bài học tài chính (x2 sát thương)
  if (skill.weaknessChapterId === chapterId) {
    damageDealt = Math.round(damageDealt * 2.0);
    isCriticalCounter = true;
  }

  // Nếu Boss Cuồng nộ do chi tiêu lố ngoài đời, sát thương người chơi giảm 30%
  if (isEnraged) {
    damageDealt = Math.round(damageDealt * 0.7);
  }

  const nextBossHp = Math.max(0, bossState.hp - damageDealt);
  const isBossDefeated = nextBossHp <= 0;

  // 2. Tính toán khiên hoặc hồi máu của người chơi
  let newShield = (mascotState.shield || 0) + (skill.defense || 0);
  let newMascotHp = mascotState.hp;
  if (skill.specialEffect === 'heal_50') {
    newMascotHp = Math.min(mascotState.maxHp, newMascotHp + 50);
  }

  // 3. Tính toán đòn phản kích của Boss (nếu Boss chưa chết và không bị Stun)
  let bossDamageDealt = 0;
  let stunTriggered = skill.stun;

  if (!isBossDefeated && !stunTriggered) {
    let baseBossAtk = bossState.attack || 20;
    if (isEnraged) baseBossAtk = Math.round(baseBossAtk * 1.3);

    // Giảm đòn nếu dính skill weaken
    if (skill.specialEffect === 'weaken_attack') {
      baseBossAtk = Math.round(baseBossAtk * 0.5);
    }

    // Trừ vào khiên trước
    if (newShield > 0) {
      if (newShield >= baseBossAtk) {
        newShield -= baseBossAtk;
        bossDamageDealt = 0;
      } else {
        const remainingDmg = baseBossAtk - newShield;
        newShield = 0;
        bossDamageDealt = remainingDmg;
        newMascotHp = Math.max(0, newMascotHp - remainingDmg);
      }
    } else {
      bossDamageDealt = baseBossAtk;
      newMascotHp = Math.max(0, newMascotHp - baseBossAtk);
    }
  }

  return {
    skillUsed: skill,
    damageDealt,
    isCriticalCounter,
    bossDamageDealt,
    stunTriggered,
    newBossHp: nextBossHp,
    newMascotHp,
    newShield,
    isBossDefeated,
    isMascotDefeated: newMascotHp <= 0,
  };
}

module.exports = {
  ULTIMATE_SKILLS,
  getSkillByChapter,
  getSkillsByChapter,
  calculateRealLifeImpact,
  calculateBattleTurn,
};
