const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('LoginScreen: component source file contains entry button, code 1234, and retroTokens', () => {
  const code = fs.readFileSync(path.join(__dirname, '../src/screens/LoginScreen.js'), 'utf8');
  assert.ok(code.includes('VÀO TRANG CHỦ'), 'LoginScreen must include entry button');
  assert.ok(code.includes('1234'), 'LoginScreen must reference code 1234');
  assert.ok(code.includes('HARDCODED_USER'), 'LoginScreen must define HARDCODED_USER');
  assert.ok(code.includes('user_1234'), 'LoginScreen must define user_1234');
  assert.ok(code.includes('retroTokens'), 'LoginScreen must use retroTokens');
});

test('LoginScreen: supports Đăng Ký Mới tab and age confirmation', () => {
  const code = fs.readFileSync(path.join(__dirname, '../src/screens/LoginScreen.js'), 'utf8');
  assert.ok(code.includes('ĐĂNG KÝ MỚI'), 'LoginScreen must have ĐĂNG KÝ MỚI tab');
  assert.ok(code.includes('TẠO TÀI KHOẢN MỚI'), 'LoginScreen must support new account creation');
  assert.ok(code.includes('16 tuổi'), 'LoginScreen must confirm 16+ age compliance');
});

test('ProfileScreenNeo: has Logout button and onLogout handler', () => {
  const profileCode = fs.readFileSync(path.join(__dirname, '../src/screens/ProfileScreenNeo.js'), 'utf8');
  assert.ok(profileCode.includes('Đăng xuất khỏi tài khoản'), 'ProfileScreenNeo must have Logout button');
  assert.ok(profileCode.includes('onLogout'), 'ProfileScreenNeo must call onLogout');
});

test('LoginScreen: App.js renders LoginScreen when !isAuthenticated and passes onLogout', () => {
  const appCode = fs.readFileSync(path.join(__dirname, '../App.js'), 'utf8');
  assert.ok(appCode.includes('LoginScreen'), 'App.js must import LoginScreen');
  assert.ok(appCode.includes('!isAuthenticated'), 'App.js must check !isAuthenticated to show LoginScreen');
  assert.ok(appCode.includes('setIsAuthenticated(false)'), 'App.js must handle logout by resetting isAuthenticated');
});
