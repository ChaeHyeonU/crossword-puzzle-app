'use client';

import React from 'react';
import type { PuzzleClue } from '@/types/puzzle';

interface CluesProps {
  readonly clues: Readonly<Record<string, string>>;
  readonly onClueSelect?: (clue: PuzzleClue) => void;
}

interface ProcessedClue {
  readonly number: string;
  readonly clue: string;
  readonly direction: '가로' | '세로';
}

const DIRECTION_MAP = {
  ACROSS: '가로',
  DOWN: '세로'
} as const;

const processClues = (clues: Readonly<Record<string, string>>): readonly ProcessedClue[] => {
  return Object.entries(clues)
    .map(([key, clue]): ProcessedClue => {
      const isDown = key.endsWith('-down');
      const number = isDown ? key.replace('-down', '') : key;
      
      return {
        number,
        clue,
        direction: isDown ? DIRECTION_MAP.DOWN : DIRECTION_MAP.ACROSS
      };
    })
    .sort((a, b) => {
      const numA = parseInt(a.number);
      const numB = parseInt(b.number);
      return numA === numB ? (a.direction === DIRECTION_MAP.ACROSS ? -1 : 1) : numA - numB;
    });
};

const ClueItem: React.FC<{
  readonly clue: ProcessedClue;
  readonly onClick: () => void;
}> = ({ clue, onClick }) => (
  <li 
    className="flex gap-1 items-start cursor-pointer hover:bg-muted p-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
    tabIndex={0}
    aria-label={`${clue.number}번 ${clue.direction} 문제: ${clue.clue}`}
    onClick={onClick}
  >
    <span className="text-primary font-semibold whitespace-nowrap text-sm">
      {clue.number}.{clue.direction ? ` (${clue.direction})` : ''}
    </span>
    <span className="text-muted-foreground text-sm leading-5 pl-1">{clue.clue}</span>
  </li>
);

const Clues: React.FC<CluesProps> = ({ clues, onClueSelect }) => {
  const processedClues = processClues(clues);

  return (
    <div className="p-4 overflow-y-auto scrollbar-hide h-full bg-inherit text-inherit">
      <ul className="space-y-3">
        {processedClues.map((clue) => (
          <ClueItem
            key={`${clue.number}-${clue.direction}`}
            clue={clue}
            onClick={() => onClueSelect?.({
              number: clue.number,
              direction: clue.direction === DIRECTION_MAP.ACROSS ? 'across' : 'down'
            })}
          />
        ))}
      </ul>
    </div>
  );
};

export default Clues; 