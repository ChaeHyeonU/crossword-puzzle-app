import type { Settings, SettingsKey } from '@/types/settings';

const STORAGE_PREFIX = 'crossword_';

export class StorageError extends Error {
  constructor(message: string, public readonly key?: string) {
    super(message);
    this.name = 'StorageError';
  }
}

const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

export const storage = {
  getItem<T>(key: string, defaultValue: T): T {
    if (!isLocalStorageAvailable()) {
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Failed to get item from storage: ${key}`, error.message);
      }
      return defaultValue;
    }
  },

  setItem(key: string, value: unknown): void {
    if (!isLocalStorageAvailable()) {
      return;
    }

    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
    } catch (error) {
      if (error instanceof Error) {
        throw new StorageError(`Failed to set item in storage: ${key} - ${error.message}`, key);
      }
      throw new StorageError(`Failed to set item in storage: ${key}`, key);
    }
  },

  loadSettings(): Settings {
    return {
      isDarkMode: this.getItem<boolean>('isDarkMode', false),
      showHints: this.getItem<boolean>('showHints', false),
    };
  },

  saveSetting(key: SettingsKey, value: boolean): void {
    this.setItem(key, value);
  },
}; 