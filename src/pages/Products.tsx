import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap, CheckCircle2, Clock, Rocket, Star, ArrowRight } from 'lucide-react';
import DaysCounter from '../components/DaysCounter';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id: string;
  emoji: string;
  name: string;
  tagline: string;
  description: string;
  status: 'building' | 'planned' | 'idea';
  features: string[];
  gradient: string;
  glowColor: string;
  tech: string[];
  progress?: number;
}

// ─── Product Data ──────────────────────────────────────────────────────────────
const products: Product[] = [
  {
    id: 'ars-app',
    emoji: '🎬',
    name: 'ARS Video App',
    tagline: "Nepal's TikTok Alternative",
    description: 'The flagship short-form video platform for Nepali creators. Upload 15s–60s videos, add Nepali filters, trending sounds, and reach millions of Nepali viewers. Built for Nepal, by Nepal.',
    status: 'building',
    features: [
      'Short videos 15s – 60s',
      'Nepali filters & effects',
      'Trending Nepali sounds',
      'For You algorithm',
      'Creator analytics dashboard',
      'Comment & duet system',
    ],
    gradient: 'from-red-600/20 to-orange-600/10',
    glowColor: 'rgba(220, 38, 38, 0.3)',
    tech: ['React Native', 'Node.js', 'PostgreSQL', 'R2 Storage'],
    progress: 75,
  },
  {
    id: 'ars-live',
    emoji: '📡',
    name: 'ARS Live',
    tagline: 'Real-Time Community Streaming',
    description: 'Go live and connect directly with your Nepali audience. Accept virtual gifts, build a loyal fanbase, and turn your passion into income through real-time engagement.',
    status: 'planned',
    features: [
      'HD live streaming',
      'Virtual gift system',
      'Gift-to-coin conversion',
      'Real-time chat & reactions',
      'Co-host feature',
      'Replay recording',
    ],
    gradient: 'from-orange-600/20 to-yellow-600/10',
    glowColor: 'rgba(249, 115, 22, 0.3)',
    tech: ['WebRTC', 'Socket.io', 'Redis', 'FFmpeg'],
    progress: 30,
  },
  {
    id: 'ars-coins',
    emoji: '💰',
    name: 'ARS Coins & Rewards',
    tagline: 'Creator Monetization System',
    description: 'A complete economy for creators. Earn coins through gifts and engagement, convert them to Nepali rupees, and withdraw directly to your bank or eSewa/Khalti wallet.',
    status: 'planned',
    features: [
      'Coin-to-NPR conversion',
      'eSewa & Khalti integration',
      'Bank transfer support',
      'Creator leaderboard',
      'Daily reward challenges',
      'Referral bonus system',
    ],
    gradient: 'from-yellow-600/20 to-green-600/10',
    glowColor: 'rgba(234, 179, 8, 0.3)',
    tech: ['eSewa API', 'Khalti API', 'Python', 'Supabase'],
    progress: 20,
  },
  {
    id: 'ars-sounds',
    emoji: '🎵',
    name: 'ARS Sounds',
    tagline: 'Nepali Music Library',
    description: 'A dedicated library of Nepali songs, folk music, trending sounds, and original creator-made audio. Use the perfect sound for your next viral video.',
    status: 'planned',
    features: [
      'Thousands of Nepali tracks',
      'Folk & modern music',
      'Original creator sounds',
      'Trending sounds chart',
      'Audio trimmer tool',
      'Royalty-free collection',
    ],
    gradient: 'from-purple-600/20 to-pink-600/10',
    glowColor: 'rgba(147, 51, 234, 0.3)',
    tech: ['FFmpeg', 'R2 Storage', 'ElasticSearch', 'React Native'],
    progress: 15,
  },
  {
    id: 'ars-studio',
    emoji: '🎨',
    name: 'ARS Creator Studio',
    tagline: 'Built-In Video Editor',
    description: 'A powerful in-app video editor with Nepali-specific filters, text overlays in Devanagari script, stickers, transitions, and auto-caption support.',
    status: 'idea',
    features: [
      'Devanagari text overlay',
      'Nepali-themed filters',
      'Multi-clip timeline',
      'Auto-caption (Nepali)',
      'Background remover',
      'Sticker library',
    ],
    gradient: 'from-blue-600/20 to-cyan-600/10',
    glowColor: 'rgba(59, 130, 246, 0.3)',
    tech: ['FFmpeg', 'TensorFlow.js', 'Canvas API', 'Python'],
    progress: 5,
  },
  {
    id: 'ars-safe',
    emoji: '🔒',
    name: 'ARS SafeSpace',
    tagline: 'Content Safety & Moderation',
    description: 'A robust content moderation system powered by AI, with human review, reporting tools, and community safety features tailored to Nepali cultural context.',
    status: 'idea',
    features: [
      'AI content moderation',
      'Community reporting',
      'Age-appropriate filters',
      'Privacy controls',
      'Anti-bullying system',
      'Safe mode for minors',
    ],
    gradient: 'from-green-600/20 to-teal-600/10',
    glowColor: 'rgba(34, 197, 94, 0.3)',
    tech: ['TensorFlow', 'Python', 'OpenCV', 'Flask'],
    progress: 3,
  },
];

