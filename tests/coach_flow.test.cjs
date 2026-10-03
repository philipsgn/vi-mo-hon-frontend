const test = require('node:test');
const assert = require('node:assert/strict');
const {
  calculateEquivalents,
  getOfflineCoachVerdict,
  PHO_AVERAGE_PRICE,
  PART_TIME_HOURLY_WAGE,
} = require('../src/utils/coachHelper.cjs');

test('calculateEquivalents converts VND amount to pho bowls and work hours accurately', () => {
  const result = calculateEquivalents(70000);
  assert.equal(result.phoCount, 2);
  assert.equal(result.workHours, 2.8);
  assert.match(result.readableSummary, /2 bát phở/);
  assert.match(result.readableSummary, /2.8 giờ cày việc/);
});

test('calculateEquivalents handles 0 and negative values safely', () => {
  const zeroResult = calculateEquivalents(0);
  assert.equal(zeroResult.phoCount, 0);
  assert.equal(zeroResult.workHours, 0);

  const invalidResult = calculateEquivalents('abc');
  assert.equal(invalidResult.phoCount, 0);
});

test('getOfflineCoachVerdict generates sharp Gen Z roast copy', () => {
  const roast = getOfflineCoachVerdict('Trà sữa full topping', 60000, 'roast');
  assert.match(roast, /Trà sữa full topping/);
  assert.match(roast, /nhịn ngay đi con sen/i);
});

test('getOfflineCoachVerdict generates gentle encouragement copy', () => {
  const gentle = getOfflineCoachVerdict('Áo hoodie', 350000, 'gentle');
  assert.match(gentle, /Áo hoodie/);
  assert.match(gentle, /hoãn mua 24 giờ/i);
});
