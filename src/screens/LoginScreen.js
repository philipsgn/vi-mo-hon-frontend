import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { retroTokens } from '../theme/retroTokens';
import { RetroCard } from '../components/common/RetroCard';
import { RetroButton } from '../components/common/RetroButton';
import {
  getStoredAccounts,
  loginWithPin,
  registerNewUser,
  isValidPin,
} from '../services/authService';

export const HARDCODED_USER = {
  id: 'user_1234',
  name: 'Người dùng 1',
  code: '1234',
};

export function LoginScreen({ onLoginSuccess, onRegisterSuccess }) {
  const [authMode, setAuthMode] = useState('LOGIN'); // 'LOGIN' | 'REGISTER'
  const [storedAccounts, setStoredAccounts] = useState([]);

  // Login form state
  const [loginName, setLoginName] = useState(HARDCODED_USER.name);
  const [loginPin, setLoginPin] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regPin, setRegPin] = useState('');
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(true);

  const [errorMessage, setErrorMessage] = useState('');

  // Load registered accounts on mount
  useEffect(() => {
    async function loadAccounts() {
      const accounts = await getStoredAccounts();
      setStoredAccounts(accounts);
      if (accounts.length > 0) {
        setLoginName(accounts[accounts.length - 1].name);
      }
    }
    loadAccounts();
  }, [authMode]);

  // Numpad input handler
  const currentPin = authMode === 'LOGIN' ? loginPin : regPin;
  const setPin = authMode === 'LOGIN' ? setLoginPin : setRegPin;

  const handleKeyPress = (digit) => {
    if (currentPin.length < 6) {
      setPin(currentPin + String(digit));
      setErrorMessage('');
    }
  };

  const handleDeletePress = () => {
    if (currentPin.length > 0) {
      setPin(currentPin.slice(0, -1));
      setErrorMessage('');
    }
  };

  const handleClearPin = () => {
    setPin('');
    setErrorMessage('');
  };

  const handleLogin = async () => {
    const trimmedName = loginName.trim();
    const trimmedPin = loginPin.trim();

    if (!trimmedName) {
      setErrorMessage('Vui lòng nhập tên tài khoản của bạn.');
      return;
    }
    if (!trimmedPin) {
      setErrorMessage('Vui lòng nhập mã PIN bạn đã tạo khi đăng ký.');
      return;
    }

    // 1. Check local registered accounts
    const authResult = await loginWithPin(trimmedName, trimmedPin);

    if (authResult.success) {
      setErrorMessage('');
      onLoginSuccess?.({
        userId: authResult.account.id,
        userName: authResult.account.name,
      });
      return;
    }

    // 2. Fallback for default test user (user_1234 / 1234)
    if (trimmedName.toLowerCase() === HARDCODED_USER.name.toLowerCase() && trimmedPin === HARDCODED_USER.code) {
      setErrorMessage('');
      onLoginSuccess?.({
        userId: HARDCODED_USER.id,
        userName: HARDCODED_USER.name,
      });
      return;
    }

    // 3. Invalid credentials
    setErrorMessage(authResult.error || `Mã PIN không đúng cho tài khoản "${trimmedName}". Vui lòng kiểm tra lại!`);
  };

  const handleRegister = async () => {
    const trimmedName = regName.trim();
    if (!trimmedName) {
      setErrorMessage('Vui lòng nhập tên hiển thị của bạn.');
      return;
    }
    if (regPin.length < 4) {
      setErrorMessage('Vui lòng đặt mã PIN ít nhất 4 chữ số trên bàn phím.');
      return;
    }
    if (!isAgeConfirmed) {
      setErrorMessage('Vui lòng xác nhận bạn từ đủ 16 tuổi trở lên.');
      return;
    }

    try {
      const newAccount = await registerNewUser({
        name: trimmedName,
        pin: regPin,
      });

      setErrorMessage('');
      if (onRegisterSuccess) {
        onRegisterSuccess({
          userId: newAccount.id,
          name: trimmedName,
          code: regPin,
        });
      } else {
        onLoginSuccess?.({
          userId: newAccount.id,
          userName: trimmedName,
        });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Không thể tạo tài khoản mới.');
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardWrap}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Title */}
          <View style={styles.headerTitleWrap}>
            <Text style={styles.appTitle}>VÍ MỎ HỖN</Text>
            <Text style={styles.appSubtitle}>Ví Giả Lập & Học Tài Chính Thực Tế</Text>
          </View>

          {/* Mode Switch Tabs */}
          <View style={styles.modeTabsWrap}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setAuthMode('LOGIN');
                setErrorMessage('');
                setLoginPin('');
              }}
              style={[
                styles.modeTabBtn,
                authMode === 'LOGIN' && styles.modeTabBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.modeTabBtnText,
                  authMode === 'LOGIN' && styles.modeTabBtnTextActive,
                ]}
              >
                ĐĂNG NHẬP
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setAuthMode('REGISTER');
                setErrorMessage('');
                setRegPin('');
              }}
              style={[
                styles.modeTabBtn,
                authMode === 'REGISTER' && styles.modeTabBtnActive,
              ]}
            >
              <Text
                style={[
                  styles.modeTabBtnText,
                  authMode === 'REGISTER' && styles.modeTabBtnTextActive,
                ]}
              >
                ĐĂNG KÝ MỚI
              </Text>
            </TouchableOpacity>
          </View>

          {/* Main Card */}
          <RetroCard variant="dialog" style={styles.loginCard}>
            {authMode === 'LOGIN' ? (
              <>
                <View style={styles.cardHeaderRow}>
                  <Ionicons name="wallet-outline" size={20} color="#4F46E5" />
                  <Text style={styles.cardHeaderTitle}>ĐĂNG NHẬP VÍ CÁ NHÂN</Text>
                </View>

                {errorMessage ? (
                  <View style={styles.errorAlert}>
                    <Ionicons name="alert-circle" size={16} color="#B91C1C" />
                    <Text style={styles.errorAlertText}>{errorMessage}</Text>
                  </View>
                ) : null}

                {/* Nickname Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>TÊN TÀI KHOẢN</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="person-outline"
                      size={18}
                      color="#64748B"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      value={loginName}
                      onChangeText={setLoginName}
                      placeholder="Nhập tên tài khoản của bạn"
                      placeholderTextColor="#94A3B8"
                      autoCapitalize="words"
                      maxLength={20}
                    />
                  </View>
                </View>

                {/* Account quick selector chips if multiple accounts exist */}
                {storedAccounts.length > 0 ? (
                  <View style={styles.accountChipsRow}>
                    <Text style={styles.chipsLabel}>Tài khoản trên máy:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
                      {storedAccounts.map((acc) => (
                        <TouchableOpacity
                          key={acc.id}
                          style={[
                            styles.accountChip,
                            loginName.trim().toLowerCase() === acc.name.toLowerCase() && styles.accountChipActive,
                          ]}
                          onPress={() => {
                            setLoginName(acc.name);
                            setLoginPin('');
                            setErrorMessage('');
                          }}
                        >
                          <Text
                            style={[
                              styles.accountChipText,
                              loginName.trim().toLowerCase() === acc.name.toLowerCase() && styles.accountChipTextActive,
                            ]}
                          >
                            👤 {acc.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                ) : null}

                {/* PIN Display Row */}
                <View style={styles.pinSection}>
                  <Text style={styles.inputLabel}>NHẬP MÃ PIN CỦA BẠN</Text>
                  <View style={styles.pinDisplayRow}>
                    {[0, 1, 2, 3].map((index) => {
                      const isFilled = loginPin.length > index;
                      const char = loginPin[index] || '';
                      return (
                        <View
                          key={index}
                          style={[
                            styles.pinBox,
                            isFilled && styles.pinBoxFilled,
                          ]}
                        >
                          <Text style={styles.pinBoxText}>
                            {isFilled ? char : '•'}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>

                {/* 3x3 Numeric Keypad */}
                <View style={styles.numpadContainer}>
                  <View style={styles.numpadRow}>
                    {[1, 2, 3].map((num) => (
                      <TouchableOpacity
                        key={num}
                        style={styles.numKey}
                        activeOpacity={0.7}
                        onPress={() => handleKeyPress(num)}
                      >
                        <Text style={styles.numKeyText}>{num}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.numpadRow}>
                    {[4, 5, 6].map((num) => (
                      <TouchableOpacity
                        key={num}
                        style={styles.numKey}
                        activeOpacity={0.7}
                        onPress={() => handleKeyPress(num)}
                      >
                        <Text style={styles.numKeyText}>{num}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.numpadRow}>
                    {[7, 8, 9].map((num) => (
                      <TouchableOpacity
                        key={num}
                        style={styles.numKey}
                        activeOpacity={0.7}
                        onPress={() => handleKeyPress(num)}
                      >
                        <Text style={styles.numKeyText}>{num}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.numpadRow}>
                    <TouchableOpacity
                      style={[styles.numKey, styles.numKeySpecial]}
                      activeOpacity={0.7}
                      onPress={handleClearPin}
                    >
                      <Text style={styles.numKeySpecialText}>C</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.numKey}
                      activeOpacity={0.7}
                      onPress={() => handleKeyPress(0)}
                    >
                      <Text style={styles.numKeyText}>0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.numKey, styles.numKeySpecial]}
                      activeOpacity={0.7}
                      onPress={handleDeletePress}
                    >
                      <Ionicons name="backspace-outline" size={22} color="#0F172A" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Submit Button */}
                <View style={styles.actionWrap}>
                  <RetroButton
                    title="VÀO TRANG CHỦ"
                    variant="primary"
                    size="large"
                    onPress={handleLogin}
                    style={styles.playButton}
                  />
                </View>
              </>
            ) : (
              <>
                <View style={styles.cardHeaderRow}>
                  <Ionicons name="person-add-outline" size={20} color="#4F46E5" />
                  <Text style={styles.cardHeaderTitle}>TẠO TÀI KHOẢN MỚI</Text>
                </View>

                {errorMessage ? (
                  <View style={styles.errorAlert}>
                    <Ionicons name="alert-circle" size={16} color="#B91C1C" />
                    <Text style={styles.errorAlertText}>{errorMessage}</Text>
                  </View>
                ) : null}

                {/* Register: Nickname Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>TÊN HIỂN THỊ (*)</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="person-outline"
                      size={18}
                      color="#64748B"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      value={regName}
                      onChangeText={setRegName}
                      placeholder="Nhập tên của bạn"
                      placeholderTextColor="#94A3B8"
                      autoCapitalize="words"
                      maxLength={20}
                    />
                  </View>
                </View>

                {/* Register: PIN Display */}
                <View style={styles.pinSection}>
                  <Text style={styles.inputLabel}>ĐẶT MÃ PIN CỦA BẠN (4 SỐ)</Text>
                  <View style={styles.pinDisplayRow}>
                    {[0, 1, 2, 3].map((index) => {
                      const isFilled = regPin.length > index;
                      const char = regPin[index] || '';
                      return (
                        <View
                          key={index}
                          style={[
                            styles.pinBox,
                            isFilled && styles.pinBoxFilled,
                          ]}
                        >
                          <Text style={styles.pinBoxText}>
                            {isFilled ? char : '•'}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>

                {/* 3x3 Numeric Keypad */}
                <View style={styles.numpadContainer}>
                  <View style={styles.numpadRow}>
                    {[1, 2, 3].map((num) => (
                      <TouchableOpacity
                        key={num}
                        style={styles.numKey}
                        activeOpacity={0.7}
                        onPress={() => handleKeyPress(num)}
                      >
                        <Text style={styles.numKeyText}>{num}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.numpadRow}>
                    {[4, 5, 6].map((num) => (
                      <TouchableOpacity
                        key={num}
                        style={styles.numKey}
                        activeOpacity={0.7}
                        onPress={() => handleKeyPress(num)}
                      >
                        <Text style={styles.numKeyText}>{num}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.numpadRow}>
                    {[7, 8, 9].map((num) => (
                      <TouchableOpacity
                        key={num}
                        style={styles.numKey}
                        activeOpacity={0.7}
                        onPress={() => handleKeyPress(num)}
                      >
                        <Text style={styles.numKeyText}>{num}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={styles.numpadRow}>
                    <TouchableOpacity
                      style={[styles.numKey, styles.numKeySpecial]}
                      activeOpacity={0.7}
                      onPress={handleClearPin}
                    >
                      <Text style={styles.numKeySpecialText}>C</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.numKey}
                      activeOpacity={0.7}
                      onPress={() => handleKeyPress(0)}
                    >
                      <Text style={styles.numKeyText}>0</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.numKey, styles.numKeySpecial]}
                      activeOpacity={0.7}
                      onPress={handleDeletePress}
                    >
                      <Ionicons name="backspace-outline" size={22} color="#0F172A" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Age Confirmation Checkbox */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setIsAgeConfirmed(!isAgeConfirmed)}
                  style={styles.checkboxRow}
                >
                  <View
                    style={[
                      styles.checkboxBox,
                      isAgeConfirmed && styles.checkboxBoxChecked,
                    ]}
                  >
                    {isAgeConfirmed && (
                      <Ionicons name="checkmark" size={14} color="#FFF" />
                    )}
                  </View>
                  <Text style={styles.checkboxLabel}>
                    Tôi xác nhận đã từ đủ 16 tuổi trở lên (Tuân thủ NĐ 13/2023).
                  </Text>
                </TouchableOpacity>

                {/* Submit Register Button */}
                <View style={styles.actionWrap}>
                  <RetroButton
                    title="TIẾP TỤC: LẬP KẾ HOẠCH ➔"
                    variant="primary"
                    size="large"
                    onPress={handleRegister}
                    style={styles.playButton}
                  />
                </View>
              </>
            )}
          </RetroCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardWrap: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  headerTitleWrap: {
    alignItems: 'center',
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 1,
  },
  appSubtitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 4,
  },
  modeTabsWrap: {
    flexDirection: 'row',
    marginBottom: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1E293B',
    overflow: 'hidden',
  },
  modeTabBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  modeTabBtnActive: {
    backgroundColor: '#FFE600',
  },
  modeTabBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
  },
  modeTabBtnTextActive: {
    color: '#0F172A',
  },
  loginCard: {
    padding: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  errorAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1.5,
    borderColor: '#EF4444',
    borderRadius: 8,
    padding: 10,
    gap: 6,
    marginBottom: 12,
  },
  errorAlertText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#991B1B',
    flex: 1,
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1E293B',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    height: 42,
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },

  accountChipsRow: {
    marginBottom: 10,
  },
  chipsLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 4,
  },
  chipsScroll: {
    gap: 6,
  },
  accountChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 16,
  },
  accountChipActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#4F46E5',
  },
  accountChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  accountChipTextActive: {
    color: '#4F46E5',
    fontWeight: '900',
  },

  // PIN Display
  pinSection: {
    marginBottom: 12,
    alignItems: 'center',
  },
  pinDisplayRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  pinBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#94A3B8',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinBoxFilled: {
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },
  pinBoxText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E293B',
  },

  // Numpad 3x3
  numpadContainer: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    padding: 8,
    gap: 8,
    marginBottom: 12,
  },
  numpadRow: {
    flexDirection: 'row',
    gap: 8,
  },
  numKey: {
    flex: 1,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#1E293B',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E293B',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 0,
    elevation: 2,
  },
  numKeyText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  numKeySpecial: {
    backgroundColor: '#E2E8F0',
    borderColor: '#64748B',
  },
  numKeySpecialText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#475569',
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    gap: 8,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#1E293B',
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  checkboxLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    flex: 1,
  },
  actionWrap: {
    marginTop: 4,
  },
  playButton: {
    width: '100%',
  },
});
