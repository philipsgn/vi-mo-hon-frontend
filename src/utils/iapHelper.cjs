/**
 * Pure configuration and error mapping logic for In-App Purchase (IAP).
 * CommonJS compatible for Node.js test runners and React Native bundlers.
 */

const REVENUECAT_CONFIG = {
  entitlementId: 'premium_access',
  packageId: 'vmh_premium_monthly_29k',
  price: 29000,
  priceString: '29.000đ',
  currency: 'VND',
  billingPeriod: '1 tháng (Gia hạn tự động)',
  title: 'Gói Premium VIP Ví Mỏ Hỗn',
};

function formatPackageOffer(pkg) {
  if (!pkg) {
    return {
      identifier: REVENUECAT_CONFIG.packageId,
      price: REVENUECAT_CONFIG.price,
      priceString: REVENUECAT_CONFIG.priceString,
      period: REVENUECAT_CONFIG.billingPeriod,
      title: REVENUECAT_CONFIG.title,
      isAvailable: true,
    };
  }

  return {
    identifier: pkg.identifier || REVENUECAT_CONFIG.packageId,
    price: Number(pkg.price) || REVENUECAT_CONFIG.price,
    priceString: pkg.priceString || REVENUECAT_CONFIG.priceString,
    period: pkg.period || REVENUECAT_CONFIG.billingPeriod,
    title: pkg.title || REVENUECAT_CONFIG.title,
    isAvailable: true,
  };
}

function mapPurchaseError(err) {
  if (!err) return 'Giao dịch không thành công. Vui lòng thử lại.';

  const code = String(err.code || err.message || '');

  if (err.userCancelled || /user_cancelled|cancelled/i.test(code)) {
    return 'Bạn đã hủy giao dịch.';
  }

  if (/network|offline|timeout/i.test(code)) {
    return 'Lỗi kết nối App Store/Google Play. Vui lòng kiểm tra mạng và thử lại.';
  }

  if (/payment_pending|pending/i.test(code)) {
    return 'Giao dịch đang chờ ngân hàng/cửa hàng xử lý. Quyền Premium sẽ kích hoạt khi hoàn tất.';
  }

  if (/store_problem|store_unavailable/i.test(code)) {
    return 'Cửa hàng ứng dụng đang bảo trì. Vui lòng thử lại sau ít phút.';
  }

  return err.message || 'Không thể hoàn tất giao dịch thanh toán.';
}

function formatRestoreResult(isPremium) {
  if (isPremium) {
    return {
      success: true,
      message: 'Khôi phục giao dịch thành công! Gói Premium VIP của bạn đã được phục hồi.',
    };
  }
  return {
    success: false,
    message: 'Không tìm thấy gói Premium hợp lệ nào đã mua trên tài khoản App Store/Google Play này.',
  };
}

module.exports = {
  REVENUECAT_CONFIG,
  formatPackageOffer,
  mapPurchaseError,
  formatRestoreResult,
};
