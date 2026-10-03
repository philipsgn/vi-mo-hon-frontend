import Constants from 'expo-constants';
import { resolveApiBaseUrl } from './apiBaseUrl.cjs';

/**
 * gameUrl.js
 * Dynamically resolves the full URL for 3D WebGL HTML games (Runner & Boss Battle)
 * Works seamlessly across iOS, Android, and Web in LAN, emulator, and production.
 */
export function getGameUrl(filename = 'runner_game.html') {
  const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename;
  const apiBaseUrl = resolveApiBaseUrl({
    configuredUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
    hostUri: Constants.expoConfig?.hostUri,
    isDevelopment: typeof __DEV__ !== 'undefined' && __DEV__,
  });

  if (!apiBaseUrl) {
    throw new Error(
      'No game server endpoint available. Run Expo in LAN mode or set EXPO_PUBLIC_API_BASE_URL.',
    );
  }

  const { protocol, host } = new URL(apiBaseUrl);
  const baseOrigin = `${protocol}//${host}`;

  return `${baseOrigin}/game/${cleanFilename}`;
}
