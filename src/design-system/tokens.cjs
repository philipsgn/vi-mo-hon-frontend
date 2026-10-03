/**
 * VI-MO-HON Neo-Brutalism Design Tokens (CommonJS)
 */

const neoColors = {
  // Nền & Canvas
  bgCanvas: '#F8F9FA',
  bgSurface: '#FFFFFF',

  // Bảng màu rực rỡ tương phản cao (High Contrast Neo-Brutalism)
  black: '#121212',
  white: '#FFFFFF',
  yellow: '#FFE600',       // Năng lượng, Cảnh báo mua sắm, Boss Arena
  mint: '#00F0FF',         // Thành công, Nhịn mua thành công, Tiết kiệm
  coral: '#FF5C5C',        // Chi tiêu, Cảnh báo nguy hiểm, Trừ máu Boss
  purple: '#B388FF',       // Cấp độ nhân vật, EXP, Huy hiệu
  lime: '#C6FF00',         // Chuỗi streak, Thử thách hoàn thành
  orange: '#FF9100',       // Đốm lửa streak

  // Màu trạng thái & Hỗ trợ
  grayLight: '#EFEFEF',
  grayMuted: '#666666',
  borderDefault: '#121212',
};

const neoBorders = {
  thin: 1.5,
  default: 2,
  thick: 3,
  hero: 4,
};

const neoShadows = {
  default: {
    shadowColor: '#121212',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  card: {
    shadowColor: '#121212',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  pressed: {
    shadowColor: '#121212',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
};

const neoRadii = {
  none: 0,
  sm: 6,
  md: 8,
  lg: 12,
  full: 9999,
};

const neoSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

module.exports = {
  neoColors,
  neoBorders,
  neoShadows,
  neoRadii,
  neoSpacing,
  // Tương thích ngược với tên gọi neoTokens cũ
  neoTokens: {
    colors: neoColors,
    borders: neoBorders,
    shadows: neoShadows,
    radii: neoRadii,
    spacing: neoSpacing,
  },
};
