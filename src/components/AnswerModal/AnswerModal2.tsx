'use client';

import React, { useRef, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import type { PuzzleClue } from '@/types/puzzle';

interface AnswerModal2Props {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onConfirm: (answer: string) => void;
  readonly selectedClue?: PuzzleClue;
  readonly clueText?: string;
  readonly maxLength: number;
  readonly currentAnswer?: string;
}

interface InputBlockProps {
  className?: string;
  index: number;
  codeArr: string[];
  onChange: (code: string[]) => void;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
}

const isValidKorean = (char: string): boolean => {
  const code = char.charCodeAt(0);
  return (
    (code >= 0xAC00 && code <= 0xD7A3) || // 한글 음절
    (code >= 0x3131 && code <= 0x318E) || // 한글 자모
    (code >= 0x1100 && code <= 0x11FF)    // 한글 자모 확장
  );
};

const InputBlock = (props: InputBlockProps) => {
  const { className, index, codeArr = [], onChange, isFocused, onFocus, onBlur } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const value = codeArr[index] || '';
  const isComposing = useRef(false);
  const [composingValue, setComposingValue] = useState('');
  const lastKeyDown = useRef<string>('');  // 마지막 키 입력 저장

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  const setValue = (value: string, position: number = 0) => {
    console.log('🔵 setValue 호출됨:', {
      입력값: value,
      위치: position,
      현재값: codeArr[index]
    });
    const nextCodeArr = [...codeArr];
    nextCodeArr[index + position] = value;
    onChange(nextCodeArr);
  };

  const nextInput = inputRef.current?.nextElementSibling as HTMLInputElement;
  const previousInput = inputRef.current?.previousElementSibling as HTMLInputElement;

  const isKoreanKey = (key: string): boolean => {
    // 한글 키 코드 범위 (ㄱ~ㅎ, ㅏ~ㅣ)
    return /^[ㄱ-ㅎㅏ-ㅣ]$/.test(key);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('🔴 KeyDown 이벤트:', { 
      키: e.key, 
      코드: e.code,
      조합중: isComposing.current
    });
    
    // 이전 블록의 입력값이 있고, 현재 블록이 비어있을 때만 한글 키 저장
    if (isKoreanKey(e.key) && value === '') {
      const prevInput = previousInput?.value;
      if (prevInput && isValidKorean(prevInput)) {
        lastKeyDown.current = e.key;
        console.log('한글 키 저장:', e.key);
      }
    }

    if (e.key === 'ArrowRight' && nextInput) {
      if (inputRef.current?.selectionStart === 0 && value !== '') {
        inputRef.current?.setSelectionRange(1, 1);
      } else {
        nextInput.focus();
      }
    }

    if (e.key === 'ArrowLeft' && previousInput) {
      if (inputRef.current?.selectionStart === 1) {
        inputRef.current?.setSelectionRange(0, 0);
      } else {
        previousInput.focus();
      }
    }

    if (e.key === 'Backspace' && previousInput) {
      if (inputRef.current?.selectionStart === 1) {
        const nextCodeArr = [...codeArr];
        nextCodeArr[index] = '';
        onChange(nextCodeArr);
        setComposingValue('');
      } else {
        setValue('', -1);
        setComposingValue('');
        previousInput.focus();
      }
    }

    if (isComposing.current) {
      console.log('조합 중 키 이벤트 무시');
      return;
    }
  };

  const handleCompositionStart = (e: React.CompositionEvent<HTMLInputElement>) => {
    console.log('🟡 조합 시작:', {
      마지막키: lastKeyDown.current,
      데이터: e.data
    });
    isComposing.current = true;
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    console.log('🟢 조합 완료:', {
      데이터: e.data,
      마지막키: lastKeyDown.current
    });
    const finalValue = e.data;
    
    if (finalValue && isValidKorean(finalValue)) {
      setValue(finalValue);
      if (nextInput) {
        nextInput.focus();
      }
    } else {
      setValue('');
    }
    
    setComposingValue('');
    isComposing.current = false;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('🟣 Change 이벤트:', {
      값: newValue,
      마지막키: lastKeyDown.current,
      조합중: isComposing.current
    });
    
    if (isComposing.current) {
      setComposingValue(newValue);
    } else {
      if (newValue && !isValidKorean(newValue)) return;
      setValue(newValue);
      setComposingValue('');
    }
  };

  // onFocus 이벤트 핸들러 추가
  const handleFocus = () => {
    // 포커스를 받았을 때 이전 블록에서 저장된 lastKeyDown 값이 있다면 사용
    if (lastKeyDown.current) {
      setComposingValue(lastKeyDown.current);
      isComposing.current = true;
    }
    onFocus();
  };

  return (
    <InputBlockStyle
      className={`${value.length > 0 ? 'focused' : ''} ${className ?? ''}`}
      type="text"
      ref={inputRef}
      value={isComposing.current ? composingValue : value}
      onKeyDown={handleKeyDown}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={onBlur}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      isInputValue={value.length > 0}
      isFocused={isFocused}
      maxLength={2}
      autoComplete="off"
      autoCapitalize="off"
      spellCheck={false}
      inputMode="text"
      pattern="[가-힣ㄱ-ㅎㅏ-ㅣ]*"
    />
  );
};

const AnswerModal2: React.FC<AnswerModal2Props> = ({
  isOpen,
  onClose,
  onConfirm,
  selectedClue,
  clueText,
  maxLength,
  currentAnswer = ''
}) => {
  const [answer, setAnswer] = useState<string[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  useEffect(() => {
    if (isOpen && maxLength > 0) {
      const initialAnswer = currentAnswer.split('');
      const paddedAnswer = Array(maxLength).fill('').map((_, index) => initialAnswer[index] || '');
      setAnswer(paddedAnswer);
      setFocusedIndex(0);
    }
  }, [isOpen, currentAnswer, maxLength]);

  const handleAnswerChange = (newAnswer: string[]) => {
    if (newAnswer.length === maxLength) {
      setAnswer(newAnswer);
    }
  };

  const handleConfirm = () => {
    if (answer.length === maxLength) {
      onConfirm(answer.join(''));
      onClose();
    }
  };

  if (!isOpen || maxLength <= 0) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <h3>{selectedClue?.number}번 {selectedClue?.direction === 'across' ? '(가로)' : '(세로)'}</h3>
          <p>{clueText}</p>
        </ModalHeader>
        
        <InputContainer>
          {Array.from({ length: maxLength }).map((_, index) => (
            <InputBlock
              key={index}
              index={index}
              codeArr={answer}
              onChange={handleAnswerChange}
              isFocused={focusedIndex === index}
              onFocus={() => setFocusedIndex(index)}
              onBlur={() => setFocusedIndex(-1)}
            />
          ))}
        </InputContainer>

        <ModalFooter>
          <Button onClick={onClose}>취소</Button>
          <Button 
            onClick={handleConfirm}
            disabled={answer.join('').length !== maxLength}
            primary
          >
            확인
          </Button>
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  width: 90%;
  max-width: 28rem;
  @media (prefers-color-scheme: dark) {
    background-color: #1f2937;
  }
`;

const ModalHeader = styled.div`
  margin-bottom: 1.5rem;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #374151;
    @media (prefers-color-scheme: dark) {
      color: #f3f4f6;
    }
  }
  
  p {
    color: #6b7280;
    font-size: 0.875rem;
    @media (prefers-color-scheme: dark) {
      color: #9ca3af;
    }
  }
`;

const InputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

interface InputBlockStyleProps {
  isInputValue: boolean;
  isFocused: boolean;
}

const InputBlockStyle = styled.input<InputBlockStyleProps>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background-color: ${(props: InputBlockStyleProps) => props.isInputValue ? 'white' : '#f3f4f6'};
  border: 1px solid ${(props: InputBlockStyleProps) => props.isFocused ? '#618DE5' : '#e5e7eb'};
  text-align: center;
  font-size: 1.25rem;
  font-weight: 600;
  transition: all 0.2s;
  color: #374151;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  
  &:focus {
    outline: none;
    border-color: #618DE5;
    box-shadow: 0 0 0 2px rgba(97, 141, 229, 0.1);
  }
  
  &:disabled {
    background-color: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    width: 2.25rem;
    height: 2.25rem;
    font-size: 1.125rem;
  }

  @media (prefers-color-scheme: dark) {
    background-color: ${(props: InputBlockStyleProps) => props.isInputValue ? '#1f2937' : '#374151'};
    border-color: ${(props: InputBlockStyleProps) => props.isFocused ? '#618DE5' : '#4b5563'};
    color: #f3f4f6;

    &:disabled {
      background-color: #374151;
      color: #6b7280;
    }
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
`;

interface ButtonProps {
  primary?: boolean;
}

const Button = styled.button<ButtonProps>`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  
  ${(props: ButtonProps) => props.primary ? `
    background-color: #618DE5;
    color: white;
    &:hover:not(:disabled) {
      background-color: #4A7BD4;
    }
    &:disabled {
      background-color: #93c5fd;
      cursor: not-allowed;
    }
  ` : `
    background-color: #f3f4f6;
    color: #374151;
    &:hover {
      background-color: #e5e7eb;
    }
  `}

  @media (prefers-color-scheme: dark) {
    ${(props: ButtonProps) => props.primary ? `
      background-color: #618DE5;
      color: white;
      &:hover:not(:disabled) {
        background-color: #4A7BD4;
      }
      &:disabled {
        background-color: #93c5fd;
        cursor: not-allowed;
      }
    ` : `
      background-color: #374151;
      color: #f3f4f6;
      &:hover {
        background-color: #4b5563;
      }
    `}
  }
`;

export default AnswerModal2; 