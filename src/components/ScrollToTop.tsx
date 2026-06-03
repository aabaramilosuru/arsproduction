import { useState, useEffect, useCallback } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    setVisible(scrollY > 400);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min((scrollY / docHeight) * 100, 100) : 0;
    setProgress(pct);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const circumference = 2 * Math.PI * 18; // r=18
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 group ${
        visible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-8 scale-75 pointer-events-none'
      }`}
      style={{
        background: 'rgba(10, 10, 15, 0.9)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(16px)',
        boxShadow: visible
          ? '0 8px 32px rgba(220, 38, 38, 0.2), 0 0 0 1px rgba(220, 38, 38, 0.2)'
          : 'none',
      }}
    >
      {/* Progress ring */}
      <svg
        className="absolute inset-0 w-full h-full -rotate-90"
        viewBox="0 0 40 40"
      >
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="2"
        />
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="none"
          stroke="url(#scrollGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300"
        />
        <defs>
          <linearGradient id="scrollGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
      </svg>
      <ArrowUp className="w-4 h-4 text-white relative z-10 group-hover:-translate-y-0.5 transition-transform duration-300" />
    </button>
  );
}
