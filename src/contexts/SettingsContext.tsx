'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Settings, SettingsContextType, SettingsKey } from '@/types/settings';
import { storage, StorageError } from '@/utils/storage';

const DEFAULT_SETTINGS: Settings = {
  isDarkMode: false,
  showHints: false
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      return storage.loadSettings();
    } catch (error) {
      console.error('Failed to load initial settings:', error);
      return DEFAULT_SETTINGS;
    }
  });
  const [mounted, setMounted] = useState(false);

  // 컴포넌트가 마운트되면 DOM 업데이트 준비
  useEffect(() => {
    setMounted(true);
  }, []);

  // 다크모드 변경 시 DOM 업데이트
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    root.classList.toggle('dark', settings.isDarkMode);
  }, [settings.isDarkMode, mounted]);

  // 설정 변경 시 localStorage 업데이트
  useEffect(() => {
    if (!mounted) return;
    
    Object.entries(settings).forEach(([key, value]) => {
      try {
        storage.saveSetting(key as SettingsKey, value);
      } catch (error) {
        if (error instanceof StorageError) {
          console.error(`Failed to save setting: ${key}`, error.message);
        }
      }
    });
  }, [settings, mounted]);

  const updateSetting = (key: SettingsKey) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // 초기 렌더링 시에는 null 반환
  if (!mounted) {
    return null;
  }

  const contextValue: SettingsContextType = {
    ...settings,
    toggleDarkMode: () => updateSetting('isDarkMode'),
    toggleHints: () => updateSetting('showHints'),
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextType {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
} 