const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { retroColors, retroRadii, retroSpacing } = require('../src/theme/retroTokens.cjs');
const { FEATURE_FLAGS } = require('../src/config/features.cjs');

/**
 * Tính toán độ tương phản tương đối theo chuẩn WCAG 2.1
 */
function getLuminance(hex) {
  const rgb = hex.replace('#', '').match(/.{2}/g).map((x) => parseInt(x, 16) / 255);
  const a = rgb.map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function getContrastRatio(hex1, hex2) {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

test('PHASE 1: Retro Design Tokens match ADR-21 Sài Gòn 1990s', () => {
  assert.equal(retroColors.bgCanvas, '#FAF6EF', 'Canvas background must be Giấy dó kem');
  assert.equal(retroColors.textPrimary, '#2E1E14', 'Primary text must be Cà phê mực đậm');
  assert.equal(retroColors.accentAmber, '#D97706', 'Main action accent must be Mù tạt cổ');
  assert.equal(retroColors.accentBrick, '#B91C1C', 'Expense/Boss HP accent must be Đỏ ngói');
  assert.equal(retroColors.accentMoss, '#15803D', 'Income/Saving accent must be Xanh rêu');
  assert.ok(retroRadii.md, 'Border radius tokens must exist');
  assert.ok(retroSpacing.lg, 'Spacing tokens must exist');

  const { retroTokens } = require('../src/theme/retroTokens.cjs');
  assert.ok(retroTokens, 'retroTokens object must be exported');
  assert.equal(retroTokens.bgPaper, '#F4EFE6', 'retroTokens.bgPaper must exist');
  assert.equal(retroTokens.bgCanvas, '#FAF6EF', 'retroTokens.bgCanvas must exist');
  assert.equal(retroTokens.textPrimary, '#2E1E14', 'retroTokens.textPrimary must exist');
});

test('PHASE 1: WCAG AA contrast ratio compliance for all primary text', () => {
  const ratioPrimary = getContrastRatio(retroColors.textPrimary, retroColors.bgCanvas);
  assert.ok(
    ratioPrimary >= 4.5,
    `Primary text contrast (${ratioPrimary.toFixed(2)}) must meet WCAG AA >= 4.5:1`
  );

  const ratioSecondary = getContrastRatio(retroColors.textSecondary, retroColors.bgCanvas);
  assert.ok(
    ratioSecondary >= 4.5,
    `Secondary text contrast (${ratioSecondary.toFixed(2)}) must meet WCAG AA >= 4.5:1`
  );

  const ratioBrick = getContrastRatio(retroColors.accentBrick, retroColors.bgCanvas);
  assert.ok(
    ratioBrick >= 4.5,
    `Accent brick contrast (${ratioBrick.toFixed(2)}) must meet WCAG AA >= 4.5:1`
  );
});

test('PHASE 1: Debug overlay and colored borders default to OFF', () => {
  assert.equal(
    FEATURE_FLAGS.SHOW_DEV_DEBUG_OVERLAY,
    false,
    'SHOW_DEV_DEBUG_OVERLAY must be false by default so user sees real UI'
  );
});

test('PHASE 1: Atomic common components exist and do NOT reference tainted baked UI assets', () => {
  const commonDir = path.join(__dirname, '../src/components/common');
  const files = fs.readdirSync(commonDir);
  assert.ok(files.includes('RetroCard.js'), 'RetroCard must exist');
  assert.ok(files.includes('RetroButton.js'), 'RetroButton must exist');
  assert.ok(files.includes('RetroStatChip.js'), 'RetroStatChip must exist');
  assert.ok(files.includes('RetroProgressBar.js'), 'RetroProgressBar must exist');
  assert.ok(files.includes('RetroEmptyState.js'), 'RetroEmptyState must exist');

  const taintedPatterns = [
    'island_main_waterfall',
    'island_expense_base',
    'panel_parchment_blank',
    'capsule_metric_blue',
    'tag_ribbon_chapter_red',
    'panel_card_cyan_mission',
    'panel_card_purple_wallet',
    'boss_tra_sua_monster',
  ];

  files.forEach((file) => {
    const code = fs.readFileSync(path.join(commonDir, file), 'utf8');
    taintedPatterns.forEach((taint) => {
      assert.doesNotMatch(
        code,
        new RegExp(taint),
        `Component ${file} must NEVER reference tainted asset ${taint}`
      );
    });
  });
});
