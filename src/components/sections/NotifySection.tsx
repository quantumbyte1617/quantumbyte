"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Check, ArrowRight } from "lucide-react";
import { fadeInUp, viewportConfig } from "@/lib/animations";

export default function NotifySection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email");
      return;
    }
    setError("");
    setSubmitted(true);
    // In production, this would send to an API
  };

  return (
    <motion.section
      className="py-16 px-6"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
    >
      <div className="max-w-3xl mx-auto">
        <div className="notify-glass p-8 md:p-10 text-center">
          {!submitted ? (
            <>
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-cyan/10 mb-5">
                <Bell size={22} className="text-accent-cyan" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2">
                Get notified when new tools launch
              </h3>
              <p className="text-text-muted text-sm mb-6 max-w-md mx-auto">
                We&apos;ll send you a one-time email when Image Compressor, PDF Tools, or
                any new app hits 100%. No spam, ever.
              </p>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-3 rounded-lg bg-bg-primary border border-border text-sm text-text-primary placeholder:text-text-muted/40 focus:border-accent-cyan/40 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-lg text-sm font-medium text-bg-primary hover:opacity-90 transition-opacity flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Notify Me
                  <ArrowRight size={14} />
                </button>
              </form>
              {error && (
                <p className="text-red-400 text-xs mt-2">{error}</p>
              )}
              <p className="text-text-muted/50 text-[11px] mt-4">
                One-time alerts only. Unsubscribe anytime.
              </p>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500/10 mb-4">
                <Check size={28} className="text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-2">You&apos;re on the list!</h3>
              <p className="text-text-muted text-sm">
                We&apos;ll let you know the moment a new tool is ready.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
