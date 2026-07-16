import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  CheckCircle2,
  FileText,
  GraduationCap,
  MapPin,
  MessageSquare,
  Plane,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { listPkGuides, type PkGuideSummary } from "@/lib/pk-guides.functions";

const CANONICAL = "https://airesumi.com/pk";

const CATEGORY_META: Record<string, { label: string; icon: any; color: string }> = {
  resume: { label: "Resume Format", icon: FileText, color: "text-orange-600 bg-orange-50 dark:text-orange-300 dark:bg-orange-500/10" },
  portals: { label: "Job Portals", icon: Briefcase, color: "text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-500/10" },
  gulf: { label: "Gulf & Middle East", icon: Plane, color: "text-emerald-600 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-500/10" },
  fresher: { label: "Fresh Graduates", icon: GraduationCap, color: "text-purple-600 bg-purple-50 dark:text-purple-300 dark:bg-purple-500/10" },
  interview: { label: "Interview Prep", icon: MessageSquare, color: "text-pink-600 bg-pink-50 dark:text-pink-300 dark:bg-pink-500/10" },
};

const STATS = [
  { value: "50K+", label: "CVs built in Pakistan", icon: FileText },
  { value: "100%", label: "Free & ATS-safe", icon: CheckCircle2 },
  { value: "Rozee.pk", label: "Portal optimized", icon: Briefcase },
  { value: "UAE · KSA · Qatar", label: "Gulf job ready", icon: Plane },
];

const CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta"];

const EMPLOYERS = [
  "HBL", "UBL", "MCB", "Systems Ltd", "Arbisoft", "Afiniti",
  "NetSol", "Engro", "PTCL", "Jazz", "Bayt.com", "Rozee.pk",
];

const HUB_FAQS = [
  {
    q: "Are these guides really tailored to Pakistan?",
    a: "Yes. Every guide is written for the Pakistani job market — CNIC handling, father's name conventions, HEC-recognized degree formatting, Rozee.pk / Mustakbil quirks, and salary expectations in PKR. No generic Western-CV filler.",
  },
  {
    q: "Do I need to include a photo on my CV in Pakistan?",
    a: "It's still common in Pakistan and expected in the Gulf (Bayt.com, Naukrigulf). Our Resume Format guide covers exactly when to include one and when to skip it for international ATS.",
  },
  {
    q: "Is Airesumi free for Pakistani users?",
    a: "Yes — the resume builder, ATS checker and cover letter generator are free. Premium unlocks unlimited AI rewrites and Gulf-market templates.",
  },
  {
    q: "Can I apply to UAE / Saudi Arabia jobs with the same CV?",
    a: "Not without changes. The Gulf CV expects passport number, visa status, nationality and expected salary in AED/SAR. Read the Gulf guide before you send the same PDF to Dubai and Islamabad.",
  },
];

// Semantic color aliases (with dark variants)
const TXT_HEAD = "text-[#111827] dark:text-slate-100";
const TXT_BODY = "text-[#374151] dark:text-slate-300";
const TXT_MUTED = "text-[#4B5563] dark:text-slate-400";
const TXT_SUBTLE = "text-[#6B7280] dark:text-slate-400";
const CARD = "bg-white dark:bg-slate-900";
const CARD_BORDER = "border-[#E5E7EB] dark:border-slate-800";
const PAGE_BG = "bg-[#F8FAFC] dark:bg-slate-950";

