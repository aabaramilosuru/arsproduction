import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/5 bg-black/40 backdrop-blur-xl">
      {/* Top glow */}
      <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-red-600/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-5 lg:col-span-1">
            <div className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <img src="/splash.png" alt="ARS Logo" className="w-12 h-12 object-contain" />
              </div>
              <div>
                <span className="text-xl font-bold gradient-text" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  Aaba Ramilo Suru
                </span>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              ARS (Aaba Ramilo Suru) — Nepal's own short-form video platform.
              Created by <strong className="text-white/70">Roshan Shrestha</strong>, a 17-year-old Nepali student developer,
              for Nepali creators. Every line of code written with Nepal in mind.
            </p>
            <div className="flex items-center gap-2 text-2xl">
              🇳🇵
              <span className="text-white/30 text-xs ml-1">Made with pride in Nepal</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-5">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase flex items-center gap-2">
              <span className="w-6 h-px bg-red-500/50" />
              Quick Links
            </h4>
            <div className="space-y-3">
              {[
                { label: 'Home', to: '/' },
                { label: 'Products', to: '/products' },
                { label: 'Features', to: '/#features' },
                { label: 'About Developer', to: '/#about' },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="block text-white/40 hover:text-red-400 text-sm transition-all duration-200 group flex items-center gap-2"
                >
                  <span className="w-0 group-hover:w-3 h-px bg-red-400 transition-all duration-200" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className="space-y-5">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase flex items-center gap-2">
              <span className="w-6 h-px bg-orange-500/50" />
              Products
            </h4>
            <div className="space-y-3">
              {[
                { label: '🎬 ARS Video App', to: '/products' },
                { label: '📡 ARS Live', to: '/products' },
                { label: '💰 ARS Coins', to: '/products' },
                { label: '🎵 ARS Sounds', to: '/products' },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="block text-white/40 hover:text-red-400 text-sm transition-all duration-200 group flex items-center gap-2"
                >
                  <span className="w-0 group-hover:w-3 h-px bg-red-400 transition-all duration-200" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div className="space-y-5">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase flex items-center gap-2">
              <span className="w-6 h-px bg-red-500/50" />
              Connect
            </h4>
            <p className="text-white/40 text-sm leading-relaxed">
              Follow the journey of building Nepal's first homegrown video platform. Every update, every milestone.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <TikTokIcon />, href: 'https://www.tiktok.com/@aabaramilosuru', label: 'TikTok', emoji: '🎵' },
                { icon: <InstagramIcon />, href: 'https://www.instagram.com/aabaramilosuru', label: 'Instagram', emoji: '📸' },
                { icon: <YouTubeIcon />, href: 'https://youtube.com/@aabaramilosuru', label: 'YouTube', emoji: '🎬' },
              ].map(({ icon, href, label, emoji }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all duration-200 hover:scale-110 hover:-translate-y-1 group relative"
                >
                  {icon}
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-medium text-white/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {emoji} {label}
                  </span>
                </a>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400/70 text-xs">Actively building</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="section-divider mb-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <p className="text-white/30 text-sm flex items-center gap-1.5 text-center sm:text-left">
            © {currentYear} ARS Nepal — Aaba Ramilo Suru. Built with{' '}
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" aria-label="love" />
            {' '}in Nepal by{' '}
            <span className="text-white/60 font-semibold hover:text-red-400 transition-colors duration-200">Roshan Shrestha</span>
          </p>
          <div className="flex items-center gap-4 text-white/20 text-xs">
            <span className="hover:text-white/40 transition-colors duration-200 cursor-pointer">Privacy Policy</span>
            <span className="text-white/10">·</span>
            <span className="hover:text-white/40 transition-colors duration-200 cursor-pointer">Terms of Service</span>
            <span className="text-white/10">·</span>
            <span className="text-red-400/60 font-medium">🇳🇵 Nepal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Real Brand SVG Icons ────────────────────────────────────────────────────

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79V9.5c-1.29.1-2.55-.15-3.75-.73-.42-.2-.82-.44-1.2-.68-.01 2.07-.01 4.14-.01 6.21-.28 1.78-.97 3.5-2.13 4.87-1.78 2.11-4.62 3.27-7.44 2.68-1.97-.41-3.72-1.57-4.92-3.09-1.93-2.45-2.46-5.91-1.17-8.81 1.16-2.61 3.65-4.54 6.42-5.06.58-.11 1.17-.15 1.76-.14V7.99c-1.95.35-3.83 1.68-4.61 3.51-.61 1.44-.53 3.08.01 4.47.58 1.49 1.72 2.73 3.15 3.52 1.44.8 3.12 1.08 4.73.7 1.49-.35 2.84-1.22 3.78-2.48.71-1.04 1.18-2.28 1.36-3.55.01-2.33.01-4.66.01-6.99z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4">
      <defs>
        <linearGradient id="ig-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f58529" />
          <stop offset="50%" stopColor="#dd2a7b" />
          <stop offset="100%" stopColor="#515bd4" />
        </linearGradient>
      </defs>
      <path fill="url(#ig-gradient)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}
