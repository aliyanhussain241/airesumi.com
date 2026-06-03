import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, LogOut, User } from 'lucide-react';
import { Link, useLocation, useNavigate } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import rezumiLogo from '@/assets/ai-resumi.webp';

export const Logo = () => (
  <div className="flex items-center select-none z-50 transition-transform duration-200 hover:scale-[1.02]">
    <img src={rezumiLogo} alt="airesumi - AI Resume Builder" className="h-8 w-auto" />
  </div>
);

const navLinks: { name: string; to: string; matches: string[] }[] = [
  { name: 'Home', to: '/', matches: ['/'] },
  { name: 'Resume', to: '/resume', matches: ['/resume'] },
  { name: 'Cover Letter', to: '/cover-letter', matches: ['/cover-letter'] },
  { name: 'ATS Checker', to: '/ats-checker', matches: ['/ats-checker'] },
  { name: 'Examples', to: '/examples', matches: ['/examples'] },
  { name: 'Blog', to: '/blog', matches: ['/blog'] },
];

export const Header = ({ windowWidth }: { windowWidth?: number }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [width, setWidth] = useState(
    windowWidth ?? (typeof window !== 'undefined' ? window.innerWidth : 1200)
  );
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: '/' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 h-[68px] z-[1000] transition-all duration-300 print:hidden ${
        isScrolled
          ? 'bg-white/60 backdrop-blur-lg shadow-[0_2px_12px_rgba(234,88,12,0.08)] border-b border-[#FED7AA]/50'
          : 'bg-[#FFFFFF] border-b border-transparent shadow-none'
      } px-[20px] md:px-[32px] lg:px-[48px] box-border w-full flex items-center justify-between font-['Inter',sans-serif]`}
    >
      <Link to="/" className="flex-shrink-0 cursor-pointer no-underline">
        <Logo />
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-[20px] lg:gap-[32px]">
        {navLinks.map((link) => {
          const isActive = link.matches.includes(location.pathname);
          return (
            <Link
              key={link.name}
              to={link.to}
              className={`cursor-pointer text-[14px] font-medium tracking-[0.02em] transition-colors duration-200 relative pb-1 no-underline
                ${isActive ? 'text-[#EA580C]' : 'text-[#374151] hover:text-[#EA580C]'}
              `}
            >
              {link.name}
              {isActive && (
                <span className="absolute bottom-[0] left-0 right-0 h-[2px] bg-[#EA580C]"></span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Desktop Right Buttons */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {user ? (
          // ✅ LOGGED IN — User email + Logout button
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-orange-50 px-3 py-2 rounded-lg">
              <User size={15} className="text-orange-500" />
              <span className="max-w-[140px] truncate">{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-[14px] font-semibold px-[18px] py-[10px] rounded-[8px] border border-gray-300 text-gray-600 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
            >
              <LogOut size={15} />
              Logout
            </button>
            <button
              onClick={() => navigate({ to: '/resume' })}
              className="bg-[#EA580C] text-white text-[14px] font-semibold px-[22px] py-[10px] rounded-[8px] hover:bg-[#C2410C] hover:scale-[1.02] transition-all duration-200 cursor-pointer border-none"
            >
              {width >= 1024 ? 'Build My Resume →' : 'Start →'}
            </button>
          </div>
        ) : (
          // ✅ NOT LOGGED IN — Login + Start Free buttons
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate({ to: '/login' })}
              className="text-[14px] font-semibold px-[18px] py-[10px] rounded-[8px] border border-[#EA580C] text-[#EA580C] hover:bg-orange-50 transition-all duration-200 cursor-pointer bg-transparent"
            >
              Login
            </button>
            <button
              onClick={() => navigate({ to: '/resume' })}
              className="bg-[#EA580C] text-white text-[14px] font-semibold px-[22px] py-[10px] rounded-[8px] hover:bg-[#C2410C] hover:scale-[1.02] transition-all duration-200 cursor-pointer border-none"
            >
              {width >= 1024 ? 'Build My Resume →' : 'Start Free →'}
            </button>
          </div>
        )}

        {/* Mobile Start Button */}
        <button
          onClick={() => navigate({ to: '/resume' })}
          className="bg-[#EA580C] text-white text-[14px] font-semibold px-[16px] py-[8px] rounded-[8px] hover:bg-[#C2410C] transition-all duration-200 cursor-pointer md:hidden border-none"
        >
          Start Free →
        </button>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-[#374151] flex items-center justify-center p-1 cursor-pointer bg-transparent border-none"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={24} strokeWidth={2} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#FFFFFF] z-[1001] flex flex-col p-6 font-['Inter',sans-serif]"
          >
            <div className="flex justify-between items-center mb-8">
              <Link
                to="/"
                className="cursor-pointer no-underline"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Logo />
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-[#374151] p-2 cursor-pointer bg-transparent border-none"
              >
                <X size={24} strokeWidth={2} />
              </button>
            </div>

            <nav className="flex flex-col gap-2 flex-grow justify-center">
              {navLinks.map((link) => {
                const isActive = link.matches.includes(location.pathname);
                return (
                  <Link
                    key={link.name}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`cursor-pointer text-center text-[18px] py-[16px] font-medium transition-colors no-underline
                      ${isActive ? 'text-[#EA580C]' : 'text-[#374151] hover:text-[#EA580C]'}
                    `}
                  >
                    {link.name}
                  </Link>
                );
              })}

              {/* Mobile Login/Logout */}
              {user ? (
                <button
                  onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }}
                  className="text-center text-[18px] py-[16px] font-medium text-red-500 bg-transparent border-none cursor-pointer"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-center text-[18px] py-[16px] font-medium text-[#EA580C] no-underline"
                >
                  Login / Sign Up
                </Link>
              )}
            </nav>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate({ to: '/resume' });
              }}
              className="w-full bg-[#EA580C] text-white text-[18px] font-semibold py-[16px] rounded-[8px] hover:bg-[#C2410C] transition-colors mt-auto mb-8 border-none cursor-pointer"
            >
              Build My Resume Free →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
