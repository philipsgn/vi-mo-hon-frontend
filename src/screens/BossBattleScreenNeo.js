import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, StatusBar } from 'react-native';
import { COLORS, BORDER_WIDTHS, SHADOWS, SPACING, RADII, TYPOGRAPHY } from '../design-system/tokens';
import { parseBattleMessage, createBattleInitMessage } from '../utils/bossBattleBridge.cjs';
import { getSkillsByChapter } from '../utils/ultimateSkills.cjs';
import { BOSS_BATTLE_HTML } from '../assets/bossBattleHtml';

// Dynamic import for WebView on native only to avoid web bundle breaks
let WebView = null;
if (Platform.OS !== 'web') {
  try {
    WebView = require('react-native-webview').WebView;
  } catch (e) {
    console.warn('react-native-webview could not be loaded:', e);
  }
}

/**
 * BossBattleScreenNeo: 3D Boss Battle Arena Screen (Game 2)
 * Embeds Three.js WebGL arena via WebView (native) or iframe (web)
 * Handles 2-way postMessage communication for turn-based RPG combat.
 */
export default function BossBattleScreenNeo({
  onClose,
  chapter = {
    id: 'chapter-1',
    title: 'Chương 1: Trà Sữa',
    bossName: 'Quái Vật Trà Sữa',
    bossIcon: '🧋',
    maxHp: 100,
    bossAttack: 18
  },
  avatarId = 'cat',
  userSkills = [],
  onFinishBattle
}) {
  const webViewRef = useRef(null);
  const [battleResult, setBattleResult] = useState(null);

  // Compute equipped skills (fallback to default chapter skills if user has none)
  const availableChapterSkills = getSkillsByChapter(chapter.id);
  const fallbackSkillIds = availableChapterSkills.map(s => s.id);
  const equippedSkills = (userSkills && userSkills.length > 0)
    ? userSkills.slice(0, 3)
    : fallbackSkillIds.slice(0, 3);

  // Handle messages in Web environment
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleWebMessage = (event) => {
        const parsed = parseBattleMessage(event.data);
        if (!parsed) return;

        if (parsed.type === 'BATTLE_LOADED') {
          const initPayload = createBattleInitMessage({
            chapterId: chapter.id,
            avatarId,
            bossHp: chapter.maxHp || 100,
            bossAttack: chapter.bossAttack || 18,
            bossName: chapter.bossName,
            bossIcon: chapter.bossIcon,
            equippedSkills
          });
          if (event.source && event.source.postMessage) {
            event.source.postMessage(initPayload, '*');
          }
        } else if (parsed.type === 'BATTLE_END') {
          setBattleResult(parsed);
          if (onFinishBattle) {
            onFinishBattle(parsed);
          }
        } else if (parsed.type === 'BATTLE_EXIT') {
          if (onClose) onClose();
        }
      };

      window.addEventListener('message', handleWebMessage);
      return () => window.removeEventListener('message', handleWebMessage);
    }
  }, [chapter, avatarId, equippedSkills, onFinishBattle, onClose]);

  const handleNativeMessage = (event) => {
    const rawData = event.nativeEvent ? event.nativeEvent.data : null;
    const parsed = parseBattleMessage(rawData);
    if (!parsed) return;

    if (parsed.type === 'BATTLE_LOADED' && webViewRef.current) {
      const initPayload = createBattleInitMessage({
        chapterId: chapter.id,
        avatarId,
        bossHp: chapter.maxHp || 100,
        bossAttack: chapter.bossAttack || 18,
        bossName: chapter.bossName,
        bossIcon: chapter.bossIcon,
        equippedSkills
      });
      webViewRef.current.postMessage(initPayload);
    } else if (parsed.type === 'BATTLE_END') {
      setBattleResult(parsed);
      if (onFinishBattle) {
        onFinishBattle(parsed);
      }
    } else if (parsed.type === 'BATTLE_EXIT') {
      if (onClose) onClose();
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="light-content" translucent={true} backgroundColor="#0a0f1d" />
      {/* Neo-Brutalist Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <Text style={styles.backBtnText}>◀ RÚT LUI</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>⚔️ ĐẤU TRƯỜNG BOSS 3D</Text>
          <Text style={styles.headerSubtitle}>
            {chapter.bossIcon} {chapter.bossName} • {chapter.maxHp || 100} HP
          </Text>
        </View>

        <View style={styles.modeBadge}>
          <Text style={styles.modeBadgeText}>RPG 3D</Text>
        </View>
      </View>

      {/* 3D WebGL Canvas Container */}
      <View style={styles.canvasContainer}>
        {Platform.OS === 'web' ? (
          <iframe
            srcDoc={BOSS_BATTLE_HTML}
            title="3D Boss Battle Arena Game"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              backgroundColor: '#0a0f1d'
            }}
          />
        ) : WebView ? (
          <WebView
            ref={webViewRef}
            source={{ html: BOSS_BATTLE_HTML, baseUrl: '' }}
            style={{ flex: 1, backgroundColor: '#0a0f1d' }}
            onMessage={handleNativeMessage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            originWhitelist={['*']}
            mixedContentMode="always"
            allowFileAccess={true}
            scrollEnabled={false}
            bounces={false}
          />
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>WebView không khả dụng trên nền tảng này.</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#0a0f1d',
    paddingTop: Platform.OS === 'ios' ? 48 : StatusBar.currentHeight || 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: BORDER_WIDTHS.thick,
    borderBottomColor: COLORS.black,
    ...SHADOWS.hardSm
  },
  backBtn: {
    backgroundColor: COLORS.yellow,
    borderWidth: BORDER_WIDTHS.standard,
    borderColor: COLORS.black,
    borderRadius: RADII.sm,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs + 2,
    ...SHADOWS.hardSm
  },
  backBtnText: {
    ...TYPOGRAPHY.label,
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.black
  },
  headerCenter: {
    alignItems: 'center'
  },
  headerTitle: {
    ...TYPOGRAPHY.label,
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.black,
    letterSpacing: 0.5
  },
  headerSubtitle: {
    ...TYPOGRAPHY.caption,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.gray600
  },
  modeBadge: {
    backgroundColor: COLORS.coral,
    borderWidth: BORDER_WIDTHS.standard,
    borderColor: COLORS.black,
    borderRadius: RADII.pill,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    ...SHADOWS.hardSm
  },
  modeBadgeText: {
    ...TYPOGRAPHY.label,
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.white
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: '#0a0f1d'
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg
  },
  errorText: {
    ...TYPOGRAPHY.body,
    color: COLORS.white,
    textAlign: 'center'
  }
});
