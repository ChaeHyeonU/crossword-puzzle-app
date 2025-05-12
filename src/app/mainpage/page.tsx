"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

// 부제목(Section) 데이터 구조
interface Section {
  id: string; // 로마 숫자 등
  title: string;
  topics: string[];
}

// 샘플 데이터 (추후 확장 가능)
const sections: Section[] = [
  { id: "Ⅰ", title: "내가 사는 세계", topics: ["내가 사는 세계", "지구상의 위치"] },
  { id: "Ⅱ", title: "인간 거주에 유리한 지역", topics: ["소제목3", "소제목4"] },
  { id: "Ⅲ", title: "극한 지대에서의 생활", topics: ["소제목5", "소제목6"] },
  { id: "Ⅳ", title: "자연으로 떠나는 여행", topics: ["소제목7", "소제목8"] },
];

const getSectionNumber = (id: string) => {
  // 로마 숫자를 아라비아 숫자로 변환
  const map: Record<string, number> = { "Ⅰ": 1, "Ⅱ": 2, "Ⅲ": 3, "Ⅳ": 4 };
  return map[id] || 0;
};

export default function GameMainPage() {
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  const handlePrev = () => setCurrent((prev) => (prev > 0 ? prev - 1 : prev));
  const handleNext = () => setCurrent((prev) => (prev < sections.length - 1 ? prev + 1 : prev));

  const section = sections[current];

  const handleTopicClick = (topic: string, topicIdx: number) => {
    const sectionNum = getSectionNumber(section.id);
    const topicId = `${sectionNum}-${topicIdx + 1}`;
    router.push(`/game/${topicId}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-100 px-2">
      <div className="w-full max-w-lg bg-slate-800 rounded-2xl shadow-xl p-6 flex flex-col gap-6 border border-slate-700">
        {/* 상단 부제목 */}
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={handlePrev} disabled={current === 0} aria-label="이전 부제목으로">
            ◀
          </Button>
          <h2 className="text-xl font-bold text-center flex-1">
            <span className="mr-2 text-2xl font-extrabold">{section.id}.</span>
            {section.title}
          </h2>
          <Button variant="ghost" onClick={handleNext} disabled={current === sections.length - 1} aria-label="다음 부제목으로">
            ▶
          </Button>
        </div>
        {/* 소제목 버튼 리스트 */}
        <div className="flex flex-col gap-4">
          {section.topics.map((topic, idx) => (
            <Button
              key={topic}
              className="w-full h-14 rounded-lg text-lg font-semibold bg-slate-700 text-slate-100 hover:bg-slate-600 transition-colors"
              variant="secondary"
              onClick={() => handleTopicClick(topic, idx)}
            >
              {topic}
            </Button>
          ))}
        </div>
      </div>
    </main>
  );
} 