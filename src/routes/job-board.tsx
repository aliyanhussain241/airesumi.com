import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Search, MapPin, Briefcase, Building2, DollarSign, Lock, ExternalLink, Sparkles } from "lucide-react";
import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { supabase } from "@/integrations/supabase/client";

type Job = {
  id?: string;
  title: string;
  company: string;
  location?: string;
  salary_min?: number;
  salary_max?: number;
  description?: string;
  url: string;
  posted_at?: string;
};

function checkPremium(): boolean {
  // Placeholder — always false for now
  return false;
}

function timeAgo(dateStr?: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const secs = Math.floor((Date.now() - d.getTime()) / 1000);
  if (secs < 60) return "just now";
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

function formatSalary(min?: number, max?: number): string | null {
  if (!min && !max) return null;
  const fmt = (n: number) => `$${n.toLocaleString()}`;
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  if (min) return `${fmt(min)}+`;
  return fmt(max!);
}

function JobSkeleton() {
  return (
    <div className="liquid-card rounded-2xl p-6 border border-neutral-200 bg-white animate-pulse">
      <div className="h-5 w-2/3 bg-neutral-200 rounded mb-3" />
      <div className="h-4 w-1/3 bg-neutral-200 rounded mb-4" />
      <div className="h-3 w-full bg-neutral-100 rounded mb-2" />
      <div className="h-3 w-5/6 bg-neutral-100 rounded mb-4" />
      <div className="h-9 w-28 bg-neutral-200 rounded-lg" />
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  const salary = formatSalary(job.salary_min, job.salary_max);
  const excerpt = job.description ? job.description.slice(0, 150) + (job.description.length > 150 ? "…" : "") : "";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="liquid-card rounded-2xl p-6 border border-neutral-200 bg-white hover:border-[#FF6321]/40 hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between gap-4 mb-2">
        <h3 className="text-lg font-bold text-[#1a202c] leading-tight">{job.title}</h3>
        {job.posted_at && (
          <span className="text-[12px] text-neutral-500 whitespace-nowrap">{timeAgo(job.posted_at)}</span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[14px] text-neutral-600 mb-3">
        <span className="inline-flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" />{job.company}</span>
        {job.location && (
          <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{job.location}</span>
        )}
        {salary && (
          <span className="inline-flex items-center gap-1.5 text-[#EA580C] font-semibold">
            <DollarSign className="w-3.5 h-3.5" />{salary}
          </span>
        )}
      </div>
      {excerpt && <p className="text-[14px] text-neutral-600 leading-relaxed mb-4">{excerpt}</p>}
      <a
        href={job.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-[#FF6321] hover:bg-[#EA580C] text-white font-semibold text-[14px] px-4 py-2 rounded-lg transition-colors"
      >
        Apply Now <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </motion.div>
  );
}

function JobBoardPage() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPremium = checkPremium();

  async function runSearch(nextPage: number, append: boolean) {
    if (append) setLoadingMore(true);
    else setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke("job-search", {
        body: { keyword, location, page: nextPage },
      });
      if (error) throw error;
      const newJobs: Job[] = (data?.jobs || []) as Job[];
      const count: number = data?.count ?? newJobs.length;
      setJobs((prev) => (append ? [...prev, ...newJobs] : newJobs));
      setPage(nextPage);
      setHasMore(newJobs.length > 0 && (append ? jobs.length + newJobs.length : newJobs.length) < count);
    } catch (e: any) {
      setError(e?.message || "Something went wrong. Please try again.");
      if (!append) setJobs([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setHasSearched(true);
    runSearch(1, false);
  }

  const visibleJobs = !isPremium && jobs.length > 3 ? jobs.slice(0, 3) : jobs;
  const lockedJobs = !isPremium && jobs.length > 3 ? jobs.slice(3) : [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden pt-28 pb-12 px-4">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-[#FF6321]/10 blur-[120px]" />
          </div>
          <div className="relative max-w-4xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 bg-[#FF6321]/10 border border-[#FF6321]/30 text-[#EA580C] text-[12px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full mb-5">
              <Sparkles className="w-3.5 h-3.5" /> Premium Feature
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#1a202c] mb-4 tracking-tight">
              Job Board — Every Job Site, One Search
            </h1>
            <p className="text-[17px] text-[#4a5568] max-w-2xl mx-auto leading-relaxed">
              We scan the entire internet every day so you don't have to check ten different job boards. Search once, see everything.
            </p>
          </div>
        </section>

        {/* Search */}
        <section className="px-4 pb-8">
          <form onSubmit={onSubmit} className="max-w-4xl mx-auto liquid-card rounded-2xl p-4 sm:p-5 border border-neutral-200 bg-white shadow-sm">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. Software Engineer"
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-neutral-200 focus:border-[#FF6321] focus:ring-2 focus:ring-[#FF6321]/20 outline-none text-[15px] bg-white text-[#1a202c]"
                />
              </div>
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. New York, NY"
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-neutral-200 focus:border-[#FF6321] focus:ring-2 focus:ring-[#FF6321]/20 outline-none text-[15px] bg-white text-[#1a202c]"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 bg-[#FF6321] hover:bg-[#EA580C] disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                <Search className="w-4 h-4" /> Search
              </button>
            </div>
          </form>
        </section>

        {/* Results */}
        <section className="px-4 pb-20">
          <div className="max-w-4xl mx-auto">
            {loading && (
              <div className="grid gap-4">
                {Array.from({ length: 4 }).map((_, i) => <JobSkeleton key={i} />)}
              </div>
            )}

            {!loading && error && (
              <div className="text-center text-red-600 py-10">{error}</div>
            )}

            {!loading && !error && hasSearched && jobs.length === 0 && (
              <div className="text-center py-16">
                <p className="text-[16px] text-[#4a5568]">No jobs found, try a different search</p>
              </div>
            )}

            {!loading && !error && jobs.length > 0 && (
              <>
                <div className="grid gap-4">
                  {visibleJobs.map((job, i) => <JobCard key={job.id || `${job.url}-${i}`} job={job} />)}
                </div>

                {lockedJobs.length > 0 && (
                  <div className="relative mt-4">
                    <div className="grid gap-4 filter blur-sm pointer-events-none select-none">
                      {lockedJobs.slice(0, 3).map((job, i) => <JobCard key={`locked-${i}`} job={job} />)}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="liquid-card rounded-2xl p-8 border border-[#FF6321]/30 bg-white/95 shadow-xl text-center max-w-md mx-auto">
                        <div className="w-12 h-12 rounded-full bg-[#FF6321]/10 border border-[#FF6321]/30 flex items-center justify-center mx-auto mb-3">
                          <Lock className="w-5 h-5 text-[#FF6321]" />
                        </div>
                        <p className="font-bold text-[#1a202c] text-[17px] mb-2">
                          Unlock all job listings with Premium
                        </p>
                        <p className="text-[14px] text-[#4a5568] mb-4">
                          {jobs.length - 3}+ more matching jobs available
                        </p>
                        <a
                          href="/premium"
                          className="inline-flex items-center gap-2 bg-[#FF6321] hover:bg-[#EA580C] text-white font-semibold px-5 py-2.5 rounded-lg transition-colors"
                        >
                          Upgrade to Premium
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {isPremium && hasMore && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => runSearch(page + 1, true)}
                      disabled={loadingMore}
                      className="inline-flex items-center gap-2 bg-white border border-[#FF6321]/30 text-[#EA580C] hover:bg-[#FF6321]/5 font-semibold px-6 py-3 rounded-xl transition-colors disabled:opacity-60"
                    >
                      {loadingMore ? "Loading…" : "Load more"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export const Route = createFileRoute("/job-board")({
  head: () => ({
    meta: [
      { title: "Job Board — Search Every Job Site in One Place | Airesumi" },
      { name: "description", content: "Search thousands of live job listings from across the internet in one place. Updated daily. Free preview, unlock full access with Premium." },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Job Board — Search Every Job Site in One Place | Airesumi" },
      { property: "og:description", content: "Search thousands of live job listings from across the internet in one place. Updated daily." },
      { property: "og:url", content: "https://airesumi.com/job-board" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://airesumi.com/job-board" }],
  }),
  component: JobBoardPage,
});
