"use client";

import { motion } from "framer-motion";
import { Download, ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";

const supportedPlatforms = [
  { name: "YouTube", color: "text-red-400" },
  { name: "Instagram", color: "text-pink-400" },
  { name: "TikTok", color: "text-cyan-300" },
  { name: "Twitter/X", color: "text-blue-400" },
  { name: "Facebook", color: "text-blue-500" },
  { name: "Reddit", color: "text-orange-400" },
];

const formats = ["MP4 1080p", "MP4 720p", "MP3 Audio", "WebM"];

const ease = [0.22, 1, 0.36, 1] as const;

export default function VideoDownloaderPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Background effects */}
      <div className="mesh-gradient fixed inset-0 pointer-events-none" />
      <div className="orb w-[500px] h-[500px] bg-accent-cyan/15 -top-40 -right-40 fixed" />
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
          <div className="inline-flex items-center justify-center w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-accent-cyan/15 to-accent-purple/15 border border-accent-cyan/10 mb-6">
            <Download size={34} className="text-accent-cyan" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            <span className="gradient-text">Video Downloader</span>
          </h1>
          <p className="text-text-muted max-w-md mx-auto leading-relaxed">
            Download videos from any supported platform. Paste a link, pick your
            format, and save it instantly. No sign-ups, no limits.
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
            <div className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent-cyan/15 text-accent-cyan text-[11px] font-bold flex-shrink-0 mt-0.5">
                1
              </span>
              <p>Paste a video URL from any supported platform</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent-cyan/15 text-accent-cyan text-[11px] font-bold flex-shrink-0 mt-0.5">
                2
              </span>
              <p>Choose your preferred format and quality</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent-cyan/15 text-accent-cyan text-[11px] font-bold flex-shrink-0 mt-0.5">
                3
              </span>
              <p>Download directly to your device</p>
            </div>
          </div>

          {/* Formats */}
          <div className="mb-6">
            <p className="text-[11px] text-text-muted/60 mb-2.5 uppercase tracking-wider font-bold">
              Available Formats
            </p>
            <div className="flex flex-wrap gap-2">
              {formats.map((fmt) => (
                <span
                  key={fmt}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-accent-cyan/8 text-accent-cyan/80 border border-accent-cyan/10"
                >
                  {fmt}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <a
            href="https://videodownloader.quantumbyte.app"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-2xl font-bold text-bg-primary text-[15px] hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2.5 tracking-[0.3px]"
            style={{
              boxShadow: "0 4px 20px rgba(var(--color-accent-cyan),0.12)",
            }}
          >
            Open Video Downloader
            <ExternalLink size={18} />
          </a>
        </motion.div>

        {/* Supported Platforms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease }}
          className="text-center"
        >
          <p className="text-[11px] text-text-muted/60 mb-3 uppercase tracking-wider font-bold">
            Supported Platforms
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {supportedPlatforms.map((p) => (
              <span
                key={p.name}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium bg-white/4 border border-white/5 ${p.color}`}
              >
                {p.name}
              </span>
            ))}
          </div>
          <p className="text-text-muted/40 text-[11px] mt-6">
            Videos are processed on your device. We never store your downloads.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
