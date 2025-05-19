'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { PuzzleData, PuzzleClue } from '@/types/puzzle';
import { useGridGestures } from './useGridGestures';
import { calculateCellSize, getSelectedCells } from './utils';
import { CrosswordCell } from './CrosswordCell';
import { MIN_SCALE } from './constants';

interface CrosswordGridProps {
  size: number;
  puzzle: PuzzleData;
  selectedClue?: PuzzleClue;
  userInput: string[][];
  onInput?: (row: number, col: number, value: string) => void;
}

const CrosswordGrid: React.FC<CrosswordGridProps> = ({ 
  size, 
  puzzle, 
  selectedClue, 
  userInput, 
  onInput 
}) => {
  const [cellSize, setCellSize] = useState(36);
  const [focusedCell, setFocusedCell] = useState<{row: number, col: number} | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const {
    scale,
    position,
    setScale,
    setPosition,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useGridGestures();

  // 셀 크기 업데이트
  useEffect(() => {
    const updateCellSize = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      let gridWidth, gridHeight;
      if (isLandscape) {
        // 가로모드: 화면의 절반 너비, 전체 높이 사용
        gridWidth = window.innerWidth * 0.5 * 0.95; // 좌우 여백 고려
        gridHeight = window.innerHeight * 0.85; // 헤더 등 여백 고려
      } else {
        // 세로모드: 전체 너비, 절반 높이 사용
        gridWidth = window.innerWidth * 0.95;
        gridHeight = window.innerHeight * 0.45;
      }
      setCellSize(calculateCellSize(size, gridWidth, gridHeight));
    };

    updateCellSize();
    window.addEventListener('resize', updateCellSize);
    return () => window.removeEventListener('resize', updateCellSize);
  }, [size]);

  // 선택된 문제로 자동 확대/이동 기능 제거: 항상 기본 스케일과 위치 유지
  useEffect(() => {
    setScale(MIN_SCALE);
    setPosition({ x: 0, y: 0 });
  }, [selectedClue, size, cellSize, puzzle, setScale, setPosition]);

  const handleCellClick = (row: number, col: number) => {
    if (puzzle.grid[row][col] !== '#') {
      setFocusedCell({row, col});
    }
  };

  const selectedCells = getSelectedCells(selectedClue, puzzle, size);

  return (
    <div 
      ref={gridRef}
      className="relative touch-none w-full h-full flex items-center justify-center py-4"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
        transformOrigin: 'center',
        transition: selectedClue ? 'transform 0.3s ease-out' : 'none',
        minHeight: '45vh',
      }}
    >
      <div className="grid gap-[1px] bg-gray-300 dark:bg-gray-600 p-[2px] rounded-lg border-2 border-gray-400 dark:border-gray-500 mx-5 bg-transparent text-inherit">
        {Array(size).fill(null).map((_unused, rowIndex) => (
          <div key={rowIndex} className="flex gap-[1px]">
            {Array(size).fill(null).map((_unused2, colIndex) => {
              const isSelected = selectedCells.some(cell => cell.x === colIndex && cell.y === rowIndex);
              const isFocused = focusedCell?.row === rowIndex && focusedCell?.col === colIndex;
              const number = Object.entries(puzzle.numbers).find(
                ([number]) => puzzle.numbers[number].x === colIndex && puzzle.numbers[number].y === rowIndex
              )?.[0];

              return (
                <CrosswordCell
                  key={`${rowIndex}-${colIndex}`}
                  cellSize={cellSize}
                  isBlocked={puzzle.grid[rowIndex][colIndex] === '#'}
                  isSelected={isSelected}
                  isFocused={isFocused}
                  number={number}
                  value={userInput[rowIndex][colIndex]}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onInput={(value) => onInput?.(rowIndex, colIndex, value)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrosswordGrid; 