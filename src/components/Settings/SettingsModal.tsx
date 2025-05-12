'use client';

import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { isDarkMode, showHints, toggleDarkMode, toggleHints } = useSettings();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-card rounded-lg p-6 w-[90%] max-w-md shadow-lg"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-foreground">설정</h2>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* 다크모드 토글 */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">다크 모드</span>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${isDarkMode ? 'bg-primary' : 'bg-muted'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform
                  ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>

          {/* 힌트 토글 */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">힌트 보기</span>
            <button
              onClick={toggleHints}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${showHints ? 'bg-primary' : 'bg-muted'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform
                  ${showHints ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>

          {/* 제작자 정보 */}
          <div className="pt-4 mt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">제작자</span>
              <span className="text-sm font-medium text-foreground">JC</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              © 2024 크로스워드 퍼즐. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal; 