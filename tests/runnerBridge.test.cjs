const test = require('node:test');
const assert = require('node:assert/strict');
const runnerBridge = require('../src/utils/runnerBridge.cjs');

test('runnerBridge - parseRunnerMessage handles null or invalid JSON string safely', () => {
  assert.equal(runnerBridge.parseRunnerMessage(null), null);
  assert.equal(runnerBridge.parseRunnerMessage(''), null);
  assert.equal(runnerBridge.parseRunnerMessage('{bad_json'), null);
  assert.equal(runnerBridge.parseRunnerMessage({}), null);
  assert.equal(runnerBridge.parseRunnerMessage({ type: 'UNKNOWN_EVENT' }), null);
});

test('runnerBridge - parseRunnerMessage parses RUNNER_GAME_LOADED properly', () => {
  const msg = JSON.stringify({ type: 'RUNNER_GAME_LOADED', version: '2.0', status: 'ready' });
  const parsed = runnerBridge.parseRunnerMessage(msg);

  assert.equal(parsed.type, 'RUNNER_GAME_LOADED');
  assert.equal(parsed.version, '2.0');
  assert.equal(parsed.status, 'ready');
});

test('runnerBridge - parseRunnerMessage parses RUNNER_SESSION_END and enforces security caps', () => {
  // Excessive numbers that must be capped
  const excessivePayload = JSON.stringify({
    type: 'RUNNER_SESSION_END',
    distance: 4500.8,
    coins: 200,
    savingsPoints: 200, // Cap is 50
    knowledgePoints: 100, // Cap is 20
    damageToBoss: 9999, // Cap is 20
    reason: 'shopee_box'
  });

  const parsed = runnerBridge.parseRunnerMessage(excessivePayload);

  assert.equal(parsed.type, 'RUNNER_SESSION_END');
  assert.equal(parsed.distance, 4501);
  assert.equal(parsed.coins, 200);
  // Checked against caps
  assert.equal(parsed.savingsPoints, 50);
  assert.equal(parsed.knowledgePoints, 20);
  assert.equal(parsed.damageToBoss, 20);
  assert.equal(parsed.reason, 'shopee_box');
});

test('runnerBridge - createRunnerInitMessage formats outbound JSON payload', () => {
  const jsonStr = runnerBridge.createRunnerInitMessage({
    targetBossHp: 3500,
    ticketsRemaining: 2
  });

  const obj = JSON.parse(jsonStr);
  assert.equal(obj.type, 'START_RUNNER_GAME');
  assert.equal(obj.targetBossHp, 3500);
  assert.equal(obj.ticketsRemaining, 2);
});
