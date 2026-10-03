const { test } = require('node:test');
const assert = require('node:assert/strict');
const {
  isValidPin,
  normalizeUsername,
  parseAccounts,
  findAccountByUsername,
  findAccountById,
  verifyCredentials,
  registerAccountInList,
} = require('../src/services/authService.cjs');

test('authService: isValidPin accepts only 4-6 digit numeric strings', () => {
  assert.equal(isValidPin('1234'), true);
  assert.equal(isValidPin('0000'), true);
  assert.equal(isValidPin('123456'), true);
  assert.equal(isValidPin('123'), false, 'Too short');
  assert.equal(isValidPin('1234567'), false, 'Too long');
  assert.equal(isValidPin('abcd'), false, 'Non-numeric');
  assert.equal(isValidPin(null), false);
});

test('authService: normalizeUsername trims and lowercases for reliable matching', () => {
  assert.equal(normalizeUsername('  Minh Anh  '), 'minh anh');
  assert.equal(normalizeUsername('ALEX'), 'alex');
});

test('authService: registerAccountInList adds and updates user accounts with custom PIN', () => {
  let accounts = [];

  // Register User A with PIN 2580
  const resA = registerAccountInList(accounts, {
    name: 'Người dùng A',
    pin: '2580',
  });
  accounts = resA.accounts;
  assert.equal(accounts.length, 1);
  assert.equal(accounts[0].name, 'Người dùng A');
  assert.equal(accounts[0].pin, '2580');

  // Register User B with PIN 9999
  const resB = registerAccountInList(accounts, {
    name: 'Người dùng B',
    pin: '9999',
  });
  accounts = resB.accounts;
  assert.equal(accounts.length, 2);
  assert.equal(accounts[1].name, 'Người dùng B');
  assert.equal(accounts[1].pin, '9999');
});

test('authService: verifyCredentials enforces exact PIN matching per user', () => {
  const accounts = [
    { id: 'user_1', name: 'Minh Anh', pin: '2580' },
    { id: 'user_2', name: 'Quốc Bảo', pin: '9999' },
  ];

  // User 1 with correct PIN
  const auth1 = verifyCredentials(accounts, 'Minh Anh', '2580');
  assert.equal(auth1.success, true);
  assert.equal(auth1.account.id, 'user_1');

  // User 1 with wrong PIN
  const authWrongPin = verifyCredentials(accounts, 'Minh Anh', '1234');
  assert.equal(authWrongPin.success, false);
  assert.match(authWrongPin.error, /Mã PIN không chính xác/);

  // User 2 with correct PIN
  const auth2 = verifyCredentials(accounts, 'quốc bảo', '9999');
  assert.equal(auth2.success, true);
  assert.equal(auth2.account.id, 'user_2');

  // User 2 with User 1's PIN
  const authCrossPin = verifyCredentials(accounts, 'Quốc Bảo', '2580');
  assert.equal(authCrossPin.success, false);

  // Non-existent user
  const authNonExistent = verifyCredentials(accounts, 'Người Lạ', '1234');
  assert.equal(authNonExistent.success, false);
  assert.match(authNonExistent.error, /chưa tồn tại/);
});
