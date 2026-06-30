import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu, X, LogOut, ChevronDown, FileText, Mail, Target,
  Linkedin, PenLine, List, Briefcase, Wand2, LayoutDashboard, ScanLine, Sun, Moon
} from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import rezumiLogo from '@/assets/ai-resumi.webp';
import rezumiLogoWhite from '@/assets/rezumi-white.webp';

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

  /* iOS 26 LIQUID GLASS DROPDOWN — translucent, distorted, shiny */
  .hdr-dropdown {
    position: absolute;
    isolation: isolate;
    border-radius: 1.75rem;
    overflow: hidden;
    box-shadow:
      0 6px 6px rgba(0, 0, 0, 0.2),
      0 0 20px rgba(0, 0, 0, 0.1);
    transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 2.2);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    background: rgba(255, 255, 255, 0.18);
  }

  :global(html.dark) .hdr-dropdown {
    background: rgba(20, 20, 28, 0.28);
  }

  /* Distortion layer */
  .hdr-dropdown::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 0;
    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(3px);
    filter: url(#glass-distortion) saturate(120%) brightness(1.15);
    isolation: isolate;
    pointer-events: none;
  }

  /* Subtle tint layer */
  .hdr-dropdown::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    background: rgba(255, 255, 255, 0.15);
    pointer-events: none;
  }

  :global(html.dark) .hdr-dropdown::after {
    background: rgba(20, 20, 28, 0.25);
  }

  /* Glossy shine highlight */
  .hdr-dropdown > .hdr-dropdown-shine {
    position: absolute;
    inset: 0;
    z-index: 2;
    border-radius: inherit;
    box-shadow:
      inset 2px 2px 1px 0 rgba(255, 255, 255, 0.75),
      inset -1px -1px 1px 1px rgba(255, 255, 255, 0.4);
    pointer-events: none;
  }

  :global(html.dark) .hdr-dropdown > .hdr-dropdown-shine {
    box-shadow:
      inset 2px 2px 1px 0 rgba(255, 255, 255, 0.18),
      inset -1px -1px 1px 1px rgba(255, 255, 255, 0.08);
  }

  .hdr-dropdown > .hdr-dropdown-content {
    position: relative;
    z-index: 3;
  }

  .hdr-dropdown-footer {
    background: rgba(255, 255, 255, 0.25);
    border-top: 1px solid rgba(255, 255, 255, 0.35);
  }

  :global(html.dark) .hdr-dropdown-footer {
    background: rgba(255, 255, 255, 0.05);
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }


  /* HORIZONTAL GRID */
  .hdr-dropdown-grid {
    display: grid;
    gap: 4px;
  }
  .hdr-dropdown-grid.cols-2 {
    grid-template-columns: 1fr 1fr;
  }
  .hdr-dropdown-grid.cols-3 {
    grid-template-columns: 1fr 1fr 1fr;
  }

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
  .hdr-tool-item:hover {
    background: rgba(234,88,12,0.06);
    border-radius: 12px;
  }
  .hdr-tool-item.active {
    background: rgba(234,88,12,0.1);
    border-radius: 12px;
  }
  .hdr-mobile {
    background: rgba(255,255,255,0.88);
    backdrop-filter: blur(40px) saturate(200%);
    -webkit-backdrop-filter: blur(40px) saturate(200%);
  }
  .hdr-tag {
    background: rgba(234,88,12,0.12);
    border: 1px solid rgba(234,88,12,0.15);
    backdrop-filter: blur(4px);
  }
