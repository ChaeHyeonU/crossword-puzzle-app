import type { PuzzleData, PuzzleClue, PuzzlePosition } from '@/types/puzzle';
import { MIN_CELL_SIZE, MAX_CELL_SIZE, GRID_PADDING } from './constants';

export const calculateCellSize = (size: number, screenWidth: number, screenHeight: number): number => {
  const maxGridWidth = screenWidth - GRID_PADDING;
  const maxGridHeight = screenHeight - GRID_PADDING;
  const maxSize = Math.min(maxGridWidth, maxGridHeight);
  const newCellSize = Math.min(Math.floor(maxSize / size), MAX_CELL_SIZE);
  return Math.max(newCellSize, MIN_CELL_SIZE);
};

export const getSelectedCells = (
  selectedClue: PuzzleClue | undefined, 
  puzzle: PuzzleData, 
  size: number
): PuzzlePosition[] => {
  if (!selectedClue) return [];
  
  const startPos = puzzle.numbers[selectedClue.number];
  if (!startPos) return [];

  const cells = [startPos];
  let currentX = startPos.x;
  let currentY = startPos.y;

  if (selectedClue.direction === 'across') {
    while (currentX + 1 < size && puzzle.grid[startPos.y][currentX + 1] !== '#') {
      currentX++;
      cells.push({ x: currentX, y: startPos.y });
    }
  } else {
    while (currentY + 1 < size && puzzle.grid[currentY + 1][startPos.x] !== '#') {
      currentY++;
      cells.push({ x: startPos.x, y: currentY });
    }
  }

  return cells;
};

export const isValidInput = (value: string): boolean => {
  if (value === '') return true;
  const lastChar = value.charAt(value.length - 1);
  return /^[ㄱ-ㅎㅏ-ㅣ가-힣]$/.test(lastChar);
}; 