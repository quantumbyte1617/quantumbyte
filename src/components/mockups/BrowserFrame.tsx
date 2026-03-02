interface BrowserFrameProps {
  url?: string;
  children: React.ReactNode;
  className?: string;
}

export default function BrowserFrame({
  url = "quantumbyte.app",
  children,
  className = "",
}: BrowserFrameProps) {
  return (
    <div
      className={`rounded-xl overflow-hidden shadow-2xl border border-border ${className}`}
    >
      {/* Title bar */}
      <div className="h-10 bg-bg-secondary flex items-center px-4 gap-2 border-b border-border">
        {/* Traffic light dots */}
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        {/* URL bar */}
        <div className="flex-1 mx-3 h-6 rounded-md bg-bg-primary border border-border/50 flex items-center px-3">
          <svg
            className="w-3 h-3 text-text-muted/40 mr-2 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span className="text-[11px] text-text-muted/60 truncate">
            {url}
          </span>
        </div>
      </div>
      {/* Content area */}
      <div className="bg-bg-primary">{children}</div>
    </div>
  );
}