// ─── Status Config ────────────────────────────────────────────────────────────
const statusConfig = {
  building: {
    label: '🔨 Currently Building',
    className: 'bg-red-600/20 border-red-600/40 text-red-400',
    dot: 'bg-red-400',
    gradient: 'from-red-500 to-orange-500',
  },
  planned: {
    label: '📋 Planned',
    className: 'bg-blue-600/20 border-blue-600/40 text-blue-400',
    dot: 'bg-blue-400',
    gradient: 'from-blue-500 to-cyan-500',
  },
  idea: {
    label: '💡 In Concept',
    className: 'bg-purple-600/20 border-purple-600/40 text-purple-400',
    dot: 'bg-purple-400',
    gradient: 'from-purple-500 to-pink-500',
  },
};

// ─── 3D Tilt Hook ────────────────────────────────────────────────────────────
function useTiltCard() {
  const ref = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouse = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotate({ x: -y * 10, y: x * 10 });
  }, []);

  const handleLeave = useCallback(() => setRotate({ x: 0, y: 0 }), []);

  return { ref, rotate, handleMouse, handleLeave };
}

// ─── Product Card ────────────────────────────────────────────────────────────
function ProductCard({ product, index }: { product: Product; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { rotate, handleMouse, handleLeave } = useTiltCard();
  const status = statusConfig[product.status];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="card-3d"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(50px)',
        transition: `opacity 0.7s ease ${index * 100}ms, transform 0.7s ease ${index * 100}ms`,
      }}
    >
      <div
        className="card-3d-inner product-card rounded-3xl p-6 sm:p-8 overflow-hidden group relative"
        onMouseMove={handleMouse}
        onMouseLeave={handleLeave}
        style={{
          transform: visible
            ? `perspective(800px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`
            : 'perspective(800px) rotateX(5deg)',
        }}
      >
        {/* Hover gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl`} />

        {/* Progress bar */}
        {product.progress !== undefined && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 rounded-t-3xl overflow-hidden">
            <div
              className="h-full rounded-t-3xl transition-all duration-1000"
              style={{
                width: visible ? `${product.progress}%` : '0%',
                background: `linear-gradient(90deg, ${product.glowColor.replace('0.3', '0.8')}, ${product.glowColor.replace('0.3', '0.4')})`,
                transitionDelay: `${index * 100 + 500}ms`,
              }}
            />
          </div>
        )}

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${product.glowColor.replace('0.3', '0.2')}, rgba(255,255,255,0.03))`,
                  border: `1px solid ${product.glowColor.replace('0.3', '0.15')}`,
                }}
              >
                {/* Hover shine */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10">{product.emoji}</span>
              </div>
              <div>
                <h3
                  className="text-white font-black text-xl"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {product.name}
                </h3>
                <p className="text-white/40 text-sm">{product.tagline}</p>
              </div>
            </div>
          </div>

          {/* Status badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-4 ${status.className}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${status.dot} ${product.status === 'building' ? 'animate-pulse' : ''}`} />
            {status.label}
            {product.progress !== undefined && (
              <span className="text-white/30 ml-1">({product.progress}%)</span>
            )}
          </div>

          {/* Description */}
          <p className="text-white/55 text-sm leading-relaxed mb-6">{product.description}</p>

          {/* Features grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
            {product.features.map((feat, i) => (
              <div
                key={feat}
                className="flex items-center gap-2 text-white/60 text-xs group/feat"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateX(0)' : 'translateX(-10px)',
                  transition: `all 0.5s ease ${index * 100 + i * 80}ms`,
                }}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400/70 flex-shrink-0 group-hover/feat:text-green-400 transition-colors" />
                <span className="group-hover/feat:text-white/80 transition-colors">{feat}</span>
              </div>
            ))}
          </div>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1.5">
            {product.tech.map((t) => (
              <span
                key={t}
                className="text-[10px] font-mono px-2 py-1 rounded-md bg-white/5 border border-white/10 text-white/40 hover:bg-red-600/10 hover:border-red-600/30 hover:text-red-400 transition-all duration-200"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Progress indicator */}
          {product.progress !== undefined && (
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between text-white/30 text-[10px] mb-1.5">
                <span>Progress</span>
                <span>{product.progress}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1500"
                  style={{
                    width: visible ? `${product.progress}%` : '0%',
                    background: `linear-gradient(90deg, ${product.glowColor.replace('0.3', '0.6')}, ${product.glowColor.replace('0.3', '0.3')})`,
                    transitionDelay: `${index * 100 + 800}ms`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Products Page ────────────────────────────────────────────────────────────
export default function Products() {
  const buildingProducts = products.filter((p) => p.status === 'building');
  const plannedProducts = products.filter((p) => p.status === 'planned');
  const ideaProducts = products.filter((p) => p.status === 'idea');

  useEffect(() => {
    document.title = 'ARS Products — Aaba Ramilo Suru Nepal | Short Video, Live, Coins & More by Roshan Shrestha';
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content',
      'Explore the full ARS Nepal product suite by Roshan Shrestha — ARS Video App, Live Streaming, Creator Coins, Nepali Sounds, Creator Studio, and SafeSpace. Aaba Ramilo Suru — Nepal\'s own creator platform.'
    );
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://ars.qzz.io/products');
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* SEO hidden */}
      <div aria-hidden="true" style={{
        position: 'absolute', width: '1px', height: '1px',
        overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap'
      }}>
        <h1>ARS Nepal Products — Aaba Ramilo Suru by Roshan Shrestha</h1>
        <p>
          ARS Nepal product suite built by Roshan Shrestha. Aaba Ramilo Suru includes ARS Video App,
          ARS Live streaming, ARS Coins creator monetization, ARS Sounds Nepali music library,
          ARS Creator Studio video editor, and ARS SafeSpace content moderation.
        </p>
      </div>

      {/* Backgrounds */}
      <div className="fixed inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="fixed inset-0 mesh-gradient pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-10 transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-16 space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-600/20 text-red-400 text-sm font-medium reveal">
            <Rocket className="w-4 h-4" />
            ARS Product Suite
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-tight reveal"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            What We're{' '}
            <span className="gradient-text-fire">Building</span>
          </h1>

          <p className="text-white/50 text-base max-w-2xl mx-auto reveal" style={{ transitionDelay: '100ms' }}>
            ARS — Aaba Ramilo Suru — is more than one app. It's an entire ecosystem for Nepali creators,
            built by Roshan Shrestha. Every product is designed with Nepal in mind.
          </p>

          {/* Days counter */}
          <div className="inline-block mt-6 reveal" style={{ transitionDelay: '200ms' }}>
            <div className="stat-card rounded-2xl px-8 py-6 flex flex-col items-center">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span className="text-white/40 text-xs uppercase tracking-widest font-medium">Live Build Counter</span>
              </div>
              <DaysCounter showLabel={true} />
            </div>
          </div>
        </div>

        {/* ── Currently Building ── */}
        {buildingProducts.length > 0 && (
          <div className="mb-16 reveal">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 text-red-400 font-bold text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                <Zap className="w-5 h-5" />
                Currently Building
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-red-600/40 to-transparent" />
              <span className="text-white/20 text-xs">LIVE</span>
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {buildingProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* ── Planned ── */}
        {plannedProducts.length > 0 && (
          <div className="mb-16 reveal" style={{ transitionDelay: '200ms' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                <Clock className="w-5 h-5" />
                Planned Features
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-blue-600/40 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {plannedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i + buildingProducts.length} />
              ))}
            </div>
          </div>
        )}

        {/* ── Ideas ── */}
        {ideaProducts.length > 0 && (
          <div className="mb-16 reveal" style={{ transitionDelay: '400ms' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-lg" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                <Star className="w-5 h-5" />
                Concepts & Ideas
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-purple-600/40 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ideaProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i + buildingProducts.length + plannedProducts.length} />
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="relative bg-gradient-to-br from-red-950/40 to-orange-950/20 border border-red-600/20 rounded-3xl p-10 sm:p-14 text-center overflow-hidden mt-8 group">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-orange-500/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-600/10 rounded-full blur-3xl group-hover:bg-red-600/15 transition-all duration-700" />
          <div className="shimmer-bar" />
          <div className="relative z-10 space-y-5">
            <div className="text-4xl sm:text-5xl float-slow">🇳🇵</div>
            <h3
              className="text-2xl sm:text-3xl font-black text-white"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Support Nepal's Own Platform
            </h3>
            <p className="text-white/50 text-sm max-w-lg mx-auto leading-relaxed">
              Roshan Shrestha — a 17-year-old Nepali student — is building all of this alone.
              Join the ARS Nepal waitlist, spread the word, and help Aaba Ramilo Suru become Nepal's biggest platform.
            </p>
            <Link
              to="/#join"
              className="inline-flex items-center gap-2 btn-primary px-8 py-3.5 rounded-2xl text-sm font-bold text-white shadow-xl group/btn"
            >
              <span>🚀 Join the Waitlist</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
