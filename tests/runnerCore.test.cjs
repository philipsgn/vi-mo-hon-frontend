const test = require('node:test');
const assert = require('node:assert/strict');
const runnerCore = require('../src/game/runnerCore.cjs');
const GAME_ECONOMY = require('../src/game/gameEconomy.config.cjs');

test('runnerCore - createInitialGameState initializes with safe center defaults', () => {
  const state = runnerCore.createInitialGameState();
  assert.equal(state.currentLane, 1);
  assert.equal(state.targetLane, 1);
  assert.equal(state.playerPos.x, 0);
  assert.equal(state.playerPos.y, 0);
  assert.equal(state.distance, 0);
  assert.equal(state.isGameOver, false);
  assert.equal(state.speed, GAME_ECONOMY.runnerGame.baseSpeed);
});

test('runnerCore - changeLane clamps within valid lane range (0 to 2)', () => {
  const state = runnerCore.createInitialGameState();

  // Starting at lane 1 (center)
  // Move left -> lane 0
  runnerCore.changeLane(state, 'left');
  assert.equal(state.targetLane, 0);

  // Move left again -> should clamp at lane 0
  runnerCore.changeLane(state, -1);
  assert.equal(state.targetLane, 0);

  // Move right -> lane 1
  runnerCore.changeLane(state, 'right');
  assert.equal(state.targetLane, 1);

  // Move right again -> lane 2
  runnerCore.changeLane(state, 1);
  assert.equal(state.targetLane, 2);

  // Move right again -> should clamp at lane 2
  runnerCore.changeLane(state, 'right');
  assert.equal(state.targetLane, 2);
});

test('runnerCore - jump triggers vertical velocity only when on ground', () => {
  const state = runnerCore.createInitialGameState();

  // Initial jump on ground
  const jumped = runnerCore.jump(state);
  assert.equal(jumped, true);
  assert.equal(state.isJumping, true);
  assert.ok(state.velocity.y > 0);

  // Consecutive jump in mid-air should be rejected
  const doubleJump = runnerCore.jump(state);
  assert.equal(doubleJump, false);
});

test('runnerCore - slide starts timer and cancels mid-air jump', () => {
  const state = runnerCore.createInitialGameState();

  // Mid-air jump
  runnerCore.jump(state);
  state.playerPos.y = 1.5;
  assert.equal(state.isJumping, true);

  // Slide while in mid-air should plunge to ground and activate slide
  const slid = runnerCore.slide(state);
  assert.equal(slid, true);
  assert.equal(state.isJumping, false);
  assert.equal(state.playerPos.y, 0);
  assert.equal(state.isSliding, true);
  assert.ok(state.slideTimeRemaining > 0);
});

test('runnerCore - stepPhysics advances distance, accelerates speed, and resolves jump', () => {
  const state = runnerCore.createInitialGameState();

  // Step 1 second
  runnerCore.stepPhysics(state, 1.0);
  assert.ok(state.distance >= 12.0);
  assert.ok(state.speed >= 12.0);

  // Test jump trajectory and landing
  runnerCore.jump(state);
  assert.equal(state.isJumping, true);

  // Advance by multiple small steps to simulate landing
  for (let i = 0; i < 60; i++) {
    runnerCore.stepPhysics(state, 1 / 60);
  }
  // Should land safely back on ground
  assert.equal(state.isJumping, false);
  assert.equal(state.playerPos.y, 0);
  assert.equal(state.velocity.y, 0);
});

test('runnerCore - checkAABBCollision detects overlapping bounding boxes accurately', () => {
  const playerBox = {
    minX: -0.5, maxX: 0.5,
    minY: 0,    maxY: 1.5,
    minZ: -0.5, maxZ: 0.5
  };

  const collidingBox = {
    minX: -0.2, maxX: 0.8,
    minY: 0,    maxY: 1.0,
    minZ: 0,    maxZ: 1.0
  };

  const farBox = {
    minX: 2.0, maxX: 3.0,
    minY: 0,   maxY: 1.0,
    minZ: 10,  maxZ: 12
  };

  assert.equal(runnerCore.checkAABBCollision(playerBox, collidingBox), true);
  assert.equal(runnerCore.checkAABBCollision(playerBox, farBox), false);
});

