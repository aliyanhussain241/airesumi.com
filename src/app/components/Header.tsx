import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu, X, LogOut, ChevronDown, FileText, Mail, Target,
  Linkedin, PenLine, List, Briefcase, Wand2, LayoutDashboard, ScanLine, Sun, Moon, CreditCard,
  ArrowRight, Sparkles, Zap, TrendingUp
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import airesumiLogo from '@/assets/ai-resumi.webp';
import airesumiLogoWhite from '@/assets/rezumi-white.webp';

import { CreditsBadge } from './CreditsBadge';

const GLASS_HEADER_STYLES = `
  .hdr-glass {
    background: rgba(255,255,255,0.55);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border-bottom: 1px solid rgba(255,255,255,0.5);
    box-shadow: 0 2px 24px rgba(234,88,12,0.06), 0 1px 0 rgba(255,255,255,0.8) inset;
    transition: all 0.3s ease;
  }
  .hdr-glass-scrolled {
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(32px) saturate(200%);
    -webkit-backdrop-filter: blur(32px) saturate(200%);
    box-shadow: 0 4px 32px rgba(234,88,12,0.10), 0 1px 0 rgba(255,255,255,0.9) inset;
    border-bottom: 1px solid rgba(234,88,12,0.1);
  }

  /* ADVANCED DROPDOWN — high-visibility opaque glass with premium feel */
  .hdr-dropdown {
    --hdr-blur: 32px;
    --hdr-sat: 180%;
    position: absolute;
    border-radius: 1.5rem;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.98);
    border: 1px solid rgba(234, 88, 12, 0.12);
    box-shadow:
      0 30px 60px -15px rgba(17, 24, 39, 0.25),
      0 10px 20px -5px rgba(234, 88, 12, 0.10),
      0 0 0 1px rgba(255, 255, 255, 0.6) inset;
    backdrop-filter: blur(var(--hdr-blur)) saturate(var(--hdr-sat));
    transition: background 0.28s ease;
    will-change: transform, opacity;
  }
  html.dark .hdr-dropdown {
    background: rgba(17, 20, 28, 0.98);
    border: 1px solid rgba(234, 88, 12, 0.22);
    box-shadow:
      0 30px 60px -15px rgba(0, 0, 0, 0.7),
      0 10px 20px -5px rgba(234, 88, 12, 0.15),
      0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  }

  /* Ambient glow at top of dropdown */
  .hdr-dropdown::before {
    content: "";
    position: absolute;
    top: -1px; left: 20%; right: 20%; height: 2px;
    background: linear-gradient(90deg, transparent, rgba(234,88,12,0.5), transparent);
    pointer-events: none;
    z-index: 4;
  }

  .hdr-dropdown > .hdr-dropdown-content {
    position: relative;
    z-index: 3;
  }

  /* Featured side panel */
  .hdr-featured {
    background: linear-gradient(160deg, rgba(234,88,12,0.10) 0%, rgba(251,146,60,0.06) 60%, transparent 100%);
    border-right: 1px solid rgba(234,88,12,0.10);
  }
  html.dark .hdr-featured {
    background: linear-gradient(160deg, rgba(234,88,12,0.18) 0%, rgba(194,65,12,0.08) 60%, transparent 100%);
    border-right: 1px solid rgba(234,88,12,0.20);
  }

  .hdr-featured-cta {
    background: linear-gradient(135deg, #EA580C, #C2410C);
    color: #fff;
    box-shadow: 0 8px 20px -6px rgba(234,88,12,0.55);
    transition: all 0.2s ease;
  }
  .hdr-featured-cta:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 24px -6px rgba(234,88,12,0.7);
  }

  .hdr-dropdown-footer {
    background: rgba(249, 250, 251, 0.9);
    border-top: 1px solid rgba(17, 24, 39, 0.06);
  }
  html.dark .hdr-dropdown-footer {
    background: rgba(10, 12, 18, 0.7);
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  /* Keyboard focus rings */
  .hdr-nav-link:focus-visible,
  .hdr-tool-item:focus-visible,
  .hdr-dropdown-footer a:focus-visible {
    outline: 2px solid #EA580C;
    outline-offset: 2px;
    border-radius: 10px;
  }

  /* Tool item card */
  .hdr-tool-item {
    position: relative;
    border: 1px solid transparent;
    border-radius: 12px;
    transition: all 0.18s ease;
  }
  .hdr-tool-item:hover {
    background: rgba(234, 88, 12, 0.06);
    border-color: rgba(234, 88, 12, 0.15);
    transform: translateY(-1px);
  }
  html.dark .hdr-tool-item:hover {
    background: rgba(234, 88, 12, 0.14);
    border-color: rgba(234, 88, 12, 0.28);
  }
  .hdr-tool-item.active {
    background: rgba(234, 88, 12, 0.10);
    border-color: rgba(234, 88, 12, 0.25);
  }
  .hdr-tool-arrow {
    opacity: 0;
    transform: translateX(-4px);
    transition: all 0.18s ease;
  }
  .hdr-tool-item:hover .hdr-tool-arrow {
    opacity: 1;
    transform: translateX(0);
  }
  .hdr-tool-name {
    color: #111827;
  }
  .hdr-tool-desc {
    color: #6b7280;
  }
  html.dark .hdr-tool-name { color: #f3f4f6; }
  html.dark .hdr-tool-desc { color: #9ca3af; }

  .hdr-badge-new {
    background: linear-gradient(135deg, #EA580C, #F97316);
    color: #fff;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.06em;
    padding: 2px 6px;
    border-radius: 6px;
    text-transform: uppercase;
  }
  .hdr-badge-pro {
    background: rgba(234, 88, 12, 0.12);
    color: #C2410C;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.06em;
    padding: 2px 6px;
    border-radius: 6px;
    text-transform: uppercase;
  }
  html.dark .hdr-badge-pro {
    background: rgba(234, 88, 12, 0.25);
    color: #FDBA74;
  }

  .hdr-dropdown-grid {
    display: grid;
    gap: 6px;
  }
  .hdr-dropdown-grid.cols-1 { grid-template-columns: 1fr; }
  .hdr-dropdown-grid.cols-2 { grid-template-columns: 1fr 1fr; }

  .hdr-btn-primary {
    background: linear-gradient(135deg, rgba(234,88,12,0.92), rgba(194,65,12,0.95));
    border: 1px solid rgba(255,255,255,0.25);
    box-shadow: 0 4px 14px rgba(234,88,12,0.3), inset 0 1px 0 rgba(255,255,255,0.25);
    transition: all 0.2s ease;
  }
  .hdr-btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(234,88,12,0.4), inset 0 1px 0 rgba(255,255,255,0.3);
  }
  .hdr-btn-outline {
    background: rgba(255,255,255,0.45);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(234,88,12,0.25);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.7);
    transition: all 0.2s ease;
  }
  .hdr-btn-outline:hover {
    background: rgba(255,255,255,0.65);
    border-color: rgba(234,88,12,0.4);
    transform: translateY(-1px);
  }
  .hdr-nav-link {
    transition: all 0.18s ease;
    border-radius: 10px;
    padding: 6px 12px;
  }
  .hdr-nav-link:hover {
    background: rgba(234,88,12,0.08);
    color: #EA580C;
  }
  .hdr-nav-link.active {
    background: rgba(234,88,12,0.1);
    color: #EA580C;
  }
  .hdr-mobile {
    background: rgba(255,255,255,0.98);
    backdrop-filter: blur(40px) saturate(200%);
    -webkit-backdrop-filter: blur(40px) saturate(200%);
  }
  html.dark .hdr-mobile {
    background: rgba(17, 20, 28, 0.98);
  }
  .hdr-tag {
    background: rgba(234,88,12,0.12);
    border: 1px solid rgba(234,88,12,0.15);
    backdrop-filter: blur(4px);
  }
`;

