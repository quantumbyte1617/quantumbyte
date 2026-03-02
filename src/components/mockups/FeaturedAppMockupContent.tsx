import { Download, Link2 } from "lucide-react";

export default function FeaturedAppMockupContent() {
  return (
    <div className="p-4 space-y-2.5">
      {/* Header */}
      <div className="text-center pt-2">
        <div className="w-8 h-8 rounded-xl bg-accent-cyan/10 mx-auto mb-1.5 flex items-center justify-center">
          <Download size={14} className="text-accent-cyan" />
        </div>
        <div className="text-[11px] font-semibold gradient-text">
          Video Downloader
        </div>
      </div>

      {/* URL bar */}
      <div className="h-7 rounded-lg bg-bg-secondary border border-border flex items-center px-2.5 gap-1.5">
        <Link2 size={10} className="text-text-muted/30 flex-shrink-0" />
        <span className="text-[9px] text-text-muted/40 truncate">
          https://youtube.com/wa...
        </span>
      </div>

      {/* Format selector */}
      <div className="flex gap-1 justify-center">
        <div className="px-2.5 py-1 rounded-md text-[9px] font-medium bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/15">
          MP4
        </div>
        <div className="px-2.5 py-1 rounded-md text-[9px] bg-bg-secondary text-text-muted/60 border border-border">
          MP3
        </div>
        <div className="px-2.5 py-1 rounded-md text-[9px] bg-bg-secondary text-text-muted/60 border border-border">
          WebM
        </div>
      </div>

      {/* Download button */}
      <div className="h-7 rounded-lg bg-gradient-to-r from-accent-cyan to-accent-purple flex items-center justify-center gap-1.5">
        <Download size={10} className="text-bg-primary" />
        <span className="text-[9px] font-semibold text-bg-primary">
          Download
        </span>
      </div>

      {/* Result preview */}
      <div className="rounded-lg bg-bg-secondary border border-border p-2.5">
        <div className="flex items-center gap-2">
          <div className="w-10 h-7 rounded bg-accent-cyan/5 border border-border flex items-center justify-center flex-shrink-0">
            <svg
              className="w-3 h-3 text-accent-cyan/40"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="h-1.5 w-3/4 rounded bg-text-muted/10 mb-1" />
            <div className="h-1 w-1/2 rounded bg-text-muted/5" />
          </div>
        </div>
      </div>

      {/* Platforms */}
      <div className="flex gap-1 justify-center flex-wrap pt-0.5">
        {["YT", "IG", "TT", "X"].map((p) => (
          <span
            key={p}
            className="px-1.5 py-0.5 rounded text-[8px] bg-bg-secondary text-text-muted/50 border border-border"
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  );
}
