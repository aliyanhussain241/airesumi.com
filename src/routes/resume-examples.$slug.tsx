import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  Target,
  FileText,
  Copy,
  Check,
  Share2,
  MessageSquare,
  DollarSign,
  Search,
  Clock,
  ShieldCheck,
  ListChecks,
  HelpCircle,
} from "lucide-react";

import { getRoleExampleWithRelated, type ResumeRoleWithRelated } from "@/lib/resume-roles.functions";
import { AdBanner } from "@/app/components/AdBanner";

function RoleExamplePage() {
  const data = Route.useLoaderData() as ResumeRoleWithRelated;
  const { slug } = Route.useParams();
  const [copied, setCopied] = useState<number | null>(null);
  const [shared, setShared] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      setProgress(total > 0 ? Math.min(100, (h.scrollTop / total) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const faqs = useMemo(() => {
    if (!data) return [];
    return buildFaqList(
      data.role.job_title,
      data.role.key_skills?.[0],
      data.role.industry,
      data.role.role_faqs,
    );
  }, [data]);


  if (!data) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center p-6 text-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Role example not found</h1>
            <p className="text-[#6B7280] mb-6">We couldn't find a resume example for "{slug}".</p>
            <Link to="/resume-examples" className="inline-flex items-center gap-2 text-[#FF6321] font-semibold no-underline hover:underline">
              Browse all role examples <ArrowRight size={16} />
            </Link>
          </div>
        </main>
        
      </div>
    );
  }

  const { role, related } = data;

  const copyBullet = async (text: string, i: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(i);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  };

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: `${role.job_title} Resume Example`, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 1500);
      }
    } catch {}
  };

  const readMinutes = Math.max(
    3,
    Math.round(
      ((role.intro_content?.length || 0) +
        role.sample_bullet_points.join(" ").length +
        role.resume_tips.map((t) => t.heading + t.content).join(" ").length) /
        1000,
    ),
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Reading progress */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-transparent">
        <div className="h-full bg-[#FF6321] transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>


      {/* Hero */}
      <section className="pt-app-header bg-gradient-to-br from-[#FFF7ED] via-white to-[#F8FAFC] border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-6 py-8 md:py-12">
          <nav className="text-sm text-[#6B7280] mb-5" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#FF6321] no-underline">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/resume-examples" className="hover:text-[#FF6321] no-underline">Resume Examples</Link>
            <span className="mx-2">/</span>
            <span className="text-[#111827]">{role.job_title}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              {role.industry && (
                <span className="inline-block text-xs uppercase tracking-wide font-semibold text-[#FF6321] bg-white border border-[#FF6321]/20 px-3 py-1 rounded-full mb-3">
                  {role.industry}
                </span>
              )}
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-black text-[#111827] leading-tight tracking-tight"
              >
                {role.job_title} Resume Example
              </motion.h1>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-[#4B5563]">
                <span className="inline-flex items-center gap-1.5"><Clock size={14} className="text-[#FF6321]" /> {readMinutes} min read</span>
                <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} className="text-green-600" /> ATS-optimized</span>
                <span className="inline-flex items-center gap-1.5"><FileText size={14} className="text-[#FF6321]" /> Free template</span>
                <button
                  onClick={share}
                  className="inline-flex items-center gap-1.5 hover:text-[#FF6321] transition-colors"
                  aria-label="Share this page"
                >
                  {shared ? <Check size={14} className="text-green-600" /> : <Share2 size={14} />}
                  {shared ? "Link copied" : "Share"}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/resume"
                
                className="inline-flex items-center justify-center gap-2 bg-[#FF6321] hover:bg-orange-600 text-white font-semibold px-5 py-3 rounded-xl no-underline transition-colors shadow-sm"
              >
                <Sparkles size={16} /> Use This Template
              </Link>
              <Link
                to="/ats-resume-checker"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-[#F3F4F6] text-[#111827] font-semibold px-5 py-3 rounded-xl no-underline transition-colors border border-[#E5E7EB]"
              >
                <Target size={16} /> Check ATS Score
              </Link>
            </div>
          </div>
        </div>
      </section>

      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-[1fr_260px] gap-10">
          {/* Main column */}
          <div className="min-w-0">
            {role.intro_content && (
              <section id="overview" className="mb-8">
                <p className="text-lg text-[#374151] leading-relaxed">{role.intro_content}</p>
              </section>
            )}

            {/* Sample bullet points */}
            {role.sample_bullet_points.length > 0 && (
              <section id="bullets" className="bg-white rounded-2xl p-7 shadow-sm border border-[#E5E7EB] mb-8 scroll-mt-24">
                <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Briefcase size={20} className="text-[#FF6321]" />
                    <h2 className="text-2xl font-bold text-[#111827]">Sample Bullet Points</h2>
                  </div>
                  <span className="text-xs text-[#6B7280]">Click any bullet to copy</span>
                </div>
                <ul className="space-y-3">
                  {role.sample_bullet_points.map((b, i) => (
                    <li key={i}>
                      <button
                        onClick={() => copyBullet(b, i)}
                        className="w-full text-left flex gap-3 p-3 -m-3 rounded-lg hover:bg-[#FFF7ED] transition-colors group"
                      >
                        <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-1" />
                        <span className="text-[#374151] leading-relaxed flex-1">{b}</span>
                        <span className="flex-shrink-0 text-[#9CA3AF] group-hover:text-[#FF6321] mt-1">
                          {copied === i ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-5 border-t border-[#E5E7EB] flex flex-wrap gap-4">
                  <Link to="/bullet-writer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF6321] no-underline hover:underline">
                    <Sparkles size={14} /> Generate more with our Bullet Writer
                  </Link>
                  <Link to="/resume-score" className="inline-flex items-center gap-2 text-sm font-semibold text-[#111827] no-underline hover:underline">
                    <ListChecks size={14} /> Score my bullets
                  </Link>
                </div>
              </section>
            )}

            {/* Key skills */}
            {role.key_skills.length > 0 && (
              <section id="skills" className="bg-white rounded-2xl p-7 shadow-sm border border-[#E5E7EB] mb-8 scroll-mt-24">
                <div className="flex items-center gap-2 mb-2">
                  <Target size={20} className="text-[#FF6321]" />
                  <h2 className="text-2xl font-bold text-[#111827]">Key Skills to Include</h2>
                </div>
                <p className="text-sm text-[#6B7280] mb-4">Mix hard tools with role-specific outcomes. Match these against the job description you're applying to.</p>
                <div className="flex flex-wrap gap-2">
                  {role.key_skills.map((s, i) => (
                    <span key={i} className="px-3 py-1.5 bg-[#F3F4F6] hover:bg-[#FFF7ED] text-[#374151] rounded-lg text-sm font-medium transition-colors border border-transparent hover:border-[#FF6321]/20">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-6 pt-5 border-t border-[#E5E7EB]">
                  <Link to="/keyword-scanner" className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF6321] no-underline hover:underline">
                    <Search size={14} /> Scan a job posting for missing keywords
                  </Link>
                </div>
              </section>
            )}

            {/* Resume tips */}
            {role.resume_tips.length > 0 && (
              <section id="tips" className="bg-white rounded-2xl p-7 shadow-sm border border-[#E5E7EB] mb-8 scroll-mt-24">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb size={20} className="text-[#FF6321]" />
                  <h2 className="text-2xl font-bold text-[#111827]">Writing Tips for {role.job_title}s</h2>
                </div>
                <div className="space-y-6">
                  {role.resume_tips.map((tip, i) => (
                    <div key={i} className="relative pl-11">
                      <div className="absolute left-0 top-0 w-8 h-8 rounded-lg bg-[#FFF7ED] text-[#FF6321] font-bold flex items-center justify-center text-sm">
                        {i + 1}
                      </div>
                      <h3 className="font-bold text-[#111827] mb-1">{tip.heading}</h3>
                      <p className="text-[#374151] leading-relaxed">{tip.content}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Cross-tool grid */}
            <section id="next" className="mb-8 scroll-mt-24">
              <h2 className="text-2xl font-bold text-[#111827] mb-4">Next steps for your {role.job_title} application</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { to: "/cover-letter", icon: FileText, title: "Write a matching cover letter", desc: "Tailored to this role in 30 seconds." },
                  { to: "/interview-prep", icon: MessageSquare, title: "Practice interview questions", desc: `Behavioral + technical prompts for ${role.job_title}s.` },
                  { to: "/salary-analyzer", icon: DollarSign, title: "Benchmark your salary", desc: "Know what to ask for before the offer call." },
                  { to: "/linkedin-bio", icon: Sparkles, title: "Rewrite your LinkedIn bio", desc: "Recruiter-magnet headline & About section." },
                ].map((c) => (
                  <Link
                    key={c.to}
                    to={c.to}
                    className="group bg-white p-5 rounded-xl border border-[#E5E7EB] hover:border-[#FF6321] hover:shadow-md transition-all no-underline flex gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#FFF7ED] text-[#FF6321] flex items-center justify-center flex-shrink-0">
                      <c.icon size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-[#111827] group-hover:text-[#FF6321] transition-colors">{c.title}</div>
                      <div className="text-sm text-[#6B7280]">{c.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-br from-[#111827] to-[#1F2937] rounded-2xl p-8 text-center text-white mb-10">
              <h2 className="text-2xl font-bold mb-2">Build your {role.job_title} resume in 60 seconds</h2>
              <p className="text-[#9CA3AF] mb-5">AI-powered, ATS-optimized, free to start.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Link
                  to="/resume"
                  
                  className="inline-block bg-[#FF6321] hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl no-underline transition-colors w-full sm:w-auto"
                >
                  Edit This Template →
                </Link>
                <Link to="/resume" className="inline-block bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-3 rounded-xl no-underline transition-colors w-full sm:w-auto">
                  Start From Scratch
                </Link>
              </div>
            </section>

            {/* In-content ad */}
            <AdBanner variant="medium-rectangle" className="!my-10" />

            {/* FAQ */}
            <section id="faq" className="bg-white rounded-2xl p-7 shadow-sm border border-[#E5E7EB] mb-10 scroll-mt-24">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle size={20} className="text-[#FF6321]" />
                <h2 className="text-2xl font-bold text-[#111827]">Frequently Asked Questions</h2>
              </div>
              <div className="divide-y divide-[#E5E7EB]">
                {faqs.map((f, i) => (
                  <details key={i} className="group py-4">
                    <summary className="cursor-pointer list-none flex items-start justify-between gap-4 font-semibold text-[#111827]">
                      <span>{f.q}</span>
                      <span className="text-[#FF6321] text-xl leading-none group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <p className="mt-2 text-[#374151] leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>

            {/* Related roles */}
            {related.length > 0 && (
              <section id="related" className="scroll-mt-24">
                <h2 className="text-2xl font-bold text-[#111827] mb-5">Related Roles</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      to="/resume-examples/$slug"
                      params={{ slug: r.slug }}
                      className="block bg-white p-5 rounded-xl border border-[#E5E7EB] hover:border-[#FF6321] hover:shadow-md transition-all no-underline"
                    >
                      {r.industry && (
                        <span className="text-[10px] uppercase tracking-wide font-semibold text-[#FF6321]">{r.industry}</span>
                      )}
                      <h3 className="mt-1 font-bold text-[#111827]">{r.job_title}</h3>
                      {r.seo_description && (
                        <p className="mt-1 text-xs text-[#6B7280] line-clamp-2">{r.seo_description}</p>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
                <div className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-3">On this page</div>
                <nav className="flex flex-col gap-2 text-sm">
                  {[
                    { href: "#overview", label: "Overview" },
                    { href: "#bullets", label: "Sample bullets" },
                    { href: "#skills", label: "Key skills" },
                    { href: "#tips", label: "Writing tips" },
                    { href: "#next", label: "Next steps" },
                    { href: "#faq", label: "FAQ" },
                    ...(related.length ? [{ href: "#related", label: "Related roles" }] : []),
                  ].map((l) => (
                    <a key={l.href} href={l.href} className="text-[#374151] hover:text-[#FF6321] no-underline">
                      {l.label}
                    </a>
                  ))}
                </nav>
              </div>
              <div className="bg-gradient-to-br from-[#FFF7ED] to-white border border-[#FF6321]/20 rounded-xl p-5">
                <div className="text-sm font-bold text-[#111827] mb-1">Ready to apply?</div>
                <p className="text-xs text-[#6B7280] mb-3">Fill this template with your details — free, no sign-up needed.</p>
                <Link
                  to="/resume"
                  
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF6321] no-underline hover:underline"
                >
                  Use template <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </motion.main>
    </div>
  );
}

// Build FAQ JSON-LD for a given role (kept in sync with in-page FAQ copy)
function buildFaqSchema(jobTitle: string, topSkill?: string | null, industry?: string | null) {
  const faqs = [
    {
      q: `How long should a ${jobTitle} resume be?`,
      a: `One page if you have under 8 years of experience, two pages if you're senior or have deep specialization. Recruiters spend under 30 seconds on the first pass — density beats length.`,
    },
    {
      q: `Do I need a summary at the top of my ${jobTitle} resume?`,
      a: `Yes. A 2–3 line summary that names your role, years of experience, and one measurable win outperforms a generic objective. It's the first thing both the ATS and the recruiter read.`,
    },
    {
      q: `Which skills should a ${jobTitle} highlight?`,
      a: `Lead with the tools and metrics from the job description you're targeting. Use the key skills list above as a starting point, then cross-check with our Keyword Scanner against the specific posting.`,
    },
    {
      q: `Is this ${jobTitle} template ATS-friendly?`,
      a: `Yes — single-column, standard section headings, no images, tables, or text boxes. It parses cleanly in Workday, Greenhouse, Lever, Taleo, and iCIMS.`,
    },
  ];
  if (topSkill) {
    faqs.push({
      q: `What's the most important skill on a ${jobTitle} resume?`,
      a: industry
        ? `${topSkill}. It's the first thing recruiters and ATS filters scan for in ${industry} roles — pair it with a quantified bullet that proves you've actually used it, not just listed it.`
        : `${topSkill}. Recruiters and ATS filters scan for it first — pair it with a quantified bullet that proves you've actually used it, not just listed it.`,
    });
  }
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export const Route = createFileRoute("/resume-examples/$slug")({
  loader: async ({ params }) => {
    const data = await getRoleExampleWithRelated({ data: { slug: params.slug } });
    return data;
  },
  head: ({ params, loaderData }) => {
    const slug = params.slug;
    const role = loaderData?.role ?? null;
    const url = `https://airesumi.com/resume-examples/${slug}`;
    if (!role) {
      return {
        meta: [
          { title: "Role example not found | Airesumi" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = role.seo_title || `${role.job_title} Resume Example & Writing Tips | Airesumi`;
    const description =
      role.seo_description ||
      `Free ${role.job_title} resume example with sample bullet points, key skills, and ATS-friendly writing tips.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            description,
            url,
            author: { "@type": "Organization", name: "Airesumi" },
            publisher: { "@type": "Organization", name: "Airesumi" },
            datePublished: role.created_at,
            dateModified: role.updated_at,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://airesumi.com/" },
              { "@type": "ListItem", position: 2, name: "Resume Examples", item: "https://airesumi.com/resume-examples" },
              { "@type": "ListItem", position: 3, name: role.job_title, item: url },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(buildFaqSchema(role.job_title, role.key_skills?.[0], role.industry)),
        },
      ],
    };
  },
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-sm text-[#6B7280]">{error.message}</p>
      </div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="p-10 text-center">Role example not found.</div>
  ),
  component: RoleExamplePage,
});
