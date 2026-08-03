import { Link } from "@tanstack/react-router";
import { ArrowRight, Gauge, Scale, HelpCircle } from "lucide-react";

/** Slug of the post these enhancements apply to. Scoped intentionally. */
export const ATS_SCORE_SLUG = "ats-resume-checker-what-score-do-you-need";

export const ATS_SCORE_SEO_TITLE =
  "What Is a Good ATS Score? The 70–85% Range Explained (2026)";
export const ATS_SCORE_SEO_DESCRIPTION =
  "A good ATS score is generally 70–85%, depending on the tool and job description. See what each score band means, why scanners disagree, and whether 78 is good.";

export const ATS_SCORE_FAQS: { q: string; a: string }[] = [
  {
    q: "Is 78 a good ATS score?",
    a: "Yes — 78% sits inside the 70–85% range most tools and employers treat as competitive. At that level your resume is generally clearing keyword-match filters and reaching a human reviewer. Because scanners score differently, the same resume could read as 70 on one tool and 85 on another, so treat 78 as \"in a good range\" rather than an exact grade. If you are applying to a very competitive, high-volume role, closing a few of the flagged keyword gaps is still worth the effort.",
  },
  {
    q: "What is the minimum ATS score to get shortlisted?",
    a: "There is no single published threshold, because each employer and each scanner sets its own. As a practical baseline, aim for 70% or above on whichever checker you use, and higher for competitive roles at large companies. Below roughly 50–60%, the usual cause is formatting or missing keywords rather than a weak background. Shortlisting is ultimately a human decision — the score only decides whether your resume gets that far.",
  },
  {
    q: "What does my ATS score number actually mean?",
    a: "It is a measure of how closely your resume matches one specific job description — mostly keyword and section overlap — not a rating of your career. Different tools weight those signals differently, so the number is a directional signal, not a fixed grade. Use it to spot missing keywords and parsing problems, and watch the trend as you edit. A rising score against the exact job description you are applying to is the useful signal.",
  },
];

export const ATS_SCORE_FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: ATS_SCORE_FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const BANDS: { range: string; label: string; meaning: string; color: string; bar: string }[] = [
  {
    range: "Below 50",
    label: "High rejection risk",
    meaning: "Usually a formatting or parsing problem, not a weak background — fix layout and section headers first.",
    color: "text-red-600",
    bar: "bg-red-500 w-[22%]",
  },
  {
    range: "50–70",
    label: "Borderline",
    meaning: "Readable, but keyword coverage is thin. Add the exact skills and tools named in the job description.",
    color: "text-amber-600",
    bar: "bg-amber-500 w-[48%]",
  },
  {
    range: "70–85",
    label: "Competitive",
    meaning: "The range most checkers and employers treat as a pass. Fine-tune keywords and quantify your bullets.",
    color: "text-green-600",
    bar: "bg-green-500 w-[74%]",
  },
  {
    range: "85+",
    label: "Strong — watch for stuffing",
    meaning: "Stop chasing the number. Extra keywords past this point often hurt readability for the human reviewer.",
    color: "text-emerald-700",
    bar: "bg-emerald-600 w-[93%]",
  },
];

