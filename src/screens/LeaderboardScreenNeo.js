import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { neoBorders, neoColors, neoRadii, neoShadows } from '../design-system/tokens';
import { NeoBadge, NeoButton, NeoCard } from '../design-system/components';
import { apiGet } from '../api/client';

const {
  formatLeaderboardScore,
  getHonoraryTitle,
  getRankBadgeBg,
  getRankMedal,
} = require('../utils/leaderboardUtils.cjs');

const CHIBI_AVATARS = ['🐱', '🦊', '🦁', '🐼', '🐯', '🦝', '🐨', '🐰'];

export function LeaderboardScreenNeo({ userId, onClose }) {
  const [activeType, setActiveType] = useState('discipline'); // 'discipline' | 'streak'
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [error, setError] = useState(null);

  const fetchLeaderboard = useCallback(async (type) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `/leaderboard?type=${type}${userId ? `&userId=${encodeURIComponent(userId)}` : ''}`;
      const res = await apiGet(url);
      setLeaderboardData(res?.data ?? null);
    } catch (err) {
      console.warn('[Leaderboard] Fetch error:', err);
      setError(err.message || 'Không thể tải bảng xếp hạng.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchLeaderboard(activeType);
  }, [activeType, fetchLeaderboard]);

  const items = leaderboardData?.leaderboard || [];
  const currentUser = leaderboardData?.currentUser;
  const isDiscipline = activeType === 'discipline';
  const unit = isDiscipline ? 'Điểm' : 'Ngày';

  const top3 = items.slice(0, 3);
  const restItems = items.slice(3);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onClose} activeOpacity={0.8}>
            <Text style={styles.backBtnText}>◀ THOÁT</Text>
          </TouchableOpacity>
          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>🏆 BẢNG XẾP HẠNG</Text>
            <Text style={styles.headerSubtitle}>Tôn Vinh Ý Chí & Kiên Trì</Text>
          </View>
          <TouchableOpacity
            style={styles.refreshBtn}
            onPress={() => fetchLeaderboard(activeType)}
            activeOpacity={0.8}
          >
            <Text style={styles.refreshBtnText}>🔄</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Filter Switcher */}
        <View style={styles.tabSwitchRow}>
          <TouchableOpacity
            style={[
              styles.tabSwitchBtn,
              activeType === 'discipline' && styles.tabSwitchBtnActive,
            ]}
            onPress={() => setActiveType('discipline')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabSwitchText,
                activeType === 'discipline' && styles.tabSwitchTextActive,
              ]}
            >
              🛡️ ĐIỂM KỶ LUẬT
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabSwitchBtn,
              activeType === 'streak' && styles.tabSwitchBtnActive,
            ]}
            onPress={() => setActiveType('streak')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabSwitchText,
                activeType === 'streak' && styles.tabSwitchTextActive,
              ]}
            >
              🔥 CHUỖI STREAK
            </Text>
          </TouchableOpacity>
        </View>

        {/* Ethical Safety Notice Banner */}
        <View style={styles.ethicalNotice}>
          <Text style={styles.ethicalNoticeText}>
            ⚖️ Xếp hạng theo Kỷ Luật & Chuỗi Ngày – Tuyệt đối không xếp theo tiền!
          </Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={neoColors.black} />
            <Text style={styles.loadingText}>Đang tải bảng vàng danh dự...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
            <NeoButton label="Thử lại" bg="yellow" onPress={() => fetchLeaderboard(activeType)} />
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* My Rank Highlight Card */}
            {currentUser ? (
              <NeoCard bg="mint" style={styles.myRankCard}>
                <View style={styles.myRankHeader}>
                  <NeoBadge bg="black">
                    <Text style={styles.myRankBadgeText}>VỊ TRÍ CỦA TÔI</Text>
                  </NeoBadge>
                  <Text style={styles.myRankNumber}>HẠNG #{currentUser.rank}</Text>
                </View>

                <View style={styles.myRankBody}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarEmoji}>🦁</Text>
                  </View>
                  <View style={styles.myRankDetails}>
                    <Text style={styles.myRankName}>{currentUser.displayName} (Bạn)</Text>
                    <View style={styles.myRankTagRow}>
                      <NeoBadge bg="yellow">
                        <Text style={styles.badgeDarkText}>{currentUser.title}</Text>
                      </NeoBadge>
                      <NeoBadge bg="white">
                        <Text style={styles.badgeDarkText}>Lv.{currentUser.level}</Text>
                      </NeoBadge>
                    </View>
                  </View>
                  <View style={styles.myRankScoreBox}>
                    <Text style={styles.myRankScoreValue}>{currentUser.score}</Text>
                    <Text style={styles.myRankScoreUnit}>{unit}</Text>
                  </View>
                </View>
              </NeoCard>
            ) : null}

            {/* Podium Top 3 */}
            {top3.length > 0 ? (
              <View style={styles.podiumContainer}>
                {/* 2nd Place */}
                {top3[1] ? (
                  <View style={[styles.podiumColumn, styles.podiumSecond]}>
                    <Text style={styles.podiumMedal}>🥈</Text>
                    <View style={styles.podiumAvatarBox}>
                      <Text style={styles.podiumAvatar}>
                        {CHIBI_AVATARS[1 % CHIBI_AVATARS.length]}
                      </Text>
                    </View>
                    <Text style={styles.podiumName} numberOfLines={1}>
                      {top3[1].displayName}
                    </Text>
                    <Text style={styles.podiumScore}>
                      {top3[1].score} {unit}
                    </Text>
                    <NeoBadge bg="white">
                      <Text style={styles.podiumTitleBadge} numberOfLines={1}>
                        {top3[1].title}
                      </Text>
                    </NeoBadge>
                    <View style={[styles.podiumBlock, { height: 75, backgroundColor: '#E0E0E0' }]}>
                      <Text style={styles.podiumRankText}>#2</Text>
                    </View>
                  </View>
                ) : null}

                {/* 1st Place (Crown) */}
                {top3[0] ? (
                  <View style={[styles.podiumColumn, styles.podiumFirst]}>
                    <Text style={styles.podiumCrown}>👑</Text>
                    <Text style={styles.podiumMedal}>🥇</Text>
                    <View style={[styles.podiumAvatarBox, styles.podiumAvatarFirst]}>
                      <Text style={styles.podiumAvatar}>
                        {CHIBI_AVATARS[0 % CHIBI_AVATARS.length]}
                      </Text>
                    </View>
                    <Text style={styles.podiumName} numberOfLines={1}>
                      {top3[0].displayName}
                    </Text>
                    <Text style={styles.podiumScoreFirst}>
                      {top3[0].score} {unit}
                    </Text>
                    <NeoBadge bg="yellow">
                      <Text style={styles.podiumTitleBadge} numberOfLines={1}>
                        {top3[0].title}
                      </Text>
                    </NeoBadge>
                    <View style={[styles.podiumBlock, { height: 100, backgroundColor: neoColors.yellow }]}>
                      <Text style={styles.podiumRankText}>#1</Text>
                    </View>
                  </View>
                ) : null}

                {/* 3rd Place */}
                {top3[2] ? (
                  <View style={[styles.podiumColumn, styles.podiumThird]}>
                    <Text style={styles.podiumMedal}>🥉</Text>
                    <View style={styles.podiumAvatarBox}>
                      <Text style={styles.podiumAvatar}>
                        {CHIBI_AVATARS[2 % CHIBI_AVATARS.length]}
                      </Text>
                    </View>
                    <Text style={styles.podiumName} numberOfLines={1}>
                      {top3[2].displayName}
                    </Text>
                    <Text style={styles.podiumScore}>
                      {top3[2].score} {unit}
                    </Text>
                    <NeoBadge bg="coral">
                      <Text style={styles.podiumTitleBadge} numberOfLines={1}>
                        {top3[2].title}
                      </Text>
                    </NeoBadge>
                    <View style={[styles.podiumBlock, { height: 55, backgroundColor: '#FF8C42' }]}>
                      <Text style={styles.podiumRankText}>#3</Text>
                    </View>
                  </View>
                ) : null}
              </View>
            ) : null}

            {/* List for Rank 4 onwards */}
            <View style={styles.listHeaderRow}>
              <Text style={styles.listSectionTitle}>DANH SÁCH CHIẾN BINH</Text>
              <Text style={styles.listCountText}>{items.length} người tham gia</Text>
            </View>

            <View style={styles.listWrapper}>
              {restItems.map((item, idx) => {
                const isUser = item.isCurrentUser;
                return (
                  <NeoCard
                    key={item.userId}
                    bg={isUser ? 'mint' : 'white'}
                    style={[styles.listItemCard, isUser && styles.listItemCardSelf]}
                  >
                    <View style={styles.rankBadgeBox}>
                      <Text style={styles.rankBadgeText}>#{item.rank}</Text>
                    </View>

                    <Text style={styles.itemAvatar}>
                      {CHIBI_AVATARS[(idx + 3) % CHIBI_AVATARS.length]}
                    </Text>

                    <View style={styles.itemInfo}>
                      <View style={styles.itemNameRow}>
                        <Text style={styles.itemName} numberOfLines={1}>
                          {item.displayName} {isUser ? ' (Bạn)' : ''}
                        </Text>
                        <NeoBadge bg="white" style={styles.miniLevelBadge}>
                          <Text style={styles.miniLevelText}>Lv.{item.level}</Text>
                        </NeoBadge>
                      </View>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                    </View>

                    <View style={styles.itemScoreBox}>
                      <Text style={styles.itemScoreValue}>{item.score}</Text>
                      <Text style={styles.itemScoreUnit}>{unit}</Text>
                    </View>
                  </NeoCard>
                );
              })}
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: neoColors.cream,
    ...(Platform.OS === 'web' ? { height: '100vh' } : null),
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: neoBorders.default,
    borderBottomColor: neoColors.black,
    marginBottom: 10,
  },
  backBtn: {
    backgroundColor: neoColors.coral,
    borderColor: neoColors.black,
    borderWidth: neoBorders.thin,
    borderRadius: neoRadii.sm,
    paddingHorizontal: 12,
    paddingVertical: 6,
    ...neoShadows.sm,
  },
  backBtnText: {
    color: neoColors.white,
    fontWeight: '900',
    fontSize: 12,
  },
  headerTitleBox: {
    alignItems: 'center',
  },
  headerTitle: {
    color: neoColors.black,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: neoColors.grayMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  refreshBtn: {
    backgroundColor: neoColors.yellow,
    borderColor: neoColors.black,
    borderWidth: neoBorders.thin,
    borderRadius: neoRadii.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
    ...neoShadows.sm,
  },
  refreshBtnText: {
    fontSize: 14,
  },
  tabSwitchRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 10,
  },
  tabSwitchBtn: {
    flex: 1,
    backgroundColor: neoColors.white,
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
    borderRadius: neoRadii.sm,
    paddingVertical: 10,
    alignItems: 'center',
    ...neoShadows.sm,
  },
  tabSwitchBtnActive: {
    backgroundColor: neoColors.yellow,
  },
  tabSwitchText: {
    color: neoColors.black,
    fontSize: 13,
    fontWeight: '900',
  },
  tabSwitchTextActive: {
    color: neoColors.black,
  },
  ethicalNotice: {
    backgroundColor: '#FFF9D2',
    borderColor: neoColors.black,
    borderWidth: neoBorders.thin,
    borderRadius: neoRadii.sm,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  ethicalNoticeText: {
    color: neoColors.black,
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'center',
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: neoColors.black,
    fontSize: 14,
    fontWeight: '800',
  },
  errorBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  errorText: {
    color: neoColors.coral,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    gap: 14,
  },
  myRankCard: {
    padding: 12,
    gap: 8,
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
  },
  myRankHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  myRankBadgeText: {
    color: neoColors.white,
    fontSize: 10,
    fontWeight: '900',
  },
  myRankNumber: {
    color: neoColors.black,
    fontSize: 15,
    fontWeight: '900',
  },
  myRankBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    backgroundColor: neoColors.white,
    borderColor: neoColors.black,
    borderWidth: 2,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 22,
  },
  myRankDetails: {
    flex: 1,
    gap: 4,
  },
  myRankName: {
    color: neoColors.black,
    fontSize: 15,
    fontWeight: '900',
  },
  myRankTagRow: {
    flexDirection: 'row',
    gap: 6,
  },
  badgeDarkText: {
    color: neoColors.black,
    fontSize: 10,
    fontWeight: '800',
  },
  myRankScoreBox: {
    alignItems: 'flex-end',
  },
  myRankScoreValue: {
    color: neoColors.black,
    fontSize: 22,
    fontWeight: '900',
  },
  myRankScoreUnit: {
    color: neoColors.grayMuted,
    fontSize: 11,
    fontWeight: '800',
  },
  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 16,
    paddingBottom: 4,
  },
  podiumColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  podiumFirst: {
    zIndex: 2,
  },
  podiumSecond: {
    zIndex: 1,
  },
  podiumThird: {
    zIndex: 1,
  },
  podiumCrown: {
    fontSize: 22,
    marginBottom: -6,
  },
  podiumMedal: {
    fontSize: 20,
  },
  podiumAvatarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: neoColors.white,
    borderColor: neoColors.black,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...neoShadows.sm,
  },
  podiumAvatarFirst: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderColor: neoColors.black,
    borderWidth: 2.5,
  },
  podiumAvatar: {
    fontSize: 22,
  },
  podiumName: {
    color: neoColors.black,
    fontSize: 11,
    fontWeight: '900',
    marginTop: 2,
  },
  podiumScore: {
    color: neoColors.black,
    fontSize: 11,
    fontWeight: '800',
  },
  podiumScoreFirst: {
    color: neoColors.black,
    fontSize: 13,
    fontWeight: '900',
  },
  podiumTitleBadge: {
    color: neoColors.black,
    fontSize: 9,
    fontWeight: '800',
  },
  podiumBlock: {
    width: '100%',
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
    borderTopLeftRadius: neoRadii.sm,
    borderTopRightRadius: neoRadii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  podiumRankText: {
    color: neoColors.black,
    fontSize: 18,
    fontWeight: '900',
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 2,
  },
  listSectionTitle: {
    color: neoColors.black,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  listCountText: {
    color: neoColors.grayMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  listWrapper: {
    gap: 8,
  },
  listItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
  },
  listItemCardSelf: {
    borderColor: neoColors.black,
    borderWidth: neoBorders.thick,
  },
  rankBadgeBox: {
    width: 32,
    alignItems: 'center',
  },
  rankBadgeText: {
    color: neoColors.black,
    fontSize: 14,
    fontWeight: '900',
  },
  itemAvatar: {
    fontSize: 22,
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemName: {
    color: neoColors.black,
    fontSize: 13,
    fontWeight: '900',
  },
  miniLevelBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  miniLevelText: {
    color: neoColors.black,
    fontSize: 9,
    fontWeight: '800',
  },
  itemTitle: {
    color: neoColors.grayMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  itemScoreBox: {
    alignItems: 'flex-end',
  },
  itemScoreValue: {
    color: neoColors.black,
    fontSize: 15,
    fontWeight: '900',
  },
  itemScoreUnit: {
    color: neoColors.grayMuted,
    fontSize: 10,
    fontWeight: '800',
  },
});
