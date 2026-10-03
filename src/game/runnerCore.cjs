/**
 * RUNNER CORE LOGIC MODULE
 * Pure JavaScript - 100% decoupled from DOM/WebGL for Node.js unit testing.
 * Complies with AGENTS.md Section 5: Autonomy First.
 */

const DEFAULT_CONFIG = require('./gameEconomy.config.cjs');

/**
 * Creates the initial game state
 * @param {object} config - Configuration object (defaults to GAME_ECONOMY.runnerGame)
 * @param {object} options - Initial custom options { targetBossHp, userHabits }
 */
function createInitialGameState(config = DEFAULT_CONFIG.runnerGame, options = {}) {
  const runnerCfg = config.runnerGame || config;
  return {
    currentLane: 1, // 0: Left (-2.5), 1: Center (0), 2: Right (2.5)
    targetLane: 1,
    playerPos: {
      x: runnerCfg.lanes ? runnerCfg.lanes[1] : 0,
      y: 0,
      z: 0
    },
    velocity: {
      y: 0
    },
    isJumping: false,
    isSliding: false,
    slideTimeRemaining: 0,
    speed: runnerCfg.baseSpeed || 12.0,
    distance: 0,
    coins: 0,
    knowledgePoints: 0,
    hasShield: false,
    magnetTimeRemaining: 0,
    isGameOver: false,
    gameOverReason: null,
    targetBossHp: options.targetBossHp || 2000,
    userHabits: options.userHabits || {}
  };
}

/**
 * Triggers a lane change
 * @param {object} state - Game state
 * @param {number|string} direction - -1 / 'left' or +1 / 'right'
 * @param {object} config - Runner config
 */
function changeLane(state, direction, config = DEFAULT_CONFIG.runnerGame) {
  if (state.isGameOver) return state.targetLane;
  const runnerCfg = config.runnerGame || config;
  const maxLane = (runnerCfg.lanes ? runnerCfg.lanes.length : 3) - 1;

  let delta = 0;
  if (direction === 'left' || direction === -1) {
    delta = -1;
  } else if (direction === 'right' || direction === 1) {
    delta = 1;
  }

  const nextLane = Math.max(0, Math.min(maxLane, state.targetLane + delta));
  state.targetLane = nextLane;
  return state.targetLane;
}

/**
 * Triggers jump action
 */
function jump(state, config = DEFAULT_CONFIG.runnerGame) {
  if (state.isGameOver) return false;
  const runnerCfg = config.runnerGame || config;

  // Can only jump if on ground
  if (state.playerPos.y <= 0.001 && !state.isJumping) {
    state.isJumping = true;
    state.isSliding = false; // Jumping cancels slide
    state.slideTimeRemaining = 0;
    state.velocity.y = runnerCfg.jumpVelocity || 9.5;
    return true;
  }
  return false;
}

/**
 * Triggers slide action
 */
function slide(state, config = DEFAULT_CONFIG.runnerGame) {
  if (state.isGameOver) return false;
  const runnerCfg = config.runnerGame || config;

  // If currently jumping, cancel jump immediately and plunge to ground
  if (state.isJumping) {
    state.playerPos.y = 0;
    state.velocity.y = 0;
    state.isJumping = false;
  }

  state.isSliding = true;
  state.slideTimeRemaining = runnerCfg.slideDurationSec || 0.65;
  return true;
}

/**
 * Steps physics forward by dt seconds
 */
