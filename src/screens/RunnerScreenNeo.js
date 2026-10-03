import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, StatusBar } from 'react-native';
import { COLORS, BORDER_WIDTHS, SHADOWS, SPACING, RADII, TYPOGRAPHY } from '../design-system/tokens';
import { parseRunnerMessage, createRunnerInitMessage } from '../utils/runnerBridge.cjs';
import { RUNNER_GAME_HTML, RUNNER_GAME_BUILD_ID } from '../assets/runnerGameHtml';
import { QuizFallbackScreen } from './QuizFallbackScreen';
import { CHAPTER_1_LESSONS } from '../data/chapter1Lessons';

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
 * RunnerScreenNeo: 3D Endless Runner Game Screen
 * Embeds Three.js WebGL runner via WebView (native) or iframe (web)
 * Handles 2-way postMessage communication for game lifecycle & rewards.
 */
export default function RunnerScreenNeo({
  onClose,
  targetBoss = { name: 'Quái Vật Trà Sữa', currentHp: 2000, totalHp: 2000 },
  userHabits = {},
  ticketsRemaining = 3,
  onFinishRun,
  chapterId = 'chapter-1',
  hasShield = false,
  runnerConfig = null,
  stageConfig = null,
  ultimateSkill = null,
  runnerQuizzes = null
}) {
  const webViewRef = useRef(null);
  const [runnerReady, setRunnerReady] = useState(false);
  const [receivedBuildId, setReceivedBuildId] = useState(null);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [loadErrorMessage, setLoadErrorMessage] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [showTextFallback, setShowTextFallback] = useState(false);

  const effectiveQuizzes = runnerQuizzes || runnerConfig?.runnerQuizzes || CHAPTER_1_LESSONS.map((l) => ({
    ...l.quiz,
    lessonTitle: l.title,
  }));

  // Fallback Handshake timeout: if after 6s game didn't report RUNNER_GAME_LOADED
  useEffect(() => {
    if (runnerReady) return;
    const timer = setTimeout(() => {
      if (!runnerReady) {
        console.warn('[RunnerScreenNeo] Handshake timeout: 3D game engine did not signal RUNNER_GAME_LOADED within 6s');
        setHasLoadError(true);
        setLoadErrorMessage('Không nhận được phản hồi sẵn sàng từ WebGL sau 6 giây.');
      }
    }, 6000);
    return () => clearTimeout(timer);
  }, [runnerReady, reloadKey]);

  // Handle messages in Web environment
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleWebMessage = (event) => {
        const rawData = event.data;
        if (!rawData) return;

        try {
          const parsedTelemetry = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
          if (parsedTelemetry.type && parsedTelemetry.type.startsWith('TELEMETRY_')) {
            if (__DEV__) console.log('[RunnerTele Web]', parsedTelemetry.type, parsedTelemetry);
            return;
          }
        } catch (e) {}

        const parsed = parseRunnerMessage(rawData);
        if (!parsed) return;

        if (parsed.type === 'RUNNER_GAME_LOADED') {
          setRunnerReady(true);
          setHasLoadError(false);
          if (parsed.buildId) setReceivedBuildId(parsed.buildId);

          const initPayload = createRunnerInitMessage({
            targetBossHp: targetBoss.currentHp,
            userHabits,
            ticketsRemaining,
            chapterId,
            hasShield,
            primaryObstacle: runnerConfig?.primaryObstacle,
            quizGate: runnerConfig?.quizGate,
            speed: runnerConfig?.speed,
            stageConfig: stageConfig || runnerConfig?.stageConfig,
            ultimateSkill: ultimateSkill,
            runnerQuizzes: effectiveQuizzes,
            targetCoins: 20
          });
          if (event.source && event.source.postMessage) {
            event.source.postMessage(initPayload, '*');
          }
        } else if (parsed.type === 'RUNNER_SESSION_END' || parsed.type === 'RUNNER_STAGE_CONTINUE') {
          if (onFinishRun) {
            onFinishRun(parsed);
          }
        }
      };

      window.addEventListener('message', handleWebMessage);
      return () => window.removeEventListener('message', handleWebMessage);
    }
  }, [targetBoss, userHabits, ticketsRemaining, onFinishRun, chapterId, hasShield, runnerConfig, stageConfig, ultimateSkill, runnerQuizzes, effectiveQuizzes, reloadKey]);

  const handleNativeMessage = (event) => {
    const rawData = event.nativeEvent ? event.nativeEvent.data : null;
    if (!rawData) return;

    try {
      const parsedTelemetry = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
      if (parsedTelemetry.type && parsedTelemetry.type.startsWith('TELEMETRY_')) {
        if (__DEV__) console.log('[RunnerTele Native]', parsedTelemetry.type, parsedTelemetry);
        return;
      }
    } catch (e) {}

    const parsed = parseRunnerMessage(rawData);
    if (!parsed) return;

    if (parsed.type === 'RUNNER_GAME_LOADED') {
      setRunnerReady(true);
      setHasLoadError(false);
      if (parsed.buildId) {
        setReceivedBuildId(parsed.buildId);
        console.log(`[RunnerScreenNeo] Handshake READY with BUILD_ID: ${parsed.buildId} (Target: ${RUNNER_GAME_BUILD_ID})`);
      }
      if (webViewRef.current) {
        const initPayload = createRunnerInitMessage({
          targetBossHp: targetBoss.currentHp,
          userHabits,
          ticketsRemaining,
          chapterId,
          hasShield,
          primaryObstacle: runnerConfig?.primaryObstacle,
          quizGate: runnerConfig?.quizGate,
          speed: runnerConfig?.speed,
          stageConfig: stageConfig || runnerConfig?.stageConfig,
          ultimateSkill: ultimateSkill,
          runnerQuizzes: effectiveQuizzes,
          targetCoins: 20
        });
        webViewRef.current.postMessage(initPayload);
      }
    } else if (parsed.type === 'RUNNER_SESSION_END' || parsed.type === 'RUNNER_STAGE_CONTINUE') {
      if (onFinishRun) {
        onFinishRun(parsed);
      }
    }
  };

  const handleRetry = () => {
    setHasLoadError(false);
    setRunnerReady(false);
    setReloadKey(prev => prev + 1);
  };

  if (showTextFallback) {
    return (
      <QuizFallbackScreen
        quizzes={effectiveQuizzes}
        onClose={onClose}
        onComplete={(result) => {
          if (onFinishRun) onFinishRun(result);
        }}
      />
    );
  }

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="light-content" translucent={true} backgroundColor="#0f172a" />
      {/* Neo-Brutalist Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <Text style={styles.backBtnText}>◀ THOÁT</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>RUNNER NÉ CÁM DỖ</Text>
          <Text style={styles.headerSubtitle}>
            🎯 {targetBoss.name}: {targetBoss.currentHp} HP
          </Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.textQuizHeaderBtn}
            onPress={() => setShowTextFallback(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.textQuizHeaderBtnText}>📝 Chữ</Text>
          </TouchableOpacity>
          <View style={styles.ticketBadge}>
            <Text style={styles.ticketText}>🎟️ {ticketsRemaining}</Text>
          </View>
        </View>
      </View>

      {/* 3D WebGL Canvas Container */}
      <View style={styles.canvasContainer}>
        {Platform.OS === 'web' ? (
          <iframe
            srcDoc={RUNNER_GAME_HTML}
            title="3D Endless Runner Game"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              backgroundColor: '#0f172a'
            }}
          />
        ) : WebView ? (
          <>
            <WebView
              key={`runner-webview-${reloadKey}`}
              ref={webViewRef}
              source={{ html: RUNNER_GAME_HTML, baseUrl: '' }}
              style={{ flex: 1, backgroundColor: '#0f172a' }}
              onMessage={handleNativeMessage}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('[RunnerWebView] onError:', nativeEvent);
                setHasLoadError(true);
                setLoadErrorMessage(nativeEvent.description || 'Lỗi nạp WebView');
              }}
              onHttpError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('[RunnerWebView] onHttpError:', nativeEvent.statusCode);
              }}
              onContentProcessDidTerminate={() => {
                console.warn('[RunnerWebView] WebKit content process terminated! Reloading...');
                setReloadKey(prev => prev + 1);
              }}
              onLoadEnd={() => {
                console.log('[RunnerWebView] onLoadEnd completed');
              }}
              webviewDebuggingEnabled={true}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              allowsInlineMediaPlayback={true}
              originWhitelist={['*']}
              mixedContentMode="always"
              allowFileAccess={true}
              scrollEnabled={false}
              bounces={false}
            />

            {/* Friendly Fallback Error Screen if WebGL hangs or fails */}
            {hasLoadError && !runnerReady && (
              <View style={styles.fallbackOverlay}>
                <View style={styles.fallbackCard}>
                  <Text style={styles.fallbackTitle}>⚠️ KHÔNG THỂ KHỞI CHẠY 3D</Text>
                  <Text style={styles.fallbackSubtitle}>
                    {loadErrorMessage || '3D Game Engine chưa sẵn sàng. Bạn có thể làm bài trắc nghiệm chữ hoặc thử lại.'}
                  </Text>

                  <TouchableOpacity
                    style={styles.fallbackTextBtn}
                    onPress={() => setShowTextFallback(true)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.fallbackTextBtnText}>📝 LÀM BÀI TRẮC NGHIỆM CHỮ</Text>
                  </TouchableOpacity>

                  <View style={styles.fallbackBtnRow}>
                    <TouchableOpacity style={styles.retryBtn} onPress={handleRetry} activeOpacity={0.8}>
                      <Text style={styles.retryBtnText}>🔄 THỬ LẠI</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.exitBtn} onPress={onClose} activeOpacity={0.8}>
                      <Text style={styles.exitBtnText}>THOÁT</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </>
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
    backgroundColor: '#0f172a',
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs
  },
  debugBuildBadge: {
    backgroundColor: '#0F172A',
    borderWidth: BORDER_WIDTHS.standard,
    borderColor: '#00F0FF',
    borderRadius: RADII.sm,
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  debugBuildText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 9,
    fontWeight: '900',
    color: '#00F0FF'
  },
  ticketBadge: {
    backgroundColor: COLORS.mint,
    borderWidth: BORDER_WIDTHS.standard,
    borderColor: COLORS.black,
    borderRadius: RADII.pill,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    ...SHADOWS.hardSm
  },
  textQuizHeaderBtn: {
    backgroundColor: '#4F46E5',
    borderWidth: BORDER_WIDTHS.standard,
    borderColor: COLORS.black,
    borderRadius: RADII.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    marginRight: 6,
    ...SHADOWS.hardSm
  },
  textQuizHeaderBtnText: {
    ...TYPOGRAPHY.label,
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.white
  },
  ticketText: {
    ...TYPOGRAPHY.label,
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.black
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: '#0f172a'
  },
  fallbackOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
    zIndex: 999
  },
  fallbackCard: {
    backgroundColor: COLORS.white,
    borderWidth: BORDER_WIDTHS.thick,
    borderColor: COLORS.black,
    borderRadius: RADII.lg,
    padding: SPACING.lg,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    ...SHADOWS.hard
  },
  fallbackTitle: {
    ...TYPOGRAPHY.title,
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.coral,
    marginBottom: SPACING.xs,
    textAlign: 'center'
  },
  fallbackSubtitle: {
    ...TYPOGRAPHY.body,
    fontSize: 13,
    color: COLORS.gray700,
    textAlign: 'center',
    marginBottom: SPACING.md
  },
  fallbackTextBtn: {
    width: '100%',
    backgroundColor: '#4F46E5',
    borderWidth: BORDER_WIDTHS.standard,
    borderColor: COLORS.black,
    borderRadius: RADII.md,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    marginBottom: SPACING.sm,
    ...SHADOWS.hardSm
  },
  fallbackTextBtnText: {
    ...TYPOGRAPHY.label,
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.white
  },
  fallbackBtnRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    width: '100%'
  },
  retryBtn: {
    flex: 1,
    backgroundColor: COLORS.yellow,
    borderWidth: BORDER_WIDTHS.standard,
    borderColor: COLORS.black,
    borderRadius: RADII.md,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    ...SHADOWS.hardSm
  },
  retryBtnText: {
    ...TYPOGRAPHY.label,
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.black
  },
  exitBtn: {
    flex: 1,
    backgroundColor: COLORS.gray100,
    borderWidth: BORDER_WIDTHS.standard,
    borderColor: COLORS.black,
    borderRadius: RADII.md,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    ...SHADOWS.hardSm
  },
  exitBtnText: {
    ...TYPOGRAPHY.label,
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.black
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
