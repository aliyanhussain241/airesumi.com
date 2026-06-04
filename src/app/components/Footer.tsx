import { Link } from "@tanstack/react-router";
import rezumiLogo from "@/assets/ai-resumi.webp";

export const Footer = () => (
  <footer className="bg-white border-t border-gray-100 py-16 w-full print:hidden">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-[#4b5563]">
      <div className="space-y-4">
        <div className="flex items-center">
          <img src={rezumiLogo} alt="Rezumi - AI Resume Builder" className="h-10 w-auto" />
        </div>
        <p className="text-[15px] leading-relaxed">
          The fastest, most effective way to secure your next role. Built with top recruiters and AI.
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-[#1a202c] mb-6">Product</h4>
        <ul className="space-y-4 text-[15px]">
          <li><Link to="/resume" className="hover:text-[#FF6321] transition-colors text-left no-underline">Resume Builder</Link></li>
          <li><Link to="/cover-letter" className="hover:text-[#FF6321] transition-colors text-left no-underline">Cover Letter</Link></li>
          <li><Link to="/ats-checker" className="hover:text-[#FF6321] transition-colors text-left no-underline">ATS Resume Checker</Link></li>
          <li><Link to="/premium" className="hover:text-[#FF6321] transition-colors text-left no-underline">airesumi Pro</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-[#1a202c] mb-6">Resources</h4>
        <ul className="space-y-4 text-[15px]">
          <li><Link to="/blog" className="hover:text-[#FF6321] transition-colors text-left no-underline">Career Blog</Link></li>
          <li><Link to="/examples" className="hover:text-[#FF6321] transition-colors text-left no-underline">Resume Examples</Link></li>
          <li><Link to="/interview-prep" className="hover:text-[#FF6321] transition-colors text-left no-underline">Interview Questions</Link></li>
          <li><Link to="/salary-analyzer" className="hover:text-[#FF6321] transition-colors text-left no-underline">Salary Analyzer</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-[#1a202c] mb-6">Company</h4>
        <ul className="space-y-4 text-[15px]">
          <li><Link to="/about" className="hover:text-[#FF6321] transition-colors text-left no-underline">About Us</Link></li>
          <li><Link to="/contact" className="hover:text-[#FF6321] transition-colors text-left no-underline">Contact</Link></li>
          <li><Link to="/privacy" className="hover:text-[#FF6321] transition-colors text-left no-underline">Privacy Policy</Link></li>
          <li><Link to="/terms" className="hover:text-[#FF6321] transition-colors text-left no-underline">Terms of Service</Link></li>
        </ul>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
      <div>&copy; {new Date().getFullYear()} Rezumi. All rights reserved.</div>
      <div className="flex gap-6">
        <Link to="/privacy" className="hover:text-[#1a202c] transition-colors no-underline">Privacy</Link>
        <Link to="/terms" className="hover:text-[#1a202c] transition-colors no-underline">Terms</Link>
      </div>
    </div>
  </footer>
);
