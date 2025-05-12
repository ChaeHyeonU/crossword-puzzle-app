'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { PuzzleClue } from '@/types/puzzle';

interface AnswerModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onConfirm: (answer: string) => void;
  readonly selectedClue?: PuzzleClue;
  readonly clueText?: string;
  readonly maxLength: number;
}

interface CursorState {
  position: number;
  isFocused: boolean;
  isComposing: boolean;
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
  const [cursor, setCursor] = useState<CursorState>({
    position: 0,
    isFocused: false,
    isComposing: false
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      console.log('모달이 열렸습니다. 받은 인자들:', {
        isOpen,
        selectedClue,
        clueText,
        maxLength
      });
      setAnswer('');
      setCursor(prev => ({ ...prev, position: 0 }));
      
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.setSelectionRange(0, 0);
        }
      }, 100);
    }
  }, [isOpen, selectedClue, clueText, maxLength]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('입력된 텍스트:', value);
    
    // maxLength를 초과하는 입력은 무시
    if (value.length > maxLength) {
      return;
    }

    setAnswer(value);
    const newPosition = Math.min(value.length, maxLength - 1);
    setCursor(prev => ({ ...prev, position: newPosition }));
    inputRef.current?.setSelectionRange(newPosition, newPosition);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (cursor.isComposing) return;

    switch (e.key) {
      case 'ArrowLeft': {
        e.preventDefault();
        if (cursor.position > 0) {
          const newPosition = cursor.position - 1;
          setCursor(prev => ({ ...prev, position: newPosition }));
          inputRef.current?.setSelectionRange(newPosition, newPosition);
        }
        break;
      }
      case 'ArrowRight': {
        e.preventDefault();
        if (cursor.position < answer.length) {
          const newPosition = cursor.position + 1;
          setCursor(prev => ({ ...prev, position: newPosition }));
          inputRef.current?.setSelectionRange(newPosition, newPosition);
        }
        break;
      }
      case 'Home': {
        e.preventDefault();
        setCursor(prev => ({ ...prev, position: 0 }));
        inputRef.current?.setSelectionRange(0, 0);
        break;
      }
      case 'End': {
        e.preventDefault();
        const lastPosition = Math.min(answer.length, maxLength - 1);
        setCursor(prev => ({ ...prev, position: lastPosition }));
        inputRef.current?.setSelectionRange(lastPosition, lastPosition);
        break;
      }
      case 'Backspace': {
        e.preventDefault();
        if (cursor.position > 0) {
          // 커서 위치의 이전 글자를 지움
          const newAnswer = answer.slice(0, cursor.position - 1) + answer.slice(cursor.position);
          console.log('백스페이스 후 텍스트:', newAnswer);
          setAnswer(newAnswer);
          const newPosition = cursor.position - 1;
          setCursor(prev => ({ ...prev, position: newPosition }));
          inputRef.current?.setSelectionRange(newPosition, newPosition);
        }
        break;
      }
      case 'Delete': {
        e.preventDefault();
        if (cursor.position < answer.length) {
          // 커서 위치의 글자를 지움
          const newAnswer = answer.slice(0, cursor.position) + answer.slice(cursor.position + 1);
          console.log('삭제 후 텍스트:', newAnswer);
          setAnswer(newAnswer);
          setCursor(prev => ({ ...prev, position: cursor.position }));
          inputRef.current?.setSelectionRange(cursor.position, cursor.position);
        }
        break;
      }
    }
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    setCursor(prev => ({ ...prev, isComposing: false }));
    const value = e.currentTarget.value;
    console.log('한글 입력 완료 후 텍스트:', value);
    
    // maxLength를 초과하는 입력은 무시
    if (value.length > maxLength) {
      return;
    }

    if (!isValidKorean(value)) {
      setAnswer(answer);
      return;
    }

    setAnswer(value);
    const newPosition = Math.min(value.length, maxLength - 1);
    setCursor(prev => ({ ...prev, position: newPosition }));
    inputRef.current?.setSelectionRange(newPosition, newPosition);
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
    >
      <div 
        className="bg-white dark:bg-gray-800 w-[90%] max-w-md rounded-lg shadow-lg p-6"
        onClick={handleModalClick}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {selectedClue?.number}번 {selectedClue?.direction === 'across' ? '(가로)' : '(세로)'}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
          {clueText}
        </p>
        <div className="flex justify-center mb-4">
          <div className="relative inline-flex gap-1">
            {Array.from({ length: maxLength }).map((_, index) => (
              <div
                key={index}
                className={`w-12 h-12 border-2 rounded-md flex items-center justify-center
                  ${cursor.isFocused ? 'border-[#618DE5]' : 'border-gray-300'}
                  ${cursor.position === index ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
              >
                <span className="text-xl text-gray-900 dark:text-gray-100">
                  {answer[index] || ''}
                </span>
                {cursor.position === index && cursor.isFocused && !cursor.isComposing && (
                  <div className="absolute w-0.5 h-6 bg-blue-500 animate-blink" />
                )}
              </div>
            ))}
            <input
              ref={inputRef}
              type="text"
              value={answer}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              onCompositionStart={() => setCursor(prev => ({ ...prev, isComposing: true }))}
              onCompositionEnd={handleCompositionEnd}
              onFocus={() => setCursor(prev => ({ ...prev, isFocused: true }))}
              onBlur={() => setCursor(prev => ({ ...prev, isFocused: false }))}
              onSelect={(e) => {
                const target = e.target as HTMLInputElement;
                const newPosition = Math.min(target.selectionStart || 0, maxLength - 1);
                setCursor(prev => ({ ...prev, position: newPosition }));
                target.setSelectionRange(newPosition, newPosition);
              }}
              className="opacity-0 absolute inset-0 w-full"
              maxLength={maxLength}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleBeforeClose(e);
            }}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 
              dark:hover:text-gray-100"
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
            className="px-4 py-2 bg-[#618DE5] text-white rounded-md hover:bg-[#4A7BD4]
              disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnswerModal; 