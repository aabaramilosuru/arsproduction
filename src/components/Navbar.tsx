import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';


const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products' },
  { label: 'About', path: '/#about' },
  { label: 'Features', path: '/#features' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);

      // Calculate scroll progress
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass-nav py-3' : 'py-5 bg-transparent'
      }`}
    >
      {/* Scroll progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
        <div
          className="h-full transition-all duration-200 ease-out"
          style={{
            width: `${scrollProgress}%`,
            background: 'linear-gradient(90deg, #dc2626, #f97316, #fbbf24)',
            boxShadow: '0 0 10px rgba(220, 38, 38, 0.5)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <img src="/splash.png" alt="ARS Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold tracking-tight gradient-text" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                <span className="hidden sm:inline">Aaba Ramilo Suru</span>
                <span className="sm:hidden">ARS</span>
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className={`text-sm font-medium transition-all duration-200 hover:text-red-400 relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:rounded-full after:transition-all after:duration-300 ${
                  location.pathname === link.path
                    ? 'text-red-400 after:bg-red-400 after:w-full'
                    : 'text-white/70 hover:text-white after:w-0 after:bg-red-400/50 hover:after:w-full'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-xs text-white/40 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Made in Nepal
            </span>
            <a
              href="#join"
              className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg"
            >
              <span>Join Waitlist</span>
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
            aria-label="Toggle navigation menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <div className="relative w-5 h-5">
              <span className={`absolute top-0 left-0 w-full h-[2px] bg-current rounded-full transition-all duration-300 ${open ? 'rotate-45 translate-y-[9px]' : ''}`} />
              <span className={`absolute top-[9px] left-0 w-full h-[2px] bg-current rounded-full transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
              <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-current rounded-full transition-all duration-300 ${open ? '-rotate-45 -translate-y-[9px]' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        role="navigation"
        aria-label="Mobile navigation menu"
        className={`md:hidden transition-all duration-400 ease-out overflow-hidden ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="glass-nav mt-2 mx-4 rounded-2xl p-4 space-y-1 border border-white/5 shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                location.pathname === link.path
                  ? 'bg-red-600/20 text-red-400'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 mt-3 border-t border-white/10">
            <a
              href="#join"
              className="btn-primary block text-center px-4 py-3 rounded-xl text-sm font-semibold text-white"
            >
              <span>Join Waitlist 🚀</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
