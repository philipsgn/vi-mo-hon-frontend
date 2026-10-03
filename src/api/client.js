import Constants from 'expo-constants';
import { resolveApiBaseUrl } from '../utils/apiBaseUrl.cjs';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
const RESOLVED_API_BASE_URL = resolveApiBaseUrl({
  configuredUrl: API_BASE_URL,
  hostUri: Constants.expoConfig?.hostUri,
  isDevelopment: typeof __DEV__ !== 'undefined' && __DEV__,
});
const REQUEST_TIMEOUT_MS = 25000;

function buildUrl(path) {
  if (!RESOLVED_API_BASE_URL) {
    throw new Error(
      'No API endpoint available. Run Expo in LAN mode or set EXPO_PUBLIC_API_BASE_URL.',
    );
  }

  const cleanBaseUrl = RESOLVED_API_BASE_URL.replace(/\/+$/, '');
  let cleanPath = path.startsWith('/') ? path : `/${path}`;

  if (cleanBaseUrl.endsWith('/api') && cleanPath.startsWith('/api/')) {
    cleanPath = cleanPath.replace(/^\/api/, '');
  }

  return `${cleanBaseUrl}${cleanPath}`;
}

async function parseResponse(response) {
  const rawText = await response.text();
  const data = rawText ? JSON.parse(rawText) : null;

  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

async function apiRequest(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    options.timeoutMs || REQUEST_TIMEOUT_MS,
  );
  const { timeoutMs, ...fetchOptions } = options;

  try {
    const response = await fetch(buildUrl(path), {
      headers: {
        Accept: 'application/json',
        ...(fetchOptions.body && !(fetchOptions.body instanceof FormData)
          ? { 'Content-Type': 'application/json' }
          : {}),
        ...fetchOptions.headers,
      },
      ...fetchOptions,
      signal: controller.signal,
    });

    return await parseResponse(response);
  } catch (error) {
    if (error?.status) {
      throw error;
    }

    const errMsg = String(error?.message || '');
    if (
      error?.name === 'AbortError' ||
      errMsg.includes('FetchRequestCanceledException') ||
      errMsg.includes('canceled') ||
      errMsg.includes('Network request failed')
    ) {
      throw new Error('Kết nối máy chủ bị gián đoạn hoặc quá thời gian. Đang dùng dữ liệu ngoại tuyến.');
    }

    if (error instanceof SyntaxError) {
      throw new Error('Backend returned an invalid JSON response');
    }

    throw new Error(error.message || 'Unable to reach backend');
  } finally {
    clearTimeout(timeoutId);
  }
}

export function apiGet(path) {
  return apiRequest(path, { method: 'GET' });
}

export function apiPost(path, body) {
  return apiRequest(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function apiPostFormData(path, formData, options = {}) {
  return apiRequest(path, {
    method: 'POST',
    body: formData,
    timeoutMs: options.timeoutMs || 20000,
  });
}

export function apiPatch(path, body) {
  return apiRequest(path, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}
