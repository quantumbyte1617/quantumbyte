"use client";

import { motion } from "framer-motion";
import { Download, FileSearch, MessageSquare } from "lucide-react";
import QuantumBackground from "@/components/QuantumBackground";

const tools = [
  { icon: Download, label: "Video Downloader", href: "/Video_downloader" },
  { icon: FileSearch, label: "FS Reviewer", href: "/FS_reviewer" },
  { icon: MessageSquare, label: "AI Discussion", href: "/ai_discussion" },
];

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Home() {
  const text = "Quantum Realm";
  const chars = text.split("");

  return (
    <div className="relative w-full h-screen bg-[#06060f] overflow-hidden select-none">
      <QuantumBackground />

      {/* Nav */}
      <nav className="absolute top-0 left-0 right-0 z-20 px-6 py-5 flex items-center justify-between">
        <span className="text-lg font-bold tracking-tight">
          <span className="text-[#00f0ff]">Quantum</span>
          <span className="text-white/80">Byte</span>
        </span>
        <div className="hidden sm:flex items-center gap-6">
          {tools.map((t) => (
            <a
              key={t.href}
              href={t.href}
              className="text-white/40 text-sm hover:text-white/90 transition-colors duration-200"
            >
              {t.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Centered animated text */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter">
          {chars.map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.06 * i + 0.4,
                duration: 0.7,
                ease,
              }}
              className="inline-block text-white"
              style={{
                textShadow:
                  "0 0 40px rgba(0, 240, 255, 0.3), 0 0 80px rgba(0, 240, 255, 0.1)",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </h1>
      </div>

      {/* Bottom tool bar (mobile + desktop) */}
      <motion.div
        className="absolute bottom-8 left-0 right-0 z-20 flex items-center justify-center gap-6 sm:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      >
        {tools.map((t) => {
          const Icon = t.icon;
          return (
            <a
              key={t.href}
              href={t.href}
              className="flex flex-col items-center gap-1.5 text-white/30 hover:text-white/70 transition-colors"
            >
              <Icon size={18} />
              <span className="text-[10px]">{t.label}</span>
            </a>
          );
        })}
      </motion.div>
    </div>
  );
}
