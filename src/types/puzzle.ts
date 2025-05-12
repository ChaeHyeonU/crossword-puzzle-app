export type Direction = 'across' | 'down';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface PuzzlePosition {
  readonly x: number;
  readonly y: number;
}

export interface PuzzleClue {
  readonly number: string;
  readonly direction: Direction;
}

export interface PuzzleAnswer {
  readonly answer: string;
  readonly direction: Direction;
  readonly length: number;
}

export interface PuzzleData {
  readonly id?: string;
  readonly title?: string;
  readonly size: number;
  readonly grid: readonly string[][];
  readonly numbers: Readonly<Record<string, PuzzlePosition>>;
  readonly clues: Readonly<Record<string, PuzzleClue>>;
  readonly answers: Readonly<Record<string, PuzzleAnswer>>;
  readonly difficulty?: Difficulty;
  readonly category?: string;
}

export type PuzzleClueKey = `${string}${'' | '-down'}`;
export type PuzzleAnswerState = Readonly<Record<PuzzleClueKey, string>>;

export interface PuzzleState {
  readonly userInput: string[][];
  readonly selectedClue?: PuzzleClue;
  readonly answers: PuzzleAnswerState;
}

// 레거시 인터페이스 - 이전 버전과의 호환성을 위해 유지
export interface Puzzle {
  readonly id: string;
  readonly title: string;
  readonly size: number;
  readonly grid: string[][];
  readonly across: Record<string, string>;
  readonly down: Record<string, string>;
  readonly answers: Record<string, string>;
  readonly difficulty: Difficulty;
  readonly category: string;
} 