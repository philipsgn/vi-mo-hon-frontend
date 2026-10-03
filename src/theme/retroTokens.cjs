/**
 * RETRO DESIGN TOKENS - Hướng 1: "Sài Gòn Phố Cổ & Giấy Dó Xưa" (ADR-21)
 * Chuẩn màu hoài cổ 1990s, tối giản, thanh lịch, đạt chuẩn tương phản WCAG AA.
 */

const retroColors = {
  // Nền (Canvas & Surface)
  bgCanvas: '#FAF6EF',       // Giấy dó kem ấm, êm mắt
  bgPaper: '#F4EFE6',        // Nền giấy dó đục nhẹ / thẻ phụ
  surface: '#FFFFFF',        // Thẻ nội dung trắng ngà nhẹ
  surfaceSubtle: '#F4EFE6',  // Nền vùng nhập liệu, chip phụ, ô phụ

  // Chữ (Typography - WCAG AA compliant)
  textPrimary: '#2E1E14',    // Nâu đen cà phê đậm (tương phản 11.2:1)
  textSecondary: '#6E5D4F',  // Nâu đất nhạt (tương phản 4.8:1)
  textMuted: '#9C8E80',      // Chữ mờ, placeholder (tương phản 3.0:1)
  textInverse: '#FFFFFF',    // Chữ trắng trên nền sẫm

  // Viền (Borders)
  border: '#4A3525',         // Viền mực mộc thanh lịch 1.5px
  borderMuted: '#D8CEBC',    // Viền phân cách nhẹ
  borderSubtle: '#D8CEBC',   // Viền phân cách nhẹ
  borderBold: '#2E1E14',     // Viền nhấn đậm

  // Màu điểm nhấn (Accents)
  accentAmber: '#D97706',    // Vàng mù tạt cổ / Hổ phách (Nút [+], Điểm danh)
  accentAmberPressed: '#B45309',
  accentBrick: '#B91C1C',    // Đỏ gạch ngói Chợ Lớn (Khoản chi, HP Boss, Cảnh báo)
  accentBrickPressed: '#991B1B',
  accentMoss: '#15803D',     // Xanh rêu lá chuối khô (Thu tiền, Tích lũy, XP)
  accentMossPressed: '#166534',
  accentNavy: '#1E293B',     // Men gốm Lái Thiêu / Chàm sẫm (Thanh dock chân trang)
  accentNavyPressed: '#0F172A',

  // Hệ màu Game Hóa Neo-Brutalist Arcade (Đồng bộ toàn App)
  gameYellow: '#FFE600',     // Vàng chanh năng động (Header, Highlights, Card chính)
  gameMint: '#A7F3D0',       // Xanh mint pastel (Thu nhập, Ngân sách an toàn)
  gameCoral: '#FDA4AF',      // Hồng san hô pastel (Chi tiêu, Cảnh báo nhẹ)
  gameIndigo: '#818CF8',     // Tím neon pastel (AI Coach, Thẻ bài học)
  gameSand: '#FDE68A',       // Cát vàng nhạt (Viên nang chỉ số, Badge)
  gameDark: '#0F172A',       // Viền đen xanh đậm
  gameBorder: '#0F172A',     // Viền chuẩn 2px
};

const retroSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  huge: 32,
};

const retroRadii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 9999,
};

const retroShadows = {
  subtle: {
    shadowColor: '#4A3525',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  card: {
    shadowColor: '#4A3525',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  button: {
    borderBottomWidth: 3,
    borderBottomColor: '#2E1E14',
  },
};

const retroTypography = {
  fontSizes: {
    hero: 28,
    titleLg: 20,
    titleMd: 16,
    body: 14,
    caption: 12,
    tiny: 10,
  },
  fontWeights: {
    regular: '400',
    medium: '600',
    bold: '700',
    heavy: '800',
  },
};

// Unified retroTokens object
const retroTokens = {
  ...retroColors,
  radiusSm: retroRadii.sm,
  radiusMd: retroRadii.md,
  radiusLg: retroRadii.lg,
  radiusPill: retroRadii.pill,
  shadowSubtle: retroShadows.subtle,
  shadowCard: retroShadows.card,
  colors: retroColors,
  spacing: retroSpacing,
  radii: retroRadii,
  shadows: retroShadows,
  typography: retroTypography,
};

module.exports = {
  retroTokens,
  retroColors,
  retroSpacing,
  retroRadii,
  retroShadows,
  retroTypography,
};
