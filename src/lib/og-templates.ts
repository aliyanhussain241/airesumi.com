// OG image templates (1200x630 SVG). One shared layout, per-page config.
// Rendered on demand at /api/public/og/<slug> so all shares stay consistent.

export type OgConfig = {
  badge: string;
  title: string;
  highlight?: string; // portion of title to accent in orange
  subtitle: string;
  accent?: string;   // hex
};

export const OG_CONFIGS: Record<string, OgConfig> = {
  "resume": {
    badge: "AI Resume Builder",
    title: "Build a Resume That Gets Interviews",
    highlight: "Gets Interviews",
    subtitle: "ATS-friendly templates + AI writing — free to try.",
  },
  "ats-checker": {
    badge: "ATS Checker",
    title: "Beat the ATS in Under 60 Seconds",
    highlight: "Beat the ATS",
    subtitle: "Score your resume against any job description instantly.",
  },
  "cover-letter": {
    badge: "AI Cover Letter",
    title: "Write a Cover Letter That Lands the Interview",
    highlight: "Lands the Interview",
    subtitle: "Tailored to the role. Written in your voice. Free.",
  },
  "interview-prep": {
    badge: "Interview Prep",
    title: "Practice Real Interview Questions",
    highlight: "Real Interview Questions",
    subtitle: "Behavioral, technical & STAR frameworks by role.",
  },
  "salary-analyzer": {
    badge: "Salary Analyzer",
    title: "Know What You're Worth — Then Negotiate",
    highlight: "What You're Worth",
    subtitle: "Benchmark comp by role, region & seniority. Free.",
  },
  "keyword-scanner": {
    badge: "Keyword Scanner",
    title: "Match Your Resume to Any Job Posting",
    highlight: "Any Job Posting",
    subtitle: "Find missing keywords. Boost your ATS score.",
  },
  "bullet-writer": {
    badge: "Bullet Writer",
    title: "Write Stronger Resume Bullets, Instantly",
    highlight: "Stronger Resume Bullets",
    subtitle: "Metric-driven, recruiter-ready lines — powered by AI.",
  },
  "linkedin-bio": {
    badge: "LinkedIn Bio",
    title: "A LinkedIn Bio Recruiters Actually Read",
    highlight: "Recruiters Actually Read",
    subtitle: "Hook, headline & About — generated in seconds.",
  },
  "summary-generator": {
    badge: "Summary Generator",
    title: "A Professional Summary That Hooks Recruiters",
    highlight: "Hooks Recruiters",
    subtitle: "3-line summary tailored to your role. Free.",
  },
  "resignation-letter": {
    badge: "Resignation Letter",
    title: "Resign Professionally in Two Minutes",
    highlight: "Two Minutes",
    subtitle: "Polite, clear templates for any situation.",
  },
  "resume-score": {
    badge: "Resume Score",
    title: "Get an Honest Score of Your Resume",
    highlight: "Honest Score",
    subtitle: "AI feedback on impact, clarity & ATS-readiness.",
  },
  "pdf-scanner": {
    badge: "PDF Scanner",
    title: "Scan Documents Like a Pro — From Your Browser",
    highlight: "Like a Pro",
    subtitle: "Auto crop, enhance & export to PDF. No install.",
  },
  "examples": {
    badge: "Resume Examples",
    title: "Real Resume Examples That Got Interviews",
    highlight: "Got Interviews",
    subtitle: "Browse by role, industry & experience level.",
  },
  "blog": {
    badge: "Career Blog",
    title: "Resume Tips & Career Advice, Weekly",
    highlight: "Career Advice",
    subtitle: "Interviews, salary, LinkedIn — no fluff.",
  },
};

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Break title into ~22-char lines, keeping the highlight together where possible.
function wrap(title: string, maxChars = 24): string[] {
  const words = title.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > maxChars) {
      lines.push(cur.trim());
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 3);
}

export function renderOgSvg(cfg: OgConfig): string {
  const accent = cfg.accent || "#FF6321";
  const lines = wrap(cfg.title);
  const highlight = cfg.highlight || "";
  const subtitleLines = wrap(cfg.subtitle, 52).slice(0, 2);

  const titleY = 300;
  const lineH = 78;
  const titleSvg = lines
    .map((line, i) => {
      const y = titleY + i * lineH;
      if (highlight && line.includes(highlight)) {
        const [before, after] = line.split(highlight);
        return `<text x="80" y="${y}" font-family="Inter, system-ui, sans-serif" font-size="68" font-weight="800" fill="#0f172a">${escape(before)}<tspan fill="${accent}">${escape(highlight)}</tspan>${escape(after)}</text>`;
      }
      return `<text x="80" y="${y}" font-family="Inter, system-ui, sans-serif" font-size="68" font-weight="800" fill="#0f172a">${escape(line)}</text>`;
    })
    .join("");

  const subY = titleY + lines.length * lineH + 30;
  const subSvg = subtitleLines
    .map(
      (l, i) =>
        `<text x="80" y="${subY + i * 38}" font-family="Inter, system-ui, sans-serif" font-size="28" font-weight="500" fill="#475569">${escape(l)}</text>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fff7ed"/>
      <stop offset="1" stop-color="#ffffff"/>
    </linearGradient>
    <linearGradient id="orb" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${accent}" stop-opacity="0.25"/>
      <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="1050" cy="120" r="260" fill="url(#orb)"/>
  <circle cx="1120" cy="560" r="180" fill="url(#orb)"/>

  <!-- Brand -->
  <g transform="translate(80,80)">
    <rect width="52" height="52" rx="14" fill="${accent}"/>
    <text x="26" y="36" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="30" font-weight="800" fill="#ffffff">a</text>
    <text x="72" y="36" font-family="Inter, system-ui, sans-serif" font-size="26" font-weight="700" fill="#0f172a">Airesumi</text>
  </g>

  <!-- Badge -->
  <g transform="translate(80,200)">
    <rect width="${cfg.badge.length * 13 + 40}" height="44" rx="22" fill="#ffedd5" stroke="${accent}" stroke-opacity="0.25"/>
    <text x="20" y="29" font-family="Inter, system-ui, sans-serif" font-size="18" font-weight="700" fill="#c2410c">${escape(cfg.badge.toUpperCase())}</text>
  </g>

  ${titleSvg}
  ${subSvg}

  <!-- Footer -->
  <g transform="translate(80,560)">
    <text font-family="Inter, system-ui, sans-serif" font-size="22" font-weight="600" fill="#0f172a">airesumi.com</text>
    <text x="180" font-family="Inter, system-ui, sans-serif" font-size="22" font-weight="500" fill="#64748b">— Free forever. No sign-up needed.</text>
  </g>
  <rect x="0" y="624" width="1200" height="6" fill="${accent}"/>
</svg>`;
}