export const Logo = () => (
  <div className="flex items-center select-none transition-transform duration-200 hover:scale-[1.02]">
    {/* Explicit width/height reserves space so the header doesn't shift when the logo webp decodes (CLS fix). */}
    <img src={airesumiLogo} alt="Airesumi" width={128} height={32} className="theme-logo-light h-8 w-auto object-contain" />
    <img src={airesumiLogoWhite} alt="Airesumi" width={128} height={32} className="theme-logo-dark h-8 w-auto object-contain" />
  </div>
);

const resumeToolsBase = [
  { key: 'resumeBuilder',  to: '/resume',            icon: FileText, badge: 'popular' as const },
  { key: 'bulletWriter',   to: '/bullet-writer',     icon: PenLine,  badge: null },
  { key: 'summary',        to: '/summary-generator', icon: List,     badge: null },
  { key: 'keywordScanner', to: '/keyword-scanner',   icon: Target,   badge: 'new' as const },
] as const;

const otherToolsBase = [
  { key: 'coverLetter',    to: '/cover-letter',       icon: Mail,     badge: 'popular' as const },
  { key: 'linkedinBio',    to: '/linkedin-bio',       icon: Linkedin, badge: null },
  { key: 'atsChecker',     to: '/ats-checker',        icon: Target,   badge: null },
  { key: 'interviewPrep',  to: '/interview-prep',     icon: Wand2,    badge: 'new' as const },
  { key: 'resignation',    to: '/resignation-letter', icon: FileText, badge: null },
  { key: 'pdfScanner',     to: '/pdf-scanner',        icon: ScanLine, badge: null },
  { key: 'jobSearch',      to: '/salary-analyzer',    icon: Briefcase, badge: null },
] as const;

