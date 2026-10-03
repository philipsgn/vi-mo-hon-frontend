import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { neoColors, neoBorders, neoRadii, neoShadows } from '../design-system/tokens';
import { NeoCard, NeoBadge, NeoProgressBar } from '../design-system/components';

const mascotImage = require('../../design-reference/mascot.png');

const BADGES = [
  {
    id: 'b1',
    icon: 'flame',
    title: 'Lửa Bốc Ngùn Ngụt',
    desc: 'Đạt chuỗi streak kỷ luật 7 ngày liên tục',
    earnedCondition: (p) => Number(p.streak || 0) >= 3,
  },
  {
    id: 'b2',
    icon: 'shield-checkmark',
    title: 'Khắc Tinh Shopee',
    desc: 'Nhịn quẹt thẻ thành công ít nhất 3 lần',
    earnedCondition: (p) => Number(p.discipline || 0) >= 40,
  },
  {
    id: 'b3',
    icon: 'skull',
    title: 'Thợ Săn Quái Vật',
    desc: 'Gây sát thương lớn lên Quái Vật Trà Sữa',
    earnedCondition: (p, b) => Number(b.completedChallenges || 0) >= 1,
  },
  {
    id: 'b4',
    icon: 'book',
    title: 'Học Giả Tài Chính',
    desc: 'Hoàn thành bài học tài chính 1 phút',
    earnedCondition: (p) => Number(p.knowledge || 0) >= 20,
  },
  {
    id: 'b5',
    icon: 'sparkles',
    title: 'Chiến Binh Premium VIP',
    desc: 'Đăng ký gói Premium hỗ trợ 5 vé chạy & đóng băng streak',
    earnedCondition: (p) => Boolean(p.isPremium),
  },
];

