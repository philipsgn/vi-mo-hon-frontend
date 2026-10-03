/**
 * BOSS BATTLE BRIDGE UTILITY
 * Decodes, validates, and caps messages passed between React Native and the 3D Boss Battle Arena WebView.
 * Complies with AGENTS.md Server Capped Validation.
 */

/**
 * Parses raw inbound message from WebView postMessage
 * @param {string|object} rawData
 * @returns {object|null} Validated and capped payload
 */
function parseBattleMessage(rawData) {
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

  switch (payload.type) {
    case 'BATTLE_LOADED':
      return {
        type: 'BATTLE_LOADED',
        version: payload.version || '1.0',
        status: payload.status || 'ready'
      };

    case 'BATTLE_ACTION':
      return {
        type: 'BATTLE_ACTION',
        actor: payload.actor === 'boss' ? 'boss' : 'player',
        skillId: payload.skillId ? String(payload.skillId) : null,
        damageDealt: Math.max(0, Math.round(Number(payload.damageDealt) || 0)),
        isCritical: Boolean(payload.isCritical),
        bossHpLeft: Math.max(0, Math.round(Number(payload.bossHpLeft) || 0)),
        playerHpLeft: Math.max(0, Math.round(Number(payload.playerHpLeft) || 0))
      };

    case 'BATTLE_END': {
      const isVictory = payload.result === 'victory';
      const rawTurns = Math.max(1, Math.round(Number(payload.turnsTaken) || 1));
      const rawDamage = Math.max(0, Math.round(Number(payload.damageDealtTotal) || 0));
      // Max boss damage allowed in a battle session: 300 HP cap
      const cappedDamage = Math.min(300, rawDamage);

      return {
        type: 'BATTLE_END',
        result: isVictory ? 'victory' : 'defeat',
        turnsTaken: rawTurns,
        damageDealtTotal: cappedDamage,
        bossHpRemaining: Math.max(0, Math.round(Number(payload.bossHpRemaining) || 0)),
        playerHpRemaining: Math.max(0, Math.round(Number(payload.playerHpRemaining) || 0))
      };
    }

    case 'BATTLE_EXIT':
      return {
        type: 'BATTLE_EXIT',
        reason: String(payload.reason || 'manual')
      };

    default:
      return null;
  }
}

/**
 * Creates outbound payload to initialize the 3D Boss Battle Arena
 * @param {object} options
 * @returns {string} JSON string
 */
function createBattleInitMessage(options = {}) {
  return JSON.stringify({
    type: 'START_BATTLE',
    chapterId: options.chapterId || 'chapter-1',
    avatarId: options.avatarId || 'cat',
    bossHp: options.bossHp || 100,
    bossAttack: options.bossAttack || 18,
    bossName: options.bossName || 'Bà Trùm Trà Sữa Size L',
    bossIcon: options.bossIcon || '🧋',
    equippedSkills: Array.isArray(options.equippedSkills) && options.equippedSkills.length > 0
      ? options.equippedSkills
      : ['water_splash', 'cold_tumbler', 'freeze_delay']
  });
}

module.exports = {
  parseBattleMessage,
  createBattleInitMessage
};
