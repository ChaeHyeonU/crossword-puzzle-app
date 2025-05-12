"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
// import { SiKakaotalk } from "react-icons/si";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // 소셜 로그인 핸들러
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");
    await signIn("google");
  };

  // const handleKakaoLogin = async () => {
  //   setIsLoading(true);
  //   setError("");
  //   await signIn("kakao");
  // };

  // 이메일 로그인 핸들러
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setTimeout(() => {
      setIsLoading(false);
      if (email === "test@example.com" && password === "1234") {
        router.replace("/gamepage");
      } else {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      }
    }, 1000);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 text-slate-900 dark:text-slate-100 px-2 py-6">
      {/* 상단: 앱명, 슬로건, 지구본 이모지 */}
      <div className="flex flex-col items-center gap-2 mb-6">
        <span className="text-4xl">🌍</span>
        <h1 className="text-2xl font-extrabold tracking-tight">지리 크로스워드</h1>
      </div>
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-white/90 dark:bg-slate-800 rounded-2xl shadow-xl p-5 sm:p-8 flex flex-col gap-5 border border-slate-200 dark:border-slate-700">
        <h2 className="text-xl font-bold text-center text-slate-900 dark:text-slate-100 tracking-tight mb-1">로그인</h2>
        <div className="flex flex-col gap-3">
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center gap-3 justify-center border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-700 h-12 text-base font-semibold text-slate-900 dark:text-slate-100"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            aria-label="구글로 로그인"
          >
            <FcGoogle className="w-6 h-6" />
            Google로 로그인
          </Button>
          {/*
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center gap-3 justify-center border border-slate-700 bg-yellow-300 text-black hover:bg-yellow-200 h-12 text-base font-semibold"
            onClick={handleKakaoLogin}
            disabled={isLoading}
            aria-label="카카오톡으로 로그인"
          >
            <SiKakaotalk className="w-6 h-6" />
            카카오톡으로 로그인
          </Button>
          */}
        </div>
        <div className="flex items-center my-1">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          <span className="mx-3 text-xs text-slate-400">또는</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        </div>
        <form className="flex flex-col gap-3" onSubmit={handleEmailLogin} autoComplete="off">
          <label htmlFor="email" className="sr-only">이메일</label>
          <Input
            id="email"
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
            autoFocus
            disabled={isLoading}
            aria-label="이메일"
            className="rounded-lg h-11 px-4 bg-blue-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-300 dark:focus:ring-slate-400 text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
          <label htmlFor="password" className="sr-only">비밀번호</label>
          <Input
            id="password"
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            aria-label="비밀번호"
            className="rounded-lg h-11 px-4 bg-blue-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-300 dark:focus:ring-slate-400 text-base text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
          {error && <div className="text-red-400 text-sm text-center mt-1">{error}</div>}
          <Button
            type="submit"
            className="w-full mt-1 h-11 rounded-lg text-base font-semibold bg-blue-400 dark:bg-slate-700 text-white dark:text-slate-100 hover:bg-blue-500 dark:hover:bg-slate-600 transition-colors"
            disabled={isLoading}
            aria-label="이메일로 로그인"
          >
            {isLoading ? "로그인 중..." : "이메일로 로그인"}
          </Button>
        </form>
      </div>
    </main>
  );
} 