export function CharacterScreenNeo({ dashboard }) {
  const data = dashboard?.data ?? dashboard ?? {};
  const profile = data.profile ?? {};
  const boss = data.boss ?? {};

  const nickname = profile.nickname || profile.name || 'Chiến Binh Mỏ Hỗn';
  const level = Number(profile.level || 1);
  const currentXp = Number(profile.xp || 45);
  const nextLevelXp = level * 100 + 100;
  const xpProgress = Math.max(0, Math.min(1, currentXp / nextLevelXp));

  const streak = Number(profile.streak || 1);
  const coins = Number(profile.coins || 0);
  const discipline = Number(profile.discipline || 0);
  const savings = Number(profile.savings || profile.saving || 0);
  const knowledge = Number(profile.knowledge || 0);

  const isPremium = Boolean(profile.isPremium);
  const freezeStreakLeft = Number(profile.freezeStreakLeft || 0);

  return (
    <View style={styles.container}>
      {/* 1. Hero Character Card */}
      <NeoCard bg="purple" style={styles.heroCard}>
        <View style={styles.heroTop}>
          <NeoBadge bg={isPremium ? "yellow" : "white"}>
            <Text style={styles.badgeDarkText}>
              {isPremium ? '👑 PREMIUM VIP' : '⭐ CHIẾN BINH TỰ DO'}
            </Text>
          </NeoBadge>
          <Text style={styles.coinsText}>🪙 {coins} Xu</Text>
        </View>

        <View style={styles.heroMain}>
          <View style={styles.avatarFrame}>
            <Image source={mascotImage} style={styles.avatarImage} resizeMode="contain" />
          </View>

          <View style={styles.heroInfo}>
            <Text style={styles.heroName}>{nickname}</Text>
            <Text style={styles.heroTitle}>
              {isPremium ? 'Danh hiệu: Nhà Đầu Tư Thượng Lưu' : 'Danh hiệu: Bậc Thầy Kiềm Chế'}
            </Text>

            <View style={styles.levelRow}>
              <Text style={styles.levelLabel}>CẤP ĐỘ {level}</Text>
              <Text style={styles.xpLabel}>
                {currentXp} / {nextLevelXp} XP
              </Text>
            </View>

            <NeoProgressBar progress={xpProgress} fillColor="yellow" height={14} />
          </View>
        </View>
      </NeoCard>

      {/* 2. RPG Stat Grid */}
      <View style={styles.statGrid}>
        <View style={styles.statBox}>
          <Ionicons name="flame" size={24} color="#FF5C5C" />
          <Text style={styles.statLabel}>STREAK</Text>
          <Text style={styles.statValue}>{streak} Ngày</Text>
          {isPremium ? (
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#00F0FF', marginTop: 2 }}>
              ❄️ Băng: {freezeStreakLeft}/2
            </Text>
          ) : null}
        </View>

        <View style={styles.statBox}>
          <Ionicons name="shield-checkmark" size={24} color="#00F0FF" />
          <Text style={styles.statLabel}>KỶ LUẬT</Text>
          <Text style={styles.statValue}>{discipline}%</Text>
        </View>

        <View style={styles.statBox}>
          <Ionicons name="wallet" size={24} color="#FFE600" />
          <Text style={styles.statLabel}>TIẾT KIỆM</Text>
          <Text style={styles.statValue}>{savings}</Text>
        </View>

        <View style={styles.statBox}>
          <Ionicons name="book" size={24} color="#C6FF00" />
          <Text style={styles.statLabel}>KIẾN THỨC</Text>
          <Text style={styles.statValue}>{knowledge}</Text>
        </View>
      </View>

      {/* 3. Badge Showcase */}
      <NeoCard bg="white" style={styles.badgeSection}>
        <View style={styles.badgeSectionHeader}>
          <NeoBadge bg="yellow">
            <Text style={styles.badgeDarkText}>🏆 TỦ HUY HIỆU DANH GIÁ</Text>
          </NeoBadge>
          <Text style={styles.badgeCountText}>Đã mở khóa</Text>
        </View>

        <View style={styles.badgeList}>
          {BADGES.map((b) => {
            const isEarned = b.earnedCondition(profile, boss);

            return (
              <View
                key={b.id}
                style={[styles.badgeItem, isEarned ? styles.badgeEarned : styles.badgeLocked]}
              >
                <View
                  style={[
                    styles.badgeIconBox,
                    isEarned ? styles.badgeIconEarned : styles.badgeIconLocked,
                  ]}
                >
                  <Ionicons
                    name={isEarned ? b.icon : 'lock-closed'}
                    size={22}
                    color={isEarned ? neoColors.black : neoColors.grayMuted}
                  />
                </View>

                <View style={styles.badgeContent}>
                  <Text
                    style={[styles.badgeItemTitle, !isEarned && styles.badgeItemTitleLocked]}
                  >
                    {b.title}
                  </Text>
                  <Text style={styles.badgeItemDesc}>{b.desc}</Text>
                </View>

                {isEarned ? (
                  <NeoBadge bg="lime" style={styles.earnedTag}>
                    <Text style={styles.earnedTagText}>MỞ KHÓA</Text>
                  </NeoBadge>
                ) : null}
              </View>
            );
          })}
        </View>
      </NeoCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  heroCard: {
    gap: 12,
    padding: 16,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeText: {
    color: neoColors.black,
    fontSize: 10,
    fontWeight: '900',
  },
  coinsText: {
    color: neoColors.white,
    fontSize: 13,
    fontWeight: '900',
  },
  heroMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarFrame: {
    width: 80,
    height: 80,
    backgroundColor: neoColors.white,
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
    borderRadius: neoRadii.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: neoColors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 72,
    height: 72,
  },
  heroInfo: {
    flex: 1,
    gap: 4,
  },
  heroName: {
    color: neoColors.white,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  heroTitle: {
    color: neoColors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  levelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  levelLabel: {
    color: neoColors.white,
    fontSize: 10,
    fontWeight: '800',
  },
  xpLabel: {
    color: neoColors.white,
    fontSize: 11,
    fontWeight: '900',
  },
  statGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: neoColors.white,
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
    borderRadius: neoRadii.md,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    shadowColor: neoColors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  statLabel: {
    color: neoColors.grayMuted,
    fontSize: 9,
    fontWeight: '800',
  },
  statValue: {
    color: neoColors.black,
    fontSize: 12,
    fontWeight: '900',
  },
  badgeSection: {
    gap: 12,
  },
  badgeSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeDarkText: {
    color: neoColors.black,
    fontSize: 10,
    fontWeight: '900',
  },
  badgeCountText: {
    color: neoColors.grayMuted,
    fontSize: 11,
    fontWeight: '700',
  },
  badgeList: {
    gap: 10,
  },
  badgeItem: {
    borderColor: neoColors.black,
    borderWidth: neoBorders.default,
    borderRadius: neoRadii.md,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: neoColors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  badgeEarned: {
    backgroundColor: neoColors.white,
  },
  badgeLocked: {
    backgroundColor: neoColors.grayLight,
    opacity: 0.7,
  },
  badgeIconBox: {
    width: 44,
    height: 44,
    borderColor: neoColors.black,
    borderWidth: 1.5,
    borderRadius: neoRadii.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeIconEarned: {
    backgroundColor: neoColors.yellow,
  },
  badgeIconLocked: {
    backgroundColor: '#DDD',
  },
  badgeContent: {
    flex: 1,
    gap: 2,
  },
  badgeItemTitle: {
    color: neoColors.black,
    fontSize: 13,
    fontWeight: '900',
  },
  badgeItemTitleLocked: {
    color: neoColors.grayMuted,
  },
  badgeItemDesc: {
    color: neoColors.grayMuted,
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 15,
  },
  earnedTag: {
    alignSelf: 'center',
  },
  earnedTagText: {
    color: neoColors.black,
    fontSize: 9,
    fontWeight: '900',
  },
});
