const test = require('node:test');
const assert = require('node:assert/strict');
const { resolveApiBaseUrl } = require('../src/utils/apiBaseUrl.cjs');

test('development uses the Expo LAN host for the local backend', () => {
  assert.equal(
    resolveApiBaseUrl({
      configuredUrl: 'https://offline.example/api',
      hostUri: '192.168.1.20:8081',
      isDevelopment: true,
    }),
    'http://192.168.1.20:3000/api',
  );
});

test('development host resolution supports IPv6 addresses', () => {
  assert.equal(
    resolveApiBaseUrl({
      hostUri: '[::1]:8081',
      isDevelopment: true,
    }),
    'http://[::1]:3000/api',
  );
});

test('production uses the configured API endpoint', () => {
  assert.equal(
    resolveApiBaseUrl({
      configuredUrl: 'https://api.example/api',
      hostUri: '192.168.1.20:8081',
      isDevelopment: false,
    }),
    'https://api.example/api',
  );
});

test('missing development host falls back to configured endpoint', () => {
  assert.equal(
    resolveApiBaseUrl({
      configuredUrl: 'https://api.example/api',
      isDevelopment: true,
    }),
    'https://api.example/api',
  );
});

test('returns null when neither a development host nor endpoint is configured', () => {
  assert.equal(
    resolveApiBaseUrl({
      isDevelopment: false,
    }),
    null,
  );
});