/** Snippet-friendly direct answer + variance explanation + score band table. */
export function AtsScoreDirectAnswer() {
  return (
    <section className="mb-10">
      <div className="rounded-2xl border border-[#FF6321]/30 bg-gradient-to-r from-[#FFF7ED] to-orange-50 p-6 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Gauge size={16} className="text-[#FF6321]" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#EA580C]">
            Short answer
          </span>
        </div>
        <p className="text-[17px] leading-relaxed text-[#111827]">
          <strong>
            A good ATS score is generally in the 70–85% range, depending on which
            checker you use and how closely the job description matches your
            experience.
          </strong>{" "}
          Anything above 70% is usually treated as competitive, and above 85% the
          extra points stop helping — but no single number is universal, because
          every scanner calculates it differently.
        </p>
      </div>

      <h2
        id="why-ats-scores-vary-so-much"
        className="text-2xl font-bold mt-10 mb-4 text-[#111827] scroll-mt-24"
      >
        Why ATS scores vary so much
      </h2>
      <div className="flex items-start gap-3 mb-4">
        <Scale size={18} className="text-[#FF6321] mt-1 shrink-0" />
        <p className="text-[#374151] leading-relaxed">
          If you have run the same resume through Jobscan, Resume Worded, Enhancv
          and Airesumi's own checker, you have probably seen four different
          numbers — commonly a 10–15 point spread. That is not a bug. Each tool
          uses its own algorithm: some weight exact keyword phrases heavily,
          others give credit for synonyms, section structure, job-title
          alignment, or formatting and parse quality. Change the weighting and
          the percentage changes with it.
        </p>
      </div>
      <p className="text-[#374151] leading-relaxed mb-4">
        That is also why competing guides confidently recommend 70+, 75+, 80+ and
        85+ without agreeing: they are each describing a different tool's scale.
        The practical takeaway is that your exact number matters far less than
        two things — which <em>range</em> you are in, and whether the score is
        trending up as you edit against the specific job description you are
        applying to.
      </p>

      <h3 className="text-xl font-bold mt-8 mb-3 text-[#111827]">
        What each score range means
      </h3>
      <div className="grid gap-3 mb-4">
        {BANDS.map((b) => (
          <div
            key={b.range}
            className="rounded-2xl border border-[#E5E7EB] bg-white p-5 hover:border-[#FF6321]/40 transition-colors"
          >
            <div className="flex items-baseline justify-between gap-4 mb-2 flex-wrap">
              <span className="text-lg font-black text-[#111827]">{b.range}</span>
              <span className={`text-[13px] font-bold ${b.color}`}>{b.label}</span>
            </div>
            <div className="h-1.5 rounded-full bg-[#F3F4F6] mb-3 overflow-hidden">
              <div className={`h-full rounded-full ${b.bar}`} />
            </div>
            <p className="text-[14px] text-[#4B5563] leading-relaxed">{b.meaning}</p>
          </div>
        ))}
      </div>
      <p className="text-[13px] text-[#9CA3AF]">
        Bands are a practical reading of how checkers and employers commonly
        treat these ranges — not a fixed industry standard.
      </p>
    </section>
  );
}

/** Internal CTA to the tool page (used mid-article and at the end). */
export function AtsScoreToolCta({ variant = "inline" }: { variant?: "inline" | "final" }) {
  return (
    <div
      className={`rounded-2xl border border-[#FF6321]/30 bg-gradient-to-r from-[#FFF7ED] to-orange-50 p-6 ${
        variant === "final" ? "mt-10 text-center" : "my-10"
      }`}
    >
      <p className="text-[17px] font-bold text-[#111827] mb-1">
        Want to check your own resume's ATS score for free?
      </p>
      <p className="text-[14px] text-[#6B7280] mb-4">
        Paste a job description, upload your resume, and see your score plus the
        exact keywords you're missing — no signup required.
      </p>
      <Link
        to="/ats-resume-checker"
        className="inline-flex items-center gap-2 px-5 py-3 bg-[#FF6321] text-white rounded-xl font-semibold text-sm hover:bg-orange-600 transition-all no-underline"
      >
        Try our ATS Resume Checker <ArrowRight size={14} />
      </Link>
    </div>
  );
}

/** FAQ block matching the pattern used on /ats-resume-checker. */
export function AtsScoreFaq() {
  return (
    <section className="mt-12">
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle size={18} className="text-[#FF6321]" />
        <h2
          id="ats-score-questions-people-actually-search"
          className="text-2xl font-bold text-[#111827] scroll-mt-24"
        >
          ATS score questions people actually search
        </h2>
      </div>
      <div className="space-y-3">
        {ATS_SCORE_FAQS.map((f) => (
          <details
            key={f.q}
            className="border border-[#E5E7EB] rounded-2xl p-5 bg-white cursor-pointer group"
          >
            <summary className="font-bold text-[#111827] text-[16px] list-none flex justify-between items-center gap-4">
              <span>{f.q}</span>
              <span className="text-[#FF6321] text-2xl shrink-0 group-open:rotate-45 transition-transform duration-200">
                +
              </span>
            </summary>
            <p className="mt-3 text-[#4B5563] leading-relaxed text-[15px]">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
