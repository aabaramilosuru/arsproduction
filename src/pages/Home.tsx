import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, ChevronRight, Star, TrendingUp, Users, ArrowRight, Sparkles,
  Play, Shield, Music, Globe, Heart, DollarSign
} from 'lucide-react';
import DaysCounter from '../components/DaysCounter';

// ─── Canvas Particle System ──────────────────────────────────────────────────
function CanvasParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let mouseX = 0;
    let mouseY = 0;
    let particles: Array<{
      x: number; y: number; vx: number; vy: number;
      size: number; alpha: number; life: number; maxLife: number;
      color: string;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    canvas.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const spawnParticle = () => {
      if (particles.length > 100) return;
      const colors = ['#dc2626', '#f97316', '#fbbf24', '#ef4444', '#fb923c'];
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(Math.random() * 0.8 + 0.3),
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.6 + 0.2,
        life: 0,
        maxLife: Math.random() * 200 + 150,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    };

    // Spawn initial particles
    for (let i = 0; i < 60; i++) {
      const colors = ['#dc2626', '#f97316', '#fbbf24', '#ef4444', '#fb923c'];
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.3 + 0.1),
        size: Math.random() * 2.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        life: 0,
        maxLife: Math.random() * 300 + 200,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let frameCount = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frameCount++;

      // Spawn new particles
      if (frameCount % 4 === 0) spawnParticle();

      // Draw mouse glow
      const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 250);
      gradient.addColorStop(0, 'rgba(220, 38, 38, 0.08)');
      gradient.addColorStop(0.3, 'rgba(249, 115, 22, 0.04)');
      gradient.addColorStop(0.6, 'rgba(59, 130, 246, 0.02)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update & draw particles
      particles = particles.filter(p => p.life < p.maxLife);
      particles.forEach(p => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        // Mouse interaction
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150 * 0.5;
          p.x -= dx / dist * force;
          p.y -= dy / dist * force;
        }

        const fadeIn = Math.min(1, p.life / 30);
        const fadeOut = Math.max(0, 1 - (p.life - p.maxLife + 40) / 40);
        const alpha = p.alpha * fadeIn * fadeOut;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fill();

        // Glow
        if (p.size > 1.5) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha * 0.15;
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
}

// ─── Starfield Background ──────────────────────────────────────────────────
function StarfieldBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const stars = 200;
    const meteorCount = 3;

    // Create stars
    for (let i = 0; i < stars; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 2.5 + 0.5;
      const isBright = Math.random() > 0.85;
      const isDim = Math.random() < 0.3;
      star.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        --duration: ${Math.random() * 4 + 2}s;
        --delay: ${Math.random() * 5}s;
      `;
      if (isBright) star.classList.add('bright');
      if (isDim) star.classList.add('dim');
      container.appendChild(star);
    }

    // Create meteors
    for (let i = 0; i < meteorCount; i++) {
      const meteor = document.createElement('div');
      meteor.className = 'meteor';
      meteor.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 30}%;
        --duration: ${Math.random() * 2 + 1.5}s;
        --delay: ${Math.random() * 10 + 5}s;
      `;
      container.appendChild(meteor);
    }

    return () => {
      container.innerHTML = '';
    };
  }, []);

  return <div ref={containerRef} className="starfield" />;
}

