"use client";

import { motion } from "framer-motion";
import { MessageSquare, ArrowLeft, ExternalLink } from "lucide-react";

const aiModels = [
  { name: "Claude", color: "text-amber-400" },
  { name: "GPT", color: "text-emerald-400" },
  { name: "Gemini", color: "text-blue-400" },
];

const features = [
  "Pick any topic and watch AI models discuss it in real-time",
  "Each model brings its own reasoning style and perspective",
  "See agreements, disagreements, and surprising insights unfold",
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function AIDiscussionPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Background effects */}
      <div className="mesh-gradient fixed inset-0 pointer-events-none" />
      <div className="orb w-[500px] h-[500px] bg-accent-pink/12 -top-40 -right-40 fixed" />
      <div className="orb w-[400px] h-[400px] bg-accent-purple/10 bottom-0 -left-40 fixed" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        {/* Back link */}
        <motion.a
          href="/"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent-cyan transition-colors mb-10"
        >
          <ArrowLeft size={16} />
          Back to QuantumByte
        </motion.a>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-accent-pink/15 to-accent-purple/15 border border-accent-pink/10 mb-6">
            <MessageSquare size={34} className="text-accent-pink" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            <span className="gradient-text">AI Discussion</span>
          </h1>
          <p className="text-text-muted max-w-md mx-auto leading-relaxed">
            A real-time discussion room where Claude, GPT, and Gemini debate any
            topic you choose. Watch the models think, argue, and agree.
          </p>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease }}
          className="playground-glass p-6 md:p-8 mb-8"
        >
          <h2 className="text-lg font-semibold mb-3">How It Works</h2>
          <div className="space-y-3 text-sm text-text-muted leading-relaxed mb-6">
            {features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent-pink/15 text-accent-pink text-[11px] font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p>{feature}</p>
              </div>
            ))}
          </div>

          {/* AI Models */}
          <div className="mb-6">
            <p className="text-[11px] text-text-muted/60 mb-2.5 uppercase tracking-wider font-bold">
              AI Models
            </p>
            <div className="flex flex-wrap gap-2">
              {aiModels.map((model) => (
                <span
                  key={model.name}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium bg-white/4 border border-white/5 ${model.color}`}
                >
                  {model.name}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <a
            href="https://ai-discussion-room.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-gradient-to-r from-accent-pink to-accent-purple rounded-2xl font-bold text-bg-primary text-[15px] hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2.5 tracking-[0.3px]"
            style={{
              boxShadow: "0 4px 20px rgba(var(--color-accent-pink),0.12)",
            }}
          >
            Open AI Discussion
            <ExternalLink size={18} />
          </a>
        </motion.div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease }}
          className="text-center"
        >
          <p className="text-text-muted/40 text-[11px]">
            Powered by Claude, GPT, and Gemini APIs. Discussions are generated
            in real-time.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
