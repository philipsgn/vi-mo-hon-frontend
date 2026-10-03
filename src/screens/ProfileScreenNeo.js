import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiPatch, apiPost } from '../api/client';
import { neoColors, neoBorders, neoRadii, neoShadows } from '../design-system/tokens';
import { NeoButton, NeoCard, NeoBadge, NeoInput } from '../design-system/components';
import { formatVnd, GOAL_LABELS } from '../utils/profile';
import {
  PREMIUM_PLAN_INFO,
  getPremiumBadge,
  formatFreezeStreakStatus,
} from '../utils/premiumHelper.cjs';
import {
  getNotificationSettings,
  saveNotificationSettings,
  syncAllDisciplineNotifications,
  scheduleTestReminder,
  requestNotificationPermission,
} from '../utils/notifications';
import {
  NOTIFICATION_SCHEDULES,
  getNotificationSummary,
  DEFAULT_NOTIFICATION_SETTINGS,
} from '../utils/notificationConfig.cjs';
import { purchasePremium, restorePurchases } from '../services/iap.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function ProfileScreenNeo({ dashboard, profile, userId, onRefreshDashboard, onLogout }) {
  const data = dashboard?.data ?? dashboard ?? {};
  const activeProfile = profile || data.profile || {};

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(activeProfile.displayName || activeProfile.name || '');
  const [monthlyBudget, setMonthlyBudget] = useState(
    String(activeProfile.monthlyBudget || activeProfile.budget || '3000000')
  );
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const currentBudget = Number(activeProfile.monthlyBudget || activeProfile.budget || 0);
  const goalLabel = GOAL_LABELS[activeProfile.mainGoal] || activeProfile.mainGoal || 'Tiết kiệm phòng thân';

  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isFreezing, setIsFreezing] = useState(false);

  const isPremium = Boolean(activeProfile.isPremium);
  const freezeStreakLeft = Number(activeProfile.freezeStreakLeft || 0);
  const currentStreak = Number(activeProfile.streak || 1);
  const premiumBadge = getPremiumBadge(isPremium);
  const freezeStatus = formatFreezeStreakStatus(isPremium, freezeStreakLeft);

  const [isRestoring, setIsRestoring] = useState(false);

  const handleUpgradePremium = () => {
    Alert.alert(
      'Nâng Cấp Gói Premium VIP',
      'Đăng ký gói 29.000đ/tháng (RevenueCat Store IAP) để nhận ngay:\n• 5 vé chơi runner mỗi ngày (thay vì 3)\n• 2 lượt Đóng Băng Streak bảo vệ chuỗi ngày\n• Huy hiệu VIP độc quyền',
      [
        { text: 'Để sau', style: 'cancel' },
        {
          text: 'Xác nhận (29.000đ)',
          onPress: async () => {
            setIsUpgrading(true);
            try {
              await purchasePremium(userId);
              Alert.alert('Thành công! 🎉', 'Bạn đã kích hoạt thành công gói Premium VIP!');
              await onRefreshDashboard?.();
            } catch (err) {
              Alert.alert('Thông báo', err.message || 'Không thể hoàn tất giao dịch');
            } finally {
              setIsUpgrading(false);
            }
          },
        },
      ]
    );
  };

  const handleRestorePurchases = async () => {
    setIsRestoring(true);
    try {
      const result = await restorePurchases(userId, activeProfile);
      Alert.alert(result.success ? 'Thành công! 🎉' : 'Thông báo', result.message);
      if (result.success) {
        await onRefreshDashboard?.();
      }
    } catch (err) {
      Alert.alert('Lỗi', err.message || 'Không thể khôi phục giao dịch');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleFreezeStreak = () => {
    if (!isPremium) {
      Alert.alert(
        'Tính năng Premium',
        'Tính năng Đóng Băng Streak chỉ dành riêng cho thành viên Premium (29.000đ/tháng). Bạn có muốn nâng cấp ngay?',
        [
          { text: 'Hủy', style: 'cancel' },
          { text: 'Nâng cấp ngay', onPress: handleUpgradePremium },
        ]
      );
      return;
    }

    if (freezeStreakLeft <= 0) {
      Alert.alert(
        'Hết lượt đóng băng',
        'Bạn đã dùng hết 2 lượt đóng băng streak trong tháng này. Hãy giữ kỷ luật để không mất streak nhé!'
      );
      return;
    }

    Alert.alert(
      'Kích hoạt Đóng Băng Streak ❄️',
      `Bạn còn ${freezeStreakLeft}/2 lượt. Kích hoạt sẽ giữ nguyên chuỗi streak ${currentStreak} ngày của bạn không bị mất!`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Kích hoạt ngay',
          onPress: async () => {
            setIsFreezing(true);
            try {
              await apiPost('/profile/freeze-streak', { userId });
              Alert.alert('Đã đóng băng! ❄️', 'Chuỗi ngày của bạn đã được đóng băng và bảo vệ an toàn!');
              await onRefreshDashboard?.();
            } catch (err) {
              Alert.alert('Lỗi', err.message || 'Không thể kích hoạt đóng băng');
            } finally {
              setIsFreezing(false);
            }
          },
        },
      ]
    );
  };

  const [notifSettings, setNotifSettings] = useState(DEFAULT_NOTIFICATION_SETTINGS);
  const [isTestingNotif, setIsTestingNotif] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await getNotificationSettings();
      setNotifSettings(saved);
      await syncAllDisciplineNotifications(saved);
    })();
  }, []);

  const handleToggleDailyExpense = async () => {
    const updated = {
      ...notifSettings,
      dailyExpense: !notifSettings.dailyExpense,
    };
    setNotifSettings(updated);
    await saveNotificationSettings(updated);
    await syncAllDisciplineNotifications(updated);
  };

  const handleToggleNightSale = async () => {
    const updated = {
      ...notifSettings,
      nightSaleWarning: !notifSettings.nightSaleWarning,
    };
    setNotifSettings(updated);
    await saveNotificationSettings(updated);
    await syncAllDisciplineNotifications(updated);
  };

  const handleTestNotification = async (type = 'daily') => {
    setIsTestingNotif(true);
    try {
      const perm = await requestNotificationPermission();
      if (!perm.granted) {
        Alert.alert(
          'Chưa cấp quyền thông báo',
          'Vui lòng cấp quyền thông báo trong Cài đặt thiết bị để nhận nhắc nhở đúng giờ.'
        );
        return;
      }
      await scheduleTestReminder(type);
      Alert.alert(
        'Đã gửi thông báo thử nghiệm! ⏰',
        type === 'sale'
          ? 'Thông báo Cảnh báo bão sale sẽ xuất hiện sau 5 giây!'
          : 'Thông báo Nhắc ghi chi tiêu sẽ xuất hiện sau 5 giây!'
      );
    } catch (err) {
      Alert.alert('Lỗi', err.message || 'Không thể tạo thông báo thử nghiệm');
    } finally {
      setIsTestingNotif(false);
    }
  };

  const handleSave = async () => {
    const rawBudget = Number(monthlyBudget.replace(/[^0-9]/g, '')) || 0;
    if (rawBudget <= 0) {
      setFormError('Ngân sách tháng phải lớn hơn 0đ.');
      return;
    }

    setIsSaving(true);
    setFormError('');
    setSuccessMessage('');

    try {
      await apiPatch(`/profile/${userId}`, {
        displayName: displayName.trim() || 'Chiến Binh Mỏ Hỗn',
        monthlyBudget: rawBudget,
      });

      setSuccessMessage('Đã cập nhật hồ sơ thành công! 🎉');
      setIsEditing(false);
      await onRefreshDashboard?.();
    } catch (err) {
      setFormError(err.message || 'Không thể lưu hồ sơ, thử lại nha.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetData = () => {
    Alert.alert(
      'Xóa sạch dữ liệu (Nghị định 13)',
      'Bạn có chắc chắn muốn xóa toàn bộ lịch sử chi tiêu và điểm số trên thiết bị này? Thao tác này không thể hoàn tác.',
      [
        { text: 'Hủy bỏ', style: 'cancel' },
        {
          text: 'Xóa vĩnh viễn',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert('Đã xóa dữ liệu', 'Khởi động lại ứng dụng để tạo hồ sơ mới.');
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Header Profile Card */}
      <NeoCard bg="yellow" style={styles.card}>
        <View style={styles.cardHeader}>
          <NeoBadge bg="black">
            <Text style={styles.badgeText}>⚙️ HỒ SƠ CHIẾN BINH</Text>
          </NeoBadge>
          <View style={styles.headerBtnGroup}>
            <TouchableOpacity
              style={styles.headerLogoutPill}
              onPress={() => {
                Alert.alert(
                  'Đăng xuất',
                  'Bạn có chắc chắn muốn đăng xuất?',
                  [
                    { text: 'Hủy', style: 'cancel' },
                    { text: 'Đăng xuất', style: 'destructive', onPress: () => onLogout?.() },
                  ]
                );
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="log-out-outline" size={14} color="#E11D48" />
              <Text style={styles.headerLogoutText}>Đăng xuất</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => {
                setIsEditing(!isEditing);
                setFormError('');
                setSuccessMessage('');
              }}
            >
              <Text style={styles.editBtnText}>
                {isEditing ? '✕ HỦY' : '✏️ SỬA'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {successMessage ? (
          <View style={styles.successBox}>
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        ) : null}

        {isEditing ? (
          /* Edit Form */
          <View style={styles.formContainer}>
            {formError ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{formError}</Text>
              </View>
            ) : null}

            <NeoInput
              label="TÊN HIỂN THỊ"
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Ví dụ: Chiến Binh Kiên Cường"
              editable={!isSaving}
            />

            <NeoInput
              label="NGÂN SÁCH THÁNG (VNĐ)"
              value={monthlyBudget}
              onChangeText={setMonthlyBudget}
              keyboardType="numeric"
              placeholder="Ví dụ: 3000000"
              editable={!isSaving}
            />

            <NeoButton
              variant="coral"
              size="md"
              onPress={handleSave}
              disabled={isSaving}
              style={styles.saveBtn}
            >
              {isSaving ? <ActivityIndicator color={neoColors.white} /> : 'LƯU THAY ĐỔI'}
            </NeoButton>
          </View>
        ) : (
          /* View Mode */
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tên chiến binh:</Text>
              <Text style={styles.infoValue}>
                {activeProfile.displayName || activeProfile.name || 'Chiến Binh Mỏ Hỗn'}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Hạn mức chi tiêu:</Text>
              <Text style={styles.infoValue}>{formatVnd(currentBudget)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mục tiêu theo đuổi:</Text>
              <Text style={styles.infoValue}>{goalLabel}</Text>
            </View>
          </View>
        )}
      </NeoCard>

      {/* 2. Premium VIP Subscription Card */}
      <NeoCard bg={isPremium ? "mint" : "white"} style={styles.card}>
        <View style={styles.cardHeader}>
          <NeoBadge bg={isPremium ? "yellow" : "black"}>
            <Text style={isPremium ? styles.badgeDarkText : styles.badgeText}>
              👑 {premiumBadge.label}
            </Text>
          </NeoBadge>
          <Text style={styles.premiumPriceTag}>
            {isPremium ? 'ĐANG KÍCH HOẠT' : PREMIUM_PLAN_INFO.priceText}
          </Text>
        </View>

        <View style={styles.benefitList}>
          {PREMIUM_PLAN_INFO.benefits.map((b, idx) => (
            <View key={idx} style={styles.benefitRow}>
              <Ionicons
                name={isPremium ? "checkmark-circle" : "shield-checkmark-outline"}
                size={16}
                color={isPremium ? "#059669" : neoColors.black}
              />
              <Text style={styles.benefitText}>{b}</Text>
            </View>
          ))}
        </View>

        {!isPremium ? (
          <>
            <TouchableOpacity
              style={styles.upgradeBtn}
              onPress={handleUpgradePremium}
              disabled={isUpgrading}
              activeOpacity={0.8}
            >
              {isUpgrading ? (
                <ActivityIndicator color={neoColors.black} />
              ) : (
                <Text style={styles.upgradeBtnText}>🚀 NÂNG CẤP PREMIUM (29K/THÁNG)</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.restoreBtn}
              onPress={handleRestorePurchases}
              disabled={isRestoring}
              activeOpacity={0.7}
            >
              {isRestoring ? (
                <ActivityIndicator color={neoColors.grayMuted} size="small" />
              ) : (
                <Text style={styles.restoreBtnText}>🔄 Khôi phục gói đã mua (Restore)</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.activeVipBox}>
            <Text style={styles.activeVipText}>
              ✨ Bạn đang hưởng trọn đặc quyền: 5 vé runner/ngày & 2 lần đóng băng streak!
            </Text>
          </View>
        )}
      </NeoCard>

      {/* 3. Freeze Streak Utility Card */}
      <NeoCard bg="white" style={styles.card}>
        <View style={styles.cardHeader}>
          <NeoBadge bg="cyan">
            <Text style={styles.badgeDarkText}>❄️ ĐÓNG BĂNG STREAK</Text>
          </NeoBadge>
          <View style={styles.freezeBadgeBox}>
            <Text style={styles.freezeBadgeText}>{freezeStatus.badge}</Text>
          </View>
        </View>

        <Text style={styles.freezeDesc}>
          {freezeStatus.text}
        </Text>

        <TouchableOpacity
          style={[
            styles.freezeBtn,
            freezeStatus.canFreeze ? styles.freezeBtnActive : styles.freezeBtnDisabled,
          ]}
          onPress={handleFreezeStreak}
          disabled={isFreezing}
          activeOpacity={0.8}
        >
          {isFreezing ? (
            <ActivityIndicator color={neoColors.black} />
          ) : (
            <Text style={styles.freezeBtnText}>
              {freezeStatus.buttonLabel}
            </Text>
          )}
        </TouchableOpacity>
      </NeoCard>

      {/* 4. Notification Settings Card */}
      <NeoCard bg="white" style={styles.card}>
        <View style={styles.cardHeader}>
          <NeoBadge bg="yellow">
            <Text style={styles.badgeDarkText}>🔔 THÔNG BÁO KỶ LUẬT</Text>
          </NeoBadge>
        </View>

        <Text style={styles.notifSummaryText}>
          {getNotificationSummary(notifSettings)}
        </Text>

        {/* Toggle 1: Nhắc ghi chi tiêu 20:00 */}
        <View style={styles.notifRow}>
          <View style={styles.notifInfo}>
            <View style={styles.notifTitleRow}>
              <Ionicons name="time-outline" size={16} color={neoColors.black} />
              <Text style={styles.notifTitle}>Nhắc ghi chi tiêu (20:00)</Text>
            </View>
            <Text style={styles.notifSubText}>
              Nhắc nhẹ tổng kết ngày trước khi não bạn xóa lịch sử ví.
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              notifSettings.dailyExpense ? styles.toggleActive : styles.toggleInactive,
            ]}
            onPress={handleToggleDailyExpense}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.toggleText,
                notifSettings.dailyExpense ? styles.toggleTextActive : styles.toggleTextInactive,
              ]}
            >
              {notifSettings.dailyExpense ? 'BẬT' : 'TẮT'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Toggle 2: Cảnh báo bão sale 22:45 */}
        <View style={styles.notifRow}>
          <View style={styles.notifInfo}>
            <View style={styles.notifTitleRow}>
              <Ionicons name="warning-outline" size={16} color="#FF5C5C" />
              <Text style={styles.notifTitle}>Cảnh báo bão sale đêm (22:45)</Text>
            </View>
            <Text style={styles.notifSubText}>
              Báo động chống lướt sàn mua sắm khuya, giữ vững túi tiền.
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              notifSettings.nightSaleWarning ? styles.toggleActive : styles.toggleInactive,
            ]}
            onPress={handleToggleNightSale}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.toggleText,
                notifSettings.nightSaleWarning ? styles.toggleTextActive : styles.toggleTextInactive,
              ]}
            >
              {notifSettings.nightSaleWarning ? 'BẬT' : 'TẮT'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Test Buttons Row */}
        <View style={styles.testBtnRow}>
          <TouchableOpacity
            style={styles.testBtn}
            onPress={() => handleTestNotification('daily')}
            disabled={isTestingNotif}
            activeOpacity={0.8}
          >
            <Ionicons name="paper-plane-outline" size={14} color={neoColors.black} />
            <Text style={styles.testBtnText}>Test Nhắc 20:00 (5s)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.testBtn}
            onPress={() => handleTestNotification('sale')}
            disabled={isTestingNotif}
            activeOpacity={0.8}
          >
            <Ionicons name="flash-outline" size={14} color="#FF5C5C" />
            <Text style={styles.testBtnText}>Test Bão Sale (5s)</Text>
          </TouchableOpacity>
        </View>
      </NeoCard>

      {/* 5. Privacy & Decree 13 Safety Card */}
      <NeoCard bg="white" style={styles.card}>
        <View style={styles.cardHeader}>
          <NeoBadge bg="mint">
            <Text style={styles.badgeDarkText}>🔒 BẢO MẬT & QUYỀN RIÊNG TƯ</Text>
          </NeoBadge>
        </View>

        <Text style={styles.privacyDesc}>
          Ví Mỏ Hỗn tuân thủ 100% Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân. Chúng tôi
          không lưu giữ tài khoản ngân hàng, CCCD hay bất kỳ thông tin tài chính nhạy cảm nào.
        </Text>

        <TouchableOpacity
          style={styles.resetBtn}
          onPress={handleResetData}
          activeOpacity={0.8}
        >
          <Ionicons name="trash-outline" size={18} color="#FF5C5C" />
          <Text style={styles.resetBtnText}>Xóa toàn bộ dữ liệu 1 chạm</Text>
        </TouchableOpacity>
      </NeoCard>

      {/* 5. Logout / Chuyển Tài Khoản Card */}
      <NeoCard bg="white" style={styles.card}>
        <View style={styles.cardHeader}>
          <NeoBadge bg="yellow">
            <Text style={styles.badgeDarkText}>🚪 TÀI KHOẢN & PHIÊN ĐĂNG NHẬP</Text>
          </NeoBadge>
        </View>

        <Text style={styles.privacyDesc}>
          Đang đăng nhập với mã người dùng: {userId || activeProfile.id || 'Người dùng 1'}
        </Text>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            Alert.alert(
              'Đăng xuất',
              'Bạn có chắc chắn muốn đăng xuất khỏi phiên làm việc hiện tại?',
              [
                { text: 'Hủy', style: 'cancel' },
                {
                  text: 'Đăng xuất',
                  style: 'destructive',
                  onPress: () => onLogout?.(),
                },
              ]
            );
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={18} color="#FF5C5C" />
          <Text style={styles.logoutBtnText}>Đăng xuất khỏi tài khoản</Text>
        </TouchableOpacity>
      </NeoCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
    gap: 16,
  },
  card: {
    gap: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerBtnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerLogoutPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF1F2',
    borderColor: '#FF5C5C',
    borderWidth: 1.5,
    borderRadius: neoRadii.sm,
    paddingHorizontal: 8,
    paddingVertical: 4.5,
  },
  headerLogoutText: {
    color: '#E11D48',
    fontSize: 10.5,
    fontWeight: '800',
  },
  badgeText: {
    color: neoColors.white,
    fontSize: 10,
    fontWeight: '900',
  },
  badgeDarkText: {
    color: neoColors.black,
    fontSize: 10,
    fontWeight: '900',
  },
  editBtn: {
    backgroundColor: neoColors.white,
    borderColor: neoColors.black,
    borderWidth: 1.5,
    borderRadius: neoRadii.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  editBtnText: {
    color: neoColors.black,
    fontSize: 11,
    fontWeight: '900',
  },
  infoContainer: {
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: neoColors.black,
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  infoLabel: {
    color: neoColors.black,
    fontSize: 12,
    fontWeight: '700',
  },
  infoValue: {
    color: neoColors.black,
    fontSize: 13,
    fontWeight: '900',
  },
  formContainer: {
    gap: 12,
  },
  saveBtn: {
    marginTop: 4,
  },
  successBox: {
    backgroundColor: neoColors.lime,
    borderColor: neoColors.black,
    borderWidth: 1.5,
    borderRadius: neoRadii.sm,
    padding: 8,
  },
  successText: {
    color: neoColors.black,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#FFE5E5',
    borderColor: neoColors.coral,
    borderWidth: 1.5,
    borderRadius: neoRadii.sm,
    padding: 8,
  },
  errorText: {
    color: neoColors.coral,
    fontSize: 12,
    fontWeight: '800',
  },
  privacyDesc: {
    color: neoColors.grayMuted,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
  },
  resetBtn: {
    borderColor: neoColors.coral,
    borderWidth: 1.5,
    borderRadius: neoRadii.md,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFF5F5',
  },
  resetBtnText: {
    color: neoColors.coral,
    fontSize: 12,
    fontWeight: '800',
  },
  premiumPriceTag: {
    color: neoColors.black,
    fontSize: 12,
    fontWeight: '900',
  },
  benefitList: {
    gap: 8,
    marginVertical: 4,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    color: neoColors.black,
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  upgradeBtn: {
    backgroundColor: neoColors.yellow,
    borderColor: neoColors.black,
    borderWidth: neoBorders.thick,
    borderRadius: neoRadii.md,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...neoShadows.sm,
    marginTop: 6,
  },
  upgradeBtnText: {
    color: neoColors.black,
    fontSize: 13,
    fontWeight: '900',
  },
  restoreBtn: {
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  restoreBtnText: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  activeVipBox: {
    backgroundColor: '#DCFCE7',
    borderColor: '#16A34A',
    borderWidth: 1.5,
    borderRadius: neoRadii.sm,
    padding: 10,
    marginTop: 4,
  },
  activeVipText: {
    color: '#15803D',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  freezeBadgeBox: {
    backgroundColor: '#E0F2FE',
    borderColor: '#0284C7',
    borderWidth: 1.5,
    borderRadius: neoRadii.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  freezeBadgeText: {
    color: '#0369A1',
    fontSize: 11,
    fontWeight: '900',
  },
  freezeDesc: {
    color: neoColors.black,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
  },
  freezeBtn: {
    borderColor: neoColors.black,
    borderWidth: neoBorders.thick,
    borderRadius: neoRadii.md,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  freezeBtnActive: {
    backgroundColor: '#38BDF8',
    ...neoShadows.sm,
  },
  freezeBtnDisabled: {
    backgroundColor: '#E2E8F0',
  },
  freezeBtnText: {
    color: neoColors.black,
    fontSize: 13,
    fontWeight: '900',
  },
  notifSummaryText: {
    color: '#0284C7',
    fontSize: 11,
    fontWeight: '800',
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
    borderWidth: 1,
    borderRadius: neoRadii.sm,
    padding: 6,
    textAlign: 'center',
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  notifInfo: {
    flex: 1,
    gap: 4,
  },
  notifTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  notifTitle: {
    color: neoColors.black,
    fontSize: 13,
    fontWeight: '800',
  },
  notifSubText: {
    color: neoColors.grayMuted,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
  },
  toggleBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: neoRadii.sm,
    borderWidth: neoBorders.standard,
    borderColor: neoColors.black,
    minWidth: 62,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#22C55E',
    ...neoShadows.sm,
  },
  toggleInactive: {
    backgroundColor: '#E2E8F0',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '900',
  },
  toggleTextActive: {
    color: neoColors.white,
  },
  toggleTextInactive: {
    color: '#64748B',
  },
  testBtnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  testBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEF9C3',
    borderColor: neoColors.black,
    borderWidth: 1.5,
    borderRadius: neoRadii.sm,
    paddingVertical: 8,
  },
  testBtnText: {
    color: neoColors.black,
    fontSize: 11,
    fontWeight: '800',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF1F2',
    borderColor: '#FF5C5C',
    borderWidth: 2,
    borderRadius: neoRadii.md,
    paddingVertical: 12,
    marginTop: 4,
  },
  logoutBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#E11D48',
  },
  charRoleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  charRoleText: {
    color: '#0F172A',
    fontSize: 9.5,
    fontWeight: '900',
  },
  charOverviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 10,
  },
  charAvatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
  },
  charInfoWrap: {
    flex: 1,
  },
  charNameText: {
    color: neoColors.black,
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 2,
  },
  charDescText: {
    color: neoColors.grayMuted,
    fontSize: 11.5,
    lineHeight: 16,
  },
  changeCharBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#38BDF8',
    borderColor: neoColors.black,
    borderWidth: neoBorders.thick,
    borderRadius: neoRadii.md,
    paddingVertical: 10,
    marginTop: 4,
    ...neoShadows.sm,
  },
  changeCharBtnText: {
    color: neoColors.white,
    fontSize: 12.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  creditsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 1.5,
    borderRadius: neoRadii.md,
    paddingVertical: 10,
    marginTop: 4,
  },
  creditsBtnText: {
    color: '#059669',
    fontSize: 12.5,
    fontWeight: '800',
  },
});