// ─── Cursor Sparkle Effect ──────────────────────────────────────────────────
function CursorSparkles() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let sparkles: HTMLDivElement[] = [];
    let frameId: number;
    let lastTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Move glow
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`;
        glowRef.current.style.top = `${e.clientY}px`;
        glowRef.current.style.width = `${150 + Math.sin(Date.now() / 1000) * 50}px`;
        glowRef.current.style.height = glowRef.current.style.width;
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Burst sparkles on click
      for (let i = 0; i < 12; i++) {
        const sparkle = document.createElement('div');
        const size = Math.random() * 6 + 3;
        const colors = ['#dc2626', '#f97316', '#fbbf24', '#ef4444', '#ffffff'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const angle = (Math.PI * 2 * i) / 12 + (Math.random() - 0.5) * 0.5;
        const dist = Math.random() * 30 + 10;
        sparkle.style.cssText = `
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background: ${color};
          left: ${e.clientX}px;
          top: ${e.clientY}px;
          box-shadow: 0 0 ${size * 2}px ${color};
          --tx: ${Math.cos(angle) * dist}px;
          --ty: ${Math.sin(angle) * dist}px;
          animation: clickSparkle 0.6s ease-out forwards;
        `;
        document.body.appendChild(sparkle);
        sparkles.push(sparkle);
        setTimeout(() => {
          if (sparkle.parentElement) sparkle.remove();
          sparkles = sparkles.filter(s => s !== sparkle);
        }, 600);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(frameId);
      sparkles.forEach(s => s.remove());
    };
  }, []);

  return <div ref={glowRef} className="cursor-glow" />;
}

// ─── Mouse Parallax Hook ─────────────────────────────────────────────────────
function useMouseParallax(factor = 20) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = (e.clientX - centerX) / factor;
      const y = (e.clientY - centerY) / factor;
      setOffset({ x, y });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [factor]);

  return { ref, offset };
}

// ─── 3D Tilt Card Hook ───────────────────────────────────────────────────────
function useTiltCard() {
  const ref = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: -y * 12, y: x * 12 });
  }, []);

  const handleLeave = useCallback(() => setRotate({ x: 0, y: 0 }), []);

  return { ref, rotate, handleMouse, handleLeave };
}

// ─── TiltCard Component ──────────────────────────────────────────────────────
function TiltCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, rotate, handleMouse, handleLeave } = useTiltCard();

  return (
    <div className="card-3d" ref={ref}>
      <div
        className={`card-3d-inner ${className}`}
        onMouseMove={handleMouse}
        onMouseLeave={handleLeave}
        style={{
          transform: `perspective(800px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Animated Background ─────────────────────────────────────────────────────
function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Starfield night sky */}
      <div className="absolute inset-0">
        <StarfieldBackground />
      </div>
      {/* Gradient mesh */}
      <div className="absolute inset-0 mesh-gradient-shift" />
      {/* Grid */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      {/* Gradient overlays - deep dark edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-transparent to-[#0a0a0f]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-transparent to-[#0a0a0f]" />
      {/* Additional atmospheric glow at bottom */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-red-600/5 to-transparent blur-3xl" />
      {/* Canvas particles */}
      <CanvasParticles />
    </div>
  );
}

// ─── Feature Card ────────────────────────────────────────────────────────────
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  delay?: number;
}