function PkHubPage() {
  const guides = Route.useLoaderData() as PkGuideSummary[];
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const set = new Set(guides.map((g) => g.category));
    return ["all", ...Array.from(set)];
  }, [guides]);

  const filtered = useMemo(
    () => (activeCategory === "all" ? guides : guides.filter((g) => g.category === activeCategory)),
    [guides, activeCategory],
  );

  const featured = guides[0];
  const rest = filtered.filter((g) => activeCategory !== "all" || g.slug !== featured?.slug);

  return (
    <div className={`min-h-screen ${PAGE_BG}`}>
      {/* HERO */}
      <section className={`pt-app-header relative overflow-hidden bg-gradient-to-br from-[#FFF7ED] via-white to-[#F0FDF4] dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 border-b ${CARD_BORDER}`}>
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 relative">
          <nav className={`text-sm ${TXT_SUBTLE} mb-4`} aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#FF6321] no-underline">Home</Link>
            <span className="mx-2">/</span>
            <span className={TXT_HEAD}>Pakistan</span>
          </nav>

          <div className="grid md:grid-cols-[1fr_auto] gap-8 md:items-end">
            <div>
              <span className={`inline-flex items-center gap-1.5 text-xs uppercase tracking-wide font-semibold text-[#FF6321] ${CARD} border border-[#FF6321]/20 px-3 py-1 rounded-full mb-4 shadow-sm`}>
                <MapPin size={12} /> Pakistan Career Hub · 🇵🇰
              </span>
              <h1 className={`text-4xl md:text-6xl font-black ${TXT_HEAD} leading-[1.05] tracking-tight`}>
                Career & Resume Guides <br className="hidden md:block" />
                <span className="text-[#FF6321]">for Pakistan</span>
              </h1>
              <p className={`text-lg ${TXT_MUTED} mt-5 max-w-2xl leading-relaxed`}>
                Locally accurate resume, job portal, and interview advice for the Pakistani job market — plus
                tips for Pakistanis applying to jobs in the UAE, Saudi Arabia, Qatar and beyond.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <Link
                  to="/resume"
                  className="inline-flex items-center justify-center gap-2 bg-[#FF6321] hover:bg-orange-600 text-white font-semibold px-5 py-3 rounded-xl no-underline transition-colors shadow-sm"
                >
                  <Sparkles size={16} /> Build my CV — free
                </Link>
                <Link
                  to="/ats-checker"
                  className={`inline-flex items-center justify-center gap-2 ${CARD} hover:bg-[#F8FAFC] dark:hover:bg-slate-800 ${TXT_HEAD} font-semibold px-5 py-3 rounded-xl no-underline border ${CARD_BORDER} transition-colors`}
                >
                  Check my CV score
                </Link>
              </div>
              <div className={`flex items-center gap-2 mt-5 text-sm ${TXT_MUTED}`}>
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <span>Trusted by graduates from NUST, LUMS, FAST, COMSATS & UET</span>
              </div>
            </div>
          </div>

          {/* stat strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10">
            {STATS.map((s) => (
              <div key={s.label} className={`bg-white/80 dark:bg-slate-900/70 backdrop-blur border ${CARD_BORDER} rounded-xl p-4`}>
                <s.icon size={18} className="text-[#FF6321] mb-2" />
                <div className={`text-xl md:text-2xl font-black ${TXT_HEAD} leading-none`}>{s.value}</div>
                <div className={`text-xs ${TXT_SUBTLE} mt-1.5`}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Category filter */}
        {guides.length > 0 && categories.length > 2 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((c) => {
              const meta = c === "all" ? null : CATEGORY_META[c];
              const label = c === "all" ? "All guides" : meta?.label || c;
              const active = activeCategory === c;
              return (
                <button
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  className={`text-sm font-semibold px-4 py-2 rounded-full border transition-colors ${
                    active
                      ? "bg-[#111827] text-white border-[#111827] dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100"
                      : `${CARD} ${TXT_BODY} ${CARD_BORDER} hover:border-[#FF6321]/40`
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {guides.length === 0 ? (
          <p className={TXT_SUBTLE}>No guides published yet.</p>
        ) : (
          <>
            {/* Featured guide */}
            {activeCategory === "all" && featured && (
              <Link
                to="/pk/$slug"
                params={{ slug: featured.slug }}
                className="group block bg-gradient-to-br from-[#111827] to-[#1F2937] dark:from-slate-800 dark:to-slate-900 text-white rounded-2xl p-8 md:p-10 mb-8 no-underline relative overflow-hidden border border-transparent dark:border-slate-800"
              >
                <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#FF6321]/20 blur-3xl rounded-full" />
                <div className="relative">
                  <span className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wide font-bold text-[#FF6321] bg-[#FF6321]/10 border border-[#FF6321]/30 px-3 py-1 rounded-full mb-4">
                    <Award size={12} /> Most read
                  </span>
                  <h2 className="text-2xl md:text-4xl font-black mb-3 leading-tight max-w-3xl group-hover:text-[#FFEDD5] transition-colors">
                    {featured.title}
                  </h2>
                  {featured.subtitle && (
                    <p className="text-base md:text-lg text-white/70 max-w-2xl leading-relaxed">
                      {featured.subtitle}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF6321] mt-5">
                    Read the full guide <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            )}

            <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rest.map((g) => {
                const meta = CATEGORY_META[g.category];
                const Icon = meta?.icon || FileText;
                return (
                  <li key={g.slug}>
                    <Link
                      to="/pk/$slug"
                      params={{ slug: g.slug }}
                      className={`group block h-full ${CARD} rounded-2xl p-6 shadow-sm border ${CARD_BORDER} hover:border-[#FF6321]/40 hover:shadow-lg dark:hover:shadow-black/40 hover:-translate-y-0.5 transition-all no-underline`}
                    >
                      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-4 ${meta?.color || "text-orange-600 bg-orange-50 dark:text-orange-300 dark:bg-orange-500/10"}`}>
                        <Icon size={18} />
                      </div>
                      <span className="inline-block text-[11px] uppercase tracking-wider font-bold text-[#FF6321] mb-2">
                        {meta?.label || g.category}
                      </span>
                      <h3 className={`text-lg font-bold ${TXT_HEAD} mb-2 leading-snug group-hover:text-[#FF6321] transition-colors`}>
                        {g.title}
                      </h3>
                      {g.subtitle && (
                        <p className={`text-sm ${TXT_MUTED} mb-4 leading-relaxed line-clamp-3`}>{g.subtitle}</p>
                      )}
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF6321]">
                        Read guide <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {/* Cities */}
        <section className="mt-16">
          <div className="flex items-center gap-2 mb-4">
            <Building2 size={18} className="text-[#FF6321]" />
            <h2 className={`text-xl font-bold ${TXT_HEAD}`}>Job seekers we help across Pakistan</h2>
          </div>
          <p className={`text-sm ${TXT_SUBTLE} mb-4`}>
            Location-aware tips for candidates in every major city.
          </p>
          <div className="flex flex-wrap gap-2">
            {CITIES.map((city) => (
              <span key={city} className={`inline-flex items-center gap-1.5 text-sm font-medium ${TXT_BODY} ${CARD} border ${CARD_BORDER} px-3 py-1.5 rounded-full`}>
                <MapPin size={12} className="text-[#FF6321]" /> {city}
              </span>
            ))}
          </div>
        </section>

        {/* Employers */}
        <section className={`mt-12 ${CARD} rounded-2xl p-7 border ${CARD_BORDER}`}>
          <div className="flex items-center gap-2 mb-1">
            <Users size={18} className="text-[#FF6321]" />
            <h2 className={`text-xl font-bold ${TXT_HEAD}`}>Land roles at Pakistan's top employers</h2>
          </div>
          <p className={`text-sm ${TXT_SUBTLE} mb-5`}>
            From banking giants to software houses and Gulf portals — our guides cover what each recruiter actually looks for.
          </p>
          <div className="flex flex-wrap gap-2">
            {EMPLOYERS.map((e) => (
              <span key={e} className={`text-sm font-semibold ${TXT_HEAD} bg-[#F8FAFC] dark:bg-slate-800 border ${CARD_BORDER} px-3 py-1.5 rounded-lg`}>
                {e}
              </span>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="mt-12">
          <h2 className={`text-2xl font-bold ${TXT_HEAD} mb-5`}>Frequently asked questions</h2>
          <div className={`${CARD} rounded-2xl border ${CARD_BORDER} divide-y divide-[#E5E7EB] dark:divide-slate-800`}>
            {HUB_FAQS.map((f, i) => (
              <details key={i} className="p-5 group">
                <summary className={`cursor-pointer font-semibold ${TXT_HEAD} list-none flex justify-between items-start gap-4`}>
                  <span>{f.q}</span>
                  <span className="text-[#FF6321] text-xl leading-none group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className={`${TXT_MUTED} leading-relaxed mt-3`}>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-12 bg-gradient-to-br from-[#FFF7ED] via-white to-[#FEF2F2] dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 rounded-2xl p-8 md:p-10 border border-[#FF6321]/20 flex flex-col md:flex-row md:items-center gap-5 md:justify-between">
          <div>
            <h2 className={`text-2xl md:text-3xl font-black ${TXT_HEAD}`}>Ready to build your CV?</h2>
            <p className={`${TXT_MUTED} mt-2 max-w-xl`}>
              Free ATS-safe templates tuned for Rozee.pk, Bayt.com and Pakistani HR. Takes about 6 minutes.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/resume"
              className="inline-flex items-center justify-center gap-2 bg-[#FF6321] hover:bg-orange-600 text-white font-semibold px-6 py-3.5 rounded-xl no-underline transition-colors shadow-sm whitespace-nowrap"
            >
              <Sparkles size={16} /> Start free
            </Link>
            <Link
              to="/resume-examples"
              className={`inline-flex items-center justify-center gap-2 ${CARD} hover:bg-[#F8FAFC] dark:hover:bg-slate-800 ${TXT_HEAD} font-semibold px-6 py-3.5 rounded-xl no-underline border ${CARD_BORDER} transition-colors whitespace-nowrap`}
            >
              Browse examples
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/pk/")({
  loader: () => listPkGuides(),
  head: () => {
    const title = "Career & Resume Guides for Pakistan | Airesumi";
    const description =
      "Locally accurate resume, job portal (Rozee.pk), interview and Gulf job guides for the Pakistani job market.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: CANONICAL },
        { property: "og:locale", content: "en_PK" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: CANONICAL }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://airesumi.com/" },
              { "@type": "ListItem", position: 2, name: "Pakistan", item: CANONICAL },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: HUB_FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
      ],
    };
  },
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-sm text-slate-500">{error.message}</p>
      </div>
    </div>
  ),
  notFoundComponent: () => <div className="p-10 text-center">Page not found.</div>,
  component: PkHubPage,
});
