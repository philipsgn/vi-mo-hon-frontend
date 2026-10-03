const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { BUILD_INFO } = require('../src/config/buildInfo.cjs');
const { FEATURE_FLAGS } = require('../src/config/features.cjs');

test('BƯỚC 1: BUILD_ID is valid and uniquely identifies the native debug build', () => {
  assert.ok(BUILD_INFO.BUILD_ID, 'BUILD_ID must be present');
  assert.match(BUILD_INFO.BUILD_ID, /^BUILD_IA01_/, 'BUILD_ID should follow build tag convention');
  assert.ok(BUILD_INFO.BUILD_TIME, 'BUILD_TIME timestamp must exist');
});

test('BƯỚC 2: App.js has DevErrorBoundary, DevDebugOverlay, onLayout tracking, and zIndex protection', () => {
  const appCode = fs.readFileSync(path.join(__dirname, '../App.js'), 'utf8');

  // Verify Error Boundary & Overlay
  assert.match(appCode, /<DevErrorBoundary>/, 'App must be wrapped in DevErrorBoundary');
  assert.match(appCode, /<DevDebugOverlay/, 'App must render DevDebugOverlay in __DEV__');

  // Verify onLayout handlers on all major structural containers
  assert.match(appCode, /handleContainerLayout\('Root'/, 'Root container has onLayout tracking');
  assert.match(appCode, /handleContainerLayout\('Header'/, 'Header container has onLayout tracking');
  assert.match(appCode, /handleContainerLayout\('Content'/, 'Content container has onLayout tracking');
  assert.match(appCode, /handleContainerLayout\('Dock'/, 'Dock container has onLayout tracking');

  // Verify explicit absolute positioning without undefined absoluteFillObject
  assert.doesNotMatch(appCode, /StyleSheet\.absoluteFillObject/, 'Must never use undefined StyleSheet.absoluteFillObject in App.js');
  assert.match(appCode, /fixedBackgroundLayer:\s*\{[^}]*position:\s*['"]absolute['"]/, 'fixedBackgroundLayer must have explicit position absolute');
  assert.match(appCode, /skyGradientImg:\s*\{[^}]*position:\s*['"]absolute['"]/, 'skyGradientImg must have explicit position absolute');

  // Verify colored debug borders in DEV mode
  assert.match(appCode, /debugBorderRoot/, 'Root container has red debug border');
  assert.match(appCode, /debugBorderHeader/, 'Header container has yellow debug border');
  assert.match(appCode, /debugBorderContent/, 'Content container has green debug border');
  assert.match(appCode, /debugBorderDock/, 'Dock container has orange debug border');
});

test('PIVOT V2: HomeScreenGame renders 5-block real-data dashboard and no tainted assets', () => {
  const homeCode = fs.readFileSync(path.join(__dirname, '../src/screens/HomeScreenGame.js'), 'utf8');

  // Verify 5-block real-data layout
  assert.match(homeCode, /TỔNG QUAN HÔM NAY/, 'Overview section must be present');
  assert.match(homeCode, /AI COACH PHẢN BIỆN/, 'AI Coach section must be present');
  assert.match(homeCode, /CHI TIÊU HÔM NAY/, 'Daily expenses section must be present');
  assert.match(homeCode, /HỌC TẬP & KIỂM TRA/, 'Lessons and runner exam section must be present');
  assert.match(homeCode, /THI RUNNER 3D/, 'Runner 3D launch button must be present');

  // Verify RetroProgressBar usage
  assert.match(homeCode, /RetroProgressBar/, 'Must use RetroProgressBar');

  // Verify no tainted assets are imported
  assert.doesNotMatch(homeCode, /island_main_waterfall/, 'Must NOT import island_main_waterfall');
  assert.doesNotMatch(homeCode, /island_expense_base/, 'Must NOT import island_expense_base');
  assert.doesNotMatch(homeCode, /panel_parchment_blank/, 'Must NOT import panel_parchment_blank');
  assert.doesNotMatch(homeCode, /capsule_metric_blue/, 'Must NOT import capsule_metric_blue');
  assert.doesNotMatch(homeCode, /tag_ribbon_chapter_red/, 'Must NOT import tag_ribbon_chapter_red');
  assert.doesNotMatch(homeCode, /panel_card_cyan_mission/, 'Must NOT import panel_card_cyan_mission');
  assert.doesNotMatch(homeCode, /panel_card_purple_wallet/, 'Must NOT import panel_card_purple_wallet');
  assert.doesNotMatch(homeCode, /shiba/, 'Must NOT reference shiba');
});

test('BƯỚC 4 & 5: Rollback verification when USE_GAME_NAV_DOCK is disabled', () => {
  const appCode = fs.readFileSync(path.join(__dirname, '../App.js'), 'utf8');

  // Fallback branch must exist
  assert.match(appCode, /FEATURE_FLAGS\.USE_GAME_NAV_DOCK \? \(/, 'Conditional dock branch exists');
  assert.match(appCode, /<BottomTabs activeTab=\{activeTab\}/, 'Classic BottomTabs fallback is preserved');
});