function stepPhysics(state, dt, config = DEFAULT_CONFIG.runnerGame) {
  if (state.isGameOver) return state;
  const runnerCfg = config.runnerGame || config;

  // Break large dt into substeps for numerical stability
  const maxSubStep = 0.05;
  let remainingDt = Math.min(dt, 2.0); // Clamp absurd spikes

  while (remainingDt > 0) {
    const safeDt = Math.min(remainingDt, maxSubStep);
    remainingDt -= safeDt;

    // 1. Advance distance
    state.distance += state.speed * safeDt;

    // 2. Adjust speed based on distance curve
    const increment = ((state.distance / 100) * (runnerCfg.speedIncrementPer100m || 0.5));
    state.speed = Math.min(
      runnerCfg.maxSpeed || 24.0,
      (runnerCfg.baseSpeed || 12.0) + increment
    );

    // 3. Smooth lane transition
    const lanes = runnerCfg.lanes || [-2.5, 0, 2.5];
    const targetX = lanes[state.targetLane];
    const switchSpeed = runnerCfg.laneSwitchSpeed || 12.0;
    const diffX = targetX - state.playerPos.x;

    if (Math.abs(diffX) < 0.05) {
      state.playerPos.x = targetX;
      state.currentLane = state.targetLane;
    } else {
      state.playerPos.x += diffX * Math.min(1.0, switchSpeed * safeDt);
    }

    // 4. Jump physics
    if (state.isJumping) {
      state.playerPos.y += state.velocity.y * safeDt;
      state.velocity.y += (runnerCfg.gravity || -26.0) * safeDt;
      if (state.playerPos.y <= 0) {
        state.playerPos.y = 0;
        state.velocity.y = 0;
        state.isJumping = false;
      }
    }

    // 5. Slide timer
    if (state.isSliding) {
      state.slideTimeRemaining -= safeDt;
      if (state.slideTimeRemaining <= 0) {
        state.isSliding = false;
        state.slideTimeRemaining = 0;
      }
    }

    // 6. Magnet timer
    if (state.magnetTimeRemaining > 0) {
      state.magnetTimeRemaining = Math.max(0, state.magnetTimeRemaining - safeDt);
    }
  }

  return state;
}

/**
 * DEFINITIONS OF 3D TEMPTATION OBSTACLES
 * Low-poly procedural obstacles as defined in docs/GAME.md
 */
const OBSTACLE_TYPES = {
  SHOPEE_BOX: {
    id: 'shopee_box',
    name: 'Hộp Bưu Kiện Shopee',
    width: 1.2,
    height: 0.9,
    depth: 1.2,
    groundY: 0,
    canJumpOver: true,
    canSlideUnder: false
  },
  BOBA_CUP: {
    id: 'boba_cup',
    name: 'Cốc Trà Sữa Trân Châu',
    width: 1.3,
    height: 2.2,
    depth: 1.3,
    groundY: 0,
    canJumpOver: false,
    canSlideUnder: false
  },
  SALE_BANNER: {
    id: 'sale_banner',
    name: 'Biển Giảm Giá 50%',
    width: 2.3,
    height: 1.4,
    depth: 0.4,
    groundY: 0.85, // Clearance under banner is 0.85m -> Allows sliding!
    canJumpOver: false,
    canSlideUnder: true
  },
  FREESHIP_TRAP: {
    id: 'freeship_trap',
    name: 'Bẫy Freeship 0đ',
    width: 1.4,
    height: 1.1,
    depth: 1.1,
    groundY: 0.9,  // Hovering trap -> Allows sliding!
    canJumpOver: false,
    canSlideUnder: true
  }
};

const OBSTACLE_ROASTS = {
  shopee_box: 'Đơn Shopee nửa đêm đã bẫy được bạn! Cầm lòng đi người anh em!',
  boba_cup: 'Một ly trà sữa full topping đã tiễn chiếc ví ra đi trong đau đớn!',
  sale_banner: 'Bão Sale 50% nhưng ví tiền giảm 100%! Tỉnh táo lại nào!',
  freeship_trap: 'Bẫy Freeship 0đ nhưng mua hết cả nửa tháng lương đồ linh tinh!',
  default: 'Cám dỗ nhẹ một cái là ngã ngửa. Cần rèn luyện thêm kỷ luật thép!'
};

/**
 * Calculates current bounding box for the player
 */
function getPlayerBoundingBox(playerPos, isSliding = false, isJumping = false) {
  const halfW = 0.4;
  const posY = playerPos.y || 0;
  const posX = playerPos.x || 0;
  const posZ = playerPos.z || 0;

  if (isSliding) {
    // Slid down to ground: low profile (height 0.7m, longer depth)
    return {
      minX: posX - halfW,
      maxX: posX + halfW,
      minY: posY,
      maxY: posY + 0.7,
      minZ: posZ - 0.65,
      maxZ: posZ + 0.65
    };
  }

  // Upright or jumping player (height 1.85m)
  return {
    minX: posX - halfW,
    maxX: posX + halfW,
    minY: posY,
    maxY: posY + 1.85,
    minZ: posZ - 0.45,
    maxZ: posZ + 0.45
  };
}

/**
 * Calculates bounding box for an obstacle
 */