test('runnerCore - handleObstacleCollision uses shield first, then triggers game over', () => {
  const state = runnerCore.createInitialGameState();
  state.hasShield = true;

  // First collision absorbed by shield
  const result1 = runnerCore.handleObstacleCollision(state, 'shopee_box');
  assert.equal(result1.absorbed, true);
  assert.equal(result1.isGameOver, false);
  assert.equal(state.hasShield, false);
  assert.equal(state.isGameOver, false);

  // Second collision triggers game over
  const result2 = runnerCore.handleObstacleCollision(state, 'boba_cup');
  assert.equal(result2.absorbed, false);
  assert.equal(result2.isGameOver, true);
  assert.equal(state.isGameOver, true);
  assert.equal(state.gameOverReason, 'boba_cup');
});

test('runnerCore - calculateRunSummary enforces caps from GAME_ECONOMY', () => {
  const state = runnerCore.createInitialGameState();
  state.distance = 2500; // Large distance
  state.coins = 120;     // Excessive coins
  state.knowledgePoints = 45;

  const summary = runnerCore.calculateRunSummary(state);

  // Savings points capped at 50
  assert.equal(summary.savingsPoints, 50);
  // Knowledge points capped at 20
  assert.equal(summary.knowledgePoints, 20);
  // Boss damage capped at 20 HP
  assert.equal(summary.damageToBoss, 20);
  assert.equal(summary.coins, 120);
  assert.equal(summary.distance, 2500);
});

test('runnerCore - getPlayerBoundingBox scales down when sliding', () => {
  const uprightBox = runnerCore.getPlayerBoundingBox({ x: 0, y: 0, z: 0 }, false, false);
  assert.equal(uprightBox.maxY, 1.85);

  const slidingBox = runnerCore.getPlayerBoundingBox({ x: 0, y: 0, z: 0 }, true, false);
  assert.equal(slidingBox.maxY, 0.7);
  assert.ok(slidingBox.maxY < uprightBox.maxY);

  const jumpingBox = runnerCore.getPlayerBoundingBox({ x: 0, y: 1.2, z: 0 }, false, true);
  assert.equal(jumpingBox.minY, 1.2);
  assert.equal(jumpingBox.maxY, 1.2 + 1.85);
});

test('runnerCore - checkPlayerObstacleCollision handles jumping over Shopee box', () => {
  const shopeeObstacle = {
    type: 'SHOPEE_BOX',
    x: 0,
    z: -10
  };

  // Upright player at same position -> Collision!
  const standingState = {
    playerPos: { x: 0, y: 0, z: -10 },
    isSliding: false,
    isJumping: false
  };
  assert.equal(runnerCore.checkPlayerObstacleCollision(standingState, shopeeObstacle), true);

  // Jumping player at height 1.2m -> Jumps OVER Shopee box safely (box height = 0.9m)
  const jumpingState = {
    playerPos: { x: 0, y: 1.2, z: -10 },
    isSliding: false,
    isJumping: true
  };
  assert.equal(runnerCore.checkPlayerObstacleCollision(jumpingState, shopeeObstacle), false);

  // Player in different lane (x = 2.5) -> Safe!
  const sideState = {
    playerPos: { x: 2.5, y: 0, z: -10 },
    isSliding: false,
    isJumping: false
  };
  assert.equal(runnerCore.checkPlayerObstacleCollision(sideState, shopeeObstacle), false);
});

