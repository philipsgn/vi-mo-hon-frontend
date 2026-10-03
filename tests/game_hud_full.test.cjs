const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('GAME HUD: App.js renders only pure sky background and no distant islands', () => {
  const appCode = fs.readFileSync(path.join(__dirname, '../App.js'), 'utf8');

  // Verify pure sky gradient is present
  assert.match(appCode, /bg_sky_gradient\.webp/, 'App.js must render bg_sky_gradient.webp');

  // Verify distant islands are completely removed from background layer
  assert.doesNotMatch(appCode, /bg_distant_islands\.webp/, 'App.js must NOT render bg_distant_islands.webp');
});

test('GAME HUD: GameRailIcon and GameEnergyBar components are properly exported and structured', () => {
  const railIconCode = fs.readFileSync(path.join(__dirname, '../src/components/common/GameRailIcon.js'), 'utf8');
  const energyBarCode = fs.readFileSync(path.join(__dirname, '../src/components/common/GameEnergyBar.js'), 'utf8');
  const commonIndexCode = fs.readFileSync(path.join(__dirname, '../src/components/common/index.js'), 'utf8');

  // Verify GameRailIcon
  assert.match(railIconCode, /width:\s*56/, 'GameRailIcon has minimum touch size > 48pt');
  assert.match(railIconCode, /height:\s*56/, 'GameRailIcon has height > 48pt');
  assert.match(railIconCode, /badge/, 'GameRailIcon supports badge');

  // Verify GameEnergyBar
  assert.match(energyBarCode, /GameEnergyBar/, 'GameEnergyBar export exists');
  assert.match(energyBarCode, /fillColor/, 'GameEnergyBar supports custom colors');

  // Verify index export
  assert.match(commonIndexCode, /export \{ GameRailIcon \}/, 'index exports GameRailIcon');
  assert.match(commonIndexCode, /export \{ GameEnergyBar \}/, 'index exports GameEnergyBar');
});

test('PIVOT V2: HomeScreenGame implements 5-block real-data dashboard and navigation', () => {
  const homeCode = fs.readFileSync(path.join(__dirname, '../src/screens/HomeScreenGame.js'), 'utf8');

  // Verify Pivot V2 5-block structure
  assert.match(homeCode, /TỔNG QUAN HÔM NAY/, 'Overview section is present');
  assert.match(homeCode, /AI COACH PHẢN BIỆN/, 'AI Coach section is present');
  assert.match(homeCode, /CHI TIÊU HÔM NAY/, 'Daily expenses section is present');
  assert.match(homeCode, /HỌC TẬP & KIỂM TRA/, 'Lessons section is present');
  assert.match(homeCode, /THI RUNNER 3D/, 'Runner 3D button is present');

  // Verify Navigation callbacks
  assert.match(homeCode, /onNavigateToWallet/, 'Wallet navigation callback exists');
  assert.match(homeCode, /onNavigateToCoach/, 'Coach navigation callback exists');
  assert.match(homeCode, /onNavigateToLessons/, 'Lessons navigation callback exists');
  assert.match(homeCode, /onOpenRunner/, 'Runner open callback exists');
});
