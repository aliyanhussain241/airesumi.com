import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import rezumiLogo from "@/assets/ai-resumi.webp";
import rezumiLogoWhite from '@/assets/rezumi-white.webp';

export const Footer = () => {
  const { t } = useTranslation();
  return (
  <footer className="site-footer bg-white border-t border-gray-100 py-16 w-full print:hidden">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-10 text-[#4b5563]">
      <div className="space-y-4 md:col-span-1">
        <div className="flex items-center">
          <img src={rezumiLogo} alt="airesumi - AI Resume Builder" className="theme-logo-light h-10 w-auto" />
          <img src={rezumiLogoWhite} alt="airesumi - AI Resume Builder" className="theme-logo-dark h-10 w-auto" />
        </div>
        <p className="text-[15px] leading-relaxed">{t("footer.tagline")}</p>
      </div>

      <div>
        <h4 className="font-semibold text-[#1a202c] mb-6">{t("footer.resumeTools")}</h4>
        <ul className="space-y-3 text-[14px]">
          <li><Link to="/resume"            className="hover:text-[#FF6321] transition-colors no-underline">{t("tools.resumeBuilder.name")}</Link></li>
          <li><Link to="/bullet-writer"     className="hover:text-[#FF6321] transition-colors no-underline">{t("tools.bulletWriter.name")}</Link></li>
          <li><Link to="/summary-generator" className="hover:text-[#FF6321] transition-colors no-underline">{t("tools.summary.name")}</Link></li>
          <li><Link to="/keyword-scanner"   className="hover:text-[#FF6321] transition-colors no-underline">{t("tools.keywordScanner.name")}</Link></li>
          <li><Link to="/premium"           className="hover:text-[#FF6321] transition-colors no-underline">{t("footer.pro")}</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-[#1a202c] mb-6">{t("footer.otherTools")}</h4>
        <ul className="space-y-3 text-[14px]">
          <li><Link to="/cover-letter"       className="hover:text-[#FF6321] transition-colors no-underline">{t("tools.coverLetter.name")}</Link></li>
          <li><Link to="/linkedin-bio"       className="hover:text-[#FF6321] transition-colors no-underline">{t("tools.linkedinBio.name")}</Link></li>
          <li><Link to="/ats-checker"        className="hover:text-[#FF6321] transition-colors no-underline">{t("tools.atsChecker.name")}</Link></li>
          <li><Link to="/resignation-letter" className="hover:text-[#FF6321] transition-colors no-underline">{t("tools.resignation.name")}</Link></li>
          <li><Link to="/pdf-scanner"        className="hover:text-[#FF6321] transition-colors no-underline">{t("tools.pdfScanner.name")}</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-[#1a202c] mb-6">{t("footer.resources")}</h4>
        <ul className="space-y-3 text-[14px]">
          <li><Link to="/blog"           className="hover:text-[#FF6321] transition-colors no-underline">{t("footer.careerBlog")}</Link></li>
          <li><Link to="/examples"       className="hover:text-[#FF6321] transition-colors no-underline">{t("footer.resumeExamples")}</Link></li>
          <li><Link to="/interview-prep" className="hover:text-[#FF6321] transition-colors no-underline">{t("footer.interviewQuestions")}</Link></li>
          <li><Link to="/salary-analyzer"className="hover:text-[#FF6321] transition-colors no-underline">{t("footer.salaryAnalyzer")}</Link></li>
        </ul>
      </div>

      <div>
        <h4 className="font-semibold text-[#1a202c] mb-6">{t("footer.company")}</h4>
        <ul className="space-y-3 text-[14px]">
          <li><Link to="/about"   className="hover:text-[#FF6321] transition-colors no-underline">{t("footer.about")}</Link></li>
          <li><Link to="/contact" className="hover:text-[#FF6321] transition-colors no-underline">{t("footer.contact")}</Link></li>
          <li><Link to="/privacy" className="hover:text-[#FF6321] transition-colors no-underline">{t("footer.privacy")}</Link></li>
          <li><Link to="/terms"   className="hover:text-[#FF6321] transition-colors no-underline">{t("footer.terms")}</Link></li>
        </ul>
      </div>
    </div>

    <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
      <div>{t("footer.copyright", { year: new Date().getFullYear() })}</div>
      <div className="flex gap-6">
        <Link to="/privacy" className="hover:text-[#1a202c] transition-colors no-underline">{t("footer.privacyShort")}</Link>
        <Link to="/terms"   className="hover:text-[#1a202c] transition-colors no-underline">{t("footer.termsShort")}</Link>
      </div>
    </div>
  </footer>
  );
};

