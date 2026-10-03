/**
 * RUNNER BRIDGE UTILITY
 * Decodes, validates, and caps messages passed between React Native and the 3D Runner WebView.
 * Complies with AGENTS.md Server Capped Validation.
 */

const DEFAULT_CONFIG = require('../game/gameEconomy.config.cjs');

/**
 * Parses raw inbound message from WebView postMessage
 * @param {string|object} rawData
 * @returns {object|null} Validated and capped payload
 */
function parseRunnerMessage(rawData) {
  if (!rawData) return null;

  let payload = rawData;
  if (typeof rawData === 'string') {
    try {
      payload = JSON.parse(rawData);
    } catch (e) {
      return null;
    }
  }

  if (!payload || typeof payload !== 'object' || !payload.type) {
    return null;
  }

  const runnerCfg = DEFAULT_CONFIG.runnerGame || {};
  const maxBossDamage = runnerCfg.bossDamagePerRunMax || 20;
  const maxSavings = runnerCfg.maxSavingsPerRun || 50;
  const maxKnowledge = runnerCfg.maxKnowledgePerRun || 20;

  switch (payload.type) {
    case 'RUNNER_GAME_LOADED':
      return {
        type: 'RUNNER_GAME_LOADED',
        version: payload.version || '1.0',
        status: payload.status || 'ready'
      };

    case 'RUNNER_GAME_START':
      return {
        type: 'RUNNER_GAME_START',
        speed: Number(payload.speed) || runnerCfg.baseSpeed || 12.0
      };

    case 'RUNNER_SESSION_END': {
      const rawDistance = Math.max(0, Math.round(Number(payload.distance) || 0));
      const rawCoins = Math.max(0, Math.round(Number(payload.coins) || 0));
      const rawSavings = Math.max(0, Math.round(Number(payload.savingsPoints) || rawCoins));
      const rawKnowledge = Math.max(0, Math.round(Number(payload.knowledgePoints) || 0));
      const rawDamage = Math.max(0, Math.round(Number(payload.damageToBoss) || 0));
      const isStagePassed = Boolean(payload.isStagePassed);
      const ultimateSkillDamageCap = 60; // Max ultimate skill damage

      return {
        type: 'RUNNER_SESSION_END',
        distance: rawDistance,
        coins: rawCoins,
        savingsPoints: Math.min(maxSavings, rawSavings),
        knowledgePoints: Math.min(maxKnowledge, rawKnowledge),
        damageToBoss: isStagePassed ? Math.min(ultimateSkillDamageCap, rawDamage) : Math.min(maxBossDamage, rawDamage),
        isStagePassed: isStagePassed,
        hasUltimateSkill: Boolean(payload.hasUltimateSkill),
        collectedSkills: Array.isArray(payload.collectedSkills) ? payload.collectedSkills : [],
        reason: String(payload.reason || 'completed')
      };
    }

    case 'RUNNER_STAGE_CONTINUE':
      return {
        type: 'RUNNER_STAGE_CONTINUE',
        coins: Math.max(0, Math.round(Number(payload.coins) || 0)),
        isStagePassed: Boolean(payload.isStagePassed)
      };

    default:
      return null;
  }
}

/**
 * Creates outbound payload to initialize the runner game
 */
function createRunnerInitMessage(options = {}) {
  return JSON.stringify({
    type: 'START_RUNNER_GAME',
    targetBossHp: options.targetBossHp || 2000,
    userHabits: options.userHabits || {},
    ticketsRemaining: options.ticketsRemaining !== undefined ? options.ticketsRemaining : 3,
    chapterId: options.chapterId || 'chapter-1',
    hasShield: Boolean(options.hasShield),
    primaryObstacle: options.primaryObstacle || 'cup',
    quizGate: options.quizGate || null,
    speed: options.speed || undefined,
    stageConfig: options.stageConfig || undefined,
    ultimateSkill: options.ultimateSkill || undefined,
    runnerQuizzes: options.runnerQuizzes || undefined,
    targetCoins: options.targetCoins || 20
  });
}

module.exports = {
  parseRunnerMessage,
  createRunnerInitMessage
};
