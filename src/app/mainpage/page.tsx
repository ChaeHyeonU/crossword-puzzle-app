"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import SettingsModal from "@/components/Settings/SettingsModal";
import { SettingsProvider } from "@/contexts/SettingsContext";

// 부제목(Section) 데이터 구조
interface Section {
  id: string; // 로마 숫자 등
  title: string;
  topics: string[];
  icon: string; // 대표 이모지
}

// 샘플 데이터 (추후 확장 가능)
const sections: Section[] = [
  { id: "Ⅰ", title: "내가 사는 세계", topics: ["내가 사는 세계", "지구상의 위치"], icon: "🌏" },
  { id: "Ⅱ", title: "인간 거주에 유리한 지역", topics: ["소제목3", "소제목4"], icon: "🏡" },
  { id: "Ⅲ", title: "극한 지대에서의 생활", topics: ["소제목5", "소제목6"], icon: "❄️" },
  { id: "Ⅳ", title: "자연으로 떠나는 여행", topics: ["소제목7", "소제목8"], icon: "⛰️" },
];

const getSectionNumber = (id: string) => {
  // 로마 숫자를 아라비아 숫자로 변환
  const map: Record<string, number> = { "Ⅰ": 1, "Ⅱ": 2, "Ⅲ": 3, "Ⅳ": 4 };
  return map[id] || 0;
};

// 샘플 학습 현황/기록/업적
const TOTAL_QUESTIONS = 8;
const COMPLETED_QUESTIONS = 3;
const RECENT_TOPIC = "Ⅰ-2 지구상의 위치";
const BADGES = ["🎉 첫 문제 풀이 완료!", "📚 3문제 달성"];

export default function GameMainPage() {
  const [current, setCurrent] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const router = useRouter();

  // 오늘의 추천 문제(랜덤)
  const todaySectionIdx = Math.floor(Math.random() * sections.length);
  const todayTopicIdx = Math.floor(Math.random() * sections[todaySectionIdx].topics.length);
  const todaySection = sections[todaySectionIdx];
  const todayTopic = todaySection.topics[todayTopicIdx];
  const todayTopicId = `${getSectionNumber(todaySection.id)}-${todayTopicIdx + 1}`;

  const section = sections[current];

  const handlePrev = () => setCurrent((prev) => (prev > 0 ? prev - 1 : prev));
  const handleNext = () => setCurrent((prev) => (prev < sections.length - 1 ? prev + 1 : prev));

  const handleTopicClick = (topic: string, topicIdx: number) => {
    const sectionNum = getSectionNumber(section.id);
    const topicId = `${sectionNum}-${topicIdx + 1}`;
    router.push(`/game/${topicId}`);
  };

  return (
    <SettingsProvider>
      <main className="h-screen flex flex-col items-center justify-start bg-gradient-to-b from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100 px-2 scrollbar-hide">
        <div className="w-full max-w-lg flex flex-col gap-y-4 h-full">
          {/* 상단: 앱명, 지도 이모지 */}
          <div className="flex items-center justify-center gap-2 pt-6 pb-2">
            <span className="text-3xl">🌍</span>
            <h1 className="text-2xl font-extrabold tracking-tight">지리 크로스워드</h1>
          </div>
          {/* 학습 현황/추천 */}
          <div className="flex flex-row gap-3 flex-[0.9] min-h-0">
            <div className="flex-1 bg-white/80 dark:bg-slate-800 rounded-xl p-4 flex flex-col items-center shadow border border-slate-200 dark:border-slate-700 justify-center">
              <div className="text-sm font-semibold mb-1">전체 진행률</div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 mb-2">
                <div className="bg-blue-400 h-3 rounded-full transition-all" style={{ width: `${(COMPLETED_QUESTIONS / TOTAL_QUESTIONS) * 100}%` }} />
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-300">{COMPLETED_QUESTIONS} / {TOTAL_QUESTIONS} 문제 완료</div>
            </div>
            <div className="flex-1 bg-white/80 dark:bg-slate-800 rounded-xl p-4 flex flex-col items-center shadow border border-slate-200 dark:border-slate-700 justify-center">
              <div className="text-sm font-semibold mb-1">오늘의 추천 문제</div>
              <Button className="w-full mt-1" variant="secondary" onClick={() => router.push(`/game/${todayTopicId}`)}>
                {todaySection.icon} {todayTopic}
              </Button>
            </div>
          </div>
          {/* 기록/업적 */}
          <div className="flex flex-row gap-3 flex-[0.7] min-h-0">
            <div className="flex-1 bg-white/80 dark:bg-slate-800 rounded-xl p-4 flex flex-col items-center shadow border border-slate-200 dark:border-slate-700 justify-center">
              <div className="text-sm font-semibold mb-1">최근 학습 기록</div>
              <div className="text-xs text-slate-500 dark:text-slate-300">마지막으로 푼 문제: {RECENT_TOPIC}</div>
            </div>
            <div className="flex-1 bg-white/80 dark:bg-slate-800 rounded-xl p-4 flex flex-col items-center shadow border border-slate-200 dark:border-slate-700 justify-center">
              <div className="text-sm font-semibold mb-1">학습 업적</div>
              <ul className="flex flex-col gap-1 text-xs text-slate-500 dark:text-slate-300">
                {BADGES.map((badge) => (
                  <li key={badge}>{badge}</li>
                ))}
              </ul>
            </div>
          </div>
          {/* 섹션별 카드 */}
          <div className="bg-white/90 dark:bg-slate-800 rounded-2xl shadow-xl p-6 flex flex-col gap-6 border border-slate-200 dark:border-slate-700 flex-[2] min-h-0">
            {/* 상단 부제목 */}
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" onClick={handlePrev} disabled={current === 0} aria-label="이전 부제목으로">
                ◀
              </Button>
              <div className="flex-1 min-w-0 flex items-center justify-center">
                <span className="text-2xl font-bold flex items-center justify-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap"
                  style={{ lineHeight: 1.2 }}
                >
                  <span className="text-2xl">{section.icon}</span>
                  <span className="mr-2 text-2xl font-extrabold">{section.id}.</span>
                  {section.title}
                </span>
              </div>
              <Button variant="ghost" onClick={handleNext} disabled={current === sections.length - 1} aria-label="다음 부제목으로">
                ▶
              </Button>
            </div>
            {/* 소제목 버튼 리스트 */}
            <div className="flex flex-col gap-4">
              {section.topics.map((topic, idx) => (
                <Button
                  key={topic}
                  className="w-full h-14 rounded-lg text-lg font-semibold bg-blue-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-blue-100 dark:hover:bg-slate-600 transition-colors border border-blue-100 dark:border-slate-600"
                  variant="secondary"
                  onClick={() => handleTopicClick(topic, idx)}
                >
                  {topic}
                </Button>
              ))}
            </div>
          </div>
          {/* 하단 안내 및 버튼 */}
          <div className="flex flex-col items-center gap-2 pt-2 pb-4">
            <div className="text-xs text-slate-500 dark:text-slate-400">문제를 선택하면 풀이 화면으로 이동합니다.</div>
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="outline" onClick={() => setIsSettingsOpen(true)}>설정</Button>
              <Button size="sm" variant="outline">도움말</Button>
              <Button size="sm" variant="outline">피드백</Button>
            </div>
          </div>
          <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
      </main>
    </SettingsProvider>
  );
} 