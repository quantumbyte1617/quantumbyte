"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#06060f] text-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center space-y-8"
      >
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/20 text-red-500">
          <AlertCircle size={40} />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">Something went wrong</h1>
          <p className="text-white/40 leading-relaxed">
            We encountered an unexpected error. Don't worry, your data is safe.
            You can try to refresh the page or head back home.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full py-4 bg-white text-[#06060f] rounded-2xl font-bold text-[15px] hover:bg-white/90 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            Try again
          </button>
          <a
            href="/"
            className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-bold text-[15px] hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Back home
          </a>
        </div>

        {error.digest && (
          <p className="text-[10px] text-white/20 font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </motion.div>
    </div>
  );
}
