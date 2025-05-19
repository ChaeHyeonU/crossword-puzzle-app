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
    <div className="relative select-none">
      {number && (
        <span 
          className={`absolute top-[2px] left-[2px] ${numberSize} text-[#618DE5] dark:text-[#7BA1F8] font-semibold select-none`}
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
          className="bg-gray-900 dark:bg-black rounded-md border border-gray-800 dark:border-black select-none"
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
            text-center outline-none rounded-md p-1 select-none
            border
            ${isSelected ? 'border-2 border-blue-500 ring-2 ring-blue-300 dark:ring-blue-600' : isFocused ? 'border-2 border-green-500 ring-2 ring-green-300 dark:ring-green-600' : 'border border-slate-300 dark:border-slate-700'}
            focus-visible:ring-2 focus-visible:ring-blue-400
            transition-colors duration-150`}
          lang="ko"
          aria-label={number ? `${number}번 셀` : '퍼즐 셀'}
        />
      )}
    </div>
  );
}; 