const test = require('node:test');
const assert = require('node:assert/strict');
const {
  neoColors,
  neoBorders,
  neoShadows,
  neoRadii,
  neoSpacing,
} = require('../src/design-system/tokens.cjs');

test('tokens exports essential neo-brutalism high contrast colors', () => {
  assert.equal(neoColors.black, '#121212');
  assert.equal(neoColors.yellow, '#FFE600');
  assert.equal(neoColors.mint, '#00F0FF');
  assert.equal(neoColors.coral, '#FF5C5C');
  assert.equal(neoColors.purple, '#B388FF');
  assert.equal(neoColors.lime, '#C6FF00');
});

test('tokens defines crisp borders with 2px to 4px thickness', () => {
  assert.equal(neoBorders.default, 2);
  assert.equal(neoBorders.thick, 3);
  assert.equal(neoBorders.hero, 4);
});

test('tokens defines hard drop-shadows with zero blur radius', () => {
  assert.equal(neoShadows.default.shadowRadius, 0);
  assert.equal(neoShadows.card.shadowRadius, 0);
  assert.equal(neoShadows.default.shadowOpacity, 1);
  assert.equal(neoShadows.default.shadowColor, '#121212');
  assert.deepEqual(neoShadows.default.shadowOffset, { width: 3, height: 3 });
});

test('tokens defines proper spacing and border radii', () => {
  assert.equal(neoRadii.sm, 6);
  assert.equal(neoRadii.md, 8);
  assert.equal(neoRadii.lg, 12);
  assert.equal(neoSpacing.md, 12);
  assert.equal(neoSpacing.lg, 16);
});
