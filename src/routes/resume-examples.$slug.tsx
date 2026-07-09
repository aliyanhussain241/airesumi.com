import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Briefcase, CheckCircle2, Lightbulb, Sparkles, Target } from "lucide-react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { getRoleExampleWithRelated, type ResumeRoleWithRelated } from "@/lib/resume-roles.functions";

function RoleExamplePage() {
  const data = Route.useLoaderData() as ResumeRoleWithRelated;
  const { slug } = Route.useParams();

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-6 text-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Role example not found</h1>
            <p className="text-[#6B7280] mb-6">We couldn't find a resume example for "{slug}".</p>
            <Link to="/resume-examples" className="inline-flex items-center gap-2 text-[#FF6321] font-semibold no-underline hover:underline">
              Browse all role examples <ArrowRight size={16} />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { role, related } = data;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Header />
      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-[#6B7280] mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-[#FF6321] no-underline">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/resume-examples" className="hover:text-[#FF6321] no-underline">Resume Examples</Link>
          <span className="mx-2">/</span>
          <span className="text-[#111827]">{role.job_title}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          {role.industry && (
            <span className="inline-block text-xs uppercase tracking-wide font-semibold text-[#FF6321] bg-[#FFF7ED] px-3 py-1 rounded-full mb-3">
              {role.industry}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-black text-[#111827] leading-tight">
            {role.job_title} Resume Example
          </h1>
          {role.intro_content && (
            <p className="mt-5 text-lg text-[#374151] leading-relaxed">{role.intro_content}</p>
          )}
        </header>

        {/* Sample bullet points */}
        {role.sample_bullet_points.length > 0 && (
          <section className="bg-white rounded-2xl p-7 shadow-sm border border-[#E5E7EB] mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Briefcase size={20} className="text-[#FF6321]" />
              <h2 className="text-2xl font-bold text-[#111827]">Sample Resume Bullet Points</h2>
            </div>
            <ul className="space-y-3">
              {role.sample_bullet_points.map((b, i) => (
                <li key={i} className="flex gap-3">
                  <CheckCircle2 size={18} className="text-green-600 flex-shrink-0 mt-1" />
                  <span className="text-[#374151] leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-5 border-t border-[#E5E7EB]">
              <Link to="/bullet-writer" className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF6321] no-underline hover:underline">
                <Sparkles size={14} /> Use our Bullet Point Writer to generate more like this
              </Link>
            </div>
          </section>
        )}

        {/* Key skills */}
        {role.key_skills.length > 0 && (
          <section className="bg-white rounded-2xl p-7 shadow-sm border border-[#E5E7EB] mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Target size={20} className="text-[#FF6321]" />
              <h2 className="text-2xl font-bold text-[#111827]">Key Skills to Include</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {role.key_skills.map((s, i) => (
                <span key={i} className="px-3 py-1.5 bg-[#F3F4F6] text-[#374151] rounded-lg text-sm font-medium">
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-6 pt-5 border-t border-[#E5E7EB]">
              <Link to="/ats-checker" className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF6321] no-underline hover:underline">
                <Target size={14} /> Check your resume's ATS score
              </Link>
            </div>
          </section>
        )}

        {/* Resume tips */}
        {role.resume_tips.length > 0 && (
          <section className="bg-white rounded-2xl p-7 shadow-sm border border-[#E5E7EB] mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={20} className="text-[#FF6321]" />
              <h2 className="text-2xl font-bold text-[#111827]">Resume Tips for {role.job_title}s</h2>
            </div>
            <div className="space-y-5">
              {role.resume_tips.map((tip, i) => (
                <div key={i}>
                  <h3 className="font-bold text-[#111827] mb-1">{tip.heading}</h3>
                  <p className="text-[#374151] leading-relaxed">{tip.content}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-gradient-to-br from-[#111827] to-[#1F2937] rounded-2xl p-8 text-center text-white mb-10">
          <h2 className="text-2xl font-bold mb-2">Build your {role.job_title} resume in 60 seconds</h2>
          <p className="text-[#9CA3AF] mb-5">AI-powered, ATS-optimized, free to start.</p>
          <Link to="/resume" className="inline-block bg-[#FF6321] hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl no-underline transition-colors">
            Start Free →
          </Link>
        </section>

        {/* Related roles */}
        {related.length > 0 && (
          <section>
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
      </motion.main>
      <Footer />
    </div>
  );
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
