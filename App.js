import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { apiGet, apiPost } from './src/api/client';
import { BossScreen } from './src/screens/BossScreen';
import { BossScreenNeo } from './src/screens/BossScreenNeo';
import { CharacterScreen } from './src/screens/CharacterScreen';
import { CharacterScreenNeo } from './src/screens/CharacterScreenNeo';
import { CoachScreen } from './src/screens/CoachScreen';
import { CoachScreenNeo } from './src/screens/CoachScreenNeo';
import { HomeScreen } from './src/screens/HomeScreen';
import { HomeScreenNeo } from './src/screens/HomeScreenNeo';
import { HomeScreenGame } from './src/screens/HomeScreenGame';
import { LessonScreen } from './src/screens/LessonScreen';
import LessonsScreen from './src/screens/LessonsScreen';
import { LessonReaderScreen } from './src/screens/LessonReaderScreen';
import { ALL_CURRICULUM_LESSONS } from './src/data/curriculumData';
import { OnboardingScreenNeo } from './src/screens/OnboardingScreenNeo';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { ProfileScreenNeo } from './src/screens/ProfileScreenNeo';
import { LeaderboardScreenNeo } from './src/screens/LeaderboardScreenNeo';
import RunnerScreenNeo from './src/screens/RunnerScreenNeo';
import { colors } from './src/theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isCompleteProfile } from './src/utils/profile';
import { FEATURE_FLAGS } from './src/config/features';
import { GameBottomNavDock } from './src/components/GameBottomNavDock';
import { QuickActionSheet } from './src/components/QuickActionSheet';
import { WalletScreen } from './src/screens/WalletScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { DevDebugOverlay, DevErrorBoundary } from './src/components/DevDebugOverlay';
const { inferExpenseCategory } = require('./src/utils/expenseCategory.cjs');


const TABS = [
  { key: 'home', label: 'Trang chủ', icon: 'home-outline', activeIcon: 'home' },
  { key: 'boss', label: 'Boss', icon: 'skull-outline', activeIcon: 'skull' },
  { key: 'coach', label: 'Coach', icon: 'chatbubble-outline', activeIcon: 'chatbubble' },
  { key: 'character', label: 'Nhân vật', icon: 'person-outline', activeIcon: 'person' },
  { key: 'profile', label: 'Hồ sơ', icon: 'settings-outline', activeIcon: 'settings' },
];

