import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, LogOut, User, ChevronDown, FileText, Mail, Target, Linkedin, PenLine, List, Briefcase, Wand2, LayoutDashboard, ScanLine } from 'lucide-react';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import rezumiLogo from '@/assets/ai-resumi.webp';

export const Logo = () => (
  <div className="flex items-center select-none z-50 transition-transform duration-200 hover:scale-[1.02]">
    <img src={rezumiLogo} alt="airesumi - AI Resume Builder" className="h-8 w-auto" />
  </div>
);

const resumeTools = [
  { name: 'AI Resume Builder', to: '/resume', icon: FileText, desc: 'ATS-optimized resume in minutes' },
  { name: 'Resume Bullet Writer', to: '/bullet-writer', icon: PenLine, desc: 'Stronger bullet points instantly' },
  { name: 'Resume Summary', to: '/summary-generator', icon: List, desc: 'Generate a compelling summary' },
  { name: 'Keyword Scanner', to: '/keyword-scanner', icon: Target, desc: 'Match keywords to job posting' },
];

const otherTools = [
  { name: 'Cover Letter', to: '/cover-letter', icon: Mail, desc: 'Tailored cover letters' },
  { name: 'LinkedIn Bio', to: '/linkedin-bio', icon: Linkedin, desc: 'Profile generator' },
  { name: 'ATS Checker', to: '/ats-checker', icon: Target, desc: 'Score your resume' },
  { name: 'Interview Prep', to: '/interview-prep', icon: Wand2, desc: 'Practice questions' },
  { name: 'Resignation Letter', to: '/resignation-letter', icon: FileText, desc: 'Leave on good terms' },
  { name: 'PDF Scanner', to: '/pdf-scanner', icon: ScanLine, desc: 'Scan documents to PDF' },
  { name: 'Job Search', to: '/salary-analyzer', icon: Briefcase, desc: 'Salary & market insights' },
];

