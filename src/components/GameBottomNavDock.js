import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { retroTokens } from '../theme/retroTokens';

export const GAME_TABS = [
  { key: 'home', label: 'Trang chủ', icon: 'home-outline', activeIcon: 'home' },
  { key: 'wallet', label: 'Sổ ví', icon: 'wallet-outline', activeIcon: 'wallet' },
  { key: 'lessons', label: 'Bài học', icon: 'book-outline', activeIcon: 'book' },
  { key: 'profile', label: 'Hồ sơ', icon: 'person-outline', activeIcon: 'person' },
];

export function GameBottomNavDock({
  activeTab = 'home',
  onChangeTab,
  onPressFab,
}) {
  const leftTabs = GAME_TABS.slice(0, 2);
  const rightTabs = GAME_TABS.slice(2, 4);

  const renderTab = (tab) => {
    const isActive = activeTab === tab.key;
    return (
      <Pressable
        key={tab.key}
        testID={`nav-tab-${tab.key}`}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
        accessibilityLabel={tab.label}
        onPress={() => onChangeTab?.(tab.key)}
        style={({ pressed }) => [
          styles.tabButton,
          pressed && styles.tabButtonPressed,
        ]}
      >
        <Ionicons
          name={isActive ? tab.activeIcon : tab.icon}
          size={20}
          color={isActive ? retroTokens.accentBrick : retroTokens.textMuted}
          style={styles.tabIcon}
        />
        <Text
          numberOfLines={1}
          style={[
            styles.tabText,
            isActive && styles.activeTabText,
          ]}
        >
          {tab.label}
        </Text>
        {isActive ? <View style={styles.activeIndicator} /> : <View style={styles.indicatorPlaceholder} />}
      </Pressable>
    );
  };

  return (
    <View style={styles.dockContainer}>
      <View style={styles.dockBar}>
        {/* Left 2 Tabs: Trang chu, So vi */}
        <View style={styles.tabGroup}>
          {leftTabs.map(renderTab)}
        </View>

        {/* Center Elevated FAB [+] */}
        <View style={styles.fabWrapper}>
          <Pressable
            testID="nav-fab-plus"
            accessibilityRole="button"
            accessibilityLabel="Ghi chép nhanh và Hỏi Mỏ Hỗn"
            onPress={() => onPressFab?.()}
            style={({ pressed }) => [
              styles.fabButton,
              pressed && styles.fabButtonPressed,
            ]}
          >
            <View style={styles.fabInnerCircle}>
              <Ionicons name="add" size={30} color="#FFF" style={styles.fabPlusIcon} />
            </View>
          </Pressable>
          <Text style={styles.fabLabel}>Ghi / Hỏi</Text>
        </View>

        {/* Right 2 Tabs: Dau truong, Ho so */}
        <View style={styles.tabGroup}>
          {rightTabs.map(renderTab)}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dockContainer: {
    width: '100%',
    backgroundColor: retroTokens.bgPaper,
    borderTopWidth: 2,
    borderTopColor: retroTokens.border,
    paddingBottom: Platform.OS === 'ios' ? 20 : 6,
    zIndex: 100,
    elevation: 20,
    shadowColor: retroTokens.border,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  dockBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    height: 56,
  },
  tabGroup: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 54,
    minHeight: 48,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  tabButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  tabIcon: {
    marginBottom: 2,
  },
  tabText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: retroTokens.textMuted,
  },
  activeTabText: {
    color: retroTokens.accentBrick,
    fontWeight: '900',
  },
  activeIndicator: {
    width: 14,
    height: 3,
    backgroundColor: retroTokens.accentBrick,
    borderRadius: 2,
    marginTop: 2,
  },
  indicatorPlaceholder: {
    width: 14,
    height: 3,
    marginTop: 2,
  },

  // Elevated FAB [+]
  fabWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 68,
    height: 68,
    top: -14,
    zIndex: 110,
  },
  fabButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: retroTokens.accentAmber,
    borderWidth: 2.5,
    borderColor: retroTokens.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: retroTokens.border,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 8,
  },
  fabButtonPressed: {
    backgroundColor: '#B45309',
    transform: [{ scale: 0.92 }, { translateY: 2 }],
    shadowOpacity: 0.1,
  },
  fabInnerCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: retroTokens.accentBrick,
  },
  fabPlusIcon: {
    fontWeight: '900',
    marginTop: Platform.OS === 'android' ? -1 : 0,
  },
  fabLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: retroTokens.textPrimary,
    marginTop: 2,
  },
});
