"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppTitle } from "@/components/ui/app-title";

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
    return <AppTitle />;
  }
  // 3초 후 자동으로 /login으로 이동
  return null;
}
