const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { FEATURE_FLAGS, isFeatureEnabled } = require('../src/config/features.cjs');

test('Phase IA - Task IA-01: Feature Flag USE_GAME_NAV_DOCK is registered and enabled', () => {
  assert.equal(typeof FEATURE_FLAGS.USE_GAME_NAV_DOCK, 'boolean', 'USE_GAME_NAV_DOCK must be a boolean');
  assert.equal(FEATURE_FLAGS.USE_GAME_NAV_DOCK, true, 'USE_GAME_NAV_DOCK should be active for IA Phase 1');
  assert.equal(isFeatureEnabled('USE_GAME_NAV_DOCK'), true);
});

test('Phase IA - Task IA-01: GameBottomNavDock component structure and tabs', () => {
  const dockCode = fs.readFileSync(path.join(__dirname, '../src/components/GameBottomNavDock.js'), 'utf8');

  // Verify 4 tabs
  assert.match(dockCode, /'home'/, 'Should include home tab');
  assert.match(dockCode, /'wallet'/, 'Should include wallet tab');
  assert.match(dockCode, /'lessons'/, 'Should include lessons tab');
  assert.match(dockCode, /'profile'/, 'Should include profile tab');

  // Verify labels
  assert.match(dockCode, /Trang chủ/, 'Label Trang chủ');
  assert.match(dockCode, /Sổ ví/, 'Label Sổ ví');
  assert.match(dockCode, /Bài học/, 'Label Bài học');
  assert.match(dockCode, /Hồ sơ/, 'Label Hồ sơ');

  // Verify FAB [+] button
  assert.match(dockCode, /nav-fab-plus/, 'Should contain FAB plus testID');
  assert.match(dockCode, /onPressFab/, 'Should handle onPressFab callback');

  // Verify ergonomics & Apple HIG: minWidth >= 48, minHeight >= 48
  assert.match(dockCode, /minWidth:\s*54/, 'Tab button minWidth must be >= 48pt');
  assert.match(dockCode, /minHeight:\s*48/, 'Tab button minHeight must be >= 48pt');

  // Verify elevated FAB button size: 54x54pt
  assert.match(dockCode, /width:\s*54/, 'FAB button width >= 54');
  assert.match(dockCode, /height:\s*54/, 'FAB button height >= 54');
});

test('Phase IA - Task IA-01: App.js integrates GameBottomNavDock and fixed background game canvas', () => {
  const appCode = fs.readFileSync(path.join(__dirname, '../App.js'), 'utf8');

  // Verify import
  assert.match(appCode, /import.*GameBottomNavDock.*from '\.\/src\/components\/GameBottomNavDock'/, 'App.js imports GameBottomNavDock');
  assert.match(appCode, /import.*WalletScreen.*from '\.\/src\/screens\/WalletScreen'/, 'App.js imports WalletScreen');

  // Verify fixed background
  assert.match(appCode, /bg_sky_gradient\.webp/, 'Fixed sky gradient is referenced');
  assert.match(appCode, /fixedDistantIslands/, 'Fixed distant islands background style exists');

  // Verify gameContentArea with flex: 1 (no outer ScrollView)
  assert.match(appCode, /gameContentArea:\s*\{[^}]*flex:\s*1/, 'gameContentArea has flex: 1');

  // Verify FAB action sheet modal
  assert.match(appCode, /fabModalVisible/, 'App manages fabModalVisible state');
  assert.match(appCode, /GHI NHANH & HỎI MỎ HỖN/, 'Modal displays quick action sheet header');
});

test('Phase IA - Task IA-01: WalletScreen component exports and has proper simulated wallet elements', () => {
  const walletCode = fs.readFileSync(path.join(__dirname, '../src/screens/WalletScreen.js'), 'utf8');

  assert.match(walletCode, /export function WalletScreen/, 'WalletScreen is exported');
  assert.match(walletCode, /SỔ VÍ GIẢ LẬP/, 'WalletScreen shows simulated wallet banner');
  assert.match(walletCode, /Sửa số dư/, 'WalletScreen has adjust balance button');
  assert.match(walletCode, /MỤC TIÊU TÀI CHÍNH/, 'WalletScreen displays financial goal card');
  assert.match(walletCode, /LỊCH SỬ THU \/ CHI GẦN ĐÂY/, 'WalletScreen displays transaction ledger');
});
