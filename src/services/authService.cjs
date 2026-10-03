/**
 * Auth Service: Multi-account management with custom individual PIN authentication
 */

const ACCOUNTS_STORAGE_KEY = 'vmh_registered_accounts_v2';
const LAST_USER_STORAGE_KEY = 'vmh_last_active_user_v2';

/**
 * Normalizes username for consistent matching (case-insensitive, trimmed)
 */
function normalizeUsername(name) {
  return (name || '').trim().toLowerCase();
}

/**
 * Validates PIN format: 4 to 6 numeric digits
 */
function isValidPin(pin) {
  return typeof pin === 'string' && /^\d{4,6}$/.test(pin.trim());
}

/**
 * In-memory fallback if storage is unavailable (e.g. testing)
 */
let inMemoryAccounts = [];

/**
 * Parse accounts from raw JSON string
 */
function parseAccounts(rawJson) {
  if (!rawJson) return [];
  try {
    const data = JSON.parse(rawJson);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/**
 * Find account by username in account list
 */
function findAccountByUsername(accounts, username) {
  const norm = normalizeUsername(username);
  return accounts.find((acc) => normalizeUsername(acc.name) === norm);
}

/**
 * Find account by userId in account list
 */
function findAccountById(accounts, userId) {
  return accounts.find((acc) => acc.id === userId);
}

/**
 * Verify credentials against account list
 */
function verifyCredentials(accounts, username, pinCode) {
  const norm = normalizeUsername(username);
  const account = accounts.find((acc) => normalizeUsername(acc.name) === norm);

  if (!account) {
    return {
      success: false,
      error: `Tài khoản "${username}" chưa tồn tại. Vui lòng chuyển sang tab Đăng Ký Mới.`,
      account: null,
    };
  }

  if (account.pin !== pinCode.trim()) {
    return {
      success: false,
      error: `Mã PIN không chính xác cho tài khoản "${account.name}". Vui lòng nhập đúng mã PIN bạn đã tạo!`,
      account: null,
    };
  }

  return {
    success: true,
    error: null,
    account,
  };
}

/**
 * Add or update account in account list
 */
function registerAccountInList(accounts, { id, name, pin, profile }) {
  const norm = normalizeUsername(name);
  const existingIdx = accounts.findIndex((acc) => normalizeUsername(acc.name) === norm);

  const newAccount = {
    id: id || `user_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    name: (name || '').trim(),
    pin: pin.trim(),
    createdAt: new Date().toISOString(),
    profile: profile || null,
  };

  const updated = [...accounts];
  if (existingIdx >= 0) {
    updated[existingIdx] = { ...updated[existingIdx], ...newAccount };
  } else {
    updated.push(newAccount);
  }

  return {
    accounts: updated,
    account: newAccount,
  };
}

module.exports = {
  ACCOUNTS_STORAGE_KEY,
  LAST_USER_STORAGE_KEY,
  normalizeUsername,
  isValidPin,
  parseAccounts,
  findAccountByUsername,
  findAccountById,
  verifyCredentials,
  registerAccountInList,
};
