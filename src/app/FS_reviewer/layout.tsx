"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function FSReviewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, toggleTheme } = useTheme();
  const previousThemeRef = useRef<string | null>(null);
  const [ready, setReady] = useState(false);

  // Force dark on mount, restore on unmount
  useEffect(() => {
    previousThemeRef.current = theme;
    if (theme !== "dark") {
      toggleTheme();
    }
    setReady(true);

    return () => {
      // Restore previous theme when leaving
      const current = document.documentElement.getAttribute("data-theme");
      const shouldRestore = previousThemeRef.current === "light";
      if (shouldRestore && current === "dark") {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("qb-theme", "light");
      }
    };
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {ready && children}

      {/* Floating theme toggle */}
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className="fixed bottom-6 right-6 z-50 theme-toggle w-11 h-11 !rounded-full shadow-lg"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </>
  );
}
