"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AppTitleProps {
  title?: string
  className?: string
}

const springConfig = {
  duration: 0.5,
  ease: "easeOut"
}

export function AppTitle({ 
  title = "크로스워드 퍼즐", 
  className 
}: AppTitleProps) {
  return (
    <div className={cn(
      "min-h-screen flex items-center justify-center bg-slate-900",
      className
    )}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springConfig}
        className="relative"
      >
        <div className={cn(
          "relative z-10 text-center",
          "px-8 py-6 rounded-xl",
          "bg-slate-800/95 backdrop-blur",
          "border border-slate-700",
          "shadow-[0_0_0_1px_rgba(30,41,59,0.2),0_8px_16px_-4px_rgba(30,41,59,0.3)]"
        )}>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-100">
            {title}
          </h1>
          <div className="mt-2 text-slate-400 text-sm md:text-base">
            간단하고 재미있는 단어 퍼즐 게임
          </div>
        </div>
        <div className="absolute inset-0 -z-10 blur-sm opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-slate-900 rounded-xl transform rotate-3"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-slate-900 rounded-xl transform -rotate-2"></div>
        </div>
      </motion.div>
    </div>
  )
} 