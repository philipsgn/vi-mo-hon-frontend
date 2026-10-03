const test = require('node:test');
const assert = require('node:assert/strict');
const {
  REVENUECAT_CONFIG,
  formatPackageOffer,
  mapPurchaseError,
  formatRestoreResult,
} = require('../src/utils/iapHelper.cjs');

test('REVENUECAT_CONFIG matches approved 29k/month monetization spec', () => {
  assert.equal(REVENUECAT_CONFIG.packageId, 'vmh_premium_monthly_29k');
  assert.equal(REVENUECAT_CONFIG.price, 29000);
  assert.equal(REVENUECAT_CONFIG.priceString, '29.000đ');
  assert.equal(REVENUECAT_CONFIG.entitlementId, 'premium_access');
});

test('formatPackageOffer provides robust fallback when package is null', () => {
  const offer = formatPackageOffer(null);
  assert.equal(offer.identifier, 'vmh_premium_monthly_29k');
  assert.equal(offer.price, 29000);
  assert.equal(offer.priceString, '29.000đ');
  assert.equal(offer.isAvailable, true);
});

test('formatPackageOffer preserves custom package properties', () => {
  const custom = {
    identifier: 'vmh_custom',
    price: 35000,
    priceString: '35.000đ',
    period: '1 tháng',
    title: 'Custom Title',
  };
  const offer = formatPackageOffer(custom);
  assert.equal(offer.identifier, 'vmh_custom');
  assert.equal(offer.price, 35000);
});

test('mapPurchaseError translates store cancellation into friendly message', () => {
  assert.equal(mapPurchaseError({ userCancelled: true }), 'Bạn đã hủy giao dịch.');
  assert.equal(mapPurchaseError({ code: 'USER_CANCELLED' }), 'Bạn đã hủy giao dịch.');
  assert.match(mapPurchaseError({ code: 'NETWORK_ERROR' }), /kết nối App Store/i);
});

test('formatRestoreResult handles success and missing purchases', () => {
  const success = formatRestoreResult(true);
  assert.equal(success.success, true);
  assert.match(success.message, /Khôi phục giao dịch thành công/i);

  const fail = formatRestoreResult(false);
  assert.equal(fail.success, false);
  assert.match(fail.message, /Không tìm thấy gói Premium hợp lệ/i);
});
