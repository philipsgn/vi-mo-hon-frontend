/**
 * VI-MO-HON Feature Flags Configuration (Pivot V2)
 * Điều phối chuyển đổi từng màn hình theo chuẩn Strangler Pattern.
 */

const FEATURE_FLAGS = {
  USE_NEO_COACH: true,       // Màn hình Hỏi AI Coach văn bản (Pivot V2) - ĐÃ BẬT
  USE_NEO_QUICK_EXP: true,   // Form ghi chi tiêu 1-chạm (Phase UP-3) - ĐÃ BẬT
  USE_NEO_HOME: true,        // Trang chủ Tối giản theo khối dữ liệu thật (Pivot V2) - ĐÃ BẬT
  USE_NEO_PROFILE: true,     // Hồ sơ & Thiết lập mục tiêu (Pivot V2) - ĐÃ BẬT
  USE_NEO_RUNNER: true,      // Mini Game 3D Endless Runner thi Quiz (Pivot V2) - ĐÃ BẬT
  USE_GAME_NAV_DOCK: true,   // Thanh điều hướng 4 Tab + FAB [+] (ADR-31) - ĐÃ BẬT
  USE_NEO_BOSS: false,       // Đấu trường Boss cũ - ĐÃ TẮT (Pivot V2)
  USE_NEO_CHARACTER: false,  // Nhân vật Chibi cũ - ĐÃ TẮT (Pivot V2)
  USE_CHARACTER_ROSTER: false,// Hệ sinh thái nhân vật 3D cũ - ĐÃ TẮT (Pivot V2)
  SHOW_DEV_DEBUG_OVERLAY: false, // Debug overlay & viền màu (mặc định TẮT)
};

/**
 * Kiểm tra xem tính năng có được kích hoạt hay không.
 * @param {string} flagName
 * @param {boolean} [defaultValue=false]
 * @returns {boolean}
 */
function isFeatureEnabled(flagName, defaultValue = false) {
  if (typeof FEATURE_FLAGS[flagName] === 'boolean') {
    return FEATURE_FLAGS[flagName];
  }
  return defaultValue;
}

module.exports = {
  FEATURE_FLAGS,
  isFeatureEnabled,
};
