import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ArrowUpRight, Coins, Gauge, Heart, Mail, MessageCircle, Music,
  Play, Radio, Share2, Shield,
} from 'lucide-react';
import DaysCounter from '../components/DaysCounter';
import { injectJsonLd, removeJsonLd } from '../utils/seo';

/* ═══════════════════════════════════════════════════════════════════
   HERO BACKDROP — quiet layers + one Devanagari watermark
═══════════════════════════════════════════════════════════════════ */
function HeroBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="hero-bg" />
      <div className="bg-grid-fine absolute inset-0" />
      <div className="hero-watermark" aria-hidden="true">LET’S START</div>
      <div className="hero-glow-dot -bottom-40 -right-24 h-[440px] w-[440px] bg-crimson/15" />
      <div className="hero-glow-dot -top-24 -left-32 h-[380px] w-[380px] bg-royal/10" />
      <div className="grain" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TICKER — broadcast marquee band
═══════════════════════════════════════════════════════════════════ */
const TICK = [
  'Now it begins',
  'Aaba Ramilo Suru',
  'Let’s start now',
  'Nepal’s own platform',
  'Built in public',
  'Made in Nepal',
];

function Ticker() {
  return (
    <div className="ticker-band">
      <div className="ticker-track">
        {[...TICK, ...TICK].map((t, i) => (
          <span key={i} className="ticker-item">
            <span className="tick-dot" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FEED PANEL — the signature: a live, auto-playing video feed
═══════════════════════════════════════════════════════════════════ */
const FEED = [
  {
    bg: 'linear-gradient(135deg, #7f1d1d, #3f0d0d)',
    emoji: '🏔️',
    name: 'Roshan',
    handle: '@roshan.builds',
    caption: 'Coding Nepal’s platform from my room. Day by day — still going.',
    tag: '#buildinpublic',
    likes: 128_400, comments: 3_421, shares: 8_910,
  },
  {
    bg: 'linear-gradient(135deg, #1e3a8a, #12234e)',
    emoji: '🎵',
    name: 'Nepali Beats',
    handle: '@nepalisounds',
    caption: 'New hit just dropped — listen up!',
    tag: '#newmusic',
    likes: 98_900, comments: 2_210, shares: 6_540,
  },
  {
    bg: 'linear-gradient(135deg, #78350f, #431407)',
    emoji: '🍜',
    name: 'Kathmandu Kitchen',
    handle: '@ktm.foodies',
    caption: '2am momo cravings hit different. 🔥',
    tag: '#nepalifood',
    likes: 210_300, comments: 5_120, shares: 14_800,
  },
  {
    bg: 'linear-gradient(135deg, #581c87, #2e1065)',
    emoji: '💃',
    name: 'Nepal Dance',
    handle: '@dancenepal',
    caption: 'Rukmini challenge — you try it too!',
    tag: '#dancechallenge',
    likes: 76_200, comments: 1_890, shares: 4_220,
  },
];

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(n);
}

function FeedPanel() {
  const [idx, setIdx] = useState(0);
  const [liked, setLiked] = useState(false);
  const [bump, setBump] = useState(0);
  const v = FEED[idx];

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % FEED.length);
      setLiked(false);
      setBump((b) => b + 137);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="feed-wrap">
      {/* ── frame ── */}
      <div className="feed-frame">
        <div key={idx} className="feed-video" style={{ background: v.bg }}>
          <span className="text-[4.5rem] opacity-90 drop-shadow-lg">{v.emoji}</span>
        </div>

        {/* progress segments */}
        <div className="feed-progress" aria-hidden="true">
          {FEED.map((_, i) => (
            <div key={i} className={`seg ${i < idx ? 'done' : ''} ${i === idx ? 'cur' : ''}`}>
              <span />
            </div>
          ))}
        </div>

        <span className="feed-live"><span className="dot" /> Live</span>
        <span className="feed-top">FOLLOWING</span>

        {/* engagement rail */}
        <div className="feed-rail">
          <button
            type="button"
            className={`feed-act ${liked ? 'liked' : ''}`}
            onClick={() => {
              setLiked((l) => !l);
              setBump((b) => b + (liked ? -1 : 1));
            }}
            aria-label={liked ? 'Unlike' : 'Like'}
          >
            <span className="circle">
              <Heart className="h-4 w-4" fill={liked ? 'currentColor' : 'none'} />
            </span>
            <b>{fmt(v.likes + bump)}</b>
          </button>
          <div className="feed-act">
            <span className="circle"><MessageCircle className="h-4 w-4" /></span>
            <b>{fmt(v.comments)}</b>
          </div>
          <div className="feed-act">
            <span className="circle"><Share2 className="h-4 w-4" /></span>
            <b>{fmt(v.shares)}</b>
          </div>
          <div className="feed-disc" aria-hidden="true" />
        </div>

        {/* caption */}
        <div className="feed-meta">
          <p className="feed-handle">
            <span className="text-crimson">@</span>{v.handle}
            <span className="text-[0.7rem] text-stone"> · {v.name}</span>
          </p>
          <p className="feed-caption mt-1">
            {v.caption} <span className="text-marigold">{v.tag}</span>
          </p>
        </div>
      </div>

      {/* ── floating chips ── */}
      <div className="feed-chip float" style={{ top: '-1.1rem', right: '-0.9rem' }}>
        <span className="text-marigold">🪙</span>
        <b>+1,240 coins</b>
      </div>
      <div className="feed-chip float-delayed" style={{ bottom: '30%', left: '-1rem' }}>
        <span className="h-1.5 w-1.5 rounded-full bg-crimson animate-pulse" />
        <b>2,301 watching</b>
      </div>
      <div className="feed-chip float-fast" style={{ bottom: '-1rem', right: '1.6rem' }}>
        <Heart className="h-3.5 w-3.5 text-crimson" fill="currentColor" />
        <b>You &amp; 12.4k others</b>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SECTION HEADER
═══════════════════════════════════════════════════════════════════ */
function SectionHeader({
  badge, title, subtitle,
}: {
  badge: string;
  title: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="section-eyebrow reveal">{badge}</p>
      <h2 className="section-title reveal" style={{ transitionDelay: '80ms' }}>{title}</h2>
      {subtitle && (
        <p className="reveal mt-4 text-base leading-relaxed text-stone" style={{ transitionDelay: '160ms' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FEATURES
═══════════════════════════════════════════════════════════════════ */
const FEATURES = [
  {
    tag: 'Shorts',
    icon: <Play className="h-5 w-5 text-crimson" />,
    title: '15 seconds to say it all.',
    desc: 'Short video with Nepali filters, trending sounds and Devanagari captions — built for how Nepal actually creates.',
  },
  {
    tag: 'Live',
    icon: <Radio className="h-5 w-5 text-crimson" />,
    title: 'The whole country, live.',
    desc: 'Go live in a tap, take gifts, and grow a real audience in real time — a gift economy made for Nepal.',
  },
  {
    tag: 'Coins',
    icon: <Coins className="h-5 w-5 text-marigold" />,
    title: 'Content that pays.',
    desc: 'Gifts become coins, coins become Nepali rupees — straight to eSewa, Khalti or your bank.',
  },
  {
    tag: 'Sounds',
    icon: <Music className="h-5 w-5 text-crimson" />,
    title: 'Every Nepali sound.',
    desc: 'Folk to fresh — a music library that actually knows Nepali ears, trends and festivals.',
  },
  {
    tag: 'Safety',
    icon: <Shield className="h-5 w-5 text-cream" />,
    title: 'Safe by design.',
    desc: 'Moderation and reporting tuned to Nepali culture and community — not a one-size transplant.',
  },
  {
    tag: 'Speed',
    icon: <Gauge className="h-5 w-5 text-marigold" />,
    title: 'Built for Nepal’s internet.',
    desc: 'Light, fast and offline-friendly — so it works on 3G in the hills, not just fiber in Kathmandu.',
  },
];

function FeatureCard({
  tag, icon, title, desc, i,
}: {
  tag: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  i: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 },
    );
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="feature-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(26px)',
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 70}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 70}ms, border-color 0.4s ease`,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.22em] text-crimson">{tag}</span>
        {icon}
      </div>
      <h3 className="mt-6 font-display text-xl font-medium text-cream">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-stone">{desc}</p>
      <div className="feature-underline mt-6" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   LAUNCH BOARD
═══════════════════════════════════════════════════════════════════ */
const PHASES = [
  {
    phase: 'Phase 01', name: 'Foundation', done: true,
    detail: 'Backend, auth, storage — 170+ API endpoints live.', pct: 100,
  },
  {
    phase: 'Phase 02', name: 'Core app', done: false,
    detail: 'Short video with a full HLS pipeline — upload to play.', pct: 75,
  },
  {
    phase: 'Phase 03', name: 'Creator economy', done: false,
    detail: 'Coins, live gifts, and eSewa & Khalti payouts.', pct: 30,
  },
  {
    phase: 'Phase 04', name: 'Launch', done: false,
    detail: 'Nepal-wide release — you’re on the list.', pct: 5,
  },
];

function PhaseCard({
  phase, name, detail, pct, done, i,
}: {
  phase: string; name: string; detail: string; pct: number; done: boolean; i: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.25 },
    );
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="milestone"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(24px)',
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 90}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 90}ms, border-color 0.4s ease`,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="phase">{phase}</span>
        <span className="font-mono text-[0.66rem] tabular-nums text-mute">{pct}%</span>
      </div>
      <p className="pname">{name}</p>
      <p className="pdetail">{detail}</p>
      <div className="progress-track">
        <div
          className={`progress-fill ${done ? 'done' : ''}`}
          style={{ width: visible ? `${pct}%` : '0%' }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TIMELINE
═══════════════════════════════════════════════════════════════════ */
const STORY = [
  {
    year: 'Early 2025', active: false,
    title: 'The idea',
    desc: 'A 17-year-old from Nepal decides his country deserves its own short-video platform — and starts building it.',
  },
  {
    year: 'Mid 2025', active: false,
    title: 'First lines of code',
    desc: 'Backend takes shape: Flask API, Supabase database, Cloudflare R2 storage.',
  },
  {
    year: 'Late 2025', active: false,
    title: 'App & admin built',
    desc: 'Flutter mobile app, an 18-page admin panel, and an HLS video pipeline all come together.',
  },
  {
    year: '2026', active: true,
    title: 'Active development',
    desc: '170+ API endpoints shipped, 30+ AI agents helping build. Every day brings Suru closer to launch.',
  },
];

function TimelineItem({
  year, title, desc, active, last,
}: {
  year: string; title: string; desc: string; active: boolean; last: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.2 },
    );
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="flex gap-5"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateX(-18px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
      }}
    >
      <div className="flex flex-col items-center">
        <span className={`timeline-dot ${active ? 'pulse-ring' : ''}`} />
        {!last && <span className="timeline-line" />}
      </div>
      <div className="pb-9 pt-0.5">
        <p className="font-mono text-[0.66rem] uppercase tracking-[0.24em] text-crimson">{year}</p>
        <h4 className="mt-1.5 font-display text-lg font-medium text-cream">{title}</h4>
        <p className="mt-1.5 max-w-md text-sm leading-relaxed text-stone">{desc}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SEO HIDDEN CONTENT
═══════════════════════════════════════════════════════════════════ */
function SeoContent() {
  return (
    <div aria-hidden="true" style={{
      position: 'absolute', width: '1px', height: '1px',
      overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap',
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

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════ */
export default function Home() {
  const [submitted, setSubmitted] = useState(false);

  // Page metadata + JSON-LD (kept from previous build)
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

    injectJsonLd('seo-webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Aaba Ramilo Suru — ARS Nepal Home',
      description: 'Nepal\'s own short-form video social media platform built by Roshan Shrestha. Create, share, go live, and earn rewards.',
      url: 'https://ars.qzz.io/',
      inLanguage: 'en',
      isPartOf: { '@type': 'WebSite', name: 'Aaba Ramilo Suru', url: 'https://ars.qzz.io' },
      about: { '@type': 'Organization', name: 'Aaba Ramilo Suru', url: 'https://ars.qzz.io' },
    });

    return () => removeJsonLd();
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 },
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach((el) => {
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen bg-ink">
      <SeoContent />

      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden" aria-label="ARS Nepal — hero">
        <HeroBackdrop />

        <div className="relative z-10 mx-auto max-w-7xl px-5 pt-32 pb-16 sm:px-8 sm:pb-20 lg:pt-36">
          <div className="grid items-center gap-16 lg:grid-cols-[1.04fr_0.96fr] lg:gap-8">
            {/* Left — copy */}
            <div>
              <div className="reveal inline-flex items-center gap-2.5 rounded-full border border-line bg-white/[0.03] py-1.5 pl-1.5 pr-4 text-[0.68rem] font-medium uppercase tracking-[0.24em] text-stone">
                <img
                  src="/images/roshan-avatar.jpg"
                  alt="Roshan Shrestha"
                  className="h-6 w-6 rounded-full object-cover ring-1 ring-crimson/50"
                />
                <span className="h-1.5 w-1.5 rounded-full bg-crimson animate-pulse" />
                Made in Nepal · for Nepal
              </div>

              <h1 className="hero-title reveal mt-7 text-cream" style={{ transitionDelay: '80ms' }}>
                Aaba Ramilo<br />
                <span className="text-crimson">Suru</span>
              </h1>

              <p className="reveal mt-4 text-lg text-stone" style={{ transitionDelay: '140ms' }}>
                <span className="font-display text-cream">“Let’s start now.”</span>{' '}
                <span className="font-body text-mute">— the meaning of Aaba Ramilo Suru</span>
              </p>

              <p className="reveal mt-6 max-w-xl text-[1.02rem] leading-relaxed text-stone" style={{ transitionDelay: '200ms' }}>
                Nepal’s own short-video platform — built from scratch by a{' '}
                <span className="font-semibold text-cream">17-year-old Nepali developer</span>,
                for the country that raised him. No copy-paste, no outside funding. Just code and
                conviction.
              </p>

              <div className="reveal mt-9 flex flex-wrap items-center gap-3" style={{ transitionDelay: '260ms' }}>
                <a href="#join" className="btn btn-primary shine-on-hover px-7 py-3.5 text-[0.95rem] group">
                  Join the waitlist
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
                <Link to="/products" className="btn btn-secondary px-7 py-3.5 text-[0.95rem] group">
                  See what’s being built
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div
                className="reveal mt-10 flex flex-wrap items-center gap-x-9 gap-y-4 border-t border-line-soft pt-6"
                style={{ transitionDelay: '320ms' }}
              >
                {[
                  { k: 'One developer', d: 'builder · founder' },
                  { k: '170+ APIs', d: 'endpoints shipped' },
                  { k: '0 funding', d: 'NPR outside' },
                  { k: 'In public', d: 'day by day' },
                ].map((m) => (
                  <div key={m.k}>
                    <p className="font-display text-lg font-medium text-cream">{m.k}</p>
                    <p className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-mute">{m.d}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — developer card + live feed */}
            <div className="reveal-right flex flex-col items-center gap-6 lg:justify-self-end">
              <div className="float-slow flex w-full max-w-[340px] items-center gap-4 rounded-2xl border border-line bg-gradient-to-r from-white/[0.05] to-white/[0.01] p-4 shadow-2xl backdrop-blur-sm">
                <img
                  src="/images/roshan-avatar.jpg"
                  alt="Roshan Shrestha — developer of Aaba Ramilo Suru"
                  className="h-16 w-16 shrink-0 rounded-xl object-cover ring-2 ring-crimson/40"
                />
                <div className="min-w-0">
                  <p className="truncate font-display text-base font-medium text-cream">Roshan Shrestha</p>
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-crimson">Founder & developer</p>
                  <p className="mt-1.5 text-xs text-stone">17 · self-taught · built from scratch</p>
                </div>
                <span className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-ink px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-stone">Coding</span>
                </span>
              </div>
              <FeedPanel />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TICKER ═══ */}
      <Ticker />

      {/* ═══ BUILD SO FAR ═══ */}
      <section className="relative px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="reveal">
              <p className="section-eyebrow">Live build log</p>
              <h2 className="section-title">The build, so far.</h2>
            </div>
            <Link to="/products" className="reveal link-arrow" style={{ transitionDelay: '100ms' }}>
              Track every product <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div
            className="reveal mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4"
            style={{ transitionDelay: '120ms' }}
          >
            <div className="bg-ink p-7">
              <div className="mb-5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-crimson animate-pulse" />
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-mute">Days building</span>
              </div>
              <DaysCounter showLabel={false} />
            </div>

            <div className="bg-ink p-7">
              <p className="font-display text-5xl font-medium tabular-nums text-cream">1</p>
              <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-mute">developer · designer · founder</p>
            </div>

            <div className="bg-ink p-7">
              <p className="font-display text-5xl font-medium tabular-nums text-cream">
                170<span className="text-crimson">+</span>
              </p>
              <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-mute">API endpoints shipped</p>
            </div>

            <div className="bg-ink p-7">
              <p className="font-display text-5xl font-medium tabular-nums text-cream">0</p>
              <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-mute">NPR of outside funding</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="relative px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            badge="The platform"
            title={<>What <span className="text-crimson">Suru</span> is</>}
            subtitle="Six surfaces, one promise — a stage built for Nepali creators, in their language."
          />
          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.tag} {...f} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ LAUNCH BOARD ═══ */}
      <section className="relative px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            badge="On the way"
            title={<>The launch <span className="text-crimson">board</span></>}
            subtitle="Four phases, tracked in public. No smoke and mirrors — this is the honest state of the build."
          />
          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PHASES.map((p, i) => (
              <PhaseCard key={p.name} {...p} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STORY ═══ */}
      <section className="relative px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-2xl">
          <SectionHeader
            badge="The story"
            title={<>From a room, <span className="text-crimson">to Nepal</span></>}
            subtitle="Every platform starts somewhere. Here’s how Suru started."
          />
          <div className="mt-14 ml-1">
            {STORY.map((s, i) => (
              <TimelineItem key={s.year} {...s} last={i === STORY.length - 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section id="about" className="relative px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <SectionHeader
            badge="The founder"
            title={<>One developer, <span className="text-crimson">one dream</span></>}
            subtitle="Aaba Ramilo Suru isn’t built by a company. It’s built by one kid who refused to wait for someone else to do it."
          />

          <div className="reveal mt-12 overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-white/[0.03] to-transparent p-8 sm:p-12">
            <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
              {/* avatar */}
              <div className="relative shrink-0">
                <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-2 avatar-border bg-gradient-to-br from-crimson to-marigold">
                  <img
                    src="/images/roshan-avatar.jpg"
                    alt="Roshan Shrestha — founder & developer"
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="absolute -bottom-2 -right-2 rounded-full border border-line bg-ink px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-widest text-crimson">
                  Building
                </span>
              </div>

              {/* body */}
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-display text-2xl font-medium text-cream">Roshan Shrestha</h3>
                <p className="mt-1 text-sm font-medium text-crimson">Founder & developer, Aaba Ramilo Suru</p>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-stone">
                  Roshan is 17. He taught himself to code, then built an entire platform on his own —
                  backend, mobile app, admin panel, website — without a team or a single rupee of
                  funding. Suru is the proof that Nepal’s next platform doesn’t have to be imported.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">
                  {['Self-taught', 'Class 9', 'From Nepal', 'Solo founder', 'Built in public'].map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-line bg-white/[0.03] px-3 py-1 text-xs text-stone"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <a
                  href="mailto:founder@ars.qzz.io"
                  className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-crimson/30 bg-crimson/[0.08] px-5 py-2.5 text-sm font-medium text-crimson transition-colors duration-200 hover:bg-crimson hover:text-white sm:justify-start"
                >
                  <Mail className="h-4 w-4" />
                  Contact the founder
                  <span className="font-mono text-[0.68rem] tracking-wide opacity-80">founder@ars.qzz.io</span>
                </a>
              </div>
            </div>

            <blockquote className="mt-10 border-t border-line-soft pt-7 text-center">
              <p className="font-display text-lg leading-relaxed text-stone">
                “I’m just a student from Nepal. But Nepal deserves its own platform —{' '}
                <span className="text-crimson">so let’s start now.</span>”
              </p>
              <cite className="mt-3 block font-mono text-xs not-italic uppercase tracking-[0.2em] text-mute">
                — Roshan Shrestha
              </cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section id="join" className="relative overflow-hidden px-5 py-24 sm:px-8 sm:py-32">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(60% 80% at 50% 120%, rgba(230, 57, 70, 0.16), transparent 60%)' }}
        />
        <div className="relative mx-auto max-w-2xl text-center">
          <p className="section-eyebrow justify-center reveal">Be first</p>
          <h2 className="section-title reveal mt-4 text-center" style={{ transitionDelay: '80ms' }}>
            Be first when Nepal<br />goes <span className="text-crimson">live.</span>
          </h2>
          <p className="reveal mt-5 text-stone" style={{ transitionDelay: '160ms' }}>
            Join the waitlist. Early creators get early access, a head start on the first feed —
            and a name on the platform before anyone else.
          </p>

          {submitted ? (
            <div
              className="reveal mx-auto mt-9 max-w-md rounded-2xl border border-line bg-white/[0.03] px-6 py-5"
              style={{ transitionDelay: '240ms' }}
            >
              <p className="font-display text-lg text-cream">You’re on the list. 🙏</p>
              <p className="mt-1 text-sm text-stone">We’ll write the moment Suru goes live. Watch this space.</p>
            </div>
          ) : (
            <form
              className="reveal mx-auto mt-9 flex max-w-md flex-col gap-3 sm:flex-row"
              style={{ transitionDelay: '240ms' }}
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
            >
              <label htmlFor="cta-email" className="sr-only">Email address</label>
              <input
                id="cta-email"
                type="email"
                required
                placeholder="your@email.com"
                className="w-full flex-1 rounded-xl border border-line bg-white/[0.03] px-5 py-3.5 text-sm text-cream placeholder:text-mute focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/25"
              />
              <button type="submit" className="btn btn-primary shine-on-hover px-6 py-3.5 text-sm">
                Join now <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          <p
            className="reveal mt-5 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-mute"
            style={{ transitionDelay: '300ms' }}
          >
            No spam — launch updates only. Sworn on Sagarmatha. 🏔️
          </p>
        </div>
      </section>

      {/* ═══ CLOSING MARK ═══ */}
      <div className="border-t border-line-soft px-5 py-10 text-center">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-mute">
          Aaba Ramilo Suru <span className="text-crimson">·</span> made in Nepal{' '}
          <span className="text-crimson">·</span> for Nepal
        </p>
      </div>
    </div>
  );
}