`;

export const Logo = () => (
  <div className="flex items-center select-none transition-transform duration-200 hover:scale-[1.02]">
    <img src={rezumiLogo} alt="airesumi" className="theme-logo-light h-8 w-auto object-contain" />
    <img src={rezumiLogoWhite} alt="airesumi" className="theme-logo-dark h-8 w-auto object-contain" />
  </div>
);

const resumeTools = [
  { name: 'AI Resume Builder',    to: '/resume',            icon: FileText, desc: 'ATS-optimized resume in minutes' },
  { name: 'Resume Bullet Writer', to: '/bullet-writer',     icon: PenLine,  desc: 'Stronger bullet points instantly' },
  { name: 'Resume Summary',       to: '/summary-generator', icon: List,     desc: 'Generate a compelling summary' },
  { name: 'Keyword Scanner',      to: '/keyword-scanner',   icon: Target,   desc: 'Match keywords to job posting' },
];

const otherTools = [
  { name: 'Cover Letter',       to: '/cover-letter',       icon: Mail,     desc: 'Tailored cover letters' },
  { name: 'LinkedIn Bio',       to: '/linkedin-bio',       icon: Linkedin, desc: 'Profile generator' },
  { name: 'ATS Checker',        to: '/ats-checker',        icon: Target,   desc: 'Score your resume' },
  { name: 'Interview Prep',     to: '/interview-prep',     icon: Wand2,    desc: 'Practice questions' },
  { name: 'Resignation Letter', to: '/resignation-letter', icon: FileText, desc: 'Leave on good terms' },
  { name: 'PDF Scanner',        to: '/pdf-scanner',        icon: ScanLine, desc: 'Scan documents to PDF' },
  { name: 'Job Search',         to: '/salary-analyzer',    icon: Briefcase,desc: 'Salary & market insights' },
];

export const Header = ({ windowWidth }: { windowWidth?: number }) => {
  const [isScrolled, setIsScrolled]     = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isOtherOpen, setIsOtherOpen]   = useState(false);
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
    triggerRef: React.RefObject<HTMLButtonElement>,
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
    const fn = () => setIsScrolled(window.scrollY > 10);
    fn(); window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = () => setWidth(window.innerWidth);
    fn(); // ✅ mount hote hi asal width set karo (sirf browser mein chalta hai, hydration ke baad — safe)
    window.addEventListener('resize', fn);
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

  const handleLogout = async () => { await supabase.auth.signOut(); navigate({ to: '/' }); };

  // ✅ UPDATED: Horizontal tool card layout
  const ToolItem = ({ tool, onClose }: { tool: typeof resumeTools[0]; onClose: () => void }) => {
    const Icon = tool.icon;
    const active = location.pathname === tool.to;
    return (
      <Link
        to={tool.to}
        onClick={onClose}
        role="menuitem"
        aria-current={active ? 'page' : undefined}
        className={`hdr-tool-item flex items-center gap-2.5 px-3 py-2.5 no-underline transition-colors group ${active ? 'active' : ''}`}
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${active ? 'bg-[#EA580C]' : 'bg-orange-50 group-hover:bg-orange-100'}`}>
          <Icon size={14} className={active ? 'text-white' : 'text-[#EA580C]'} />
        </div>
        <div>
          <p className={`text-[13px] font-semibold leading-tight ${active ? 'text-[#EA580C]' : 'text-[#111827]'}`}>{tool.name}</p>
          <p className="text-[11px] text-[#9ca3af] leading-tight">{tool.desc}</p>
        </div>
      </Link>
    );
  };

  const DropdownAnimation = {

    initial: { opacity: 0, y: 8, scale: 0.96 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit:    { opacity: 0, y: 8, scale: 0.96 },
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
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
        <div className="max-w-7xl mx-auto px-6 w-full h-full flex items-center justify-between gap-6">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 no-underline"><Logo /></Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1">

            <Link to="/"
              className={`hdr-nav-link text-[14px] font-medium no-underline ${location.pathname === '/' ? 'active text-[#EA580C]' : 'text-[#374151]'}`}>
              Home
            </Link>

            {/* ✅ Resume Tools — 2 column horizontal grid */}
            <div ref={resumeRef} className="relative">
              <button
                onClick={() => { setIsResumeOpen(v => !v); setIsOtherOpen(false); }}
                className={`hdr-nav-link flex items-center gap-1.5 text-[14px] font-medium cursor-pointer border-none bg-transparent ${isResumeActive || isResumeOpen ? 'active text-[#EA580C]' : 'text-[#374151]'}`}>
                Resume Tools
                <ChevronDown size={13} className={`transition-transform duration-200 ${isResumeOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isResumeOpen && (
                  <motion.div
                    {...DropdownAnimation}
                    style={{ transformOrigin: 'top center' }}
                    className="hdr-dropdown absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 w-[480px]"
                  >
                    <span className="hdr-dropdown-shine" aria-hidden="true" />
                    <div className="hdr-dropdown-content">
                      <div className="p-4">
                        <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest mb-3 px-2">Resume Tools</p>
                        {/* ✅ 2 columns grid */}
                        <div className="hdr-dropdown-grid cols-2">
                          {resumeTools.map(tool => (
                            <ToolItem key={tool.to} tool={tool} onClose={() => setIsResumeOpen(false)} />
                          ))}
                        </div>
                      </div>
                      <div className="hdr-dropdown-footer px-5 py-2.5 flex items-center justify-between">
                        <span className="text-[11px] text-[#9ca3af]">{resumeTools.length} resume tools</span>
                        <Link to="/resume" onClick={() => setIsResumeOpen(false)}
                          className="text-[12px] font-bold text-[#EA580C] no-underline hover:underline">
                          Start free →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ✅ Other Tools — 3 column horizontal grid */}
            <div ref={otherRef} className="relative">
              <button
                onClick={() => { setIsOtherOpen(v => !v); setIsResumeOpen(false); }}
                className={`hdr-nav-link flex items-center gap-1.5 text-[14px] font-medium cursor-pointer border-none bg-transparent ${isOtherActive || isOtherOpen ? 'active text-[#EA580C]' : 'text-[#374151]'}`}>
                Other Tools
                <ChevronDown size={13} className={`transition-transform duration-200 ${isOtherOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isOtherOpen && (
                  <motion.div
                    {...DropdownAnimation}
                    style={{ transformOrigin: 'top center' }}
                    className="hdr-dropdown absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 w-[600px]"
                  >
                    <span className="hdr-dropdown-shine" aria-hidden="true" />
                    <div className="hdr-dropdown-content">
                      <div className="p-4">
                        <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest mb-3 px-2">Other Tools</p>
                        {/* ✅ 3 columns grid */}
                        <div className="hdr-dropdown-grid cols-3">
                          {otherTools.map(tool => (
                            <ToolItem key={tool.to} tool={tool} onClose={() => setIsOtherOpen(false)} />
                          ))}
                        </div>
                      </div>
                      <div className="hdr-dropdown-footer px-5 py-2.5 flex items-center justify-between">
                        <span className="text-[11px] text-[#9ca3af]">{otherTools.length} other tools</span>
                        <Link to="/cover-letter" onClick={() => setIsOtherOpen(false)}
                          className="text-[12px] font-bold text-[#EA580C] no-underline hover:underline">
                          Explore →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link to="/examples"
              className={`hdr-nav-link text-[14px] font-medium no-underline ${location.pathname === '/examples' ? 'active text-[#EA580C]' : 'text-[#374151]'}`}>
              Examples
            </Link>
            <Link to="/blog"
              className={`hdr-nav-link text-[14px] font-medium no-underline ${location.pathname === '/blog' ? 'active text-[#EA580C]' : 'text-[#374151]'}`}>
              Blog
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/dashboard"
                  className="hdr-tag flex items-center gap-1.5 text-[13px] font-medium text-[#EA580C] px-3 py-2 rounded-xl no-underline transition-all hover:bg-orange-50">
                  <LayoutDashboard size={14} /> My Resumes
                </Link>
                <button onClick={handleLogout}
                  className="hdr-btn-outline flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-xl text-[#374151] cursor-pointer">
                  <LogOut size={13} /> Logout
                </button>
                <Link to="/resume"
                  className="hdr-btn-primary text-white text-[13px] font-bold px-4 py-2 rounded-xl no-underline whitespace-nowrap">
                  {width >= 1024 ? 'Build My Resume →' : 'Start →'}
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login"
                  className="hdr-btn-outline text-[13px] font-semibold px-4 py-2 rounded-xl text-[#EA580C] no-underline">
                  Login
                </Link>
                <Link to="/resume"
                  className="hdr-btn-primary text-white text-[13px] font-bold px-4 py-2 rounded-xl no-underline whitespace-nowrap">
                  {width >= 1024 ? 'Build My Resume →' : 'Start Free →'}
                </Link>
              </div>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="hdr-btn-outline flex items-center justify-center p-2 rounded-xl text-[#374151] dark:text-orange-200 cursor-pointer"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Mobile */}
            <Link to="/resume" className="hdr-btn-primary text-white text-[13px] font-bold px-4 py-2 rounded-xl md:hidden no-underline">
              Start Free
            </Link>
            <button onClick={() => setIsMobileOpen(true)}
              className="md:hidden text-[#374151] dark:text-orange-200 p-1.5 rounded-xl cursor-pointer bg-transparent border-none hdr-btn-outline">
              <Menu size={22} strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu — unchanged */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[1002]"
          >
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.28, ease: [0.22,1,0.36,1] }}
              className="hdr-mobile absolute right-0 top-0 bottom-0 w-[85%] max-w-[340px] flex flex-col overflow-y-auto"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
                <Logo />
                <button onClick={() => setIsMobileOpen(false)}
                  className="p-2 rounded-xl text-[#374151] cursor-pointer bg-black/5 border-none">
                  <X size={20} strokeWidth={2} />
                </button>
              </div>

              <div className="flex-1 px-4 py-4">
                <Link to="/" onClick={() => setIsMobileOpen(false)}
                  className="flex items-center py-3 px-2 text-[15px] font-medium text-[#374151] no-underline border-b border-black/5">
                  Home
                </Link>

                <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest mt-5 mb-2 px-2">Resume Tools</p>
                {resumeTools.map(tool => {
                  const Icon = tool.icon;
                  return (
                    <Link key={tool.to} to={tool.to} onClick={() => setIsMobileOpen(false)}
                      className="flex items-center gap-3 py-2.5 px-2 text-[14px] font-medium text-[#374151] no-underline border-b border-black/5 hover:text-[#EA580C]">
                      <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon size={13} className="text-[#EA580C]" />
                      </div>
                      {tool.name}
                    </Link>
                  );
                })}

                <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest mt-5 mb-2 px-2">Other Tools</p>
                {otherTools.map(tool => {
                  const Icon = tool.icon;
                  return (
                    <Link key={tool.to} to={tool.to} onClick={() => setIsMobileOpen(false)}
                      className="flex items-center gap-3 py-2.5 px-2 text-[14px] font-medium text-[#374151] no-underline border-b border-black/5 hover:text-[#EA580C]">
                      <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon size={13} className="text-[#EA580C]" />
                      </div>
                      {tool.name}
                    </Link>
                  );
                })}

                <Link to="/examples" onClick={() => setIsMobileOpen(false)}
                  className="flex items-center py-3 px-2 text-[15px] font-medium text-[#374151] no-underline border-b border-black/5 mt-2">
                  Examples
                </Link>
                <Link to="/blog" onClick={() => setIsMobileOpen(false)}
                  className="flex items-center py-3 px-2 text-[15px] font-medium text-[#374151] no-underline border-b border-black/5">
                  Blog
                </Link>

                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsMobileOpen(false)}
                      className="flex items-center gap-2 py-3 px-2 text-[15px] font-medium text-[#374151] no-underline border-b border-black/5">
                      <LayoutDashboard size={16} className="text-[#EA580C]" /> My Resumes
                    </Link>
                    <button onClick={() => { setIsMobileOpen(false); handleLogout(); }}
                      className="w-full text-left py-3 px-2 text-[15px] font-medium text-red-500 bg-transparent border-none cursor-pointer">
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsMobileOpen(false)}
                    className="flex items-center py-3 px-2 text-[15px] font-medium text-[#EA580C] no-underline">
                    Login / Sign Up
                  </Link>
                )}
              </div>

              <div className="px-4 pb-8 pt-2">
                <Link to="/resume" onClick={() => setIsMobileOpen(false)}
                  className="hdr-btn-primary block w-full text-white text-[15px] font-bold py-4 rounded-2xl text-center no-underline">
                  Build My Resume Free →
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
