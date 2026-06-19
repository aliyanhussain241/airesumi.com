import { Link } from "@tanstack/react-router";
import rezumiLogo from "@/assets/ai-resumi.webp";

const tape = (
  <svg xmlns="http://www.w3.org/2000/svg" width="95" height="80" viewBox="0 0 95 80" fill="none">
    <path d="M1 45L70.282 5L88.282 36.1769L19 76.1769L1 45Z" fill="#222222"/>
  </svg>
);

export const Footer = () => (
  <footer className="my-8 px-4 max-w-7xl mx-auto print:hidden">
    <div className="relative bg-white rounded-3xl px-8 py-10">
      <div className="hidden md:block absolute -top-4 -left-8 w-[80px] scale-75 opacity-10">
        {tape}
      </div>
      <div className="hidden md:block absolute -top-4 -right-8 rotate-90 w-[80px] scale-75 opacity-10">
        {tape}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="flex flex-col gap-3 items-start">
  <img
    src={rezumiLogo}
    alt="Rezumi - AI Resume Builder"
    className="h-10 w-auto object-contain"
  />
  <p className="text-sm text-neutral/50 leading-relaxed max-w-[220px]">
    The fastest, most effective way to secure your next role. Built with top recruiters and AI.
  </p>
</div>

        <div className="flex flex-col gap-4">
          <h4 className="uppercase text-xs tracking-widest font-semibold text-neutral/50">Product</h4>
          <ul className="flex flex-col gap-3 text-sm text-neutral/50">
            <li><Link to="/resume" className="hover:text-[#FF6321] transition-colors no-underline">Resume Builder</Link></li>
            <li><Link to="/cover-letter" className="hover:text-[#FF6321] transition-colors no-underline">Cover Letter</Link></li>
            <li><Link to="/ats-checker" className="hover:text-[#FF6321] transition-colors no-underline">ATS Resume Checker</Link></li>
            <li><Link to="/premium" className="hover:text-[#FF6321] transition-colors no-underline">Airesumi Pro</Link></li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="uppercase text-xs tracking-widest font-semibold text-neutral/50">Resources</h4>
          <ul className="flex flex-col gap-3 text-sm text-neutral/50">
            <li><Link to="/blog" className="hover:text-[#FF6321] transition-colors no-underline">Career Blog</Link></li>
            <li><Link to="/examples" className="hover:text-[#FF6321] transition-colors no-underline">Resume Examples</Link></li>
            <li><Link to="/interview-prep" className="hover:text-[#FF6321] transition-colors no-underline">Interview Questions</Link></li>
            <li><Link to="/salary-analyzer" className="hover:text-[#FF6321] transition-colors no-underline">Salary Analyzer</Link></li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="uppercase text-xs tracking-widest font-semibold text-neutral/50">Company</h4>
          <ul className="flex flex-col gap-3 text-sm text-neutral/50">
            <li><Link to="/about" className="hover:text-[#FF6321] transition-colors no-underline">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-[#FF6321] transition-colors no-underline">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-[#FF6321] transition-colors no-underline">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-[#FF6321] transition-colors no-underline">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <hr className="my-8 border-gray-100" />

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral/50">
        <span>© {new Date().getFullYear()} Rezumi. All rights reserved.</span>
        <div className="flex gap-6">
          <Link to="/privacy" className="hover:text-[#1a202c] transition-colors no-underline">Privacy</Link>
          <Link to="/terms" className="hover:text-[#1a202c] transition-colors no-underline">Terms</Link>
        </div>
      </div>
    </div>
  </footer>
);
