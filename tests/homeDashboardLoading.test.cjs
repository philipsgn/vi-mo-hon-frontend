const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('home renders without the global dashboard loading spinner and label', () => {
  const appCode = fs.readFileSync(path.join(__dirname, '../App.js'), 'utf8');

  assert.doesNotMatch(appCode, /Đang tải dashboard/i);
  assert.doesNotMatch(appCode, /styles\.loadingRow/);
  assert.match(appCode, /const loadDashboard = useCallback/);
  assert.match(appCode, /setDashboard\(response\)/);
});
