"use client";

import { motion } from "framer-motion";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#06060f] text-white p-6 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00f0ff]/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center space-y-8 z-10"
      >
        <div className="relative inline-block">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-white/5 border border-white/10 text-[#00f0ff] backdrop-blur-xl"
          >
            <Search size={48} strokeWidth={1.5} />
          </motion.div>
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full border-2 border-[#06060f]">
            404
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tighter">Lost in the Realm</h1>
          <p className="text-white/40 leading-relaxed text-sm">
            The page you're looking for has vanished into the quantum void.
            It may have been moved, deleted, or never existed in this dimension.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
          <a
            href="/"
            className="w-full py-4 bg-white text-[#06060f] rounded-2xl font-bold text-[15px] hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            <Home size={18} />
            Back to Home
          </a>
          <button
            onClick={() => window.history.back()}
            className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-[15px] hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        <p className="text-[10px] text-white/20 font-mono tracking-widest uppercase pt-8">
          QuantumByte Dimensional Error
        </p>
      </motion.div>
    </div>
  );
}
