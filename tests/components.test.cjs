const test = require('node:test');
const assert = require('node:assert/strict');

// Test helper math and styling rules
function clampProgress(progress) {
  return Math.max(0, Math.min(1, Number(progress) || 0));
}

function calculateHpPercentage(current, max) {
  if (!max || max <= 0) return 0;
  return clampProgress(current / max);
}

test('progress bar math correctly clamps values between 0 and 1', () => {
  assert.equal(clampProgress(0.65), 0.65);
  assert.equal(clampProgress(-0.5), 0);
  assert.equal(clampProgress(1.5), 1);
  assert.equal(clampProgress('invalid'), 0);
});

test('calculateHpPercentage handles healthy and defeated boss values', () => {
  assert.equal(calculateHpPercentage(6500, 10000), 0.65);
  assert.equal(calculateHpPercentage(0, 10000), 0);
  assert.equal(calculateHpPercentage(10000, 10000), 1);
  assert.equal(calculateHpPercentage(5000, 0), 0);
});
