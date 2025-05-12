"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function Splash() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100 px-2 py-6">
      <div className="flex flex-col items-center gap-3">
        <span className="text-5xl animate-bounce">🌍</span>
        <h1 className="text-3xl font-extrabold tracking-tight mt-2">지리 크로스워드</h1>
        <p className="text-base text-slate-600 dark:text-slate-300 font-medium mt-1">재미있게 배우는 지리 개념, 크로스워드로 도전하세요!</p>
        <div className="mt-6 flex flex-col items-center gap-2">
          <div className="w-40 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-2 bg-blue-400 animate-pulse rounded-full w-2/3" />
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">잠시만 기다려주세요...</div>
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      router.replace("/login");
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  if (showSplash) {
    return <Splash />;
  }
  // 2초 후 자동으로 /login으로 이동
  return null;
}
