import { motion } from "motion/react";
import { ArrowUpRight, BookOpen, Sparkles, Clock } from "lucide-react";

export type BlogHighlightPost = {
  title: string;
  href: string;
  description?: string;
  category?: string;
  readTime?: string;
};

interface BlogHighlightsProps {
  posts: BlogHighlightPost[];
  eyebrow?: string;
  heading?: string;
  subheading?: string;
}

// Deterministic pseudo-random read time from title length (3–9 min)
function deriveReadTime(title: string) {
  const n = (title.length % 7) + 3;
  return `${n} min read`;
}

// Category inference from the slug when not provided.
function deriveCategory(href: string) {
  const slug = href.split("/").pop() || "";
  if (slug.includes("ats")) return "ATS";
  if (slug.includes("cover-letter")) return "Cover Letters";
  if (slug.includes("tailor")) return "Job Search";
  if (slug.includes("career-change")) return "Career Change";
  if (slug.includes("best-ai")) return "Tools";
  if (slug.includes("human-written")) return "AI vs. Human";
  if (slug.includes("build-resume")) return "Resume Building";
  return "Career";
}

const gradients = [
  "from-orange-500 to-rose-500",
  "from-amber-500 to-orange-600",
  "from-fuchsia-500 to-orange-500",
];

export function BlogHighlights({
  posts,
  eyebrow = "From Our Blog",
  heading = "Sharper resumes start with smarter reading",
  subheading = "Hand-picked guides from our editors — 3-minute reads that upgrade your job search.",
}: BlogHighlightsProps) {
  const [featured, ...rest] = posts;

  return (
    <section className="max-w-6xl mx-auto px-6 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-[#c2410c] text-[11px] font-bold uppercase tracking-widest mb-3">
            <Sparkles size={12} className="fill-current" />
            {eyebrow}
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#0f172a] tracking-tight leading-tight max-w-xl">
            {heading}
          </h2>
          <p className="text-[#64748b] text-sm md:text-[15px] mt-2 max-w-xl">{subheading}</p>
        </div>
        <a
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#FF6321] hover:gap-2.5 transition-all no-underline shrink-0"
        >
          View all articles <ArrowUpRight size={16} />
        </a>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-5 gap-4">
        {/* Featured */}
        {featured && (
          <motion.a
            href={featured.href}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="md:col-span-3 group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white p-7 md:p-9 min-h-[260px] flex flex-col justify-between no-underline shadow-lg shadow-slate-900/10"
          >
            {/* Decorative orbs */}
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-orange-500/40 to-transparent blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-16 w-72 h-72 rounded-full bg-gradient-to-br from-fuchsia-500/20 to-transparent blur-3xl pointer-events-none" />

            <div className="relative flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur text-[11px] font-semibold uppercase tracking-wider">
                <BookOpen size={11} /> Featured
              </span>
              <span className="text-[11px] font-medium text-white/60 uppercase tracking-wider">
                {featured.category || deriveCategory(featured.href)}
              </span>
            </div>

            <div className="relative">
              <h3 className="text-2xl md:text-[28px] font-semibold leading-tight tracking-tight mb-3 group-hover:text-orange-300 transition-colors">
                {featured.title}
              </h3>
              {featured.description && (
                <p className="text-white/70 text-sm leading-relaxed mb-4 max-w-md line-clamp-2">
                  {featured.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-white/60">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={12} /> {featured.readTime || deriveReadTime(featured.title)}
                  </span>
                </div>
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur group-hover:bg-orange-500 group-hover:scale-110 transition-all">
                  <ArrowUpRight size={16} className="text-white" />
                </span>
              </div>
            </div>
          </motion.a>
        )}

        {/* Side stack */}
        <div className="md:col-span-2 flex flex-col gap-4">
          {rest.map((post, i) => (
            <motion.a
              key={post.href}
              href={post.href}
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200/80 p-5 flex-1 flex flex-col justify-between no-underline hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5 transition-all"
            >
              {/* Accent bar */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${gradients[i % gradients.length]} opacity-70 group-hover:opacity-100 transition-opacity`}
              />
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-[#FF6321] uppercase tracking-wider">
                  {post.category || deriveCategory(post.href)}
                </span>
                <span className="text-[11px] text-slate-400 inline-flex items-center gap-1">
                  <Clock size={10} /> {post.readTime || deriveReadTime(post.title)}
                </span>
              </div>
              <h4 className="text-[15px] font-semibold text-[#0f172a] leading-snug group-hover:text-[#FF6321] transition-colors line-clamp-2">
                {post.title}
              </h4>
              <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-slate-500 group-hover:text-[#FF6321] group-hover:gap-2 transition-all">
                Read article <ArrowUpRight size={12} />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
