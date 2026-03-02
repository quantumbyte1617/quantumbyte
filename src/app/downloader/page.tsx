"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  ArrowLeft,
  Link2,
  Film,
  Music,
  FileVideo,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const formats = [
  { id: "mp4-1080", label: "MP4 1080p", icon: Film, quality: "HD" },
  { id: "mp4-720", label: "MP4 720p", icon: Film, quality: "SD" },
  { id: "mp3", label: "MP3 Audio", icon: Music, quality: "320kbps" },
  { id: "webm", label: "WebM", icon: FileVideo, quality: "HD" },
];

const supportedPlatforms = [
  { name: "YouTube", color: "text-red-400" },
  { name: "Instagram", color: "text-pink-400" },
  { name: "TikTok", color: "text-cyan-300" },
  { name: "Twitter/X", color: "text-blue-400" },
  { name: "Facebook", color: "text-blue-500" },
  { name: "Reddit", color: "text-orange-400" },
];

export default function DownloaderPage() {
  const [url, setUrl] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("mp4-1080");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setStatus("loading");
    // Simulate processing
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Background effects */}
      <div className="mesh-gradient fixed inset-0 pointer-events-none" />
      <div className="orb w-[500px] h-[500px] bg-accent-cyan/15 -top-40 -right-40 fixed" />
      <div className="orb w-[400px] h-[400px] bg-accent-purple/10 bottom-0 -left-40 fixed" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
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
          transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-cyan/10 mb-6">
            <Download size={32} className="text-accent-cyan" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Video Downloader</span>
          </h1>
          <p className="text-text-muted max-w-md mx-auto">
            Paste a video link from any supported platform. Pick your format.
            Download instantly.
          </p>
        </motion.div>

        {/* Download Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="playground-glass p-8 mb-8"
        >
          <form onSubmit={handleDownload} className="space-y-6">
            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Video URL
              </label>
              <div className="relative">
                <Link2
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted/50"
                />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-bg-primary border border-border text-sm text-text-primary placeholder:text-text-muted/40 focus:border-accent-cyan/40 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">Format</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {formats.map((fmt) => {
                  const Icon = fmt.icon;
                  return (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setSelectedFormat(fmt.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        selectedFormat === fmt.id
                          ? "bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan"
                          : "bg-bg-primary border-border text-text-muted hover:border-border hover:bg-white/3"
                      }`}
                    >
                      <Icon size={18} className="mb-1.5" />
                      <div className="text-xs font-medium">{fmt.label}</div>
                      <div className="text-[10px] opacity-60">{fmt.quality}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Download Button */}
            <button
              type="submit"
              disabled={!url.trim() || status === "loading"}
              className="w-full py-3.5 bg-gradient-to-r from-accent-cyan to-accent-purple rounded-xl font-medium text-bg-primary hover:opacity-90 transition-all glow-cyan-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing...
                </>
              ) : status === "success" ? (
                <>
                  <CheckCircle2 size={18} />
                  Ready to Download!
                </>
              ) : (
                <>
                  <Download size={18} />
                  Download Video
                </>
              )}
            </button>

            {status === "error" && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle size={16} />
                Could not process that URL. Please check the link and try again.
              </div>
            )}
          </form>
        </motion.div>

        {/* Supported Platforms */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <p className="text-xs text-text-muted/60 mb-3 uppercase tracking-wider">
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
