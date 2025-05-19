"use client";

import { notFound } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import { samplePuzzle } from "@/data/samplePuzzle";
import { sampleClues } from "@/data/sampleClues";
import dynamic from "next/dynamic";
import type { PuzzleClue } from "@/types/puzzle";
import AnswerModal from "@/components/AnswerModal/AnswerModal";
import SettingsModal from "@/components/Settings/SettingsModal";
import { SettingsProvider } from "@/contexts/SettingsContext";
import Textfit from "react-textfit";

const CrosswordGrid = dynamic(() => import('@/components/CrosswordGrid/CrosswordGrid'), { ssr: false });
const Clues = dynamic(() => import('@/components/Clues/Clues'), { ssr: false });

interface PuzzleState {
  selectedClue?: PuzzleClue;
  userInput: string[][];
}

const GRID_SIZE = samplePuzzle.size;
const createEmptyGrid = (size: number): string[][] =>
  Array(size).fill('').map(() => Array(size).fill(''));

const getSelectedClueLength = (clue: PuzzleClue): number => {
  const key = clue.direction === 'down' ? `${clue.number}-down` : clue.number;
  return samplePuzzle.answers[key as keyof typeof samplePuzzle.answers]?.length || 0;
};

const getClueText = (clue: PuzzleClue): string => {
  const key = clue.direction === 'down' ? `${clue.number}-down` : clue.number;
  return sampleClues[key as keyof typeof sampleClues] || '';
};

export default function GamePage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = React.use(params);

  const [state, setState] = useState<PuzzleState>(() => {
    let userInput = createEmptyGrid(GRID_SIZE);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`crossword-progress:${topicId}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) userInput = parsed;
        } catch {}
      }
    }
    return { selectedClue: undefined, userInput };
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  if (topicId !== "1-1") return notFound();

  // 문제 선택 핸들러
  const handleClueSelect = (clue: PuzzleClue) => {
    setState(prev => ({ ...prev, selectedClue: clue }));
    setIsAnswerModalOpen(true);
  };

  // 정답 입력 핸들러
  const handleAnswerConfirm = (answer: string) => {
    if (!state.selectedClue) return;
    const startPos = samplePuzzle.numbers[state.selectedClue.number];
    if (!startPos) return;

    setState(prev => {
      const newInput = prev.userInput.map(row => [...row]);
      let currentX = startPos.x;
      let currentY = startPos.y;

      for (let i = 0; i < answer.length; i++) {
        newInput[currentY][currentX] = answer[i];
        if (state.selectedClue?.direction === 'across') {
          currentX++;
        } else {
          currentY++;
        }
      }
      return { ...prev, userInput: newInput };
    });
  };

  // 셀 입력 핸들러
  const handleInput = (row: number, col: number, value: string) => {
    setState(prev => ({
      ...prev,
      userInput: prev.userInput.map((r, i) =>
        i === row ? r.map((c, j) => j === col ? value : c) : r
      )
    }));
  };

  // userInput 변경 시 localStorage에 저장
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`crossword-progress:${topicId}`, JSON.stringify(state.userInput));
  }, [state.userInput, topicId]);

  return (
    <SettingsProvider>
      <div className="h-screen flex flex-col min-h-0 min-w-0 bg-gradient-to-b from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100 px-2 overflow-hidden">
        {/* 상단 헤더 (항상 상단 고정) */}
        <header className="w-full max-w-2xl mx-auto h-14 bg-white/80 dark:bg-slate-800 rounded-xl shadow z-10 sticky top-0 flex items-center justify-center border border-slate-200 dark:border-slate-700 mt-2 mb-2 relative backdrop-blur-md" role="banner">
          <button
            onClick={() => window.history.back()}
            className="absolute left-4 flex items-center justify-center text-slate-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-full p-2"
            aria-label="뒤로가기"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌍</span>
            <Textfit mode="single" min={16} max={28} className="font-bold leading-tight text-lg" style={{width: '160px'}}>
              지리 크로스워드
            </Textfit>
          </div>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="absolute right-4 flex items-center justify-center text-slate-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-full p-2"
            aria-label="설정"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </header>

        <div className="flex-1 flex flex-col landscape-flex-row gap-4 w-full max-w-7xl mx-auto h-full min-h-0 min-w-0 overflow-hidden">
          {/* 퍼즐 영역 */}
          <div
            ref={gridContainerRef}
            className="w-full h-1/2 landscape-flex-row:w-1/2 landscape-flex-row:h-full flex items-center justify-center min-h-0 min-w-0 flex-1 overflow-hidden"
            aria-label="퍼즐 영역"
          >
            <div
              className="w-full h-full bg-white/90 dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center touch-pan-x touch-pan-y min-h-0 min-w-0 overflow-hidden"
            >
              <CrosswordGrid
                size={GRID_SIZE}
                puzzle={samplePuzzle}
                selectedClue={state.selectedClue}
                userInput={state.userInput}
                onInput={handleInput}
              />
            </div>
          </div>
          {/* 문제 영역 */}
          <div className="w-full h-1/2 landscape-flex-row:w-1/2 landscape-flex-row:h-full flex flex-col min-h-0 min-w-0 flex-1 overflow-hidden" aria-label="문제 영역">
            <div className="w-full h-full bg-white/90 dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden min-h-0 min-w-0">
              <div className="px-6 pt-4 pb-2 text-sm text-slate-500 dark:text-slate-300 font-medium">
                <Textfit mode="single" min={12} max={16} className="w-full">
                  문제를 클릭하면 정답 입력창이 열립니다.
                </Textfit>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-4 min-h-0 min-w-0">
                <Clues
                  clues={sampleClues}
                  onClueSelect={handleClueSelect}
                />
              </div>
            </div>
          </div>
        </div>
        {/* 설정 모달 */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
        {/* 정답 입력 모달 */}
        <AnswerModal
          isOpen={isAnswerModalOpen}
          onClose={() => {
            setIsAnswerModalOpen(false);
            setState(prev => ({ ...prev, selectedClue: undefined }));
          }}
          onConfirm={handleAnswerConfirm}
          selectedClue={state.selectedClue}
          clueText={state.selectedClue ? getClueText(state.selectedClue) : ''}
          maxLength={state.selectedClue ? getSelectedClueLength(state.selectedClue) : 0}
        />
      </div>
    </SettingsProvider>
  );
} 