function FeatureCard({ icon, title, description, gradient, delay = 0 }: FeatureCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const { rotate, handleMouse, handleLeave } = useTiltCard();

  return (
    <div
      ref={ref}
      className="card-3d"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `all 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      <div
        className="card-3d-inner feature-card rounded-2xl p-6 sm:p-7 h-full cursor-default relative overflow-hidden group"
        onMouseMove={handleMouse}
        onMouseLeave={handleLeave}
        style={{
          transform: visible
            ? `perspective(800px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`
            : 'perspective(800px) rotateX(10deg) rotateY(0deg)',
        }}
      >
        {/* Hover glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600/0 via-red-600/0 to-orange-500/0 group-hover:from-red-600/10 group-hover:via-red-600/5 group-hover:to-orange-500/10 blur-2xl transition-all duration-700 rounded-3xl opacity-0 group-hover:opacity-100" />

        <div className="relative z-10">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 ${gradient} shadow-lg`}>
            {icon}
          </div>
          <h3
            className="text-white font-bold text-lg sm:text-xl mb-2"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {title}
          </h3>
          <p className="text-white/50 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Stats Card ──────────────────────────────────────────────────────────────
function StatCard({ value, label, icon, delay = 0 }: {
  value: string; label: string; icon: React.ReactNode; delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <TiltCard>
      <div
        ref={ref}
        className="stat-card rounded-2xl px-6 py-6 sm:py-7 text-center flex flex-col items-center gap-2 card-hover"
        style={{
          transition: `all 0.6s ease ${delay}ms`,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
        }}
      >
        <div className="text-red-400 mb-1">{icon}</div>
        <div
          className="text-4xl sm:text-5xl font-black gradient-text tabular-nums"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          {value}
        </div>
        <div className="text-white/50 text-xs tracking-widest uppercase font-semibold">{label}</div>
      </div>
    </TiltCard>
  );
}

// ─── SEO Hidden Content ──────────────────────────────────────────────────────
function SeoContent() {
  return (
    <div aria-hidden="true" style={{
      position: 'absolute', width: '1px', height: '1px',
      overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap'
    }}>
      <h1>Aaba Ramilo Suru — ARS Nepal by Roshan Shrestha</h1>
      <p>
        ARS (Aaba Ramilo Suru) is Nepal's own short-form video social media platform built by
        Roshan Shrestha, a 17-year-old self-taught Nepali student developer and founder.
        ARS Nepal is the best TikTok alternative for Nepali creators. Create short videos,
        go live, earn coins, and connect with the Nepali community. Aaba Ramilo Suru means
        "Let's Start Now" in Nepali — and that's exactly what ARS is doing for Nepal's
        creator economy. Roshan Shrestha is building Nepal's first homegrown video platform
        from scratch.
      </p>
    </div>
  );
}

// ─── Section Header ──────────────────────────────────────────────────────────
function SectionHeader({
  badge, badgeIcon, title, subtitle,
}: {
  badge: string; badgeIcon?: React.ReactNode; title: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="text-center mb-12 sm:mb-16">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-600/20 text-red-400 text-sm font-medium mb-4 reveal">
        {badgeIcon}
        {badge}
      </div>
      <h2
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight reveal"
        style={{ fontFamily: 'Space Grotesk, sans-serif', transitionDelay: '100ms' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="text-white/50 mt-4 text-base max-w-xl mx-auto reveal" style={{ transitionDelay: '200ms' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── Timeline Item ───────────────────────────────────────────────────────────
function TimelineItem({
  year, title, description, active = false,
}: {
  year: string; title: string; description: string; active?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex gap-5 items-start"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(-20px)',
        transition: `all 0.6s ease`,
      }}
    >
      <div className="flex flex-col items-center">
        <div className={`timeline-dot ${active ? 'shadow-lg' : ''}`} />
        <div className="timeline-line flex-1 min-h-[40px]" />
      </div>
      <div className="pb-8 pt-1">
        <span className={`text-xs font-bold tracking-widest ${active ? 'text-red-400' : 'text-white/30'}`}>
          {year}
        </span>
        <h4 className="text-white font-bold text-base mt-1" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          {title}
        </h4>
        <p className="text-white/40 text-sm mt-1">{description}</p>
      </div>
    </div>
  );
}

// ─── Main Home Page ──────────────────────────────────────────────────────────
export default function Home() {
  const [typedText, setTypedText] = useState('');
  const fullText = 'Aaba Ramilo Suru';
  const parallax = useMouseParallax(30);

  // Update page metadata for SEO
  useEffect(() => {
    document.title = 'Aaba Ramilo Suru | ARS Nepal — aabaramilosuru | Nepal\'s Own Short Video Platform by Roshan Shrestha';
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content',
      'Aaba Ramilo Suru (ARS Nepal) by Roshan Shrestha — aabaramilosuru. Nepal\'s own short-form video social media platform built by a 17-year-old Nepali student developer. Create, share, go live, earn rewards. Nepal\'s TikTok alternative made in Nepal for Nepali creators.'
    );
    const keywords = document.querySelector('meta[name="keywords"]');
    if (keywords) keywords.setAttribute('content',
      'Aaba Ramilo Suru, ARS, ARS Nepal, aabaramilosuru, Roshan Shrestha, roshan ars, ars nepal, roshan shrestha aabaramilosuru, Nepal short video app, Nepal TikTok alternative, Nepali creators platform'
    );
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://ars.qzz.io/');
  }, []);

  // Typing effect
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 70);
    return () => clearInterval(timer);
  }, []);

  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <Play className="w-5 h-5 text-white" />,
      title: 'Short Videos',
      description: 'Create and share 15s to 60s videos with filters, effects, and music. Express yourself the Nepali way.',
      gradient: 'bg-gradient-to-br from-red-600 to-red-500',
    },
    {
      icon: <RadioIcon className="w-5 h-5 text-white" />,
      title: 'Live Streaming',
      description: 'Go live and connect with your audience in real-time. Receive gifts and build your Nepali community.',
      gradient: 'bg-gradient-to-br from-orange-500 to-yellow-500',
    },
    {
      icon: <DollarSign className="w-5 h-5 text-white" />,
      title: 'Earn Rewards',
      description: 'Creators earn coins from gifts, which can be converted to real money. Your content has real value.',
      gradient: 'bg-gradient-to-br from-yellow-500 to-amber-500',
    },
    {
      icon: <Music className="w-5 h-5 text-white" />,
      title: 'Nepali Sounds',
      description: 'A growing library of Nepali music and trending sounds. Create content that resonates with Nepal.',
      gradient: 'bg-gradient-to-br from-purple-600 to-pink-500',
    },
    {
      icon: <Shield className="w-5 h-5 text-white" />,
      title: 'Safe & Secure',
      description: 'Content moderation, reporting system, and privacy controls to keep the Nepali community safe.',
      gradient: 'bg-gradient-to-br from-blue-600 to-cyan-500',
    },
    {
      icon: <Zap className="w-5 h-5 text-white" />,
      title: 'Fast & Light',
      description: 'Optimized for Nepal\'s network conditions. Works smoothly even on slower internet connections.',
      gradient: 'bg-gradient-to-br from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Cursor sparkle effects */}
      <CursorSparkles />

      <SeoContent />

      {/* ═══ HERO SECTION ═══ */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-24 pb-12 overflow-hidden"
        aria-label="Hero section"
      >
        <HeroBackground />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6" ref={parallax.ref}>
          {/* Nepal badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 mb-4 flag-pulse"
            style={{ transform: `translate(${parallax.offset.x * 0.5}px, ${parallax.offset.y * 0.5}px)` }}
          >
            <span className="text-lg">🇳🇵</span>
            <span className="tracking-wider font-semibold">Nepal's Own Platform</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse ml-1" />
          </div>

          {/* Logo with rotating orbital rings */}
          <div
            className="flex justify-center mb-2"
            style={{ transform: `translate(${parallax.offset.x * -0.3}px, ${parallax.offset.y * -0.3}px)` }}
          >
            <div className="relative float-slow">
              {/* Orbital decoration rings */}
              <div className="absolute inset-[-40px] orbital-ring" style={{ width: 'calc(100% + 80px)', height: 'calc(100% + 80px)' }} />
              <div className="absolute inset-[-70px] orbital-ring" style={{ width: 'calc(100% + 140px)', height: 'calc(100% + 140px)' }} />
              <div className="absolute inset-[-100px] orbital-ring" style={{ width: 'calc(100% + 200px)', height: 'calc(100% + 200px)' }} />

              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl flex items-center justify-center hero-glow rounded-3xl">
                <img src="/splash.png" alt="ARS Logo" className="w-28 h-28 sm:w-36 sm:h-36 object-contain drop-shadow-2xl" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-[#0a0a0f] animate-pulse" />

              {/* Animated glowing particles around logo */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-48 sm:h-48 rounded-full border border-red-500/10 spin-slow" style={{ animationDuration: '8s' }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-400 shadow-lg shadow-red-500/50" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-52 h-52 sm:w-64 sm:h-64 rounded-full border border-orange-500/5 spin-slow" style={{ animationDuration: '12s', animationDirection: 'reverse' }}>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-orange-400 shadow-lg shadow-orange-500/50" />
              </div>
            </div>
          </div>

          {/* Brand name with typing effect */}
          <div>
            <h1
              className="hero-title font-black text-white leading-tight"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              <span className="gradient-text-fire">{typedText}</span>
              <span className="cursor text-red-400 font-thin">|</span>
            </h1>
          </div>

          {/* Tagline */}
          <p
            className="text-base sm:text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed font-light"
            style={{ transform: `translate(${parallax.offset.x * 0.2}px, ${parallax.offset.y * 0.2}px)` }}
          >
            Nepal's own short-form video social media platform — built by{' '}
            <span className="text-white font-semibold">Roshan Shrestha</span>, a Nepali student, for Nepali creators.
            <span className="text-red-400 font-semibold"> Express yourself, go viral, earn rewards.</span>
          </p>

          {/* Action words with stagger animation */}
          <div className="flex flex-wrap justify-center gap-2 text-lg sm:text-xl font-bold">
            {['Create.', 'Share.', 'Inspire Nepal.'].map((word, i) => (
              <span
                key={word}
                className={i === 2 ? 'gradient-text-fire' : 'text-white/90'}
                style={{ fontFamily: 'Space Grotesk, sans-serif', animationDelay: `${i * 0.15}s` }}
              >
                {word}
              </span>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#join"
              className="btn-primary px-8 py-4 rounded-2xl text-base font-bold text-white flex items-center gap-2 shadow-2xl group"
            >
              <span className="flex items-center gap-2">
                🚀 Join Waitlist
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
            <Link
              to="/products"
              className="btn-secondary px-8 py-4 rounded-2xl text-base font-bold text-white flex items-center gap-2 group"
            >
              <span>Explore Products</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="pt-8 flex flex-col items-center gap-2 text-white/20">
            <span className="text-xs tracking-[0.2em] uppercase font-medium">Scroll to explore</span>
            <div className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center p-1">
              <div className="w-1 h-2.5 bg-gradient-to-b from-red-400 to-orange-400 rounded-full scroll-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS SECTION ═══ */}
      <section className="relative py-16 sm:py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-black/40 to-[#0a0a0f]" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <TiltCard>
              <div className="stat-card rounded-2xl p-6 text-center card-hover h-full">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                </div>
                <DaysCounter showLabel={true} />
              </div>
            </TiltCard>
            <StatCard
              value="∞"
              label="Possibilities"
              icon={<Sparkles className="w-5 h-5" />}
              delay={100}
            />
            <StatCard
              value="1"
              label="Developer"
              icon={<Star className="w-5 h-5" />}
              delay={200}
            />
            <StatCard
              value="🇳🇵"
              label="Made in Nepal"
              icon={<Heart className="w-5 h-5" />}
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* ═══ DIVIDER ═══ */}
      <div className="section-divider mx-8 sm:mx-16" />

      {/* ═══ FEATURES SECTION ═══ */}
      <section id="features" className="relative py-20 sm:py-28 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/5 to-transparent" />
        <div className="max-w-6xl mx-auto relative z-10">
          <SectionHeader
            badge="Platform Features"
            badgeIcon={<Zap className="w-4 h-4" />}
            title={<>Everything Nepal <span className="gradient-text">Needs</span></>}
            subtitle="ARS — Aaba Ramilo Suru — is designed from scratch with Nepali creators in mind. Every feature built to serve the Nepali community."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} delay={i * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ APP PREVIEW SECTION ═══ */}
      <section className="relative py-20 sm:py-28 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/20 via-transparent to-orange-950/20" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: text */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium reveal">
                <TrendingUp className="w-4 h-4" />
                Coming Soon
              </div>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight reveal"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                The Next-Gen<br />
                <span className="gradient-text-fire">Nepali App</span>
              </h2>
              <p className="text-white/50 text-base leading-relaxed reveal" style={{ transitionDelay: '150ms' }}>
                ARS is being built from the ground up — optimized for mobile-first Nepal.
                A platform that truly understands the Nepali creator, their language, their culture, their dreams.
              </p>

              <div className="space-y-3 reveal" style={{ transitionDelay: '250ms' }}>
                {[
                  { icon: '🎬', text: 'Short videos 15s – 60s with Nepali filters' },
                  { icon: '📡', text: 'Live streaming with gift economy' },
                  { icon: '💰', text: 'Monetization for Nepali creators' },
                  { icon: '🇳🇵', text: 'Fully localized for Nepal' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3 text-white/70 group hover:translate-x-1 transition-transform">
                    <span className="text-lg w-8">{item.icon}</span>
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/products"
                className="inline-flex items-center gap-2 btn-primary px-7 py-3.5 rounded-2xl text-sm font-bold text-white group reveal"
                style={{ transitionDelay: '300ms' }}
              >
                <span>Explore All Products</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right: realistic phone mockup with image */}
            <div className="flex justify-center reveal-right">
              <div className="relative float-slow">
                {/* Phone frame */}
                <div
                  className="w-64 sm:w-80 rounded-[3rem] overflow-hidden border-4 border-white/10 shadow-2xl transition-all duration-500 hover:border-red-500/30 relative"
                  style={{
                    boxShadow: '0 0 60px rgba(220,38,38,0.3), 0 40px 80px rgba(0,0,0,0.6)',
                  }}
                >
                  {/* Phone screen */}
                  <div className="aspect-[9/19] bg-gradient-to-b from-[#0a0a1a] to-[#000] flex items-center justify-center p-4 relative overflow-hidden">
                    {/* App screen content */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 to-black/80" />

                    {/* App UI simulation */}
                    <div className="relative z-10 w-full h-full flex flex-col">
                      {/* Status bar */}
                      <div className="flex justify-between items-center px-2 pt-2 pb-4">
                        <span className="text-white/40 text-[10px]">9:41</span>
                        <div className="flex gap-1">
                          <div className="w-3 h-2 rounded-[1px] border border-white/30" />
                          <span className="text-white/40 text-[10px]">📶</span>
                          <span className="text-white/40 text-[10px]">🔋</span>
                        </div>
                      </div>

                      {/* Content area */}
                      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                        {/* Real App Logo */}
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-600/30 float-fast">
                          <img src="/splash.png" alt="ARS Nepal Logo" className="w-14 h-14 object-contain" />
                        </div>
                        <p className="text-white/50 text-xs font-semibold tracking-widest uppercase">Aaba Ramilo Suru</p>

                        <div className="flex gap-1.5">
                          {[0, 1, 2].map(i => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-red-400 animate-pulse' : 'bg-white/20'}`}
                            />
                          ))}
                        </div>

                        {/* Bottom tag */}
                        <div className="absolute bottom-8 left-0 right-0 text-center">
                          <p className="text-white/60 text-xs font-semibold">🎬 Nepal's Own</p>
                          <p className="text-white/20 text-[9px] mt-0.5">short video platform</p>
                        </div>

                        {/* Horizontal content thumbnails */}
                        <div className="absolute bottom-16 left-4 right-4 flex gap-2">
                          {[0, 1, 2].map(i => (
                            <div key={i} className="flex-1 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
                              <span className="text-white/20 text-[8px]">▶</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-5 -right-5 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg float-delayed shadow-red-600/30">
                  🇳🇵 Nepal's Own
                </div>
                <div className="absolute -bottom-4 -left-5 bg-[#1a1a2e] border border-white/10 text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg float shadow-black/50 backdrop-blur-sm">
                  ⚡ Coming Soon
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TIMELINE / ROADMAP ═══ */}
      <section className="relative py-20 sm:py-28 px-4">
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            badge="Journey"
            badgeIcon={<Globe className="w-4 h-4" />}
            title={<>The <span className="gradient-text">Story</span> So Far</>}
            subtitle="From idea to reality — the ARS Nepal journey"
          />

          <div className="ml-4 mt-10">
            <TimelineItem
              year="EARLY 2025"
              title="💡 The Idea"
              description="Roshan Shrestha, a 17-year-old student from Nepal, starts dreaming of building Nepal's own short-video platform."
            />
            <TimelineItem
              year="MID 2025"
              title="🔨 First Lines of Code"
              description="Backend development begins. Flask API, Supabase database, Cloudflare R2 storage. The foundation of ARS is laid."
            />
            <TimelineItem
              year="LATE 2025"
              title="📱 Mobile & Admin Built"
              description="Flutter mobile app takes shape. Admin panel with 18 pages built. Video pipeline with HLS streaming completed."
            />
            <TimelineItem
              year="2026"
              title="🚀 Active Development"
              description="170+ API endpoints built. 30+ ECC agents helping development. Every day brings ARS closer to launch."
              active={true}
            />
          </div>
        </div>
      </section>

      {/* ═══ ABOUT DEVELOPER ═══ */}
      <section id="about" className="relative py-20 sm:py-28 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-red-950/10 to-[#0a0a0f]" />
        <div className="max-w-4xl mx-auto relative z-10">
          <SectionHeader
            badge="The Developer"
            badgeIcon={<Users className="w-4 h-4" />}
            title={<>Built by <span className="gradient-text">Roshan Shrestha</span></>}
            subtitle="Founder of ARS Nepal — Aaba Ramilo Suru"
          />

          {/* Developer card */}
          <TiltCard>
            <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-8 sm:p-10 overflow-hidden card-hover group">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-red-600/10 to-transparent rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-2xl" />
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600/0 via-red-600/0 to-orange-500/0 group-hover:from-red-600/5 group-hover:via-transparent group-hover:to-orange-500/5 blur-3xl transition-all duration-700" />

              <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-8">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 avatar-border shadow-xl pulse-ring">
                    <div className="w-full h-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center">
                      <span className="text-3xl font-black text-white">R</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-[#0a0a0f] shadow-lg">
                    BUILDING
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center sm:text-left space-y-3">
                  <div>
                    <h3
                      className="text-2xl sm:text-3xl font-black text-white"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      Roshan Shrestha{' '}
                      <span className="wave">👋</span>
                    </h3>
                    <p className="text-red-400 font-semibold text-sm mt-0.5">Developer & Founder @ ARS Nepal — Aaba Ramilo Suru</p>
                  </div>

                  <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-xl">
                    A <span className="text-white font-semibold">17-year-old self-taught developer</span> from Nepal,
                    building ARS (Aaba Ramilo Suru) — Nepal's own short-form video social media platform — from scratch.
                    Roshan is passionate about creating technology that serves Nepali creators and brings
                    the community together. Every line of code is written with the dream of giving Nepal its own
                    platform to shine on the world stage.
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
                    {[
                      { emoji: '🎓', text: '17 yrs' },
                      { emoji: '📚', text: 'Class 9' },
                      { emoji: '🇳🇵', text: 'Nepal' },
                      { emoji: '💻', text: 'Self-taught' },
                      { emoji: '🚀', text: 'Founder' },
                    ].map((tag) => (
                      <span
                        key={tag.text}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-medium hover:bg-red-600/10 hover:border-red-600/30 hover:text-red-400 transition-all duration-200"
                      >
                        {tag.emoji} {tag.text}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-2">
                    <div className="flex items-center gap-2 bg-red-600/10 border border-red-600/20 rounded-xl px-4 py-2 group">
                      <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse group-hover:scale-125 transition-transform" />
                      <span className="text-red-400 text-xs font-semibold">Actively building every day</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="relative z-10 mt-8 pt-6 border-t border-white/5">
                <blockquote className="text-center text-white/40 text-sm italic">
                  "I'm just a student from Nepal, but I believe Nepal deserves its own platform.
                  <span className="text-red-400 not-italic font-semibold"> Aaba Ramilo Suru.</span>"
                </blockquote>
                <p className="text-center text-white/20 text-xs mt-2">— Roshan Shrestha, Developer</p>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section id="join" className="relative py-20 sm:py-28 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="relative bg-gradient-to-br from-red-950/40 to-orange-950/20 border border-red-600/20 rounded-3xl p-10 sm:p-14 overflow-hidden group">
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-orange-500/5" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-600/10 rounded-full blur-3xl group-hover:bg-red-600/15 transition-all duration-700" />
            <div className="shimmer-bar" />

            <div className="relative z-10 space-y-6">
              <div className="text-5xl sm:text-6xl float-slow">🚀</div>
              <h2
                className="text-3xl sm:text-4xl md:text-5xl font-black text-white"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Be First in{' '}
                <span className="gradient-text-fire">Nepal</span>
              </h2>
              <p className="text-white/50 text-base max-w-lg mx-auto leading-relaxed">
                ARS — Aaba Ramilo Suru — is under construction. Join the waitlist and be among
                the first Nepali creators when we launch. Your creativity, your platform.
                Built by Roshan Shrestha for Nepal.
              </p>

              {/* Email form */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  id="cta-email"
                  name="email"
                  placeholder="your@email.com"
                  className="flex-1 px-5 py-3.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-red-600/60 focus:bg-white/10 focus:ring-2 focus:ring-red-600/20 transition-all"
                />
                <button className="btn-primary px-6 py-3.5 rounded-xl text-sm font-bold text-white whitespace-nowrap shadow-xl">
                  <span>Join Now 🇳🇵</span>
                </button>
              </div>

              <p className="text-white/20 text-xs">No spam. Only launch updates. Swear on Sagarmatha. 🏔️</p>

              {/* Nepal flag accent */}
              <div className="flex justify-center gap-1 text-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-500">
                🇳🇵❤️🇳🇵
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER TAGLINE ═══ */}
      <div className="text-center py-10 px-4 relative">
        <div className="section-divider mx-8 sm:mx-16 mb-8" />
        <p className="text-white/30 text-sm flex items-center justify-center gap-2">
          <span className="gradient-text font-semibold">Aaba Ramilo Suru</span>
          <span className="text-white/20">—</span>
          ARS Nepal by Roshan Shrestha.
          <span className="text-red-400/60">Create. Share. Inspire.</span>
        </p>
      </div>


    </div>
  );
}

// ─── RadioIcon (custom SVG) ───────────────────────────────────────────────────
function RadioIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.9 16.1C1 12.2 1 5.8 4.9 1.9" />
      <path d="M7.8 13.2c-2.3-2.3-2.3-6.1 0-8.5" />
      <circle cx="12" cy="12" r="2" />
      <path d="M16.2 13.2c2.3-2.3 2.3-6.1 0-8.5" />
      <path d="M19.1 16.1c3.9-3.9 3.9-10.3 0-14.2" />
    </svg>
  );
}
