import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ACCOUNTS_STORAGE_KEY,
  LAST_USER_STORAGE_KEY,
  normalizeUsername,
  isValidPin,
  parseAccounts,
  findAccountByUsername,
  findAccountById,
  verifyCredentials,
  registerAccountInList,
} from './authService.cjs';

export async function getStoredAccounts() {
  try {
    const raw = await AsyncStorage.getItem(ACCOUNTS_STORAGE_KEY);
    return parseAccounts(raw);
  } catch (e) {
    console.warn('[authService] Failed to read accounts:', e);
    return [];
  }
}

export async function saveStoredAccounts(accounts) {
  try {
    await AsyncStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.warn('[authService] Failed to save accounts:', e);
  }
}

export async function getLastActiveUser() {
  try {
    return await AsyncStorage.getItem(LAST_USER_STORAGE_KEY);
  } catch {
    return null;
  }
}

export async function setLastActiveUser(userId) {
  try {
    if (userId) {
      await AsyncStorage.setItem(LAST_USER_STORAGE_KEY, userId);
    } else {
      await AsyncStorage.removeItem(LAST_USER_STORAGE_KEY);
    }
  } catch {
    // Ignore
  }
}

export async function loginWithPin(username, pinCode) {
  const accounts = await getStoredAccounts();
  const result = verifyCredentials(accounts, username, pinCode);
  if (result.success && result.account) {
    await setLastActiveUser(result.account.id);
  }
  return result;
}

export async function registerNewUser({ name, pin, profile }) {
  const accounts = await getStoredAccounts();
  const { accounts: updatedAccounts, account } = registerAccountInList(accounts, {
    name,
    pin,
    profile,
  });
  await saveStoredAccounts(updatedAccounts);
  await setLastActiveUser(account.id);
  return account;
}

export {
  isValidPin,
  normalizeUsername,
  findAccountByUsername,
  findAccountById,
};
