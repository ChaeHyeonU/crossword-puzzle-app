import React from 'react';
import { isValidInput } from './utils';

export interface CrosswordCellProps {
  cellSize: number;
  isBlocked: boolean;
  isSelected: boolean;
  isFocused: boolean;
  number?: string;
  value: string;
  onClick: () => void;
  onInput?: (value: string) => void;
}

export const CrosswordCell: React.FC<CrosswordCellProps> = ({
  cellSize,
  isBlocked,
  isSelected,
  isFocused,
  number,
  value,
  onClick,
  onInput
}) => {
  const fontSize = cellSize < 32 ? 'text-lg' : 'text-xl';
  const numberSize = cellSize < 32 ? 'text-[9px]' : 'text-[11px]';

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onInput && isValidInput(e.target.value)) {
      onInput(e.target.value);
    }
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    if (onInput && e.data && isValidInput(e.data)) {
      onInput(e.data);
    }
  };

  return (
    <div className="relative">
      {number && (
        <span 
          className={`absolute top-[2px] left-[2px] ${numberSize} text-[#618DE5] dark:text-[#7BA1F8] font-semibold`}
        >
          {number}
        </span>
      )}
      {isBlocked ? (
        <div
          style={{ 
            width: `${cellSize}px`, 
            height: `${cellSize}px`,
          }}
          className="bg-gray-900 dark:bg-black"
        />
      ) : (
        <input
          type="text"
          inputMode="text"
          maxLength={1}
          value={value}
          onChange={handleInput}
          onClick={onClick}
          onCompositionEnd={handleCompositionEnd}
          style={{ 
            width: `${cellSize}px`, 
            height: `${cellSize}px`,
          }}
          className={`flex items-center justify-center font-bold ${fontSize}
            bg-white dark:bg-slate-800 text-gray-900 dark:text-white
            text-center outline-none
            border
            ${isSelected ? 'border-blue-400' : isFocused ? 'border-green-500' : 'border-slate-300'}
            dark:border-slate-700
            ${(isSelected || isFocused) ? 'border-2' : 'border'}
            transition-colors duration-150`}
          lang="ko"
        />
      )}
    </div>
  );
}; 