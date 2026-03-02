"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  FileSearch,
  MessageSquare,
  Landmark,
  Layers,
  Bot,
  ChevronDown,
} from "lucide-react";
import QuantumBackground from "@/components/QuantumBackground";

const menus = [
  {
    label: "Financial Tools",
    icon: Landmark,
    items: [
      { icon: FileSearch, label: "FS Reviewer", href: "/FS_reviewer" },
    ],
  },
  {
    label: "General Tools",
    icon: Layers,
    items: [
      { icon: Download, label: "Video Downloader", href: "/Video_downloader" },
    ],
  },
  {
    label: "AI Tools",
    icon: Bot,
    items: [
      { icon: MessageSquare, label: "AI Discussion", href: "/ai_discussion" },
    ],
  },
];

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

function NavDropdown({
  menu,
}: {
  menu: (typeof menus)[number];
}) {
  const [open, setOpen] = useState(false);
  const MenuIcon = menu.icon;

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="flex items-center gap-1.5 text-white/40 text-sm hover:text-white/90 transition-colors duration-200">
        <MenuIcon size={14} />
        {menu.label}
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute top-full right-0 mt-2 min-w-[180px] rounded-xl border border-white/10 bg-[#111118]/90 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {menu.items.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors duration-150"
              >
                <Icon size={15} className="text-[#00f0ff]/60" />
                {item.label}
              </a>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

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
        <div className="hidden sm:flex items-center gap-5">
          {menus.map((menu) => (
            <NavDropdown key={menu.label} menu={menu} />
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

      {/* Bottom tool bar (mobile) */}
      <motion.div
        className="absolute bottom-8 left-0 right-0 z-20 flex items-center justify-center gap-6 sm:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      >
        {menus.map((menu) =>
          menu.items.map((t) => {
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
          })
        )}
      </motion.div>
    </div>
  );
}
