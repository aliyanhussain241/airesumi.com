import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { ArrowRight, Briefcase, Filter, Search } from "lucide-react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { getPublishedRoleExamples, type ResumeRoleSummary } from "@/lib/resume-roles.functions";

function ResumeExamplesIndex() {
  const roles = Route.useLoaderData() as ResumeRoleSummary[];
  const [industry, setIndustry] = useState<string>("All");
  const [query, setQuery] = useState("");

  const industries = useMemo(() => {
    const set = new Set<string>();
    roles.forEach((r) => r.industry && set.add(r.industry));
    return ["All", ...Array.from(set).sort()];
  }, [roles]);

  const filtered = useMemo(() => {
    return roles.filter((r) => {
      if (industry !== "All" && r.industry !== industry) return false;
      if (query && !r.job_title.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [roles, industry, query]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto px-6 py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-[#111827]">Resume Examples by Role</h1>
          <p className="mt-4 text-lg text-[#6B7280] max-w-2xl mx-auto">
            Browse ATS-optimized resume examples with sample bullet points, key skills, and expert tips for each role.
          </p>
        </header>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E5E7EB] mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Search roles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:border-[#FF6321]"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} className="text-[#6B7280]" />
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => setIndustry(ind)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  industry === ind
                    ? "bg-[#FF6321] text-white"
                    : "bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB]"
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[#6B7280]">
            No role examples match your filters yet.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((r) => (
              <Link
                key={r.slug}
                to="/resume-examples/$slug"
                params={{ slug: r.slug }}
                className="group block bg-white p-6 rounded-2xl border border-[#E5E7EB] hover:border-[#FF6321] hover:shadow-md transition-all no-underline"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase size={16} className="text-[#FF6321]" />
                  {r.industry && (
                    <span className="text-[10px] uppercase tracking-wide font-semibold text-[#FF6321]">
                      {r.industry}
                    </span>
                  )}
                </div>
                <h2 className="font-bold text-lg text-[#111827] group-hover:text-[#FF6321] transition-colors">
                  {r.job_title}
                </h2>
                {r.seo_description && (
                  <p className="mt-2 text-sm text-[#6B7280] line-clamp-3">{r.seo_description}</p>
                )}
                <div className="mt-4 text-sm font-semibold text-[#FF6321] inline-flex items-center gap-1">
                  View example <ArrowRight size={13} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </motion.main>
      <Footer />
    </div>
  );
}

export const Route = createFileRoute("/resume-examples/")({
  loader: () => getPublishedRoleExamples(),
  head: () => ({
    meta: [
      { title: "Resume Examples by Job Title & Industry | Airesumi" },
      { name: "description", content: "Free ATS-optimized resume examples for every role. Sample bullet points, key skills, and expert writing tips by job title and industry." },
      { property: "og:title", content: "Resume Examples by Job Title & Industry | Airesumi" },
      { property: "og:description", content: "Free ATS-optimized resume examples by role, with bullet points, skills, and tips." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://airesumi.com/resume-examples" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Resume Examples by Job Title & Industry | Airesumi" },
      { name: "twitter:description", content: "Free ATS-optimized resume examples by role." },
    ],
    links: [{ rel: "canonical", href: "https://airesumi.com/resume-examples" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Resume Examples by Role",
          url: "https://airesumi.com/resume-examples",
        }),
      },
    ],
  }),
  errorComponent: ({ error }) => (
    <div className="p-10 text-center">
      <h1 className="text-2xl font-bold mb-2">Unable to load examples</h1>
      <p className="text-sm text-[#6B7280]">{error.message}</p>
    </div>
  ),
  component: ResumeExamplesIndex,
});
