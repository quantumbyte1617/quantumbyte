import { Download, Link2 } from "lucide-react";

export default function HeroMockupContent() {
  return (
    <div className="p-5 space-y-3.5 min-h-[300px]">
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 flex items-center justify-center">
          <Download size={16} className="text-accent-cyan" />
        </div>
        <div>
          <span className="text-sm font-semibold gradient-text block leading-tight">
            Video Downloader
          </span>
          <span className="text-[10px] text-text-muted">
            Paste a link, pick format, download
          </span>
        </div>
      </div>

      {/* URL Input */}
      <div className="h-9 rounded-lg bg-bg-secondary border border-border flex items-center px-3 gap-2">
        <Link2 size={13} className="text-text-muted/40 flex-shrink-0" />
        <span className="text-[11px] text-text-muted/50 truncate">
          https://youtube.com/watch?v=dQw4w9...
        </span>
      </div>

      {/* Format pills */}
      <div className="flex gap-1.5">
        <div className="px-3 py-1.5 rounded-lg text-[11px] font-medium bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
          MP4 1080p
        </div>
        <div className="px-3 py-1.5 rounded-lg text-[11px] bg-bg-secondary text-text-muted border border-border">
          MP3
        </div>
        <div className="px-3 py-1.5 rounded-lg text-[11px] bg-bg-secondary text-text-muted border border-border">
          WebM
        </div>
      </div>

      {/* Download button */}
      <div className="h-9 rounded-lg bg-gradient-to-r from-accent-cyan to-accent-purple flex items-center justify-center gap-2">
        <Download size={13} className="text-bg-primary" />
        <span className="text-[11px] font-semibold text-bg-primary">
          Download Video
        </span>
      </div>

      {/* Platforms */}
      <div className="pt-1">
        <p className="text-[9px] text-text-muted/40 uppercase tracking-wider mb-1.5">
          Supported
        </p>
        <div className="flex gap-1 flex-wrap">
          {["YouTube", "Instagram", "TikTok", "Twitter/X"].map((p) => (
            <span
              key={p}
              className="px-2 py-0.5 rounded text-[9px] bg-bg-secondary text-text-muted/70 border border-border"
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {/* Fake result preview */}
      <div className="rounded-lg bg-bg-secondary border border-border p-3 space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-14 h-10 rounded bg-accent-cyan/5 border border-border flex items-center justify-center">
            <svg
              className="w-4 h-4 text-accent-cyan/40"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="h-2 w-3/4 rounded bg-text-muted/10 mb-1.5" />
            <div className="h-1.5 w-1/2 rounded bg-text-muted/5" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[9px] text-green-500/70">Ready</span>
          <div className="h-5 px-3 rounded bg-accent-cyan/10 flex items-center">
            <span className="text-[9px] text-accent-cyan font-medium">
              Save
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
