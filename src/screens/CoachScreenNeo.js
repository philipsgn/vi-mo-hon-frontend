import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiPost } from '../api/client';
import {
  calculateEquivalents,
  checkDailyCoachUsage,
  getOfflineCoachVerdict,
  getDailyTipByDate,
  COACH_DAILY_FREE_LIMIT,
  COACH_LEGAL_DISCLAIMER,
} from '../utils/coachHelper.cjs';
import { DAILY_TIPS, DAILY_QUESTS } from '../data/dailyTips';

const PRESETS = [
  { item: 'Trà sữa trân châu', amount: '55000' },
  { item: 'Áo hoodie Shopee', amount: '350000' },
  { item: 'Vé concert đu idol', amount: '1800000' },
  { item: 'Blindbox Labubu', amount: '450000' },
];

export function CoachScreenNeo({ userId, dashboard }) {
  const [activeTab, setActiveTab] = useState('judge'); // 'judge' | 'chat' | 'tips'
  const [itemName, setItemName] = useState('');
  const [itemAmount, setItemAmount] = useState('');
  const [attitude, setAttitude] = useState('roast'); // 'roast' | 'gentle'
  const [isLoading, setIsLoading] = useState(false);
  const [verdict, setVerdict] = useState(null);

  // Daily Usage Tracking
  const [dailyUsage, setDailyUsage] = useState({ date: new Date().toISOString().slice(0, 10), count: 0 });
  const isPremium = Boolean(dashboard?.profile?.isPremium || dashboard?.profile?.subscriptionStatus === 'ACTIVE');
  const usageStatus = checkDailyCoachUsage(dailyUsage, isPremium);

  // Completed quests tracking
  const [completedQuests, setCompletedQuests] = useState([]);

  // Chat tab state
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'welcome',
      role: 'coach',
      text: 'Chào bạn! Mình là AI Coach Đồng Hành. Bạn đang phân vân trước món đồ nào hay sợ bị vượt ngân sách? Hãy chia sẻ với mình nhé!',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatSending, setIsChatSending] = useState(false);

  // Today's Tip
  const todayTip = getDailyTipByDate(new Date().toISOString().slice(0, 10), DAILY_TIPS);

  // Load usage & quests on mount
  useEffect(() => {
    if (!userId) return;
    const todayStr = new Date().toISOString().slice(0, 10);
    AsyncStorage.getItem(`vmh_coach_usage_${userId}`).then((res) => {
      if (res) {
        try {
          const parsed = JSON.parse(res);
          if (parsed.date === todayStr) {
            setDailyUsage(parsed);
          } else {
            const fresh = { date: todayStr, count: 0 };
            setDailyUsage(fresh);
            AsyncStorage.setItem(`vmh_coach_usage_${userId}`, JSON.stringify(fresh));
          }
        } catch {}
      }
    });

    AsyncStorage.getItem(`vmh_completed_quests_${userId}_${todayStr}`).then((res) => {
      if (res) {
        try {
          setCompletedQuests(JSON.parse(res));
        } catch {}
      }
    });
  }, [userId]);

  const incrementUsage = () => {
    if (isPremium) return;
    const todayStr = new Date().toISOString().slice(0, 10);
    setDailyUsage((prev) => {
      const nextCount = (prev.date === todayStr ? prev.count : 0) + 1;
      const updated = { date: todayStr, count: nextCount };
      if (userId) {
        AsyncStorage.setItem(`vmh_coach_usage_${userId}`, JSON.stringify(updated)).catch(() => {});
      }
      return updated;
    });
  };

  const handleToggleQuest = (questId) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    setCompletedQuests((prev) => {
      const isDone = prev.includes(questId);
      const next = isDone ? prev.filter((id) => id !== questId) : [...prev, questId];
      if (userId) {
        AsyncStorage.setItem(`vmh_completed_quests_${userId}_${todayStr}`, JSON.stringify(next)).catch(() => {});
      }
      return next;
    });
  };

  const equivalents = calculateEquivalents(itemAmount);

  const handleAskVerdict = async () => {
    const rawItem = itemName.trim();
    const rawAmount = Number(itemAmount) || 0;

    if (!rawItem) {
      setVerdict({
        reply: 'Bạn hãy nhập tên món đồ dự định mua để mình tính toán nhanh nhé.',
        equivalents: calculateEquivalents(0),
        disclaimer: COACH_LEGAL_DISCLAIMER,
      });
      return;
    }

    if (!usageStatus.canAsk) {
      setVerdict({
        reply: 'Hôm nay bạn đã dùng hết 5 lượt hỏi miễn phí. Hãy nghỉ ngơi hoặc nâng cấp Premium để tiếp tục trao đổi nha!',
        equivalents: calculateEquivalents(0),
        disclaimer: COACH_LEGAL_DISCLAIMER,
      });
      return;
    }

    setIsLoading(true);
    setVerdict(null);
    incrementUsage();

    try {
      if (userId) {
        const res = await apiPost('/coach/anti-regret', {
          userId,
          item: rawItem,
          amount: rawAmount,
          attitude,
        });
        if (res && res.data) {
          setVerdict({
            reply: res.data.reply || res.data.message,
            equivalents: res.data.equivalents || equivalents,
            disclaimer: COACH_LEGAL_DISCLAIMER,
          });
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Fallback
    }

    // Local fallback
    const offlineResult = getOfflineCoachVerdict(rawItem, rawAmount, attitude, {
      dailyBudget: dashboard?.dailyBudget || 100000,
      targetReason: dashboard?.profile?.targetReason || 'mục tiêu tích lũy',
    });
    setVerdict(offlineResult);
    setIsLoading(false);
  };

  const handleSendChat = async () => {
    const text = chatInput.trim();
    if (!text || isChatSending) return;

    if (!usageStatus.canAsk) {
      const limitMsg = {
        id: `coach_${Date.now()}`,
        role: 'coach',
        text: 'Hôm nay bạn đã dùng hết 5 lượt hỏi miễn phí. Hẹn gặp lại bạn vào ngày mai hoặc nâng cấp Premium nha!',
      };
      setChatMessages((prev) => [...prev, limitMsg]);
      return;
    }

    const userMsg = { id: `user_${Date.now()}`, role: 'user', text };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsChatSending(true);
    incrementUsage();

    try {
      if (userId) {
        const res = await apiPost('/coach/chat', {
          userId,
          message: text,
        });
        if (res && res.data && res.data.reply) {
          const coachMsg = { id: `coach_${Date.now()}`, role: 'coach', text: res.data.reply };
          setChatMessages((prev) => [...prev, coachMsg]);
          setIsChatSending(false);
          return;
        }
      }
    } catch {
      // Fallback
    }

    // Local fallback response
    setTimeout(() => {
      const fallbackMsg = {
        id: `coach_${Date.now()}`,
        role: 'coach',
        text: `Khoản chi này cần được xem xét với hạn mức ngày. Bạn thử áp dụng quy tắc 24h để xem cảm xúc mua có lắng xuống không nhé!`,
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
      setIsChatSending(false);
    }, 500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Usage Quota Banner */}
        <View style={styles.quotaBanner}>
          <View style={styles.quotaLeft}>
            <Ionicons name="sparkles" size={16} color={isPremium ? '#F59E0B' : '#4338CA'} />
            <Text style={styles.quotaText}>
              {isPremium
                ? '👑 Gói Premium: Hỏi Coach Không Giới Hạn'
                : `Lượt hỏi hôm nay: ${usageStatus.remaining}/${COACH_DAILY_FREE_LIMIT} lượt`}
            </Text>
          </View>
        </View>

        {/* Header Tabs */}
        <View style={styles.tabHeader}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'judge' && styles.tabItemActive]}
            onPress={() => setActiveTab('judge')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabItemText, activeTab === 'judge' && styles.tabItemTextActive]}>
              ⚡ Phán Quyết
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'chat' && styles.tabItemActive]}
            onPress={() => setActiveTab('chat')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabItemText, activeTab === 'chat' && styles.tabItemTextActive]}>
              💬 Chat AI
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'tips' && styles.tabItemActive]}
            onPress={() => setActiveTab('tips')}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabItemText, activeTab === 'tips' && styles.tabItemTextActive]}>
              💡 Thẻ Mẹo & Nhiệm Vụ
            </Text>
          </TouchableOpacity>
        </View>

        {/* TAB 1: PHÁN QUYẾT */}
        {activeTab === 'judge' && (
          <>
            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>MÓN ĐỒ BẠN ĐANG PHÂN VÂN</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Tên món đồ / dịch vụ</Text>
                <TextInput
                  placeholder="Ví dụ: Ly trà sữa, áo khoác sale..."
                  placeholderTextColor="#94A3B8"
                  value={itemName}
                  onChangeText={setItemName}
                  style={styles.textInput}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Giá tiền dự tính (VNĐ)</Text>
                <TextInput
                  placeholder="Ví dụ: 55000"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={itemAmount}
                  onChangeText={setItemAmount}
                  style={styles.textInput}
                />
              </View>

              {/* Presets */}
              <Text style={styles.presetTitle}>Gợi ý nhanh:</Text>
              <View style={styles.presetsWrap}>
                {PRESETS.map((p, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.presetChip}
                    onPress={() => {
                      setItemName(p.item);
                      setItemAmount(p.amount);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.presetChipText}>{p.item}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Attitude Switch */}
              <View style={styles.attitudeRow}>
                <Text style={styles.attitudeLabel}>Phong cách phản biện:</Text>
                <View style={styles.attitudeButtons}>
                  <TouchableOpacity
                    style={[
                      styles.attitudeBtn,
                      attitude === 'roast' && styles.attitudeBtnActiveCoral,
                    ]}
                    onPress={() => setAttitude('roast')}
                  >
                    <Text style={attitude === 'roast' ? styles.btnTextWhite : styles.btnTextDark}>
                      🔥 Sắc sảo
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.attitudeBtn,
                      attitude === 'gentle' && styles.attitudeBtnActiveMint,
                    ]}
                    onPress={() => setAttitude('gentle')}
                  >
                    <Text style={attitude === 'gentle' ? styles.btnTextDark : styles.btnTextDark}>
                      🌱 Ôn hòa
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.askBtn}
                onPress={handleAskVerdict}
                disabled={isLoading}
                activeOpacity={0.85}
              >
                {isLoading ? (
                  <ActivityIndicator color="#0F172A" />
                ) : (
                  <Text style={styles.askBtnText}>XIN Ý KIẾN TỪ AI COACH</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Verdict Result Card */}
            {verdict ? (
              <View style={styles.verdictCard}>
                <View style={styles.verdictHeader}>
                  <View style={styles.badgePillDark}>
                    <Text style={styles.badgePillDarkText}>PHÁN QUYẾT TÀI CHÍNH</Text>
                  </View>
                </View>

                <Text style={styles.verdictText}>"{verdict.reply}"</Text>

                {/* Equivalents */}
                {verdict.equivalents && verdict.equivalents.phoCount > 0 ? (
                  <View style={styles.equivBox}>
                    <Text style={styles.equivTitle}>TƯƠNG ĐƯƠNG VỚI:</Text>
                    <Text style={styles.equivItem}>
                      • {verdict.equivalents.phoCount} bát phở bò (35.000 đ)
                    </Text>
                    <Text style={styles.equivItem}>
                      • {verdict.equivalents.workHours} giờ lao động part-time (25.000 đ)
                    </Text>
                  </View>
                ) : null}

                <Text style={styles.disclaimerText}>🔒 {verdict.disclaimer || COACH_LEGAL_DISCLAIMER}</Text>
              </View>
            ) : null}
          </>
        )}

        {/* TAB 2: CHAT AI */}
        {activeTab === 'chat' && (
          <View style={styles.chatContainer}>
            <View style={styles.chatHistory}>
              {chatMessages.map((msg) => (
                <View
                  key={msg.id}
                  style={[
                    styles.chatBubble,
                    msg.role === 'user' ? styles.userBubble : styles.coachBubble,
                  ]}
                >
                  <Text style={msg.role === 'user' ? styles.userBubbleText : styles.coachBubbleText}>
                    {msg.text}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.chatInputRow}>
              <TextInput
                placeholder="Nhập câu hỏi tài chính..."
                placeholderTextColor="#94A3B8"
                value={chatInput}
                onChangeText={setChatInput}
                style={styles.chatTextInput}
                onSubmitEditing={handleSendChat}
              />
              <TouchableOpacity
                style={styles.sendBtn}
                onPress={handleSendChat}
                disabled={isChatSending}
              >
                <Ionicons name="send" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.chatDisclaimerText}>🔒 {COACH_LEGAL_DISCLAIMER}</Text>
          </View>
        )}

        {/* TAB 3: THẺ MẸO & NHIỆM VỤ NGÀY */}
        {activeTab === 'tips' && (
          <View style={styles.tipsContainer}>
            {todayTip && (
              <View style={styles.tipCard}>
                <View style={styles.tipHeaderRow}>
                  <View style={styles.badgePillDark}>
                    <Text style={styles.badgePillDarkText}>💡 THẺ MẸO HÔM NAY</Text>
                  </View>
                  <Text style={styles.tipCategoryText}>#{todayTip.category}</Text>
                </View>

                <Text style={styles.tipTitle}>{todayTip.title}</Text>
                <Text style={styles.tipContent}>{todayTip.content}</Text>

                <View style={styles.tipExampleBox}>
                  <Text style={styles.tipExampleText}>📊 {todayTip.exampleVnd}</Text>
                </View>

                <Text style={styles.tipSourceText}>📚 Nguồn: {todayTip.source}</Text>
              </View>
            )}

            {/* Quests Card */}
            <View style={styles.questCard}>
              <View style={styles.questHeaderRow}>
                <Ionicons name="flag" size={16} color="#0F172A" />
                <Text style={styles.questCardTitle}>NHIỆM VỤ KỶ LUẬT NGÀY</Text>
              </View>

              <View style={styles.questList}>
                {DAILY_QUESTS.map((q) => {
                  const isDone = completedQuests.includes(q.id);
                  return (
                    <TouchableOpacity
                      key={q.id}
                      style={[styles.questItem, isDone && styles.questItemDone]}
                      onPress={() => handleToggleQuest(q.id)}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.questCheck, isDone && styles.questCheckDone]}>
                        {isDone ? (
                          <Ionicons name="checkmark" size={14} color="#FFF" />
                        ) : null}
                      </View>
                      <View style={styles.questInfo}>
                        <Text style={[styles.questTitle, isDone && styles.questTitleDone]}>
                          {q.title}
                        </Text>
                        <Text style={styles.questDesc}>{q.desc}</Text>
                      </View>
                      <View style={styles.questRewardBadge}>
                        <Text style={styles.questRewardText}>+{q.rewardXp} XP</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
    gap: 14,
  },
  quotaBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EEF2FF',
    borderWidth: 2,
    borderColor: '#0F172A',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  quotaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quotaText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  tabHeader: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0F172A',
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemActive: {
    backgroundColor: '#FFE600',
  },
  tabItemText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  tabItemTextActive: {
    color: '#0F172A',
    fontWeight: '900',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  textInput: {
    height: 42,
    borderWidth: 1.5,
    borderColor: '#0F172A',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  presetTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  presetsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  presetChip: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#0F172A',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  presetChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  attitudeRow: {
    gap: 6,
    marginTop: 2,
  },
  attitudeLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  attitudeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  attitudeBtn: {
    flex: 1,
    height: 38,
    borderWidth: 1.5,
    borderColor: '#0F172A',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  attitudeBtnActiveCoral: {
    backgroundColor: '#FDA4AF',
  },
  attitudeBtnActiveMint: {
    backgroundColor: '#A7F3D0',
  },
  btnTextWhite: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
  },
  btnTextDark: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
  },
  askBtn: {
    backgroundColor: '#FFE600',
    borderWidth: 2,
    borderColor: '#0F172A',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    marginTop: 4,
  },
  askBtnText: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.5,
  },
  verdictCard: {
    backgroundColor: '#DCFCE7',
    borderWidth: 2,
    borderColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    gap: 10,
  },
  verdictHeader: {},
  badgePillDark: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgePillDarkText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  verdictText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 20,
  },
  equivBox: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#0F172A',
    gap: 4,
  },
  equivTitle: {
    fontSize: 10.5,
    fontWeight: '900',
    color: '#0F172A',
  },
  equivItem: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#334155',
  },
  disclaimerText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    lineHeight: 14,
  },
  chatContainer: {
    gap: 12,
  },
  chatHistory: {
    gap: 10,
  },
  chatBubble: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0F172A',
    maxWidth: '85%',
    shadowColor: '#0F172A',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFE600',
  },
  coachBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  userBubbleText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  coachBubbleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    lineHeight: 18,
  },
  chatInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chatTextInput: {
    flex: 1,
    height: 42,
    borderWidth: 2,
    borderColor: '#0F172A',
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  sendBtn: {
    width: 42,
    height: 42,
    backgroundColor: '#0F172A',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatDisclaimerText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    textAlign: 'center',
  },
  tipsContainer: {
    gap: 14,
  },
  tipCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 2,
    borderColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    gap: 8,
  },
  tipHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tipCategoryText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  tipContent: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
    lineHeight: 18,
  },
  tipExampleBox: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: '#0F172A',
    borderRadius: 10,
    padding: 8,
  },
  tipExampleText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#78350F',
  },
  tipSourceText: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
  },
  questCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    gap: 10,
  },
  questHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  questCardTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },
  questList: {
    gap: 8,
  },
  questItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    gap: 10,
  },
  questItemDone: {
    backgroundColor: '#DCFCE7',
    borderColor: '#15803D',
  },
  questCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#64748B',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  questCheckDone: {
    backgroundColor: '#15803D',
    borderColor: '#15803D',
  },
  questInfo: {
    flex: 1,
  },
  questTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F172A',
  },
  questTitleDone: {
    textDecorationLine: 'line-through',
    color: '#15803D',
  },
  questDesc: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '600',
  },
  questRewardBadge: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#B45309',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  questRewardText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#92400E',
  },
});