function BottomTabs({ activeTab, onChangeTab }) {
  const isGameKit = FEATURE_FLAGS.USE_GAME_KIT;

  return (
    <View style={[styles.tabBar, isGameKit && styles.tabBarGameKit]}>
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <Pressable
            key={tab.key}
            onPress={() => onChangeTab(tab.key)}
            style={({ pressed }) => [
              styles.tabButton,
              pressed && styles.tabButtonPressed,
            ]}
          >
            <Ionicons
              name={isActive ? tab.activeIcon : tab.icon}
              size={22}
              color={
                isActive
                  ? isGameKit ? '#38BDF8' : colors.primary
                  : isGameKit ? '#94A3B8' : colors.onSurfaceVariant
              }
              style={styles.tabIcon}
            />

            <Text
              numberOfLines={1}
              style={[
                styles.tabText,
                isGameKit && { color: '#94A3B8' },
                isActive && (isGameKit ? styles.activeTabTextGameKit : styles.activeTabText),
              ]}
            >
              {tab.label}
            </Text>

            {isGameKit && isActive ? <View style={styles.activeTabIndicator} /> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

function profileFromResponse(response) {
  return response?.data?.profile ?? response?.profile ?? response?.data ?? response;
}

function AppHeader({ screenTitle, onOpenRunner }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTopRow}>
        <View style={styles.gameLogoBadge}>
          <Text style={styles.gameLogoText}>VÍ MỎ HỖN</Text>
        </View>

        <TouchableOpacity
          style={styles.gameMenuBtn}
          onPress={onOpenRunner}
        >
          <Ionicons name="game-controller-outline" size={16} color="#0F172A" style={{ marginRight: 4 }} />
          <Text style={styles.gameMenuBtnText}>RUNNER 3D</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function App() {
  const [showDesignLab, setShowDesignLab] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showRunner, setShowRunner] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [bootstrapError, setBootstrapError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [dashboard, setDashboard] = useState(null);
  const [expenseText, setExpenseText] = useState('');
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState('OTHER');
  const [isExpenseCategoryManual, setIsExpenseCategoryManual] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [completingChallengeId, setCompletingChallengeId] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [lessonRefreshKey, setLessonRefreshKey] = useState(0);
  const [error, setError] = useState('');
  const [fabModalVisible, setFabModalVisible] = useState(false);
  const [layoutMetrics, setLayoutMetrics] = useState({});

  const handleContainerLayout = useCallback((name, event) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    console.log(`[LAYOUT DEBUG NATIVE] ${name}: ${Math.round(width)}x${Math.round(height)} at (${Math.round(x)}, ${Math.round(y)})`);
    if (height === 0 || width === 0) {
      console.warn(`[LAYOUT WARNING NATIVE] ${name} has ZERO dimension: ${width}x${height}`);
    }
    setLayoutMetrics((prev) => ({
      ...prev,
      [name]: { w: width, h: height, x, y },
    }));
  }, []);

  const loadDashboard = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);

    try {
      const response = await apiGet(`/dashboard/${userId}`);
      setDashboard(response);
      setError('');
    } catch (dashboardError) {
      console.warn('[Dashboard] Fallback to simulated data:', dashboardError?.message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    async function bootstrap() {
      setIsBootstrapping(true);
      setBootstrapError('');
      try {
        let storedUserId = await AsyncStorage.getItem('vmh_user_id');
        if (!storedUserId) {
          storedUserId = `vmh_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
          await AsyncStorage.setItem('vmh_user_id', storedUserId);
        }
        setUserId(storedUserId);

        // Pre-fetch profile gracefully without blocking app launch
        try {
          const response = await apiGet(`/profile/${storedUserId}`);
          const nextProfile = profileFromResponse(response);
          setProfile(nextProfile);
        } catch {
          // Graceful fallback for offline / new user
        }
      } catch (bootstrapFailure) {
        console.warn('[Bootstrap] Non-fatal init:', bootstrapFailure);
      } finally {
        setIsBootstrapping(false);
      }
    }
    bootstrap();
  }, []);

  useEffect(() => {
    if (!isBootstrapping && !bootstrapError && !needsOnboarding && userId) {
      loadDashboard();
    }
  }, [isBootstrapping, bootstrapError, needsOnboarding, userId, loadDashboard]);

  useEffect(() => {
    if (!userId) return;
    AsyncStorage.getItem(`vmh_completed_lessons_${userId}`).then((res) => {
      if (res) {
        try {
          const parsed = JSON.parse(res);
          if (Array.isArray(parsed)) {
            setCompletedLessonIds(parsed);
          }
        } catch {
          // ignore
        }
      }
    });
  }, [userId]);

  const handleChangeExpenseText = (value) => {
    setExpenseText(value);

    if (!value.trim()) {
      setSelectedExpenseCategory('OTHER');
      setIsExpenseCategoryManual(false);
      return;
    }

    if (!isExpenseCategoryManual) {
      setSelectedExpenseCategory(inferExpenseCategory(value));
    }
  };

  const handleSelectExpenseCategory = (category) => {
    setSelectedExpenseCategory(category);
    setIsExpenseCategoryManual(true);
  };

  const handleSubmitExpense = async () => {
    const trimmedText = expenseText.trim();

    if (!trimmedText) {
      setError('Vui lòng nhập khoản chi trước khi gửi.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await apiPost('/expenses/quick-input', {
        userId,
        text: trimmedText,
        category: selectedExpenseCategory,
      });
      setExpenseText('');
      setSelectedExpenseCategory('OTHER');
      setIsExpenseCategoryManual(false);
      await loadDashboard();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteChallenge = async (challengeId) => {
    setCompletingChallengeId(challengeId);
    setError('');

    try {
      await apiPost(`/challenges/${challengeId}/complete`, {
        userId,
      });
      await loadDashboard();
    } catch (challengeError) {
      setError(challengeError.message);
    } finally {
      setCompletingChallengeId(null);
    }
  };

  const screenTitle = useMemo(() => {
    if (activeTab === 'wallet') return 'Sổ ví';
    if (activeTab === 'arena') return 'Đấu trường';
    const tabObj = TABS.find((tab) => tab.key === activeTab);
    return tabObj?.label ?? 'Trang chủ';
  }, [activeTab]);

  const handleExitLesson = () => {
    setSelectedLesson(null);
    setActiveTab('boss');
    setLessonRefreshKey((value) => value + 1);
  };

  if (showDesignLab) {
    return <DesignLabScreen onClose={() => setShowDesignLab(false)} />;
  }

  if (showLeaderboard) {
    return (
      <LeaderboardScreenNeo
        userId={userId}
        onClose={() => setShowLeaderboard(false)}
      />
    );
  }

  if (showRunner) {
    const boss = dashboard?.data?.boss ?? dashboard?.boss ?? {};
    return (
      <RunnerScreenNeo
        onClose={() => setShowRunner(false)}
        targetBoss={{
          name: boss?.name || 'Quái Vật Trà Sữa',
          currentHp: Number(boss?.currentHp ?? boss?.hpRemaining ?? 2000),
          totalHp: Number(boss?.maxHp ?? boss?.totalHp ?? 2000),
        }}
        ticketsRemaining={profile?.isPremium ? 5 : 3}
        onFinishRun={async (res) => {
          setShowRunner(false);
          if (userId && res) {
            try {
              await apiPost('/game/end-session', {
                userId,
                damageToBoss: res.damageToBoss || 0,
                coins: res.coins || 0,
                savingsPoints: res.savingsPoints || 0,
                knowledgePoints: res.knowledgePoints || 0,
                durationSeconds: res.duration || 0,
                reason: res.reason || 'completed',
              });
              loadDashboard();
            } catch (e) {
              console.warn('Game sync error:', e);
            }
          }
        }}
      />
    );
  }

  if (isBootstrapping) {
    return (
      <View style={[styles.app, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View style={[styles.app, styles.appGameMode]}>
        <StatusBar style="light" />
        <View style={styles.fixedBackgroundLayer} pointerEvents="none">
          <Image
            source={require('./assets/game-ui/backgrounds/bg_sky_gradient.webp')}
            style={styles.skyGradientImg}
            resizeMode="cover"
          />
        </View>
        <LoginScreen
          onLoginSuccess={async ({ userId: loggedInId, userName }) => {
            const finalUserId = loggedInId || 'user_1234';
            setUserId(finalUserId);
            setIsAuthenticated(true);
            try {
              const response = await apiGet(`/profile/${finalUserId}`);
              const nextProfile = profileFromResponse(response);
              setProfile(nextProfile);
              setNeedsOnboarding(!isCompleteProfile(nextProfile));
            } catch (err) {
              if (err.status === 404) {
                setProfile({ displayName: userName, name: userName });
                setNeedsOnboarding(true);
              }
            }
            try {
              const dashRes = await apiGet(`/dashboard/${finalUserId}`);
              setDashboard(dashRes);
            } catch {
              // Fallback
            }
          }}
          onRegisterSuccess={({ userId: newUserId, name }) => {
            setUserId(newUserId);
            setIsAuthenticated(true);
            setProfile({ displayName: name, name });
            setNeedsOnboarding(true);
          }}
        />
      </View>
    );
  }



  if (needsOnboarding) {
    return (
      <OnboardingScreenNeo
        userId={userId}
        initialProfile={profile}
        onFinish={(nextProfile) => {
          setProfile(nextProfile);
          setNeedsOnboarding(false);
          setActiveTab('home');
          loadDashboard();
        }}
      />
    );
  }

  if (selectedLesson) {
    const isRichLesson = Boolean(selectedLesson.story && selectedLesson.coreConcept);
    return (
      <View style={styles.app}>
        <StatusBar style="dark" />
        {isRichLesson ? (
          <LessonReaderScreen
            lesson={selectedLesson}
            allLessons={ALL_CURRICULUM_LESSONS}
            onBack={handleExitLesson}
            onNavigateLesson={(nextL) => setSelectedLesson(nextL)}
            onFinishLesson={(lessonId) => {
              setCompletedLessonIds((prev) => {
                const updated = Array.from(new Set([...prev, lessonId]));
                if (userId) {
                  AsyncStorage.setItem(`vmh_completed_lessons_${userId}`, JSON.stringify(updated)).catch(() => {});
                }
                return updated;
              });
            }}
            onOpenRunner={() => {
              handleExitLesson();
              setShowRunner(true);
            }}
          />
        ) : (
          <LessonScreen
            lesson={selectedLesson}
            userId={userId}
            onBack={handleExitLesson}
            onRefreshDashboard={loadDashboard}
          />
        )}
      </View>
    );
  }

  const isGameMode = FEATURE_FLAGS.USE_GAME_KIT || FEATURE_FLAGS.USE_GAME_NAV_DOCK;
  const showDevDebug = typeof __DEV__ !== 'undefined' && __DEV__ && Boolean(FEATURE_FLAGS.SHOW_DEV_DEBUG_OVERLAY);

  return (
    <DevErrorBoundary>
      <View
        onLayout={(e) => handleContainerLayout('Root', e)}
        style={[
          styles.app,
          isGameMode && styles.appGameMode,
          showDevDebug && styles.debugBorderRoot,
        ]}
      >
        <StatusBar style={isGameMode ? 'light' : 'dark'} />

        {/* Dev Debug Overlay for Native Measurement (Default OFF, toggle via flag) */}
        {showDevDebug ? (
          <DevDebugOverlay
            activeTab={activeTab}
            userId={userId}
            hasDashboard={Boolean(dashboard)}
            lastError={error}
            layoutMetrics={layoutMetrics}
          />
        ) : null}

        {/* Layer Cố Định: Background Sky Gradient & Distant Archipelago */}
        {isGameMode ? (
          <View
            style={styles.fixedBackgroundLayer}
            pointerEvents="none"
          >
            <Image
              source={require('./assets/game-ui/backgrounds/bg_sky_gradient.webp')}
              style={styles.skyGradientImg}
              resizeMode="cover"
            />
          </View>
        ) : null}

        {/* Header cố định ở đỉnh */}
        <View
          onLayout={(e) => handleContainerLayout('Header', e)}
          style={[
            styles.headerContainer,
            isGameMode && styles.headerContainerGameMode,
            showDevDebug && styles.debugBorderHeader,
          ]}
        >
          <AppHeader
            screenTitle={screenTitle}
            onOpenDesignLab={() => setShowDesignLab(true)}
            onOpenLeaderboard={() => setShowLeaderboard(true)}
            onOpenRunner={() => setShowRunner(true)}
          />
        </View>

        {/* Thông báo lỗi & trạng thái tải */}
        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={18} color="#EF4444" />
            <Text selectable style={styles.errorText}>
              {error}
            </Text>
            <TouchableOpacity onPress={() => setError('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={18} color="#991B1B" />
            </TouchableOpacity>
          </View>
        ) : null}

      {/* Vùng nội dung chính */}
      {isGameMode ? (
        <View
          onLayout={(e) => handleContainerLayout('Content', e)}
          style={[
            styles.gameContentArea,
            showDevDebug && styles.debugBorderContent,
          ]}
        >
          {activeTab === 'home' && (
            <HomeScreenGame
              dashboard={dashboard}
              onNavigateToCoach={() => setActiveTab('coach')}
              onNavigateToLessons={() => setActiveTab('lessons')}
              onNavigateToWallet={() => setActiveTab('wallet')}
              onOpenRunner={() => setShowRunner(true)}
              userId={userId}
              onRefreshDashboard={loadDashboard}
            />
          )}

          {activeTab === 'wallet' && (
            <WalletScreen
              dashboard={dashboard}
              userId={userId}
              onRefreshDashboard={loadDashboard}
              onNavigateHome={() => setActiveTab('home')}
            />
          )}

          {activeTab === 'lessons' && (
            <LessonsScreen
              onOpenRunner={() => setShowRunner(true)}
              onSelectLesson={(lesson) => setSelectedLesson(lesson)}
              completedLessonIds={completedLessonIds}
            />
          )}

          {activeTab === 'coach' && (
            <CoachScreenNeo dashboard={dashboard} userId={userId} />
          )}

          {activeTab === 'profile' && (
            <ProfileScreenNeo
              dashboard={dashboard}
              profile={profile}
              userId={userId}
              onRefreshDashboard={loadDashboard}
              onLogout={() => setIsAuthenticated(false)}
            />
          )}
        </View>
      ) : (
        /* Classic Web-like Layout Fallback */
        activeTab === 'coach' ? (
          <View style={styles.coachContent}>
            {FEATURE_FLAGS.USE_NEO_COACH ? (
              <CoachScreenNeo dashboard={dashboard} userId={userId} />
            ) : (
              <CoachScreen dashboard={dashboard} userId={userId} />
            )}
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.content}>
            {activeTab === 'home' ? (
              FEATURE_FLAGS.USE_NEO_HOME ? (
                <HomeScreenNeo
                  dashboard={dashboard}
                  expenseText={expenseText}
                  isLoading={isLoading}
                  selectedExpenseCategory={selectedExpenseCategory}
                  completingChallengeId={completingChallengeId}
                  onChangeExpenseText={handleChangeExpenseText}
                  onSelectExpenseCategory={handleSelectExpenseCategory}
                  onSubmitExpense={handleSubmitExpense}
                  onCompleteChallenge={handleCompleteChallenge}
                  onNavigateToCoach={() => setActiveTab('coach')}
                  onNavigateToBoss={() => setActiveTab('boss')}
                  onOpenLeaderboard={() => setShowLeaderboard(true)}
                  onOpenRunner={() => setShowRunner(true)}
                  userId={userId}
                  onRefreshDashboard={loadDashboard}
                />
              ) : (
                <HomeScreen
                  dashboard={dashboard}
                  expenseText={expenseText}
                  isLoading={isLoading}
                  selectedExpenseCategory={selectedExpenseCategory}
                  completingChallengeId={completingChallengeId}
                  onChangeExpenseText={handleChangeExpenseText}
                  onSelectExpenseCategory={handleSelectExpenseCategory}
                  onSubmitExpense={handleSubmitExpense}
                  onCompleteChallenge={handleCompleteChallenge}
                />
              )
            ) : null}

            {activeTab === 'boss' ? (
              FEATURE_FLAGS.USE_NEO_BOSS ? (
                <BossScreenNeo
                  dashboard={dashboard}
                  userId={userId}
                  completingChallengeId={completingChallengeId}
                  onCompleteChallenge={handleCompleteChallenge}
                  onSelectLesson={setSelectedLesson}
                  lessonRefreshKey={lessonRefreshKey}
                  onRefreshDashboard={loadDashboard}
                  onOpenRunner={() => setShowRunner(true)}
                />
              ) : (
                <BossScreen
                  dashboard={dashboard}
                  userId={userId}
                  completingChallengeId={completingChallengeId}
                  onCompleteChallenge={handleCompleteChallenge}
                  onSelectLesson={setSelectedLesson}
                  lessonRefreshKey={lessonRefreshKey}
                />
              )
            ) : null}

            {activeTab === 'character' ? (
              FEATURE_FLAGS.USE_NEO_CHARACTER ? (
                <CharacterScreenNeo dashboard={dashboard} />
              ) : (
                <CharacterScreen dashboard={dashboard} />
              )
            ) : null}

            {activeTab === 'profile' ? (
              FEATURE_FLAGS.USE_NEO_PROFILE ? (
                <ProfileScreenNeo
                  dashboard={dashboard}
                  profile={profile}
                  userId={userId}
                  onRefreshDashboard={loadDashboard}
                  onLogout={() => setIsAuthenticated(false)}
                />
              ) : (
                <ProfileScreen
                  dashboard={dashboard}
                  profile={profile}
                  userId={userId}
                  onRefreshDashboard={loadDashboard}
                  onLogout={() => setIsAuthenticated(false)}
                />
              )
            ) : null}
          </ScrollView>
        )
      )}

      {/* Thanh điều hướng: GameBottomNavDock (4 Tab + FAB) hoặc Classic BottomTabs */}
      <View
        onLayout={(e) => handleContainerLayout('Dock', e)}
        style={[showDevDebug && styles.debugBorderDock]}
      >
        {FEATURE_FLAGS.USE_GAME_NAV_DOCK ? (
          <GameBottomNavDock
            activeTab={activeTab === 'boss' ? 'arena' : activeTab}
            onChangeTab={setActiveTab}
            onPressFab={() => setFabModalVisible(true)}
          />
        ) : (
          <BottomTabs activeTab={activeTab} onChangeTab={setActiveTab} />
        )}
      </View>

      {/* Modal Action Sheet FAB [+] (IA-02 Quick Action Sheet: GHI NHANH & HỎI MỎ HỖN) */}
      <QuickActionSheet
        visible={fabModalVisible}
        onClose={() => setFabModalVisible(false)}
        dailyBudgetRemaining={dashboard?.data?.remainingDailyBudget || 100000}
        onSubmitExpense={async (data) => {
          try {
            setIsLoading(true);
            await apiPost('/expenses/quick-input', {
              userId,
              text: `${data.note} ${data.amount}`,
              amount: data.amount,
              category: data.category,
              occurredAt: data.occurredAt,
            });
            await loadDashboard();
          } catch (err) {
            setError(err.message);
          } finally {
            setIsLoading(false);
          }
        }}
        onSubmitIncome={async (data) => {
          try {
            setIsLoading(true);
            await apiPost('/expenses/quick-input', {
              userId,
              text: `Thu nhập: ${data.note} ${data.amount}`,
              amount: data.amount,
              category: 'INCOME',
              occurredAt: data.occurredAt,
            });
            await loadDashboard();
          } catch (err) {
            setError(err.message);
          } finally {
            setIsLoading(false);
          }
        }}
        onAskCoach={() => {
          setActiveTab('coach');
        }}
      />
    </View>
  </DevErrorBoundary>
  );
}

const styles = StyleSheet.create({
  app: {
    backgroundColor: colors.appCanvas,
    flex: 1,
    ...(Platform.OS === 'web' ? { height: '100vh' } : null),
  },
  content: {
    gap: 16,
    padding: 20,
    paddingBottom: 120,
    paddingTop: 60,
  },
  coachContent: {
    flex: 1,
    gap: 16,
    paddingBottom: 112,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    gap: 4,
    marginBottom: 8,
  },
  headerTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  appTitle: {
    color: colors.primary,
    flex: 1,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.onSurfaceVariant,
    fontSize: 16,
    fontWeight: '600',
  },
  errorBox: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
    borderRadius: 10,
    borderWidth: 1.5,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    zIndex: 20,
  },
  errorText: {
    color: '#991B1B',
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  startupError: { alignItems: 'center', backgroundColor: colors.appCanvas, flex: 1, gap: 14, justifyContent: 'center', padding: 24 },
  startupErrorTitle: { color: colors.primary, fontSize: 24, fontWeight: '800' },
  startupErrorText: { color: colors.onSurfaceVariant, fontSize: 16, lineHeight: 24, textAlign: 'center' },
  retryButton: { backgroundColor: colors.primary, borderRadius: 12, marginTop: 8, minWidth: 128, paddingHorizontal: 16, paddingVertical: 14 },
  retryButtonText: { color: colors.surfaceRice, fontSize: 16, fontWeight: '800', textAlign: 'center' },
  tabBar: {
    backgroundColor: colors.surfaceRice,
    borderColor: colors.softBorder,
    borderTopWidth: 1,
    bottom: 0,
    flexDirection: 'row',
    gap: 8,
    left: 0,
    padding: 12,
    paddingBottom: 24,
    position: 'absolute',
    right: 0,
  },
  tabButton: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    height: 56,
    paddingHorizontal: 2,
  },
  tabButtonPressed: {
    opacity: 0.7,
  },
  tabIcon: {
    marginBottom: 4,
  },
  tabText: {
    color: colors.mossText,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '700',
  },
  gameLogoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE600',
    borderColor: '#121212',
    borderWidth: 2.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    shadowColor: '#121212',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  gameLogoFire: {
    fontSize: 18,
  },
  gameLogoText: {
    color: '#121212',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  gameLogoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF5C5C',
    marginLeft: 2,
  },
  gameMenuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#121212',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
    shadowColor: '#121212',
    shadowOffset: { width: 2.5, height: 2.5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  gameMenuBtnPressed: {
    transform: [{ translateX: 1.5 }, { translateY: 1.5 }],
    shadowOffset: { width: 1, height: 1 },
  },
  gameMenuBtnIcon: {
    fontSize: 14,
  },
  gameMenuBtnText: {
    color: '#121212',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalDialog: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderColor: '#121212',
    borderWidth: 3,
    borderRadius: 14,
    padding: 18,
    gap: 14,
    shadowColor: '#121212',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#121212',
  },
  modalHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalHeaderIcon: {
    fontSize: 20,
  },
  modalHeaderTitle: {
    color: '#121212',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  modalCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EFEFEF',
    borderColor: '#121212',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemsList: {
    gap: 10,
  },
  menuItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8F9FA',
    borderColor: '#121212',
    borderWidth: 2,
    borderRadius: 10,
    padding: 12,
    shadowColor: '#121212',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  menuItemIconBox: {
    width: 38,
    height: 38,
    borderRadius: 8,
    borderColor: '#121212',
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemIcon: {
    fontSize: 20,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    color: '#121212',
    fontSize: 14,
    fontWeight: '900',
  },
  menuItemSub: {
    color: '#666666',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },

  // Game Kit Additions
  headerAvatarWrap: {
    position: 'relative',
    marginRight: -4,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEF08A',
    borderColor: '#78350F',
    borderWidth: 2.5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: {
    width: 38,
    height: 38,
  },
  avatarCrown: {
    position: 'absolute',
    top: -8,
    left: 8,
    fontSize: 16,
  },
  gameLogoBadgeKit: {
    backgroundColor: '#FDE047',
    borderColor: '#78350F',
    borderWidth: 2.5,
    borderRadius: 14,
    shadowColor: '#78350F',
    shadowOffset: { width: 0, height: 3 },
  },
  gameMenuBtnKit: {
    backgroundColor: '#0284C7',
    borderColor: '#075985',
    borderWidth: 2,
    borderBottomWidth: 4,
    borderRadius: 12,
    shadowColor: '#075985',
  },
  tabBarGameKit: {
    backgroundColor: '#1E293B',
    borderTopColor: '#334155',
    borderTopWidth: 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    elevation: 8,
  },
  activeTabTextGameKit: {
    color: '#38BDF8',
    fontWeight: '800',
  },
  activeTabIndicator: {
    width: 16,
    height: 3,
    backgroundColor: '#38BDF8',
    borderRadius: 2,
    marginTop: 3,
  },

  // Game Mode Fixed Background & Dock Layout
  appGameMode: {
    backgroundColor: '#0B132B',
  },
  fixedBackgroundLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  skyGradientImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  fixedDistantIslands: {
    position: 'absolute',
    top: 50,
    width: '100%',
    height: 180,
    opacity: 0.9,
  },
  headerContainer: {
    width: '100%',
  },
  headerContainerGameMode: {
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
    paddingHorizontal: 16,
    paddingBottom: 6,
    zIndex: 10,
  },
  gameContentArea: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },

  // FAB Modal Sheet
  fabModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  fabModalSheet: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 2,
    borderTopColor: '#F59E0B',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 20,
  },
  fabModalHeader: {
    alignItems: 'center',
    marginBottom: 18,
  },
  fabModalPill: {
    width: 40,
    height: 4,
    backgroundColor: '#64748B',
    borderRadius: 2,
    marginBottom: 12,
  },
  fabModalTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FBBF24',
    letterSpacing: 0.5,
  },
  fabModalSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  fabModalActions: {
    gap: 12,
  },
  fabActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  fabActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  fabActionTextWrap: {
    flex: 1,
  },
  fabActionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  fabActionDesc: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },

  // Debug Border Styles (Active only in __DEV__)
  debugBorderRoot: {
    borderColor: '#FF0055',
    borderWidth: 2,
  },
  debugBorderHeader: {
    borderColor: '#FFFF00',
    borderWidth: 2,
  },
  debugBorderContent: {
    borderColor: '#00FF00',
    borderWidth: 2,
  },
  debugBorderDock: {
    borderColor: '#FF8800',
    borderWidth: 2,
  },
});
