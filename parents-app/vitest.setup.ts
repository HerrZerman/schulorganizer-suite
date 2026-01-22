/**
 * Vitest Setup für React Native Tests
 * Mock für AsyncStorage
 */

import { beforeAll, vi } from "vitest";

// AsyncStorage Mock
const mockAsyncStorage = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: async (key: string): Promise<string | null> => {
      return store[key] || null;
    },
    setItem: async (key: string, value: string): Promise<void> => {
      store[key] = value;
    },
    removeItem: async (key: string): Promise<void> => {
      delete store[key];
    },
    clear: async (): Promise<void> => {
      store = {};
    },
    getAllKeys: async (): Promise<string[]> => {
      return Object.keys(store);
    },
    multiGet: async (keys: string[]): Promise<[string, string | null][]> => {
      return keys.map((key) => [key, store[key] || null]);
    },
    multiSet: async (keyValuePairs: [string, string][]): Promise<void> => {
      keyValuePairs.forEach(([key, value]) => {
        store[key] = value;
      });
    },
    multiRemove: async (keys: string[]): Promise<void> => {
      keys.forEach((key) => {
        delete store[key];
      });
    },
  };
})();

// AsyncStorage mocken
vi.mock("@react-native-async-storage/async-storage", () => ({
  default: mockAsyncStorage,
}));

// Expo Haptics mocken
vi.mock("expo-haptics", () => ({
  impactAsync: vi.fn(),
  notificationAsync: vi.fn(),
  ImpactFeedbackStyle: {
    Light: "light",
    Medium: "medium",
    Heavy: "heavy",
  },
  NotificationFeedbackType: {
    Success: "success",
    Warning: "warning",
    Error: "error",
  },
}));

beforeAll(() => {
  // Global mocks setup
  // @ts-ignore
  global.__DEV__ = true;
});