test('runnerCore - checkPlayerObstacleCollision handles sliding under Sale banner', () => {
  const saleObstacle = {
    type: 'SALE_BANNER',
    x: 0,
    z: -15
  };

  // Upright player running into sale banner -> Collision!
  const standingState = {
    playerPos: { x: 0, y: 0, z: -15 },
    isSliding: false,
    isJumping: false
  };
  assert.equal(runnerCore.checkPlayerObstacleCollision(standingState, saleObstacle), true);

  // Sliding player (max height 0.7m, banner ground clearance 0.85m) -> Ducks UNDER safely!
  const slidingState = {
    playerPos: { x: 0, y: 0, z: -15 },
    isSliding: true,
    isJumping: false
  };
  assert.equal(runnerCore.checkPlayerObstacleCollision(slidingState, saleObstacle), false);
});

test('runnerCore - calculateRunSummary attaches custom roast message for each temptation', () => {
  const stateShopee = runnerCore.createInitialGameState();
  stateShopee.gameOverReason = 'shopee_box';
  const summaryShopee = runnerCore.calculateRunSummary(stateShopee);
  assert.ok(summaryShopee.roastMessage.includes('Shopee'));

  const stateBoba = runnerCore.createInitialGameState();
  stateBoba.gameOverReason = 'boba_cup';
  const summaryBoba = runnerCore.calculateRunSummary(stateBoba);
  assert.ok(summaryBoba.roastMessage.includes('trà sữa'));

  const stateSale = runnerCore.createInitialGameState();
  stateSale.gameOverReason = 'sale_banner';
  const summarySale = runnerCore.calculateRunSummary(stateSale);
  assert.ok(summarySale.roastMessage.includes('Sale 50%'));
});

test('runnerCore - checkItemCollection detects proximity within pickup radius', () => {
  const playerPos = { x: 0, y: 0, z: -20 };
  const nearbyCoin = { x: 0.2, y: 0, z: -20.3 };
  const farCoin = { x: 2.5, y: 0, z: -20 };

  assert.equal(runnerCore.checkItemCollection(playerPos, nearbyCoin), true);
  assert.equal(runnerCore.checkItemCollection(playerPos, farCoin), false);
});

test('runnerCore - applyItemEffect handles coin, magnet, and shield appropriately', () => {
  const state = runnerCore.createInitialGameState();

  // Pick up coin
  runnerCore.applyItemEffect(state, 'coin');
  assert.equal(state.coins, 1);

  // Pick up magnet
  runnerCore.applyItemEffect(state, 'magnet');
  assert.equal(state.magnetTimeRemaining, 8.0);

  // Pick up shield
  runnerCore.applyItemEffect(state, 'shield');
  assert.equal(state.hasShield, true);
});

test('runnerCore - updateMagnetPull moves nearby coins towards player', () => {
  const playerPos = { x: 0, y: 0, z: -10 };
  const coin = { x: 2.5, y: 0, z: -10 };

  const initialDistance = Math.abs(coin.x - playerPos.x);
  const pulled = runnerCore.updateMagnetPull(playerPos, coin, 0.1, 14.0, 16.0);

  assert.equal(pulled, true);
  const newDistance = Math.abs(coin.x - playerPos.x);
  assert.ok(newDistance < initialDistance); // Coin moved closer!
});

test('runnerCore - evaluateQuizGate awards 5 knowledge points on correct lane', () => {
  const gate = runnerCore.FINANCIAL_QUIZZES[0]; // salary quiz: lane 0 is correct

  // Player chooses correct lane 0
  const resultCorrect = runnerCore.evaluateQuizGate(gate, 0);
  assert.equal(resultCorrect.isCorrect, true);
  assert.equal(resultCorrect.pointsAwarded, 5);
  assert.ok(resultCorrect.message.includes('CHÍNH XÁC'));

  // Player chooses incorrect lane 2
  const resultWrong = runnerCore.evaluateQuizGate(gate, 2);
  assert.equal(resultWrong.isCorrect, false);
  assert.equal(resultWrong.pointsAwarded, 0);
  assert.ok(resultWrong.message.includes('SAI'));
});
