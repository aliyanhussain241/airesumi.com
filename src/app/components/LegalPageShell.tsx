import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import {
  Search,
  Printer,
  Link2,
  Mail,
  ArrowUp,
  ShieldCheck,
  ScrollText,
  Calendar,
  CheckCircle2,
} from "lucide-react";

export type TocItem = { id: string; label: string };

type Props = {
  kind: "privacy" | "terms";
  title: string;
  subtitle: string;
  lastUpdated: string;
  effective?: string;
  plainEnglish: string;
  toc: TocItem[];
  children: React.ReactNode;
};

export const LegalPageShell: React.FC<Props> = ({
  kind,
  title,
  subtitle,
  lastUpdated,
  effective,
  plainEnglish,
  toc,
  children,
}) => {
  const [activeId, setActiveId] = useState<string>(toc[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [showTop, setShowTop] = useState(false);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.2 });

  // Scroll-spy
  useEffect(() => {
    const els = toc
      .map((t) => document.getElementById(t.id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [toc]);

  // Back-to-top visibility
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filteredToc = useMemo(() => {
    if (!query.trim()) return toc;
    const q = query.toLowerCase();
    return toc.filter((t) => t.label.toLowerCase().includes(q));
  }, [toc, query]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const Icon = kind === "privacy" ? ShieldCheck : ScrollText;
  const eyebrow = kind === "privacy" ? "Privacy Policy" : "Terms of Service";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-[#FF6321] selection:text-white pb-24 pt-[88px] print:pt-4 print:pb-0">
      {/* Reading progress bar */}
      <motion.div
        style={{ scaleX: progress }}
        className="fixed top-[68px] left-0 right-0 h-[3px] origin-left bg-gradient-to-r from-[#FF6321] via-orange-500 to-amber-400 z-40 print:hidden"
      />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/60 print:border-0">
        <div className="absolute inset-0 -z-10 opacity-[0.55] dark:opacity-30 print:hidden">
          <div className="absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-orange-300/40 blur-3xl" />
          <div className="absolute -top-20 right-0 h-[360px] w-[360px] rounded-full bg-amber-200/50 blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,hsl(var(--background)))]" />
        </div>

        <div className="max-w-6xl mx-auto px-6 pt-14 pb-12 print:py-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-sm font-semibold tracking-wide text-[#FF6321] mb-5"
          >
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-2xl bg-[#FF6321]/10 ring-1 ring-[#FF6321]/20">
              <Icon className="w-4.5 h-4.5" size={18} />
            </span>
            <span className="uppercase">{eyebrow}</span>
            <span className="text-muted-foreground font-normal">· Legal</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance max-w-4xl"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-5 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl text-pretty"
          >
            {subtitle}
          </motion.p>

          {/* Meta + Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 flex flex-wrap items-center gap-3 print:hidden"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-muted text-foreground/80 ring-1 ring-border">
              <Calendar size={13} /> Updated {lastUpdated}
            </span>
            {effective && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FF6321]/10 text-[#FF6321] ring-1 ring-[#FF6321]/20">
                Effective {effective}
              </span>
            )}
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20">
              <CheckCircle2 size={13} /> GDPR · CCPA aware
            </span>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-background ring-1 ring-border hover:ring-[#FF6321]/40 hover:text-[#FF6321] transition-all"
              >
                <Printer size={15} /> Print / PDF
              </button>
              <button
                onClick={copyLink}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-background ring-1 ring-border hover:ring-[#FF6321]/40 hover:text-[#FF6321] transition-all"
              >
                <Link2 size={15} /> {copied ? "Copied!" : "Copy link"}
              </button>
              <a
                href="mailto:info@airesumi.com"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-[#FF6321] text-white hover:bg-orange-600 transition-colors no-underline"
              >
                <Mail size={15} /> Contact legal
              </a>
            </div>
          </motion.div>

          {/* Plain-English callout */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 relative rounded-2xl p-[1px] bg-gradient-to-br from-[#FF6321]/40 via-amber-300/30 to-transparent"
          >
            <div className="rounded-2xl bg-card/80 backdrop-blur px-6 py-5 ring-1 ring-border/60">
              <div className="text-[11px] font-bold tracking-[0.18em] text-[#FF6321] uppercase mb-1.5">
                Plain English
              </div>
              <p className="text-[15px] md:text-base leading-relaxed text-foreground/90 m-0">
                {plainEnglish}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* BODY */}
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[260px_minmax(0,1fr)] gap-10 lg:gap-14 pt-12">
        {/* SIDEBAR */}
        <aside className="hidden md:block print:hidden">
          <div className="sticky top-[100px] space-y-4">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sections…"
                className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-muted/50 border border-border focus:outline-none focus:ring-2 focus:ring-[#FF6321]/40 focus:border-[#FF6321]/40 transition-all"
              />
            </div>

            <nav aria-label="Table of contents" className="space-y-1">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground mb-3 px-2">
                On this page
              </h3>
              {filteredToc.length === 0 && (
                <div className="text-xs text-muted-foreground px-2 py-3">No sections match.</div>
              )}
              {filteredToc.map((item) => {
                const active = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`group w-full text-left text-[13px] leading-snug rounded-lg px-3 py-2 transition-all flex items-start gap-2 ${
                      active
                        ? "bg-[#FF6321]/10 text-[#FF6321] font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <span
                      className={`mt-1.5 inline-block h-1.5 w-1.5 rounded-full transition-all ${
                        active ? "bg-[#FF6321] scale-110" : "bg-muted-foreground/40 group-hover:bg-foreground/60"
                      }`}
                    />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-6 rounded-xl bg-muted/40 border border-border p-4 text-xs text-muted-foreground leading-relaxed">
              <div className="font-semibold text-foreground mb-1">Need clarification?</div>
              Email{" "}
              <a href="mailto:info@airesumi.com" className="text-[#FF6321] font-semibold no-underline">
                info@airesumi.com
              </a>{" "}
              — we respond within 5 business days.
            </div>
          </div>
        </aside>

        {/* CONTENT */}
        <article
          ref={contentRef}
          className="legal-prose prose prose-neutral dark:prose-invert max-w-none
            prose-headings:scroll-mt-32 prose-headings:tracking-tight
            prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-0 prose-h2:mb-4
            prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-2
            prose-p:leading-relaxed prose-p:text-foreground/80
            prose-li:text-foreground/80 prose-li:leading-relaxed
            prose-strong:text-foreground prose-strong:font-semibold
            prose-a:text-[#FF6321] prose-a:no-underline hover:prose-a:underline
            prose-ul:my-3"
        >
          {children}
        </article>
      </div>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-[#FF6321] text-white shadow-lg shadow-orange-500/30 flex items-center justify-center transition-all print:hidden ${
          showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
        } hover:scale-105`}
      >
        <ArrowUp size={18} />
      </button>
    </div>
  );
};