export const Header = ({ windowWidth }: { windowWidth?: number }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [width, setWidth] = useState(
    windowWidth ?? (typeof window !== 'undefined' ? window.innerWidth : 1200)
  );
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const allTools = [...resumeTools, ...otherTools];
  const isToolActive = allTools.some(t => t.to === location.pathname);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setIsToolsOpen(false); }, [location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: '/' });
  };

  return (
    <header className={`fixed top-0 left-0 right-0 h-[68px] z-[1000] transition-all duration-300 print:hidden glass ${
      isScrolled
        ? 'glass-strong shadow-[0_2px_12px_rgba(234,88,12,0.08)] border-b border-[#FED7AA]/50'
        : 'border-b border-transparent shadow-none'
    } w-full font-['Inter',sans-serif]`}>
      <div className="max-w-7xl mx-auto px-6 w-full h-full flex items-center justify-between">

        <Link to="/" className="flex-shrink-0 cursor-pointer no-underline">
          <Logo />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link to="/"
            className={`px-3 py-2 rounded-lg text-[14px] font-medium transition-colors no-underline ${location.pathname === '/' ? 'text-[#EA580C]' : 'text-[#374151] hover:text-[#EA580C]'}`}>
            Home
          </Link>

          {/* Mega Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setIsToolsOpen(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[14px] font-medium transition-colors cursor-pointer border-none bg-transparent ${isToolActive || isToolsOpen ? 'text-[#EA580C]' : 'text-[#374151] hover:text-[#EA580C]'}`}>
              AI Tools
              <ChevronDown size={14} className={`transition-transform duration-200 ${isToolsOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isToolsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-[580px] glass glass-strong rounded-2xl shadow-[0_16px_48px_rgba(0,0,0,0.12)] overflow-hidden"
                >
                  <div className="flex">
                    <div className="flex-1 p-4 border-r border-[#f3f4f6]">
                      <p className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-3 px-2">Resume Tools</p>
                      {resumeTools.map(tool => {
                        const Icon = tool.icon;
                        const active = location.pathname === tool.to;
                        return (
                          <Link key={tool.to} to={tool.to} onClick={() => setIsToolsOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl no-underline transition-colors group mb-0.5 ${active ? 'bg-orange-50' : 'hover:bg-[#f9fafb]'}`}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${active ? 'bg-[#EA580C]' : 'bg-[#f3f4f6] group-hover:bg-orange-100'}`}>
                              <Icon size={15} className={active ? 'text-white' : 'text-[#6b7280] group-hover:text-[#EA580C]'} />
                            </div>
                            <div>
                              <p className={`text-[13px] font-semibold leading-tight ${active ? 'text-[#EA580C]' : 'text-[#111827]'}`}>{tool.name}</p>
                              <p className="text-[11px] text-[#9ca3af] mt-0.5">{tool.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                    <div className="flex-1 p-4">
                      <p className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider mb-3 px-2">Other Tools</p>
                      {otherTools.map(tool => {
                        const Icon = tool.icon;
                        const active = location.pathname === tool.to;
                        return (
                          <Link key={tool.to} to={tool.to} onClick={() => setIsToolsOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl no-underline transition-colors group mb-0.5 ${active ? 'bg-orange-50' : 'hover:bg-[#f9fafb]'}`}>
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${active ? 'bg-[#EA580C]' : 'bg-[#f3f4f6] group-hover:bg-orange-100'}`}>
                              <Icon size={15} className={active ? 'text-white' : 'text-[#6b7280] group-hover:text-[#EA580C]'} />
                            </div>
                            <div>
                              <p className={`text-[13px] font-semibold leading-tight ${active ? 'text-[#EA580C]' : 'text-[#111827]'}`}>{tool.name}</p>
                              <p className="text-[11px] text-[#9ca3af] mt-0.5">{tool.desc}</p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                  <div className="bg-[#f9fafb] border-t border-[#f3f4f6] px-6 py-3 flex items-center justify-between">
                    <span className="text-[12px] text-[#9ca3af]">10 AI-powered tools for your career</span>
                    <Link to="/resume" onClick={() => setIsToolsOpen(false)}
                      className="text-[12px] font-semibold text-[#EA580C] no-underline hover:underline">
                      Start building free →
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/examples"
            className={`px-3 py-2 rounded-lg text-[14px] font-medium transition-colors no-underline ${location.pathname === '/examples' ? 'text-[#EA580C]' : 'text-[#374151] hover:text-[#EA580C]'}`}>
            Examples
          </Link>
          <Link to="/blog"
            className={`px-3 py-2 rounded-lg text-[14px] font-medium transition-colors no-underline ${location.pathname === '/blog' ? 'text-[#EA580C]' : 'text-[#374151] hover:text-[#EA580C]'}`}>
            Blog
          </Link>
        </nav>

        <div className="flex items-center gap-2 flex-shrink-0">
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/dashboard"
                className="flex items-center gap-2 text-[13px] font-medium text-gray-600 bg-orange-50 px-3 py-2 rounded-lg hover:bg-orange-100 transition-colors no-underline">
                <LayoutDashboard size={14} className="text-orange-500" />
                My Resumes
              </Link>
              <button onClick={handleLogout}
                className="flex items-center gap-2 text-[13px] font-medium px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all cursor-pointer bg-transparent">
                <LogOut size={14} /> Logout
              </button>
              <Link to="/resume"
                className="bg-[#EA580C] text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-[#C2410C] transition-all no-underline whitespace-nowrap">
                {width >= 1024 ? 'Build My Resume →' : 'Start →'}
              </Link>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login"
                className="text-[13px] font-semibold px-4 py-2 rounded-lg border border-[#EA580C] text-[#EA580C] hover:bg-orange-50 transition-all no-underline">
                Login
              </Link>
              <Link to="/resume"
                className="bg-[#EA580C] text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-[#C2410C] transition-all no-underline whitespace-nowrap">
                {width >= 1024 ? 'Build My Resume →' : 'Start Free →'}
              </Link>
            </div>
          )}
          <Link to="/resume" className="bg-[#EA580C] text-white text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-[#C2410C] md:hidden no-underline">
            Start Free →
          </Link>
          <button className="md:hidden text-[#374151] flex items-center justify-center p-1 cursor-pointer bg-transparent border-none"
            onClick={() => setIsMobileMenuOpen(true)}>
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
            className="fixed inset-0 bg-white z-[1001] flex flex-col font-['Inter',sans-serif] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-[#f3f4f6]">
              <Link to="/" className="cursor-pointer no-underline" onClick={() => setIsMobileMenuOpen(false)}><Logo /></Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-[#374151] p-2 cursor-pointer bg-transparent border-none">
                <X size={24} strokeWidth={2} />
              </button>
            </div>
            <div className="px-6 py-4 flex-1">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center py-3 text-[15px] font-medium text-[#374151] no-underline border-b border-[#f3f4f6]">Home</Link>

              <p className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider mt-5 mb-2">Resume Tools</p>
              {resumeTools.map(tool => {
                const Icon = tool.icon;
                return (
                  <Link key={tool.to} to={tool.to} onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-3 text-[14px] font-medium text-[#374151] no-underline border-b border-[#f9fafb] hover:text-[#EA580C]">
                    <Icon size={16} className="text-[#EA580C]" />{tool.name}
                  </Link>
                );
              })}

              <p className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wider mt-5 mb-2">Other Tools</p>
              {otherTools.map(tool => {
                const Icon = tool.icon;
                return (
                  <Link key={tool.to} to={tool.to} onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-3 text-[14px] font-medium text-[#374151] no-underline border-b border-[#f9fafb] hover:text-[#EA580C]">
                    <Icon size={16} className="text-[#EA580C]" />{tool.name}
                  </Link>
                );
              })}

              <Link to="/examples" onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center py-3 text-[15px] font-medium text-[#374151] no-underline border-b border-[#f3f4f6] mt-2">Examples</Link>
              <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center py-3 text-[15px] font-medium text-[#374151] no-underline border-b border-[#f3f4f6]">Blog</Link>

              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-3 text-[15px] font-medium text-[#374151] no-underline border-b border-[#f3f4f6]">
                    <LayoutDashboard size={16} /> My Resumes
                  </Link>
                  <button onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                    className="w-full text-left py-3 text-[15px] font-medium text-red-500 bg-transparent border-none cursor-pointer">Logout</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center py-3 text-[15px] font-medium text-[#EA580C] no-underline">Login / Sign Up</Link>
              )}
            </div>
            <div className="px-6 pb-8">
              <Link to="/resume" onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full bg-[#EA580C] text-white text-[16px] font-semibold py-4 rounded-xl hover:bg-[#C2410C] transition-colors text-center no-underline">
                Build My Resume Free →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
