import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import type { StateStorage } from 'zustand/middleware';

// Fields sensitive enough to warrant OS-encrypted storage (Keychain/Keystore)
// rather than plain AsyncStorage. Everything else in the persisted state
// (profile info, flags) stays in AsyncStorage since SecureStore has a small
// practical size ceiling and isn't meant for arbitrary blobs.
const SECURE_KEYS = ['token', 'tempToken'] as const;

const secureKeyFor = (name: string, field: string) => `${name}.${field}`;

// Expo Router's web static output ("web.output": "static") prerenders routes
// in Node before any browser exists, so `window` (and the localStorage the web
// shims for AsyncStorage/SecureStore rely on) isn't there yet. Persisted auth
// can't mean anything on the server anyway — the client re-hydrates for real
// once it mounts in the browser — so these calls are no-ops there.
const isServer = typeof window === 'undefined';
// expo-secure-store's web build is a non-functional stub (its ExpoSecureStore.web.js
// exports `{}` — no such OS-level secure enclave exists in a browser anyway), so
// calling any of its methods there throws. Fall back to the same AsyncStorage-backed
// blob the rest of the state already uses — the same tradeoff every web app makes.
const canUseSecureStore = !isServer && Platform.OS !== 'web';

/**
 * Zustand persist storage that splits auth state across two backends:
 * tokens go to expo-secure-store, everything else goes to AsyncStorage.
 * From persist's point of view this is a single opaque key-value store.
 */
export const secureAuthStorage: StateStorage = {
  getItem: async (name) => {
    if (isServer) return null;
    const raw = await AsyncStorage.getItem(name);
    const parsed = raw ? JSON.parse(raw) : { state: {}, version: 0 };
    if (!canUseSecureStore) return JSON.stringify(parsed);

    const state = { ...parsed.state };
    const secureValues = await Promise.all(
      SECURE_KEYS.map((field) => SecureStore.getItemAsync(secureKeyFor(name, field)))
    );
    SECURE_KEYS.forEach((field, i) => {
      state[field] = secureValues[i] ?? null;
    });

    return JSON.stringify({ ...parsed, state });
  },

  setItem: async (name, value) => {
    if (isServer) return;
    if (!canUseSecureStore) {
      await AsyncStorage.setItem(name, value);
      return;
    }

    const parsed = JSON.parse(value);
    const state = { ...parsed.state };

    await Promise.all(
      SECURE_KEYS.map(async (field) => {
        const fieldValue = state[field];
        delete state[field];
        if (fieldValue) {
          await SecureStore.setItemAsync(secureKeyFor(name, field), String(fieldValue));
        } else {
          await SecureStore.deleteItemAsync(secureKeyFor(name, field)).catch(() => {});
        }
      })
    );

    await AsyncStorage.setItem(name, JSON.stringify({ ...parsed, state }));
  },

  removeItem: async (name) => {
    if (isServer) return;
    await AsyncStorage.removeItem(name);
    if (!canUseSecureStore) return;
    await Promise.all(
      SECURE_KEYS.map((field) => SecureStore.deleteItemAsync(secureKeyFor(name, field)).catch(() => {}))
    );
  },
};
