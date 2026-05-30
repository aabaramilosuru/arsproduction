import { useEffect, useState } from 'react';

// Convert Nepali BS date to AD date
// 01/01/2083 BS = approximately January 14, 2026 AD
// Using exact conversion: 2083 BS starts ~April 14, 2026
// 01/01/2083 BS = Baishakh 1, 2083 = April 14, 2026 AD
function nepaliBS20830101ToAD(): Date {
  // Baishakh 1, 2083 BS = April 14, 2026 AD
  return new Date('2026-04-14T00:00:00');
}

function calculateDays(): number {
  const startDate = nepaliBS20830101ToAD();
  const today = new Date();
  const diffMs = today.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

interface DaysCounterProps {
  className?: string;
  showLabel?: boolean;
}

export default function DaysCounter({ className = '', showLabel = true }: DaysCounterProps) {
  const [displayDays, setDisplayDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const actualDays = calculateDays();

    // Animate count up
    let current = 0;
    const step = Math.ceil(actualDays / 40);
    const interval = setInterval(() => {
      current = Math.min(current + step, actualDays);
      setDisplayDays(current);
      if (current >= actualDays) clearInterval(interval);
    }, 30);

    // Live clock
    const clockInterval = setInterval(() => {
      const now = new Date();
      setHours(now.getHours());
      setMinutes(now.getMinutes());
      setSeconds(now.getSeconds());
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(clockInterval);
    };
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className={className}>
      <div className="flex flex-col items-center">
        {/* Big day counter */}
        <div className="relative">
          <div className="text-6xl sm:text-7xl md:text-8xl font-black gradient-text tabular-nums leading-none"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {displayDays}
          </div>
          <div className="absolute -top-2 -right-4 text-xs font-bold text-red-400 bg-red-600/20 px-2 py-1 rounded-full border border-red-600/30 animate-pulse">
            LIVE
          </div>
        </div>

        {showLabel && (
          <p className="text-white/50 text-sm mt-2 tracking-widest uppercase font-medium">
            Days Building
          </p>
        )}

        {/* Live time display */}
        <div className="mt-4 flex items-center gap-1 text-white/30 text-xs font-mono">
          <span className="bg-white/5 px-2 py-1 rounded">{pad(hours)}</span>
          <span className="animate-pulse">:</span>
          <span className="bg-white/5 px-2 py-1 rounded">{pad(minutes)}</span>
          <span className="animate-pulse">:</span>
          <span className="bg-white/5 px-2 py-1 rounded text-red-400/60">{pad(seconds)}</span>
        </div>

        <p className="text-white/20 text-[10px] mt-1">
          Since Baishakh 1, 2083 BS
        </p>
      </div>
    </div>
  );
}
