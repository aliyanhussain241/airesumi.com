import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, LogOut, User, Moon, Sun, ChevronDown, FileText, Mail, Target, Linkedin, BookOpen, LayoutDashboard } from 'lucide-react';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import rezumiLogo from '@/assets/ai-resumi.webp';

export const Logo = () => (
  <div className="flex items-center select-none z-50 transition-transform duration-200 hover:scale-[1.02]">
    <img src={rezumiLogo} alt="airesumi - AI Resume Builder" className="h-8 w-auto" />
  </div>
);

// Tools dropdown items
const toolLinks = [
  { name: 'Resume Builder', to: '/resume', icon: FileText, desc: 'ATS-optimized resume' },
  { name: 'Cover Letter', to: '/cover-letter', icon: Mail, desc: 'Tailored cover letters' },
  { name: 'ATS Checker', to: '/ats-checker', icon: Target, desc: 'Score your resume' },
  { name: 'LinkedIn Bio', to: '/linkedin-bio', icon: Linkedin, desc: 'LinkedIn profile generator' },
];

const moreLinks = [
  { name: 'Examples', to: '/examples' },
  { name: 'Blog', to: '/blog' },
];

export const Header = ({ windowWidth }: { windowWidth?: number }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isDark, setIsDark] = useState(false);
  const [width, setWidth] = useState(
    windowWidth ?? (typeof window !== 'undefined' ? window.innerWidth : 1200)
  );
  const location = useLocation();
  const navigate = useNavigate();
  const toolsRef = useRef<HTMLDivElement>(null);

  // Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Dark mode
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldDark = saved === 'dark' || (!saved && prefersDark);
    setIsDark(shouldDark);
    document.documentElement.classList.toggle('dark', shouldDark);
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  // Scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Resize
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setIsToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: '/' });
  };

  const isToolActive = toolLinks.some(t => t.to === location.pathname);

  return (
    <header
      className={`fixed top-0 left-0 right-0 h-[68px] z-[1000] transition-all duration-300 print:hidden ${
        isScrolled
          ? 'bg-white/90 dark:bg-[#FFFFFF]/90 backdrop-blur-lg shadow-[0_2px_12px_rgba(0,0,0,0.08)] border-b border-gray-200/50 dark:border-gray-700/50'
          : 'bg-white dark:bg-[#FFFFFF] border-b border-transparent'
      } w-full font-['Inter',sans-serif]`}
    >
      <div className="max-w-7xl mx-auto px-6 w-full h-full flex items-center justify-between gap-6">

        {/* Logo */}
        <Link to="/" className="flex-shrink-0 cursor-pointer no-underline">
          <Logo />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1">

          {/* Home */}
          <Link
            to="/"
            className={`px-3 py-2 rounded-lg text-[14px] font-medium transition-colors no-underline ${
              location.pathname === '/'
                ? 'text-[#EA580C] bg-orange-50 dark:bg-orange-950/30'
                : 'text-gray-600 dark:text-gray-300 hover:text-[#EA580C] hover:bg-orange-50 dark:hover:bg-orange-950/20'
            }`}
          >
            Home
          </Link>

          {/* Tools Dropdown */}
          <div ref={toolsRef} className="relative">
            <button
              onClick={() => setIsToolsOpen(!isToolsOpen)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[14px] font-medium transition-colors cursor-pointer border-none bg-transparent ${
                isToolActive
                  ? 'text-[#EA580C] bg-orange-50 dark:bg-orange-950/30'
                  : 'text-gray-600 dark:text-gray-300 hover:text-[#EA580C] hover:bg-orange-50 dark:hover:bg-orange-950/20'
              }`}
            >
              Tools
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${isToolsOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {isToolsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-[calc(100%+8px)] left-0 w-[240px] bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden"
                >
                  {toolLinks.map((tool) => {
                    const Icon = tool.icon;
                    const isActive = location.pathname === tool.to;
                    return (
                      <Link
                        key={tool.to}
                        to={tool.to}
                        onClick={() => setIsToolsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 no-underline transition-colors group ${
                          isActive
                            ? 'bg-orange-50 dark:bg-orange-950/30'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isActive ? 'bg-[#EA580C]' : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-orange-100 dark:group-hover:bg-orange-950/40'
                        }`}>
                          <Icon size={15} className={isActive ? 'text-white' : 'text-gray-600 dark:text-gray-300 group-hover:text-[#EA580C]'} />
                        </div>
                        <div>
                          <div className={`text-[13px] font-semibold ${isActive ? 'text-[#EA580C]' : 'text-gray-800 dark:text-gray-100'}`}>
                            {tool.name}
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400">{tool.desc}</div>
                        </div>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* More links */}
          {moreLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-lg text-[14px] font-medium transition-colors no-underline ${
                location.pathname === link.to
                  ? 'text-[#EA580C] bg-orange-50 dark:bg-orange-950/30'
                  : 'text-gray-600 dark:text-gray-300 hover:text-[#EA580C] hover:bg-orange-50 dark:hover:bg-orange-950/20'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className="hidden md:flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer bg-transparent"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 text-[13px] font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-[#EA580C] transition-colors no-underline"
              >
                <LayoutDashboard size={14} />
                My Resumes
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer bg-transparent"
              >
                <LogOut size={14} />
                Logout
              </button>
              <button
                onClick={() => navigate({ to: '/resume' })}
                className="bg-[#EA580C] text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-[#C2410C] transition-all cursor-pointer border-none whitespace-nowrap"
              >
                Build Resume →
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => navigate({ to: '/login' })}
                className="text-[13px] font-medium px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-[#EA580C] hover:text-[#EA580C] transition-all cursor-pointer bg-transparent"
              >
                Login
              </button>
              <button
                onClick={() => navigate({ to: '/resume' })}
                className="bg-[#EA580C] text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-[#C2410C] transition-all cursor-pointer border-none whitespace-nowrap"
              >
                Build Resume →
              </button>
            </div>
          )}

          {/* Mobile buttons */}
          <button
            onClick={toggleDark}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 cursor-pointer bg-transparent"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <button
            className="md:hidden text-gray-600 dark:text-gray-300 flex items-center justify-center p-1 cursor-pointer bg-transparent border-none"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-white dark:bg-[#111827] z-[1001] flex flex-col p-6 font-['Inter',sans-serif]"
          >
            <div className="flex justify-between items-center mb-8">
              <Link to="/" className="cursor-pointer no-underline" onClick={() => setIsMobileMenuOpen(false)}>
                <Logo />
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-600 dark:text-gray-300 p-2 cursor-pointer bg-transparent border-none">
                <X size={24} strokeWidth={2} />
              </button>
            </div>

            <nav className="flex flex-col gap-1 flex-grow">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}
                className="text-[16px] py-3 px-4 rounded-lg font-medium text-gray-700 dark:text-gray-200 no-underline hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-[#EA580C]">
                Home
              </Link>

              <div className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 pt-4 pb-1">Tools</div>
              {toolLinks.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link key={tool.to} to={tool.to} onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-[15px] py-3 px-4 rounded-lg font-medium text-gray-700 dark:text-gray-200 no-underline hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-[#EA580C]">
                    <Icon size={16} /> {tool.name}
                  </Link>
                );
              })}

              <div className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 pt-4 pb-1">More</div>
              {moreLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[15px] py-3 px-4 rounded-lg font-medium text-gray-700 dark:text-gray-200 no-underline hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-[#EA580C]">
                  {link.name}
                </Link>
              ))}

              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-[15px] py-3 px-4 rounded-lg font-medium text-gray-700 dark:text-gray-200 no-underline hover:bg-orange-50">
                    <LayoutDashboard size={16} /> My Resumes
                  </Link>
                  <button onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                    className="text-left text-[15px] py-3 px-4 rounded-lg font-medium text-red-500 bg-transparent border-none cursor-pointer">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[15px] py-3 px-4 rounded-lg font-medium text-[#EA580C] no-underline">
                  Login / Sign Up
                </Link>
              )}
            </nav>

            <button
              onClick={() => { setIsMobileMenuOpen(false); navigate({ to: '/resume' }); }}
              className="w-full bg-[#EA580C] text-white text-[16px] font-semibold py-4 rounded-xl hover:bg-[#C2410C] transition-colors mt-6 border-none cursor-pointer"
            >
              Build My Resume Free →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
