"use client";

import { motion } from "framer-motion";
import { Download, ArrowLeft, ExternalLink } from "lucide-react";

const supportedPlatforms = [
  "YouTube",
  "Instagram",
  "TikTok",
  "Twitter/X",
  "Facebook",
  "Reddit",
];

const formats = ["MP4 1080p", "MP4 720p", "MP3 Audio", "WebM"];

const ease = [0.22, 1, 0.36, 1] as const;

export default function VideoDownloaderPage() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Back link */}
        <motion.a
          href="/"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-10"
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/15 mb-6">
            <Download size={30} className="text-accent-cyan" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
            Video Downloader
          </h1>
          <p className="text-text-muted max-w-md mx-auto leading-relaxed">
            Download videos from any supported platform. Paste a link, pick your
            format, and save it instantly.
          </p>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease }}
          className="rounded-2xl border border-border bg-bg-card p-6 md:p-8 mb-8"
        >
          <h2 className="text-lg font-semibold mb-4">How It Works</h2>
          <div className="space-y-3 text-sm text-text-muted leading-relaxed mb-6">
            {[
              "Paste a video URL from any supported platform",
              "Choose your preferred format and quality",
              "Download directly to your device",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent-cyan/10 text-accent-cyan text-[11px] font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p>{step}</p>
              </div>
            ))}
          </div>

          {/* Formats */}
          <div className="mb-6">
            <p className="text-[11px] text-text-muted/60 mb-2.5 uppercase tracking-wider font-medium">
              Available Formats
            </p>
            <div className="flex flex-wrap gap-2">
              {formats.map((fmt) => (
                <span
                  key={fmt}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-bg-secondary text-text-muted border border-border"
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
            className="w-full py-3.5 bg-text-primary text-bg-primary rounded-xl font-semibold text-sm hover:opacity-85 transition-opacity flex items-center justify-center gap-2"
          >
            Open Video Downloader
            <ExternalLink size={16} />
          </a>
        </motion.div>

        {/* Supported Platforms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease }}
          className="text-center"
        >
          <p className="text-[11px] text-text-muted/60 mb-3 uppercase tracking-wider font-medium">
            Supported Platforms
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {supportedPlatforms.map((p) => (
              <span
                key={p}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-bg-secondary text-text-muted border border-border"
              >
                {p}
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
