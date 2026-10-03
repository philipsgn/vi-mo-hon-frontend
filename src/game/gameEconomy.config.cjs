/**
 * GAME ECONOMY CONFIGURATION
 * Single source of truth for mini game parameters, speeds, rewards, and caps.
 * Derived from docs/GAME.md
 */

const GAME_ECONOMY = {
  tickets: {
    freeDailyMax: 3,
    premiumDailyMax: 5,
    earnRates: {
      dailyCheckin: 1,
      firstExpenseLogged: 1,
      impulseResisted: 1
    }
  },
  runnerGame: {
    lanes: [-2.5, 0, 2.5], // Lane X coordinates: 0 (Left), 1 (Center), 2 (Right)
    laneSwitchSpeed: 12.0,  // Interpolation speed between lanes
    baseSpeed: 12.0,        // Starting speed in meters/second
    speedIncrementPer100m: 0.5,
    maxSpeed: 24.0,
    jumpVelocity: 9.5,
    gravity: -26.0,
    slideDurationSec: 0.65,
    quizGateIntervalMeters: 300,
    bossDamagePerRunMax: 20,
    maxSavingsPerRun: 50,
    maxKnowledgePerRun: 20,
    roadTileLength: 20.0,
    roadTilesCount: 10,     // Total active pooled road segments
    maxObstaclesAlive: 20
  },
  boss: {
    vndToHpRatio: 1000,     // 1000đ = 1 HP
    maxGameDamagePercent: 10 // Max 10% of total boss HP can come from mini game
  },
  streak: {
    freezeStreakMonthlyLimit: 2,
    bonusMultiplier7Days: 1.5,
    bonusMultiplier30Days: 2.0
  }
};

module.exports = GAME_ECONOMY;
