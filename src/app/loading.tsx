"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#06060f] text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-4"
      >
        <Loader2 size={40} className="animate-spin text-[#00f0ff]" />
        <p className="text-sm font-medium text-white/40 tracking-widest uppercase">
          QuantumByte Loading...
        </p>
      </motion.div>
    </div>
  );
}
