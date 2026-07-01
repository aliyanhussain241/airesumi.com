import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Twitter, Github, Linkedin, Instagram } from "lucide-react";
import rezumiLogo from "@/assets/ai-resumi.webp";
import rezumiLogoWhite from "@/assets/rezumi-white.webp";

const linkCls =
  "text-[14px] text-neutral-300 hover:text-[#FF6321] transition-colors no-underline";
const headCls =
  "text-[11px] font-bold tracking-[0.18em] text-[#FF6321] uppercase mb-5";

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="site-footer relative w-full bg-[#0a0a0a] py-16 px-4 sm:px-6 print:hidden overflow-hidden">
      {/* Ambient orange glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-[#FF6321]/10 blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Rounded card */}
        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-[#141010] via-[#0d0a0a] to-[#1a0f0a] p-8 sm:p-12 overflow-hidden">
          {/* Corner glows */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#FF6321]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-[#FF6321]/15 blur-3xl" />

          <div className="relative grid grid-cols-2 md:grid-cols-5 gap-10">
            {/* Brand */}
            <div className="col-span-2 space-y-5">
              <div className="flex items-center">
                <img
                  src={rezumiLogoWhite}
                  alt="airesumi - AI Resume Builder"
                  className="h-10 w-auto"
                />
              </div>
              <p className="text-[14px] leading-relaxed text-neutral-400 max-w-xs">
                {t("footer.tagline")}
              </p>
              <div className="flex gap-3 pt-1">
                {[
                  { Icon: Twitter, href: "#", label: "Twitter" },
                  { Icon: Github, href: "#", label: "GitHub" },
                  { Icon: Linkedin, href: "#", label: "LinkedIn" },
                  { Icon: Instagram, href: "#", label: "Instagram" },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-9 h-9 rounded-full bg-[#FF6321]/15 border border-[#FF6321]/30 flex items-center justify-center text-[#FF6321] hover:bg-[#FF6321] hover:text-white transition-all hover:scale-110"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className={headCls}>{t("footer.resumeTools")}</h4>
              <ul className="space-y-3">
                <li><Link to="/resume" className={linkCls}>{t("tools.resumeBuilder.name")}</Link></li>
                <li><Link to="/bullet-writer" className={linkCls}>{t("tools.bulletWriter.name")}</Link></li>
                <li><Link to="/summary-generator" className={linkCls}>{t("tools.summary.name")}</Link></li>
                <li><Link to="/keyword-scanner" className={linkCls}>{t("tools.keywordScanner.name")}</Link></li>
                <li><Link to="/ats-checker" className={linkCls}>{t("tools.atsChecker.name")}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className={headCls}>{t("footer.resources")}</h4>
              <ul className="space-y-3">
                <li><Link to="/cover-letter" className={linkCls}>{t("tools.coverLetter.name")}</Link></li>
                <li><Link to="/linkedin-bio" className={linkCls}>{t("tools.linkedinBio.name")}</Link></li>
                <li><Link to="/interview-prep" className={linkCls}>{t("footer.interviewQuestions")}</Link></li>
                <li><Link to="/salary-analyzer" className={linkCls}>{t("footer.salaryAnalyzer")}</Link></li>
                <li><Link to="/examples" className={linkCls}>{t("footer.resumeExamples")}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className={headCls}>{t("footer.company")}</h4>
              <ul className="space-y-3">
                <li><Link to="/about" className={linkCls}>{t("footer.about")}</Link></li>
                <li><Link to="/blog" className={linkCls}>{t("footer.careerBlog")}</Link></li>
                <li><Link to="/contact" className={linkCls}>{t("footer.contact")}</Link></li>
                <li><Link to="/privacy" className={linkCls}>{t("footer.privacy")}</Link></li>
                <li><Link to="/terms" className={linkCls}>{t("footer.terms")}</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright below the card */}
        <div className="relative mt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-[13px] text-neutral-500">
          <div>{t("footer.copyright", { year: new Date().getFullYear() })}</div>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-[#FF6321] transition-colors no-underline">
              {t("footer.privacyShort")}
            </Link>
            <Link to="/terms" className="hover:text-[#FF6321] transition-colors no-underline">
              {t("footer.termsShort")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
