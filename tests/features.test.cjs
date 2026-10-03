const test = require('node:test');
const assert = require('node:assert/strict');
const { FEATURE_FLAGS, isFeatureEnabled } = require('../src/config/features.cjs');

test('feature flags configuration has all expected upgrade keys', () => {
  const expectedKeys = [
    'USE_NEO_COACH',
    'USE_NEO_QUICK_EXP',
    'USE_NEO_HOME',
    'USE_NEO_BOSS',
    'USE_NEO_CHARACTER',
    'USE_NEO_PROFILE',
  ];

  for (const key of expectedKeys) {
    assert.equal(
      typeof FEATURE_FLAGS[key],
      'boolean',
      `Flag ${key} should be defined as a boolean`
    );
  }
});

test('isFeatureEnabled helper reads valid flags and handles unknown keys safely', () => {
  assert.equal(isFeatureEnabled('USE_NEO_COACH'), FEATURE_FLAGS.USE_NEO_COACH);
  assert.equal(isFeatureEnabled('NON_EXISTENT_FLAG'), false);
  assert.equal(isFeatureEnabled('NON_EXISTENT_FLAG', true), true);
});