export const Header = ({ windowWidth }: { windowWidth?: number }) => {
  const { t } = useTranslation();
  const resumeTools = resumeToolsBase.map(x => ({ ...x, name: t(`tools.${x.key}.name`), desc: t(`tools.${x.key}.desc`) }));
  const otherTools  = otherToolsBase.map(x => ({ ...x, name: t(`tools.${x.key}.name`), desc: t(`tools.${x.key}.desc`) }));
  const [isScrolled, setIsScrolled]     = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isOtherOpen, setIsOtherOpen]   = useState(false);
  const [mobileSection, setMobileSection] = useState<'resume' | 'other' | null>('resume');
  const [user, setUser]                 = useState<any>(null);
  const { theme, toggle: toggleTheme } = useTheme();
  // ⚠️ FIX (React error #418 — hydration mismatch breaking site-wide navigation):
  // Pehle yahan `typeof window !== 'undefined' ? window.innerWidth : 1200` tha.
  // Server pe `window` nahi hota → 1200 milta tha. Browser mein hydration ke waqt
  // `window` hota hai → actual screen width milti thi (kabhi 1200 nahi hota).
  // Isse server aur client ka pehla render mismatch ho jata tha (e.g. button text
  // "Build My Resume →" vs "Start →"), jo React ko crash kar deta tha aur uske
  // baad poori site par clicks/navigation tootne lagti thi.
  // Fix: hamesha deterministic value se shuru karo (server = client = same),
  // phir neeche wale useEffect (line ~196) mein asal width set karo — ye
  // hydration ke BAAD chalta hai, isliye mismatch nahi hota.
  const [width, setWidth]               = useState(windowWidth ?? 1200);
  const location  = useLocation();
  const navigate  = useNavigate();
  const resumeRef = useRef<HTMLDivElement>(null);
  const otherRef  = useRef<HTMLDivElement>(null);
  const resumeBtnRef = useRef<HTMLButtonElement>(null);
  const otherBtnRef  = useRef<HTMLButtonElement>(null);
  const resumeMenuRef = useRef<HTMLDivElement>(null);
  const otherMenuRef  = useRef<HTMLDivElement>(null);

  // Focus first menuitem when a dropdown opens
  useEffect(() => {
    if (isResumeOpen) {
      requestAnimationFrame(() => {
        resumeMenuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
      });
    }
  }, [isResumeOpen]);
  useEffect(() => {
    if (isOtherOpen) {
      requestAnimationFrame(() => {
        otherMenuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
      });
    }
  }, [isOtherOpen]);

  // Global Escape: close open menu and return focus to trigger
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (isResumeOpen) { setIsResumeOpen(false); resumeBtnRef.current?.focus(); }
      if (isOtherOpen)  { setIsOtherOpen(false);  otherBtnRef.current?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isResumeOpen, isOtherOpen]);

  // Roving keyboard handler for an open menu
  const handleMenuKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    close: () => void,
    triggerRef: React.RefObject<HTMLButtonElement | null>,
  ) => {
    const items = Array.from(
      e.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]')
    );
    if (items.length === 0) return;
    const idx = items.indexOf(document.activeElement as HTMLElement);
    const focus = (i: number) => items[(i + items.length) % items.length]?.focus();
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); focus(idx + 1); break;
      case 'ArrowUp':   e.preventDefault(); focus(idx - 1); break;
      case 'Home':      e.preventDefault(); items[0]?.focus(); break;
      case 'End':       e.preventDefault(); items[items.length - 1]?.focus(); break;
      case 'Tab':       close(); break;
      case 'Escape':    e.preventDefault(); close(); triggerRef.current?.focus(); break;
    }
  };

  const handleTriggerKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    isOpen: boolean,
    open: () => void,
  ) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isOpen) open(); // useEffect focuses first item
    }
  };


  const isResumeActive = resumeTools.some(t => t.to === location.pathname);
  const isOtherActive  = otherTools.some(t => t.to === location.pathname);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Passive + rAF-throttled to avoid forced reflow / main-thread jank on scroll.
    let ticking = false;
    let last = false;
    const update = () => {
      const next = window.scrollY > 10;
      if (next !== last) { last = next; setIsScrolled(next); }
      ticking = false;
    };
    const fn = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    update();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    let ticking = false;
    const update = () => { setWidth(window.innerWidth); ticking = false; };
    const fn = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    update();
    window.addEventListener('resize', fn, { passive: true });
    return () => window.removeEventListener('resize', fn);
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (resumeRef.current && !resumeRef.current.contains(e.target as Node)) setIsResumeOpen(false);
      if (otherRef.current  && !otherRef.current.contains(e.target as Node))  setIsOtherOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  useEffect(() => {
    setIsResumeOpen(false);
    setIsOtherOpen(false);
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Body scroll lock while mobile menu is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isMobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [isMobileOpen]);

  const handleLogout = async () => { await supabase.auth.signOut(); navigate({ to: '/' }); };

  // Enhanced tool card with badge + hover arrow
  type HeaderTool = {
    key: string;
    to: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    name: string;
    desc: string;
    badge?: 'new' | 'popular' | null;
  };
  const ToolItem = ({ tool, onClose }: { tool: HeaderTool; onClose: () => void }) => {
    const Icon = tool.icon;
    const active = location.pathname === tool.to;
    return (
      <Link
        to={tool.to}
        onClick={onClose}
        role="menuitem"
        aria-current={active ? 'page' : undefined}
        className={`hdr-tool-item flex items-center gap-3 px-3 py-2.5 no-underline group ${active ? 'active' : ''}`}
      >
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${active ? 'bg-gradient-to-br from-[#EA580C] to-[#C2410C] shadow-md shadow-orange-500/30' : 'bg-orange-50 dark:bg-orange-500/15 group-hover:bg-orange-100 dark:group-hover:bg-orange-500/25'}`}>
          <Icon size={15} className={active ? 'text-white' : 'text-[#EA580C]'} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className={`text-[13px] font-semibold leading-tight truncate ${active ? 'text-[#EA580C]' : 'hdr-tool-name'}`}>{tool.name}</p>
            {tool.badge === 'new' && <span className="hdr-badge-new">New</span>}
            {tool.badge === 'popular' && <span className="hdr-badge-pro">Popular</span>}
          </div>
          <p className="text-[11px] hdr-tool-desc leading-tight mt-0.5 truncate">{tool.desc}</p>
        </div>
        <ArrowRight size={14} className="hdr-tool-arrow text-[#EA580C] flex-shrink-0" aria-hidden="true" />
      </Link>
    );
  };

  const DropdownAnimation = {
    initial: { opacity: 0, y: -6, scale: 0.97, "--hdr-blur": "0px", "--hdr-sat": "100%" } as any,
    animate: { opacity: 1, y: 0, scale: 1, "--hdr-blur": "28px", "--hdr-sat": "180%" } as any,
    exit:    { opacity: 0, y: -6, scale: 0.97, "--hdr-blur": "0px", "--hdr-sat": "100%" } as any,
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  };

  return (
    <>
      <style>{GLASS_HEADER_STYLES}</style>

      {/* LIQUID GLASS SVG FILTER */}
      <svg style={{ display: "none" }} aria-hidden="true">
        <filter id="glass-distortion" x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
          <feTurbulence type="fractalNoise" baseFrequency="0.001 0.005" numOctaves="1" seed="17" result="turbulence" />
          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
            <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
            <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
          </feComponentTransfer>
          <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
          <feSpecularLighting in="softMap" surfaceScale="5" specularConstant="1" specularExponent="100" lightingColor="white" result="specLight">
            <fePointLight x="-200" y="-200" z="300" />
          </feSpecularLighting>
          <feComposite in="specLight" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litImage" />
          <feDisplacementMap in="SourceGraphic" in2="softMap" scale="200" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <header className={`fixed top-0 left-0 right-0 h-[68px] z-[1000] print:hidden font-['Inter',sans-serif] ${isScrolled ? 'hdr-glass-scrolled' : 'hdr-glass'}`}>
        <div className="max-w-7xl mx-auto px-4 lg:px-6 w-full h-full flex items-center justify-between gap-3">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 no-underline"><Logo /></Link>

          {/* Desktop nav — only render at lg+ to prevent mid-width cramping */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1">

            <Link to="/"
              className={`hdr-nav-link text-[14px] font-medium no-underline ${location.pathname === '/' ? 'active text-[#EA580C]' : 'text-[#374151]'}`}>
              {t('nav.home')}
            </Link>

            {/* Resume Tools */}
            <div ref={resumeRef} className="relative">
              <button
                ref={resumeBtnRef}
                type="button"
                aria-haspopup="menu"
                aria-expanded={isResumeOpen}
                aria-controls="hdr-menu-resume"
                onClick={() => { setIsResumeOpen(v => !v); setIsOtherOpen(false); }}
                onKeyDown={(e) => handleTriggerKeyDown(e, isResumeOpen, () => { setIsResumeOpen(true); setIsOtherOpen(false); })}
                className={`hdr-nav-link flex items-center gap-1.5 text-[14px] font-medium cursor-pointer border-none bg-transparent ${isResumeActive || isResumeOpen ? 'active text-[#EA580C]' : 'text-[#374151]'}`}>
                {t('nav.resumeTools')}
                <ChevronDown size={13} aria-hidden="true" className={`transition-transform duration-200 ${isResumeOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isResumeOpen && (
                  <motion.div
                    {...DropdownAnimation}
                    ref={resumeMenuRef}
                    id="hdr-menu-resume"
                    role="menu"
                    aria-label={t('dropdown.resumeToolsLabel')}
                    onKeyDown={(e) => handleMenuKeyDown(e, () => setIsResumeOpen(false), resumeBtnRef)}
                    style={{ transformOrigin: 'top center' }}
                    className="hdr-dropdown absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-[640px]"
                  >
                    <div className="hdr-dropdown-content grid grid-cols-[220px_1fr]">
                      {/* Featured side panel */}
                      <div className="hdr-featured p-5 flex flex-col">
                        <div className="inline-flex items-center gap-1.5 self-start rounded-full bg-white/70 dark:bg-white/10 backdrop-blur px-2.5 py-1 text-[10px] font-bold text-[#C2410C] dark:text-orange-300 uppercase tracking-widest border border-orange-200/60 dark:border-orange-500/30">
                          <Sparkles size={11} /> AI Powered
                        </div>
                        <h3 className="mt-3 text-[17px] font-bold leading-snug text-[#111827] dark:text-white">
                          Build a resume that gets you hired.
                        </h3>
                        <p className="mt-1.5 text-[12px] leading-relaxed text-[#6b7280] dark:text-gray-400">
                          Tailored to any role in seconds — with ATS keywords, punchy bullets & a clean design.
                        </p>
                        <div className="mt-auto pt-4">
                          <Link
                            to="/resume"
                            role="menuitem"
                            onClick={() => setIsResumeOpen(false)}
                            className="hdr-featured-cta inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-[12px] font-bold no-underline"
                          >
                            <Zap size={13} /> Start Building
                            <ArrowRight size={13} />
                          </Link>
                        </div>
                      </div>

                      {/* Tools list */}
                      <div className="flex flex-col">
                        <div className="p-4">
                          <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest mb-2 px-2">{t('dropdown.resumeToolsLabel')}</p>
                          <div className="hdr-dropdown-grid cols-1">
                            {resumeTools.map(tool => (
                              <ToolItem key={tool.to} tool={tool} onClose={() => setIsResumeOpen(false)} />
                            ))}
                          </div>
                        </div>
                        <div className="hdr-dropdown-footer px-5 py-2.5 flex items-center justify-between mt-auto">
                          <span className="text-[11px] text-[#9ca3af] flex items-center gap-1"><TrendingUp size={11} /> {t('dropdown.resumeToolsCount', { count: resumeTools.length })}</span>
                          <Link to="/resume" onClick={() => setIsResumeOpen(false)} role="menuitem"
                            className="text-[12px] font-bold text-[#EA580C] no-underline hover:underline flex items-center gap-1">
                            {t('cta.startFreeArrow')} <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>


            {/* Other Tools */}
            <div ref={otherRef} className="relative">
              <button
                ref={otherBtnRef}
                type="button"
                aria-haspopup="menu"
                aria-expanded={isOtherOpen}
                aria-controls="hdr-menu-other"
                onClick={() => { setIsOtherOpen(v => !v); setIsResumeOpen(false); }}
                onKeyDown={(e) => handleTriggerKeyDown(e, isOtherOpen, () => { setIsOtherOpen(true); setIsResumeOpen(false); })}
                className={`hdr-nav-link flex items-center gap-1.5 text-[14px] font-medium cursor-pointer border-none bg-transparent ${isOtherActive || isOtherOpen ? 'active text-[#EA580C]' : 'text-[#374151]'}`}>
                {t('nav.otherTools')}
                <ChevronDown size={13} aria-hidden="true" className={`transition-transform duration-200 ${isOtherOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isOtherOpen && (
                  <motion.div
                    {...DropdownAnimation}
                    ref={otherMenuRef}
                    id="hdr-menu-other"
                    role="menu"
                    aria-label={t('dropdown.otherToolsLabel')}
                    onKeyDown={(e) => handleMenuKeyDown(e, () => setIsOtherOpen(false), otherBtnRef)}
                    style={{ transformOrigin: 'top center' }}
                    className="hdr-dropdown absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-[720px]"
                  >
                    <div className="hdr-dropdown-content grid grid-cols-[220px_1fr]">
                      {/* Featured side panel */}
                      <div className="hdr-featured p-5 flex flex-col">
                        <div className="inline-flex items-center gap-1.5 self-start rounded-full bg-white/70 dark:bg-white/10 backdrop-blur px-2.5 py-1 text-[10px] font-bold text-[#C2410C] dark:text-orange-300 uppercase tracking-widest border border-orange-200/60 dark:border-orange-500/30">
                          <Sparkles size={11} /> Career Suite
                        </div>
                        <h3 className="mt-3 text-[17px] font-bold leading-snug text-[#111827] dark:text-white">
                          Go beyond the resume.
                        </h3>
                        <p className="mt-1.5 text-[12px] leading-relaxed text-[#6b7280] dark:text-gray-400">
                          Cover letters, LinkedIn, ATS checks, interviews & more — every tool you need to land the offer.
                        </p>
                        <div className="mt-auto pt-4">
                          <Link
                            to="/cover-letter"
                            role="menuitem"
                            onClick={() => setIsOtherOpen(false)}
                            className="hdr-featured-cta inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-[12px] font-bold no-underline"
                          >
                            <Zap size={13} /> Explore Tools
                            <ArrowRight size={13} />
                          </Link>
                        </div>
                      </div>

                      {/* Tools list */}
                      <div className="flex flex-col">
                        <div className="p-4">
                          <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest mb-2 px-2">{t('dropdown.otherToolsLabel')}</p>
                          <div className="hdr-dropdown-grid cols-2">
                            {otherTools.map(tool => (
                              <ToolItem key={tool.to} tool={tool} onClose={() => setIsOtherOpen(false)} />
                            ))}
                          </div>
                        </div>
                        <div className="hdr-dropdown-footer px-5 py-2.5 flex items-center justify-between mt-auto">
                          <span className="text-[11px] text-[#9ca3af] flex items-center gap-1"><TrendingUp size={11} /> {t('dropdown.otherToolsCount', { count: otherTools.length })}</span>
                          <Link to="/cover-letter" onClick={() => setIsOtherOpen(false)} role="menuitem"
                            className="text-[12px] font-bold text-[#EA580C] no-underline hover:underline flex items-center gap-1">
                            {t('cta.explore')} <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>


            <Link to="/resume-examples"
              className={`hdr-nav-link text-[14px] font-medium no-underline ${location.pathname === '/resume-examples' ? 'active text-[#EA580C]' : 'text-[#374151]'}`}>
              {t('nav.examples')}
            </Link>
            <Link to="/blog"
              className={`hdr-nav-link text-[14px] font-medium no-underline ${location.pathname === '/blog' ? 'active text-[#EA580C]' : 'text-[#374151]'}`}>
              {t('nav.blog')}
            </Link>
          </nav>


          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {user ? (
              <div className="hidden lg:flex items-center gap-2">
                {(() => {
                  const p = location.pathname;
                  const appPrefixes = ['/dashboard', '/resume', '/premium', '/manage-subscription', '/cover-letter', '/ats-checker', '/bullet-writer', '/summary-generator', '/keyword-scanner', '/pdf-scanner', '/resignation-letter', '/linkedin-optimizer', '/salary-analyzer', '/admin'];
                  return appPrefixes.some(pref => p === pref || p.startsWith(pref + '/')) ? <CreditsBadge /> : null;
                })()}
                <Link to="/dashboard"
                  title={t('cta.myResumes')}
                  aria-label={t('cta.myResumes')}
                  className="hdr-tag flex items-center gap-1.5 text-[13px] font-medium text-[#EA580C] px-2.5 py-2 xl:px-3 rounded-xl no-underline transition-all hover:bg-orange-50">
                  <LayoutDashboard size={16} />
                  <span className="hidden xl:inline">{t('cta.myResumes')}</span>
                </Link>
                <Link to="/premium"
                  title="Pricing"
                  aria-label="Pricing"
                  className="hdr-tag flex items-center gap-1.5 text-[13px] font-medium text-[#EA580C] px-2.5 py-2 xl:px-3 rounded-xl no-underline transition-all hover:bg-orange-50">
                  <Sparkles size={16} />
                  <span className="hidden xl:inline">Pricing</span>
                </Link>
                <button onClick={handleLogout}
                  className="hdr-btn-outline flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-xl text-[#374151] cursor-pointer">
                  <LogOut size={13} /> {t('cta.logout')}
                </button>
                <Link to="/resume"
                  className="hdr-btn-primary text-white text-[13px] font-bold px-4 py-2 rounded-xl no-underline whitespace-nowrap">
                  {width >= 1280 ? t('cta.buildResume') : t('cta.start')}
                </Link>
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <Link to="/login"
                  className="hdr-btn-outline text-[13px] font-semibold px-4 py-2 rounded-xl text-[#EA580C] no-underline">
                  {t('cta.login')}
                </Link>
                <Link to="/resume"
                  className="hdr-btn-primary text-white text-[13px] font-bold px-4 py-2 rounded-xl no-underline whitespace-nowrap">
                  {width >= 1280 ? t('cta.buildResume') : t('cta.startFree')}
                </Link>
              </div>
            )}


            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={t('theme.toggle')}
              className="hdr-btn-outline flex items-center justify-center p-2 rounded-xl text-[#374151] dark:text-orange-200 cursor-pointer"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>



            {/* Mobile / tablet CTA */}
            <Link to="/resume" className="hdr-btn-primary text-white text-[13px] font-bold px-4 py-2 rounded-xl hidden sm:inline-flex lg:hidden no-underline">
              {t('cta.startFreeShort')}
            </Link>

            <button onClick={() => setIsMobileOpen(true)}
              aria-label="Open menu"
              aria-expanded={isMobileOpen}
              aria-controls="mobile-navigation"
              /* Fixed w/h so the icon-only button reserves a stable box (CLS fix). */
              className="lg:hidden w-10 h-10 flex items-center justify-center text-[#374151] dark:text-orange-200 rounded-xl cursor-pointer bg-transparent border-none hdr-btn-outline">
              <Menu size={22} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Menu — tap-friendly, animated, collapsible sections */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[1002] md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0, right: 0.4 }}
              onDragEnd={(_, info) => { if (info.offset.x > 80 || info.velocity.x > 400) setIsMobileOpen(false); }}
              className="hdr-mobile absolute right-0 top-0 bottom-0 w-[88%] max-w-[380px] flex flex-col shadow-2xl"
            >
              {/* Drag handle */}
              <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-12 rounded-full bg-black/10 dark:bg-white/15" aria-hidden="true" />

              {/* Header */}
              <div
                className="sticky top-0 z-10 flex items-center justify-between px-5 pb-4 border-b border-black/5 dark:border-white/5 flex-shrink-0 bg-white/95 dark:bg-[#0b0b12]/95 backdrop-blur-xl"
                style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
              >

                <Logo />
                <button
                  onClick={() => setIsMobileOpen(false)}
                  aria-label="Close menu"
                  className="w-11 h-11 flex items-center justify-center rounded-2xl text-[#374151] dark:text-orange-200 cursor-pointer bg-black/5 dark:bg-white/5 border-none active:scale-95 transition-transform"
                >
                  <X size={22} strokeWidth={2.2} />
                </button>
              </div>

              {/* Scrollable body */}
              <motion.div
                className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-1.5"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.035, delayChildren: 0.1 } } }}
              >
                {/* Primary links */}
                {[
                  { to: '/', label: t('nav.home') },
                  { to: '/examples', label: t('nav.examples') },
                  { to: '/blog', label: t('nav.blog') },
                ].map(link => (
                  <motion.div
                    key={link.to}
                    variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
                  >
                    <Link
                      to={link.to}
                      onClick={() => setIsMobileOpen(false)}
                      className={`flex items-center min-h-[52px] px-4 rounded-2xl text-[16px] font-semibold no-underline active:scale-[0.98] transition-all ${location.pathname === link.to ? 'bg-orange-50 dark:bg-orange-500/15 text-[#EA580C]' : 'text-[#374151] dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5'}`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Collapsible: Resume Tools */}
                <motion.div variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }} className="pt-2">
                  <button
                    type="button"
                    onClick={() => setMobileSection(s => s === 'resume' ? null : 'resume')}
                    aria-expanded={mobileSection === 'resume'}
                    className="w-full min-h-[52px] flex items-center justify-between px-4 rounded-2xl text-[15px] font-bold text-[#111827] dark:text-white bg-black/[0.03] dark:bg-white/5 border-none cursor-pointer active:scale-[0.98] transition-transform"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#EA580C] to-[#C2410C] flex items-center justify-center shadow-md shadow-orange-500/25">
                        <FileText size={15} className="text-white" />
                      </span>
                      {t('nav.resumeTools')}
                    </span>
                    <ChevronDown size={18} className={`transition-transform duration-300 text-[#6b7280] ${mobileSection === 'resume' ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {mobileSection === 'resume' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2 pl-2 space-y-1">
                          {resumeTools.map(tool => {
                            const Icon = tool.icon;
                            const active = location.pathname === tool.to;
                            return (
                              <Link
                                key={tool.to}
                                to={tool.to}
                                onClick={() => setIsMobileOpen(false)}
                                className={`flex items-center gap-3 min-h-[56px] px-3 rounded-2xl no-underline active:scale-[0.98] transition-all ${active ? 'bg-orange-50 dark:bg-orange-500/15' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                              >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${active ? 'bg-gradient-to-br from-[#EA580C] to-[#C2410C] shadow-md shadow-orange-500/30' : 'bg-orange-50 dark:bg-orange-500/15'}`}>
                                  <Icon size={16} className={active ? 'text-white' : 'text-[#EA580C]'} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <p className={`text-[14px] font-semibold leading-tight truncate ${active ? 'text-[#EA580C]' : 'text-[#111827] dark:text-gray-100'}`}>{tool.name}</p>
                                    {tool.badge === 'new' && <span className="hdr-badge-new">New</span>}
                                    {tool.badge === 'popular' && <span className="hdr-badge-pro">Popular</span>}
                                  </div>
                                  <p className="text-[11.5px] text-[#6b7280] dark:text-gray-400 leading-tight mt-0.5 truncate">{tool.desc}</p>
                                </div>
                                <ArrowRight size={15} className="text-[#EA580C] flex-shrink-0 opacity-60" />
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Collapsible: Other Tools */}
                <motion.div variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}>
                  <button
                    type="button"
                    onClick={() => setMobileSection(s => s === 'other' ? null : 'other')}
                    aria-expanded={mobileSection === 'other'}
                    className="w-full min-h-[52px] flex items-center justify-between px-4 rounded-2xl text-[15px] font-bold text-[#111827] dark:text-white bg-black/[0.03] dark:bg-white/5 border-none cursor-pointer active:scale-[0.98] transition-transform"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#EA580C] to-[#C2410C] flex items-center justify-center shadow-md shadow-orange-500/25">
                        <Sparkles size={15} className="text-white" />
                      </span>
                      {t('nav.otherTools')}
                    </span>
                    <ChevronDown size={18} className={`transition-transform duration-300 text-[#6b7280] ${mobileSection === 'other' ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {mobileSection === 'other' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2 pl-2 space-y-1">
                          {otherTools.map(tool => {
                            const Icon = tool.icon;
                            const active = location.pathname === tool.to;
                            return (
                              <Link
                                key={tool.to}
                                to={tool.to}
                                onClick={() => setIsMobileOpen(false)}
                                className={`flex items-center gap-3 min-h-[56px] px-3 rounded-2xl no-underline active:scale-[0.98] transition-all ${active ? 'bg-orange-50 dark:bg-orange-500/15' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                              >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${active ? 'bg-gradient-to-br from-[#EA580C] to-[#C2410C] shadow-md shadow-orange-500/30' : 'bg-orange-50 dark:bg-orange-500/15'}`}>
                                  <Icon size={16} className={active ? 'text-white' : 'text-[#EA580C]'} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <p className={`text-[14px] font-semibold leading-tight truncate ${active ? 'text-[#EA580C]' : 'text-[#111827] dark:text-gray-100'}`}>{tool.name}</p>
                                    {tool.badge === 'new' && <span className="hdr-badge-new">New</span>}
                                    {tool.badge === 'popular' && <span className="hdr-badge-pro">Popular</span>}
                                  </div>
                                  <p className="text-[11.5px] text-[#6b7280] dark:text-gray-400 leading-tight mt-0.5 truncate">{tool.desc}</p>
                                </div>
                                <ArrowRight size={15} className="text-[#EA580C] flex-shrink-0 opacity-60" />
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Account section */}
                <motion.div
                  variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}
                  className="pt-3 mt-2 border-t border-black/5 dark:border-white/5"
                >
                  {user ? (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsMobileOpen(false)}
                        className="flex items-center gap-3 min-h-[52px] px-4 rounded-2xl text-[15px] font-semibold text-[#374151] dark:text-gray-200 no-underline active:scale-[0.98] transition-all hover:bg-black/5 dark:hover:bg-white/5"
                      >
                        <LayoutDashboard size={18} className="text-[#EA580C]" /> {t('cta.myResumes')}
                      </Link>
                      <Link
                        to="/premium"
                        onClick={() => setIsMobileOpen(false)}
                        className="flex items-center gap-3 min-h-[52px] px-4 rounded-2xl text-[15px] font-semibold text-[#EA580C] no-underline active:scale-[0.98] transition-all hover:bg-orange-50 dark:hover:bg-orange-500/10"
                      >
                        <Sparkles size={18} className="text-[#EA580C]" /> Pricing
                      </Link>
                      <button
                        onClick={() => { setIsMobileOpen(false); handleLogout(); }}
                        className="w-full flex items-center gap-3 min-h-[52px] px-4 rounded-2xl text-left text-[15px] font-semibold text-red-500 bg-transparent border-none cursor-pointer active:scale-[0.98] transition-transform"
                      >
                        <LogOut size={18} /> {t('cta.logout')}
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsMobileOpen(false)}
                      className="flex items-center min-h-[52px] px-4 rounded-2xl text-[15px] font-semibold text-[#EA580C] no-underline active:scale-[0.98] transition-transform bg-orange-50 dark:bg-orange-500/15"
                    >
                      {t('cta.loginSignup')}
                    </Link>
                  )}
                </motion.div>
              </motion.div>

              {/* Sticky CTA footer */}
              <div className="px-4 pt-3 pb-6 border-t border-black/5 dark:border-white/5 bg-white/60 dark:bg-black/30 backdrop-blur-md flex-shrink-0" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
                <Link
                  to="/resume"
                  onClick={() => setIsMobileOpen(false)}
                  className="hdr-btn-primary flex items-center justify-center gap-2 w-full text-white text-[15px] font-bold min-h-[54px] rounded-2xl no-underline active:scale-[0.98] transition-transform"
                >
                  <Zap size={16} /> {t('cta.buildResumeFree')}
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
