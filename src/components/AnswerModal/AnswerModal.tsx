'use client';

import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import type { PuzzleClue } from '@/types/puzzle';

interface AnswerModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onConfirm: (answer: string) => void;
  readonly selectedClue?: PuzzleClue;
  readonly clueText?: string;
  readonly maxLength: number;
}

// const findEditablePosition = (
//   current: number, 
//   direction: 'forward' | 'backward',
//   maxLength: number,
// ): number => {
//   const step = direction === 'forward' ? 1 : -1;
//   let position = current;

//   do {
//     position += step;
//     if (position < 0) return 0;
//     if (position >= maxLength) return maxLength - 1;
//     return position;
//   } while (position >= 0 && position < maxLength);

//   return current;
// };

const isValidKorean = (value: string): boolean => /^[가-힣]*$/.test(value);

const AnswerModal: React.FC<AnswerModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedClue,
  clueText,
  maxLength,
}) => {
  const [answer, setAnswer] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const MAX_LENGTH = maxLength;

  useEffect(() => {
    if (isOpen) {
      console.log('모달이 열렸습니다. 받은 인자들:', {
        isOpen,
        selectedClue,
        clueText,
        maxLength
      });
      setAnswer('');
      
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.setSelectionRange(0, 0);
        }
      }, 100);
    }
  }, [isOpen, selectedClue, clueText, maxLength]);

  // ESC 키로 닫기, 탭 키보드 트랩
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Tab' && modalRef.current) {
        // 키보드 트랩
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (value.length > MAX_LENGTH) {
      value = value.slice(0, MAX_LENGTH);
    }
    setAnswer(value);
  };

  const handleBeforeClose = (e: React.MouseEvent) => {
    if (answer) {
      const shouldClose = window.confirm('작성 중인 내용이 있습니다. 정말로 닫으시겠습니까?');
      if (!shouldClose) {
        e.stopPropagation();
        return;
      }
    }
    onClose();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleBeforeClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="answer-modal-title"
      aria-describedby="answer-modal-desc"
    >
      <div 
        className="bg-white dark:bg-gray-800 w-[90%] max-w-md rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
        tabIndex={-1}
        onClick={handleModalClick}
        ref={modalRef}
      >
        <div className="flex items-center gap-2 mb-2">
          <h3 id="answer-modal-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {selectedClue?.number}번 {selectedClue?.direction === 'across' ? '(가로)' : '(세로)'}
          </h3>
          <span className="ml-2 px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-xs text-slate-600 dark:text-slate-300 font-medium">
            {maxLength}글자
          </span>
        </div>
        <p id="answer-modal-desc" className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
          {clueText}
        </p>
        <div className="flex justify-center mb-4">
          <input
            ref={inputRef}
            type="text"
            value={answer}
            onChange={handleInput}
            maxLength={maxLength}
            className="w-full max-w-xs text-center text-2xl font-bold border-2 rounded-lg py-3 px-4 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 border-slate-300 dark:border-slate-700 transition-colors"
            autoFocus
            aria-label="정답 입력"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleBeforeClose(e);
            }}
            className="px-4 py-2 p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="정답 입력 취소"
          >
            취소
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (answer.length === maxLength && isValidKorean(answer)) {
                onConfirm(answer);
                onClose();
              }
            }}
            disabled={answer.length !== maxLength || !isValidKorean(answer)}
            className="px-4 py-2 p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 bg-[#618DE5] text-white hover:bg-[#4A7BD4] disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed transition-colors"
            aria-label="정답 입력 확인"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnswerModal; 