function getObstacleBoundingBox(obstacle) {
  const typeDef = OBSTACLE_TYPES[obstacle.type] || OBSTACLE_TYPES.SHOPEE_BOX;
  const posX = obstacle.x || 0;
  const posZ = obstacle.z || 0;
  const groundY = obstacle.groundY !== undefined ? obstacle.groundY : typeDef.groundY;
  const height = obstacle.height || typeDef.height;
  const halfW = (obstacle.width || typeDef.width) / 2;
  const halfD = (obstacle.depth || typeDef.depth) / 2;

  return {
    minX: posX - halfW,
    maxX: posX + halfW,
    minY: groundY,
    maxY: groundY + height,
    minZ: posZ - halfD,
    maxZ: posZ + halfD
  };
}

/**
 * Checks collision between player state and an obstacle
 */
function checkPlayerObstacleCollision(playerState, obstacle) {
  const playerBox = getPlayerBoundingBox(
    playerState.playerPos,
    playerState.isSliding,
    playerState.isJumping
  );
  const obstacleBox = getObstacleBoundingBox(obstacle);
  return checkAABBCollision(playerBox, obstacleBox);
}

/**
 * 3D AABB Collision Check
 * @param {object} a - { minX, maxX, minY, maxY, minZ, maxZ }
 * @param {object} b - { minX, maxX, minY, maxY, minZ, maxZ }
 */
function checkAABBCollision(a, b) {
  return (
    a.minX <= b.maxX &&
    a.maxX >= b.minX &&
    a.minY <= b.maxY &&
    a.maxY >= b.minY &&
    a.minZ <= b.maxZ &&
    a.maxZ >= b.minZ
  );
}

/**
 * Handles collision with an obstacle
 */
function handleObstacleCollision(state, obstacleType = 'shopee_box') {
  if (state.isGameOver) return { absorbed: false, isGameOver: true };

  // Shield absorbs one hit
  if (state.hasShield) {
    state.hasShield = false;
    return { absorbed: true, isGameOver: false };
  }

  state.isGameOver = true;
  state.gameOverReason = obstacleType;
  return { absorbed: false, isGameOver: true };
}

/**
 * Collects a coin
 */
function collectCoin(state, count = 1) {
  if (state.isGameOver) return state.coins;
  state.coins += count;
  return state.coins;
}

/**
 * Calculates end-of-run summary according to GAME_ECONOMY caps
 */
function calculateRunSummary(state, config = DEFAULT_CONFIG.runnerGame) {
  const runnerCfg = config.runnerGame || config;
  const maxSavings = runnerCfg.maxSavingsPerRun || 50;
  const maxKnowledge = runnerCfg.maxKnowledgePerRun || 20;
  const maxBossDamage = runnerCfg.bossDamagePerRunMax || 20;

  // Savings score is derived from coins collected (capped)
  const savingsPoints = Math.min(maxSavings, state.coins);

  // Knowledge points earned from quizzes (capped)
  const knowledgePoints = Math.min(maxKnowledge, state.knowledgePoints);

  // Boss damage is calculated from distance & coins (capped at 20 HP)
  const rawDamage = Math.floor(state.distance / 50) + Math.floor(state.coins / 3);
  const damageToBoss = Math.min(maxBossDamage, rawDamage);

  const roast = OBSTACLE_ROASTS[state.gameOverReason] || OBSTACLE_ROASTS.default;

  return {
    distance: Math.round(state.distance),
    coins: state.coins,
    savingsPoints,
    knowledgePoints,
    damageToBoss,
    gameOverReason: state.gameOverReason || 'completed',
    roastMessage: roast
  };
}

/**
 * DEFINITIONS OF POWER-UPS & COLLECTIBLES
 */
const ITEM_TYPES = {
  COIN: {
    id: 'coin',
    name: 'Đồng Xu Vàng',
    radius: 0.65,
    value: 1
  },
  MAGNET: {
    id: 'magnet',
    name: 'Nam Châm Kỷ Luật',
    radius: 0.8,
    durationSec: 8.0,
    pullRadius: 14.0,
    pullSpeed: 16.0
  },
  SHIELD: {
    id: 'shield',
    name: 'Khiên Chắn FOMO',
    radius: 0.8
  }
};

/**
 * CURATED FINANCIAL QUIZ BANK (Gen Z Context)
 */
