/**
 * Cấu hình tập trung cho Hệ thống Chapter Giáo dục Tài chính & Đấu Boss
 * Saga Progression Spec & Dual 3D Games Ecosystem - Ví Mỏ Hỗn
 */

const { getSkillByChapter, getSkillsByChapter } = require('./ultimateSkills.cjs');

const CHAPTERS_DATA = [
  {
    id: 'chapter-1',
    number: 1,
    title: 'Chương 1: Cơn Nghiện Trà Sữa & Ăn Vặt',
    shortTitle: 'Chương 1: Trà Sữa',
    subtitle: 'Khống chế chi tiêu bốc đồng hàng ngày',
    bossId: 'impulse-boss',
    bossName: 'Quái Vật Trà Sữa',
    bossIcon: '🧋',
    bossCategory: 'food_drink',
    maxHp: 100,
    bossAttack: 18,
    bossSkillName: 'Bão Topping Trân Châu Phun Trào 🧋',
    environmentTheme: 'boba_street',
    roast: 'Uống 1 ly trà sữa 55k thì ví tiền của bạn đang bốc hơi từng ngày đó!',
    unlockRequirements: {
      minDiscipline: 0,
      minKnowledge: 0,
      requirePrevBoss: null,
    },
    coinCost: 30, // Chi phí Xu để mở khóa bài học
    lesson: {
      id: 'lesson-ch1',
      title: 'Quy Tắc 24 Giờ & Phân Biệt Cần vs Muốn',
      storyTitle: 'Tình Huống 3 Giờ Chiều: Chiếc Ly Trà Sữa & Chi Phí Cơ Hội',
      story: '3h chiều thứ Tư, deadline dí dồn dập, đồng nghiệp mở app rủ: "Làm ly trà sữa ô long nướng 65k full topping cho tỉnh táo không?". Dù tài khoản ví còn vỏn vẹn 500k, dopamine căng thẳng thúc giục bạn gật đầu ngay tắp lự để giải tỏa stress.',
      analysis: '1 ly trà sữa 55k trông vô hại, nhưng 24 ngày làm việc = 1.320.000đ/tháng! Sau 1 năm, con số này lên tới gần 16 triệu đồng — đủ mua 1 chiếc laptop mới hoặc tạo lập Quỹ khẩn cấp 3 tháng!',
      takeaway: 'Bí kíp 24 Giờ: Uống ngay 1 ly nước lọc mát lạnh và ghi tên món đồ vào "Danh Sách Chờ 24h". 80% cơn thèm nhất thời sẽ tự biến mất sau 15 phút!',
      summary: 'Chờ 24h trước khi mua món đồ không thiết yếu. 80% cơn thèm trà sữa sẽ biến mất sau 1 tiếng!',
      cards: [
        'Cơn thèm ăn vặt thường do dopamine nhất thời điều khiển khi não bộ cảm thấy căng thẳng.',
        'Quy tắc 24 Giờ: Hãy ghi món đồ vào danh sách chờ và tự hỏi: "Nếu không uống, ngày mai mình có ổn không?"'
      ],
      flashcards: [
        {
          id: 'fc-1-1',
          front: 'CƠN THÈM TRÀ SỮA & ĂN VẶT',
          back: 'Não bộ đánh lừa bạn cần dopamine ngay lập tức. 80% cơn thèm sẽ tan biến nếu bạn uống 1 ly nước lọc mát lạnh và chờ 15 phút!',
          icon: '🧋',
          actionTip: 'Uống ngay 1 cốc nước lọc khi cảm thấy muốn order trà sữa.'
        },
        {
          id: 'fc-1-2',
          front: 'QUY TẮC VÀNG 24 GIỜ',
          back: 'Đừng bấm đặt hàng ngay! Hãy đưa món đồ vào "Danh Sách Chờ 24h". Ngày hôm sau nếu vẫn cảm thấy cần thiết thì mới mua.',
          icon: '⏳',
          actionTip: 'Tạo một ghi chú trong điện thoại tên "Chờ 24h" để lưu link thay vì thanh toán.'
        },
        {
          id: 'fc-1-3',
          front: 'BẪY TIỀN LẺ 55.000Đ',
          back: '55k mỗi ngày nghe có vẻ nhỏ, nhưng 1 tháng là 1.650.000đ - đủ để đóng tiền phòng gym 4 tháng hoặc gửi tiết kiệm tích lũy!',
          icon: '💸',
          actionTip: 'Mỗi lần nhịn được 1 ly trà sữa, hãy chuyển ngay 55k vào ví tiết kiệm!'
        }
      ],
      quiz: {
        question: 'Khi thèm trà sữa 60k lúc 3h chiều, cách xử lý kỷ luật nhất là gì?',
        options: [
          'Uống ngay cho đỡ stress',
          'Chờ 24h hoặc uống nước lọc giải khát',
          'Mua 2 ly để được freeship'
        ],
        correctIndex: 1
      },
      knowledgeReward: 15,
      countermeasureShield: true
    },
    stageConfig: {
      targetDistance: 300,
      targetCoins: 30,
      baseSpeed: 11.0,
      requireQuizPass: false,
    },
    ultimateSkill: getSkillByChapter('chapter-1'),
    availableSkills: getSkillsByChapter('chapter-1'),
    runnerQuizzes: [
      {
        question: 'Đồng nghiệp rủ order trà sữa 65k lúc 3h chiều để giảm stress?',
        laneLeft: 'LÀN TRÁI: Uống nước lọc giải khát (Đúng)',
        laneRight: 'LÀN PHẢI: Bấm order ngay cho vui',
        correctLane: 0,
        rewardSkillId: 'water_splash'
      },
      {
        question: 'Ví còn 500k nhưng app giao hàng tặng voucher đồ ăn 30k?',
        laneLeft: 'LÀN TRÁI: Dùng ngay kẻo tiếc voucher',
        laneRight: 'LÀN PHẢI: Nấu cơm nhà, tiết kiệm 150k (Đúng)',
        correctLane: 1,
        rewardSkillId: 'cold_tumbler'
      },
      {
        question: 'Quy tắc hoãn mua sắm bốc đồng chuẩn nhất là gì?',
        laneLeft: 'LÀN TRÁI: Áp dụng Quy tắc Chờ 24h (Đúng)',
        laneRight: 'LÀN PHẢI: Thèm là phải quẹt thẻ liền',
        correctLane: 0,
        rewardSkillId: 'freeze_delay'
      }
    ],
    challenges: [
      { id: 'ch1-c1', title: 'Không uống trà sữa hôm nay', damage: 25, discipline: 5, rewardXp: 30 },
      { id: 'ch1-c2', title: 'Uống đủ 2L nước lọc thay nước ngọt', damage: 25, discipline: 5, rewardXp: 30 },
      { id: 'ch1-c3', title: 'Nấu ăn tại nhà hoặc ăn cơm bình dân', damage: 30, discipline: 5, rewardXp: 30 }
    ],
    runnerConfig: {
      primaryObstacle: 'cup',
      quizGate: {
        question: 'Cần hay Muốn: Trà sữa trân châu full topping?',
        laneLeft: 'CẦN (Thiết yếu)',
        laneRight: 'MUỐN (Cám dỗ)',
        correctLane: 1
      }
    }
  },
  {
    id: 'chapter-2',
    number: 2,
    title: 'Chương 2: Bẫy Freeship & Bão Sale Ảo',
    shortTitle: 'Chương 2: Bão Sale',
    subtitle: 'Vạch trần chiêu trò khuyến mãi trên sàn TMĐT',
    bossId: 'sale-goblin',
    bossName: 'Chiến Thần Chốt Đơn Shopee',
    bossIcon: '📦',
    bossCategory: 'shopping',
    maxHp: 150,
    bossAttack: 26,
    bossSkillName: 'Bão Bưu Kiện Chốt Đơn Đè Bẹp Ví 📦',
    environmentTheme: 'sale_avenue',
    roast: 'Mua đồ 200k để được freeship 15k... Bạn có thấy mình lỗ 185k không?',
    unlockRequirements: {
      minDiscipline: 15,
      minKnowledge: 15,
      requirePrevBoss: 'impulse-boss',
    },
    coinCost: 50,
    lesson: {
      id: 'lesson-ch2',
      title: 'Bóc Trần Chiêu Trò Giảm Giá Ảo & Phí Ship 0đ',
      storyTitle: 'Cú Lừa Giảm Giá Ảo 50% & Bẫy Freeship 0 Đồng',
      story: '11h đêm lướt app TMĐT, thấy chiếc áo hoodie gắn mác "Sale Sốc 50%" giảm từ 600k còn 300k. Lúc vào giỏ hàng thấy đơn thiếu 40k để được miễn phí ship 25k, bạn vội vàng nhặt thêm chiếc ốp lưng 60k cho đủ điều kiện.',
      analysis: 'Chi thêm 60k mua món đồ không có nhu cầu chỉ để "tiết kiệm" 25k ship ➔ Thực chất bạn đang LỖ thêm 35k tiền mặt! Không mua món đồ sale 50% mới là cách tiết kiệm trọn vẹn 300k!',
      takeaway: 'Bí kíp dọn sạch giỏ hàng: Giữ giỏ hàng rỗng sau 22h, chỉ mua đúng danh sách cần thiết đã lập từ trước và tuyệt đối không chi thêm tiền để lấy mã ship.',
      summary: 'Các sàn TMĐT thường đôn giá gốc rồi gắn mác giảm 50% để tạo hiệu ứng tâm lý khan hiếm (FOMO).',
      cards: [
        'Freeship không bao giờ miễn phí: Nó được thiết kế để kích thích bạn mua thêm món đồ không có kế hoạch.',
        'Mẹo khắc chế: Chỉ mua đúng món có trong danh sách từ trước khi mở app TMĐT.'
      ],
      flashcards: [
        {
          id: 'fc-2-1',
          front: 'BẪY FREESHIP 0 ĐỒNG',
          back: 'Đơn hàng 180k cần mua thêm 70k để được giảm 20k tiền ship? Thực tế bạn đang chi thêm 50k cho một món đồ hoàn toàn không cần thiết!',
          icon: '📦',
          actionTip: 'Thà trả 20k phí ship hoặc hủy đơn còn hơn chi thêm 70k vô ích.'
        },
        {
          id: 'fc-2-2',
          front: 'CHIÊU TRÒ GIẢM GIÁ ẢO 50%',
          back: 'Shop đôn giá từ 200k lên 400k rồi dán nhãn "Sale sốc 50%". Đừng bao giờ mua hàng chỉ vì thấy con số % giảm giá cao!',
          icon: '🏷️',
          actionTip: 'Dùng công cụ soi lịch sử giá hoặc chỉ nhìn vào số tiền mặt phải trả cuối cùng.'
        },
        {
          id: 'fc-2-3',
          front: 'NGHỆ THUẬT DỌN SẠCH GIỎ HÀNG',
          back: 'Giữ giỏ hàng rỗng! Không bao giờ lướt app mua sắm online sau 22h đêm khi não bộ đang kiệt sức và dễ ra quyết định bốc đồng.',
          icon: '🗑️',
          actionTip: 'Tắt thông báo đẩy từ các sàn thương mại điện tử vào buổi tối.'
        }
      ],
      quiz: {
        question: 'Đơn hàng 180k cần mua thêm 70k để được giảm 20k phí ship. Bạn nên làm gì?',
        options: [
          'Mua thêm 70k để đỡ tiếc 20k ship',
          'Chấp nhận trả 20k ship hoặc xóa giỏ hàng nếu chưa cần gấp',
          'Mua thêm 200k cho bõ công săn sale'
        ],
        correctIndex: 1
      },
      knowledgeReward: 20,
      countermeasureShield: true
    },
    stageConfig: {
      targetDistance: 400,
      targetCoins: 30,
      baseSpeed: 13.5,
      requireQuizPass: true,
    },
    ultimateSkill: getSkillByChapter('chapter-2'),
    availableSkills: getSkillsByChapter('chapter-2'),
    runnerQuizzes: [
      {
        question: 'Giỏ hàng thiếu 60k để được mã Freeship 20k?',
        laneLeft: 'LÀN TRÁI: Trả 20k ship hoặc xóa giỏ (Đúng)',
        laneRight: 'LÀN PHẢI: Mua thêm ốp lưng 80k cho đủ',
        correctLane: 0,
        rewardSkillId: 'cart_purge'
      },
      {
        question: 'Áo khoác giảm 50% từ 1 triệu còn 500k nhưng bạn không cần mặc?',
        laneLeft: 'LÀN TRÁI: Mua ngay vì hời 500k',
        laneRight: 'LÀN PHẢI: Không mua, tiết kiệm trọn 500k (Đúng)',
        correctLane: 1,
        rewardSkillId: 'freeship_breaker'
      },
      {
        question: 'Cách tốt nhất để không bị cháy túi ngày Siêu Sale 11/11?',
        laneLeft: 'LÀN TRÁI: Lập sẵn Wishlist & Ngân sách cứng (Đúng)',
        laneRight: 'LÀN PHẢI: Canh 0h lướt xem deal nào sốc thì mua',
        correctLane: 0,
        rewardSkillId: 'order_cancel'
      }
    ],
    challenges: [
      { id: 'ch2-c1', title: 'Xóa bớt 1 món đồ không cần thiết trong giỏ hàng', damage: 30, discipline: 10, rewardXp: 40 },
      { id: 'ch2-c2', title: 'Tắt thông báo app mua sắm sau 22h', damage: 30, discipline: 10, rewardXp: 40 },
      { id: 'ch2-c3', title: 'Không mở app TMĐT trong 24 giờ', damage: 40, discipline: 10, rewardXp: 50 }
    ],
    runnerConfig: {
      primaryObstacle: 'shopee',
      quizGate: {
        question: 'Mua 200k để freeship 15k là Tiết kiệm hay Lỗ?',
        laneLeft: 'LỖ 185k!',
        laneRight: 'HỜI QUÁ XÁ',
        correctLane: 0
      }
    }
  },
  {
    id: 'chapter-3',
    number: 3,
    title: 'Chương 3: Áp Lực Đồng Lứa & FOMO Đu Trend',
    shortTitle: 'Chương 3: FOMO Đu Trend',
    subtitle: 'Xây dựng lá chắn tài chính vững bền',
    bossId: 'fomo-phantom',
    bossName: 'Quỷ Vương FOMO Đu Trend',
    bossIcon: '📱',
    bossCategory: 'electronics',
    maxHp: 200,
    bossAttack: 36,
    bossSkillName: 'Cơn Lốc Thẻ Tín Dụng Quẹt Lỗ Cháy Ví 📱',
    environmentTheme: 'cyber_lounge',
    roast: 'Đu trend đồ công nghệ mới để khoe mẽ trên mạng, cuối tháng ăn mì gói?',
    unlockRequirements: {
      minDiscipline: 35,
      minKnowledge: 35,
      requirePrevBoss: 'sale-goblin',
    },
    coinCost: 80,
    lesson: {
      id: 'lesson-ch3',
      title: 'Nguyên Tắc Ngân Sách 50/30/20 & Quỹ Sinh Tồn',
      storyTitle: 'Áp Lực Đu Trend Bằng Thẻ Tín Dụng & Bẫy Trả Nợ Tối Thiểu',
      story: 'Nhóm bạn rủ đi du lịch check-in resort sang chảnh cuối tuần. Không muốn bị lạc quẻ, bạn quẹt thẻ tín dụng 4,5 triệu dù lương chưa về. Đến kỳ sao kê, ngân hàng thông báo bạn chỉ cần thanh toán tối thiểu 250k.',
      analysis: 'Chỉ trả số tối thiểu 250k/tháng với mức lãi suất cắt cổ 36%/năm sẽ biến khoản nợ 4,5 triệu thành gánh nặng kéo dài 3 năm và bạn phải trả gấp đôi tiền gốc do lãi mẹ đẻ lãi con!',
      takeaway: 'Bí kíp 50/30/20: Dũng cảm nói "Không" với các cuộc vui vượt quá hạn mức 30% linh hoạt. Luôn trích 20% vào quỹ tiết kiệm ngay khi nhận lương và thanh toán 100% dư nợ thẻ đúng hạn.',
      summary: 'Chia thu nhập thành: 50% Thiết yếu, 30% Sở thích cá nhân, 20% Tích lũy khẩn cấp.',
      cards: [
        'Quỹ sinh tồn tối thiểu phải đủ chi tiêu cho 3 tháng khẩn cấp.',
        'Đừng bao giờ vay mượn hoặc quẹt thẻ tín dụng cho những món đồ mất giá theo thời gian.'
      ],
      flashcards: [
        {
          id: 'fc-3-1',
          front: 'NGUYÊN TẮC NGÂN SÁCH 50/30/20',
          back: '50% Nhu cầu thiết yếu (nhà, ăn, điện nước) - 30% Sở thích & giải trí - 20% Tích lũy khẩn cấp và đầu tư tương lai.',
          icon: '📊',
          actionTip: 'Chia tiền ngay khi nhận lương, chuyển 20% vào quỹ tích lũy trước tiên.'
        },
        {
          id: 'fc-3-2',
          front: 'QUỸ SINH TỒN 3 THÁNG',
          back: 'Là phao cứu sinh bảo vệ bạn khi mất việc, ốm đau hoặc biến cố. Tối thiểu phải đủ tiền sống sót trong 3 tháng không thu nhập.',
          icon: '🛡️',
          actionTip: 'Để tiền sinh tồn ở ngân hàng có lãi suất không kỳ hạn, không dùng để đầu cơ mạo hiểm.'
        },
        {
          id: 'fc-3-3',
          front: 'HỘI CHỨNG FOMO ĐU TREND',
          back: 'Đồ công nghệ mới, thời trang sang chảnh sẽ mất giá 30-50% chỉ sau vài tháng. Giá trị thật của bạn không nằm ở chiếc máy xịn nhất!',
          icon: '📱',
          actionTip: 'Học cách nói "Không" với những cuộc đua mua sắm vượt quá khả năng.'
        }
      ],
      quiz: {
        question: 'Theo quy tắc 50/30/20, nếu bạn kiếm được 10 triệu thì nên dành bao nhiêu cho Tích lũy?',
        options: [
          '5 triệu (50%)',
          '3 triệu (30%)',
          '2 triệu (20%)'
        ],
        correctIndex: 2
      },
      knowledgeReward: 25,
      countermeasureShield: true
    },
    stageConfig: {
      targetDistance: 500,
      targetCoins: 40,
      baseSpeed: 15.5,
      requireQuizPass: true,
    },
    ultimateSkill: getSkillByChapter('chapter-3'),
    availableSkills: getSkillsByChapter('chapter-3'),
    runnerQuizzes: [
      {
        question: 'Lương 10 triệu vừa về, phân bổ tiền chuẩn 50/30/20?',
        laneLeft: 'LÀN TRÁI: Trích ngay 2tr vào tiết kiệm (Đúng)',
        laneRight: 'LÀN PHẢI: Đi ăn mừng xả láng trước đã',
        correctLane: 0,
        rewardSkillId: 'golden_slash'
      },
      {
        question: 'Sao kê thẻ tín dụng 5 triệu, ngân hàng báo trả tối thiểu 250k?',
        laneLeft: 'LÀN TRÁI: Chỉ trả 250k để có tiền tiêu tiếp',
        laneRight: 'LÀN PHẢI: Trả đủ 100% (5tr) tránh lãi kép (Đúng)',
        correctLane: 1,
        rewardSkillId: 'credit_cut'
      },
      {
        question: 'Bạn bè rủ đi du lịch sang chảnh check-in vượt quá khả năng tài chính?',
        laneLeft: 'LÀN TRÁI: Dũng cảm nói KHÔNG, giữ quỹ khẩn cấp (Đúng)',
        laneRight: 'LÀN PHẢI: Quẹt thẻ tín dụng trả góp để đu trend',
        correctLane: 0,
        rewardSkillId: 'emergency_fund'
      }
    ],
    challenges: [
      { id: 'ch3-c1', title: 'Trích ngay 20% tiền tiêu vặt vào quỹ khẩn cấp', damage: 50, discipline: 15, rewardXp: 60 },
      { id: 'ch3-c2', title: 'Nói "Không" với 1 lời rủ rê mua sắm/đu trend', damage: 50, discipline: 15, rewardXp: 60 },
      { id: 'ch3-c3', title: 'Tổng kết chi tiêu tuần và đối chiếu ngân sách', damage: 50, discipline: 15, rewardXp: 60 }
    ],
    runnerConfig: {
      primaryObstacle: 'sale_banner',
      quizGate: {
        question: 'Tỷ lệ tích lũy chuẩn theo 50/30/20 là bao nhiêu %?',
        laneLeft: '20% Tích Lũy',
        laneRight: '5% Tích Lũy',
        correctLane: 0
      }
    }
  }
];

module.exports = {
  CHAPTERS_DATA,
};
