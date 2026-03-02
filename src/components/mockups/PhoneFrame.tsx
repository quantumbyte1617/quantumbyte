interface PhoneFrameProps {
  children: React.ReactNode;
  className?: string;
}

export default function PhoneFrame({
  children,
  className = "",
}: PhoneFrameProps) {
  return (
    <div
      className={`relative w-[220px] rounded-[2rem] border-[5px] border-[#2a2a2e] bg-bg-primary overflow-hidden shadow-2xl ${className}`}
    >
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] h-[22px] bg-[#2a2a2e] rounded-b-xl z-10" />

      {/* Status bar */}
      <div className="relative h-8 flex items-end justify-between px-5 pb-0.5 text-[9px] text-text-muted/50 z-20">
        <span>9:41</span>
        <div className="flex gap-1 items-center">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
          </svg>
          <svg className="w-3.5 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
          </svg>
        </div>
      </div>

      {/* Screen content */}
      <div className="relative min-h-[340px]">{children}</div>

      {/* Home indicator */}
      <div className="flex justify-center py-2">
        <div className="w-[90px] h-[4px] bg-text-muted/20 rounded-full" />
      </div>
    </div>
  );
}