const FINANCIAL_QUIZZES = [
  {
    id: 'quiz_salary',
    question: 'Lương vừa về tài khoản thì làm gì trước?',
    options: {
      0: { text: 'A: Trích 20% gửi tiết kiệm', isCorrect: true },
      2: { text: 'B: Săn sale Shopee hết nấc', isCorrect: false }
    },
    correctLane: 0,
    explanation: 'Quy tắc "Trả cho mình trước" giúp bạn không bao giờ rỗng túi cuối tháng!'
  },
  {
    id: 'quiz_emergency',
    question: 'Quỹ khẩn cấp chuẩn nên có bao nhiêu tiền?',
    options: {
      0: { text: 'A: 0đ, lúc cần xin phụ huynh', isCorrect: false },
      2: { text: 'B: 3 đến 6 tháng chi phí sống', isCorrect: true }
    },
    correctLane: 2,
    explanation: 'Quỹ 3-6 tháng giúp bạn bình tâm trước mọi biến cố bất ngờ.'
  },
  {
    id: 'quiz_credit',
    question: 'Dùng thẻ tín dụng như thế nào là thông minh?',
    options: {
      0: { text: 'A: Trả nợ 100% đúng hạn', isCorrect: true },
      2: { text: 'B: Rút tiền mặt tiêu xài', isCorrect: false }
    },
    correctLane: 0,
    explanation: 'Trả nợ đúng hạn để hưởng 0% lãi và tích điểm uy tín!'
  },
  {
    id: 'quiz_sale',
    question: 'Món đồ giảm 50% nhưng bạn không cần thì tiết kiệm được bao nhiêu?',
    options: {
      0: { text: 'A: Tiết kiệm được 50%', isCorrect: false },
      2: { text: 'B: Tiết kiệm được 0đ (vẫn mất tiền)', isCorrect: true }
    },
    correctLane: 2,
    explanation: 'Không mua món đồ không cần = Tiết kiệm 100% tiền trong ví!'
  }
];

/**
 * Checks if player collects an item
 */
function checkItemCollection(playerPos, item, pickupRadius = 0.85) {
  const dx = (playerPos.x || 0) - (item.x || 0);
  const dy = (playerPos.y || 0) - (item.y || 0);
  const dz = (playerPos.z || 0) - (item.z || 0);
  const distSq = dx * dx + dy * dy + dz * dz;
  return distSq <= pickupRadius * pickupRadius;
}

/**
 * Applies item effect to game state
 */
function applyItemEffect(state, itemType, config = DEFAULT_CONFIG.runnerGame) {
  if (state.isGameOver) return state;

  if (itemType === 'coin' || itemType === ITEM_TYPES.COIN.id) {
    state.coins += 1;
    return { type: 'coin', coins: state.coins };
  }

  if (itemType === 'magnet' || itemType === ITEM_TYPES.MAGNET.id) {
    state.magnetTimeRemaining = ITEM_TYPES.MAGNET.durationSec;
    return { type: 'magnet', duration: state.magnetTimeRemaining };
  }

  if (itemType === 'shield' || itemType === ITEM_TYPES.SHIELD.id) {
    state.hasShield = true;
    return { type: 'shield', active: true };
  }

  return null;
}

/**
 * Pulls coin towards player if magnet is active
 */
function updateMagnetPull(playerPos, coin, dt, magnetRange = 14.0, pullSpeed = 16.0) {
  const dx = playerPos.x - coin.x;
  const dy = (playerPos.y + 0.8) - coin.y;
  const dz = playerPos.z - coin.z;
  const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

  if (dist < magnetRange && dist > 0.05) {
    const moveDist = Math.min(dist, pullSpeed * dt);
    coin.x += (dx / dist) * moveDist;
    coin.y += (dy / dist) * moveDist;
    coin.z += (dz / dist) * moveDist;
    return true;
  }
  return false;
}

/**
 * Evaluates player choice when passing through a Quiz Gate
 */
function evaluateQuizGate(gate, playerLane) {
  const isCorrect = (playerLane === gate.correctLane);
  const points = isCorrect ? 5 : 0;
  return {
    isCorrect,
    pointsAwarded: points,
    explanation: gate.explanation,
    message: isCorrect ? 'CHÍNH XÁC! +5 ĐIỂM KIẾN THỨC' : 'SAI RỒI! CẦN TỈNH TÁO HƠN!'
  };
}

module.exports = {
  OBSTACLE_TYPES,
  OBSTACLE_ROASTS,
  ITEM_TYPES,
  FINANCIAL_QUIZZES,
  createInitialGameState,
  changeLane,
  jump,
  slide,
  stepPhysics,
  getPlayerBoundingBox,
  getObstacleBoundingBox,
  checkPlayerObstacleCollision,
  checkAABBCollision,
  handleObstacleCollision,
  collectCoin,
  calculateRunSummary,
  checkItemCollection,
  applyItemEffect,
  updateMagnetPull,
  evaluateQuizGate
};
