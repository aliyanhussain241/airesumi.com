import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, ArrowRight, CheckCircle2, Filter,
  FileText, X, LayoutGrid, List, Heart, TrendingUp,
  ChevronLeft, ChevronRight, Sparkles, Clock, Zap
} from 'lucide-react';

const resumeExamples = [
  { title: "Software Engineer Resume Example", industry: "Technology", level: "Mid Level", format: "Chronological", badge: "Popular", highlights: ["Skills-first ATS-friendly format", "Clear technical stack section", "Quantified engineering impact"], keywords: ["Python", "JavaScript", "AWS", "React", "System Design", "Agile"] },
  { title: "Data Scientist Resume Example", industry: "Technology", level: "Senior", format: "Chronological", badge: "New", highlights: ["Quantified ML project results", "PhD and non-PhD versions", "Portfolio-friendly layout"], keywords: ["Python", "Machine Learning", "SQL", "TensorFlow", "Data Analysis", "Statistics"] },
  { title: "Entry Level Resume Example — No Experience", industry: "General", level: "Entry Level", format: "Functional", badge: "Popular", highlights: ["Built for fresh graduates", "Skills-based format for limited experience", "Works across industries"], keywords: ["Communication", "Teamwork", "Microsoft Office", "Problem Solving", "Leadership", "Adaptability"] },
  { title: "Registered Nurse Resume Example", industry: "Healthcare", level: "Mid Level", format: "Chronological", badge: "Popular", highlights: ["Hospital and clinic versions", "Licenses and certifications section", "HIPAA-conscious phrasing"], keywords: ["Patient Care", "EMR Systems", "HIPAA", "Critical Care", "BLS Certified", "Clinical Assessment"] },
  { title: "Marketing Manager Resume Example", industry: "Marketing", level: "Senior", format: "Chronological", badge: "Popular", highlights: ["ROI-focused achievement bullets", "Digital and traditional marketing", "B2B and B2C versions"], keywords: ["SEO", "Google Analytics", "Campaign Management", "Content Strategy", "CRM", "Lead Generation"] },
  { title: "Financial Analyst Resume Example", industry: "Finance", level: "Mid Level", format: "Chronological", badge: "New", highlights: ["CFA and non-CFA versions", "Quantified financial impact", "Investment banking format"], keywords: ["Financial Modeling", "Excel", "Bloomberg", "Valuation", "DCF Analysis", "Risk Assessment"] },
  { title: "UX Designer Resume Example", industry: "Design", level: "Mid Level", format: "Combination", badge: "Popular", highlights: ["Portfolio link section included", "Design tools prominently featured", "User research focused"], keywords: ["Figma", "User Research", "Prototyping", "Wireframing", "Usability Testing", "Adobe XD"] },
  { title: "Product Manager Resume Example", industry: "Technology", level: "Senior", format: "Chronological", badge: "Popular", highlights: ["Metrics-driven achievement format", "Works for startups and enterprise", "B2B and B2C versions"], keywords: ["Product Roadmap", "Agile", "Stakeholder Management", "User Stories", "KPIs", "Go-to-Market"] },
  { title: "Sales Executive Resume Example", industry: "Sales", level: "Senior", format: "Chronological", badge: "Popular", highlights: ["Revenue numbers front and center", "Quota attainment highlighted", "SaaS and enterprise versions"], keywords: ["Salesforce", "CRM", "Revenue Growth", "Pipeline Management", "B2B Sales", "Account Management"] },
  { title: "HR Manager Resume Example", industry: "HR", level: "Mid Level", format: "Chronological", badge: "New", highlights: ["Talent acquisition focused", "SHRM certification section", "Culture and DEI experience"], keywords: ["Talent Acquisition", "HRIS", "Employee Relations", "Performance Management", "Onboarding", "SHRM"] },
  { title: "Graphic Designer Resume Example", industry: "Design", level: "Entry Level", format: "Combination", badge: "Popular", highlights: ["Portfolio-first layout", "Creative yet ATS-safe format", "Print and digital design versions"], keywords: ["Adobe Illustrator", "Photoshop", "InDesign", "Typography", "Brand Identity", "Print Design"] },
  { title: "Teacher Resume Example", industry: "Education", level: "Mid Level", format: "Chronological", badge: "Popular", highlights: ["K-12 and university versions", "Classroom management highlighted", "Curriculum development focus"], keywords: ["Curriculum Development", "Classroom Management", "Google Classroom", "IEP", "Differentiated Instruction", "STEM"] },
  { title: "Business Analyst Resume Example", industry: "Technology", level: "Mid Level", format: "Chronological", badge: "Popular", highlights: ["Process improvement metrics", "JIRA and Agile experience", "Stakeholder communication focus"], keywords: ["Business Analysis", "JIRA", "SQL", "Process Improvement", "Requirements Gathering", "Agile"] },
  { title: "DevOps Engineer Resume Example", industry: "Technology", level: "Senior", format: "Chronological", badge: "New", highlights: ["CI/CD pipeline experience", "Cloud certifications section", "Infrastructure as code focused"], keywords: ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform", "CI/CD"] },
  { title: "Content Writer Resume Example", industry: "Creative", level: "Entry Level", format: "Combination", badge: "Popular", highlights: ["Portfolio and bylines section", "SEO writing skills highlighted", "Freelance and agency versions"], keywords: ["SEO Writing", "Content Strategy", "WordPress", "Copywriting", "Social Media", "Editorial Calendar"] },
  { title: "Project Manager Resume Example", industry: "Engineering", level: "Senior", format: "Chronological", badge: "Popular", highlights: ["PMP certification highlighted", "Budget and scope management", "Cross-functional team leadership"], keywords: ["PMP", "Agile", "Scrum", "Risk Management", "Stakeholder Communication", "MS Project"] },
  { title: "Accountant Resume Example", industry: "Finance", level: "Mid Level", format: "Chronological", badge: "Popular", highlights: ["CPA and non-CPA versions", "Tax and audit experience", "Big 4 and corporate formats"], keywords: ["QuickBooks", "CPA", "Tax Preparation", "Financial Reporting", "GAAP", "Audit"] },
  { title: "Customer Success Manager Resume Example", industry: "Technology", level: "Mid Level", format: "Chronological", badge: "New", highlights: ["NPS and retention metrics", "SaaS customer success format", "Onboarding and churn reduction"], keywords: ["Customer Retention", "NPS", "Salesforce", "Churn Reduction", "Onboarding", "SaaS"] },
  { title: "Frontend Developer Resume Example", industry: "Technology", level: "Mid Level", format: "Chronological", badge: "Popular", highlights: ["GitHub portfolio section", "React and Vue.js focused", "Performance optimization metrics"], keywords: ["React", "JavaScript", "TypeScript", "CSS", "Vue.js", "REST APIs"] },
  { title: "Operations Manager Resume Example", industry: "Engineering", level: "Senior", format: "Chronological", badge: "Popular", highlights: ["Supply chain and logistics versions", "Cost reduction achievements", "Team size and P&L responsibility"], keywords: ["Operations Management", "Supply Chain", "Lean Six Sigma", "P&L", "Process Improvement", "KPIs"] },
  { title: "Social Media Manager Resume Example", industry: "Marketing", level: "Entry Level", format: "Combination", badge: "Popular", highlights: ["Follower growth metrics", "Platform-specific expertise", "Content calendar management"], keywords: ["Instagram", "TikTok", "Content Creation", "Analytics", "Community Management", "Paid Social"] },
  { title: "Civil Engineer Resume Example", industry: "Engineering", level: "Mid Level", format: "Chronological", badge: "New", highlights: ["PE license section", "Infrastructure project scale", "AutoCAD and BIM software"], keywords: ["AutoCAD", "BIM", "Structural Analysis", "Project Management", "PE License", "Construction Management"] },
  { title: "Career Change Resume Example", industry: "General", level: "Career Change", format: "Functional", badge: "Popular", highlights: ["Transferable skills format", "Works for any industry switch", "Handles employment gaps"], keywords: ["Transferable Skills", "Leadership", "Communication", "Problem Solving", "Adaptability", "Project Management"] },
  { title: "Digital Marketing Specialist Resume Example", industry: "Marketing", level: "Mid Level", format: "Chronological", badge: "Popular", highlights: ["PPC and SEO metrics", "Google Ads certified format", "ROAS and CPA achievements"], keywords: ["Google Ads", "SEO", "PPC", "Facebook Ads", "Email Marketing", "Google Analytics"] },
  { title: "Executive Resume Example — C-Suite", industry: "General", level: "Executive", format: "Two Page", badge: "Premium", highlights: ["Board-ready format", "P&L and company growth focus", "CEO, COO, CFO versions"], keywords: ["Executive Leadership", "Board Presentations", "Strategic Planning", "P&L Management", "M&A", "Organizational Growth"] }
];

type SortKey = 'az' | 'za';
type View = 'grid' | 'list';
const PAGE_SIZE = 9;

const industries = ["All", "Technology", "Healthcare", "Finance", "Marketing", "Design", "Education", "Engineering", "Sales", "HR", "Creative", "General"];
const levels = ["All", "Entry Level", "Mid Level", "Senior", "Executive", "Career Change"];

export function ResumeExamples({ onNavigate, onLoadTemplate }: { onNavigate: (step: any) => void, onLoadTemplate?: (resumeData: any) => void }) {
  const [industry, setIndustry] = useState('All');
  const [level, setLevel] = useState('All');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortKey>('az');
  const [view, setView] = useState<View>('grid');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<any>(null);
  const [favs, setFavs] = useState<string[]>([]);
  const [showFavs, setShowFavs] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('examples-favs');
      if (raw) setFavs(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('examples-favs', JSON.stringify(favs)); } catch {}
  }, [favs]);

  const toggleFav = (t: string) => setFavs(f => f.includes(t) ? f.filter(x => x !== t) : [...f, t]);

  const filtered = useMemo(() => {
    let list = resumeExamples.filter(r => {
      const mi = industry === 'All' || r.industry === industry;
      const ml = level === 'All' || r.level === level;
      const q = query.toLowerCase().trim();
      const mq = !q || r.title.toLowerCase().includes(q) || r.keywords.some(k => k.toLowerCase().includes(q));
      const mf = !showFavs || favs.includes(r.title);
      return mi && ml && mq && mf;
    });
    if (sort === 'az') list.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === 'za') list.sort((a, b) => b.title.localeCompare(a.title));
    return list;
  }, [industry, level, query, sort, showFavs, favs]);

  useEffect(() => { setPage(1); }, [industry, level, query, sort, showFavs]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const featured = resumeExamples[0];

  const totalExamples = resumeExamples.length;
  const totalIndustries = useMemo(() => new Set(resumeExamples.map(r => r.industry)).size, []);

  const allKeywords = useMemo(() => {
    const map = new Map<string, number>();
    resumeExamples.forEach(r => r.keywords.forEach(k => map.set(k, (map.get(k) || 0) + 1)));
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20);
  }, []);

  const featuredList = resumeExamples.slice(0, 5);

  return (
    <div className="min-h-screen bg-background text-foreground pt-[68px] font-sans">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/50">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-orange-500/20 blur-[120px]" />
          <div className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full bg-amber-500/15 blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
          <div className="flex flex-col gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5" /> ATS-Friendly Resume Examples
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.05] mb-4 max-w-3xl">
                Resume examples that <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">get interviews</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Browse hand-crafted resume samples by job title, industry, and experience level — every one built with ATS-friendly formatting principles.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <span className="px-3 py-1.5 rounded-full bg-muted font-semibold">
                  {totalExamples} examples
                </span>
                <span className="px-3 py-1.5 rounded-full bg-muted font-semibold">
                  {totalIndustries} industries
                </span>
                <span className="px-3 py-1.5 rounded-full bg-muted font-semibold">
                  {levels.length - 1} experience levels
                </span>
              </div>
            </div>
          </div>


          {/* Featured hero example */}
          <div onClick={() => setSelected(featured)} className="group relative rounded-3xl p-6 md:p-10 cursor-pointer overflow-hidden border border-border/60 bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-[0_20px_60px_-20px_rgba(234,88,12,0.5)] hover:shadow-[0_30px_80px_-20px_rgba(234,88,12,0.7)] transition-all">
            <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[radial-gradient(circle_at_top_right,white,transparent_60%)]" />
            <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="flex-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-bold uppercase tracking-wider mb-4">
                  <TrendingUp className="w-3 h-3" /> Featured
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-3 leading-tight">{featured.title}</h2>
                <p className="text-white/90 text-base md:text-lg mb-5 max-w-xl">{featured.highlights[0]}. {featured.highlights[1]}.</p>
                <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
                  <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur">{featured.industry}</span>
                  <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur">{featured.level}</span>
                  <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur">{featured.format}</span>
                </div>

              </div>
              <button className="px-6 py-3 rounded-full bg-white text-orange-600 font-bold shadow-lg group-hover:scale-105 transition-transform flex items-center gap-2">
                Preview <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <div className="sticky top-[68px] z-30 backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search job title, skill, or keyword…" className="w-full pl-11 pr-4 py-2.5 rounded-full border border-border bg-background focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30 outline-none text-sm" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select value={sort} onChange={e => setSort(e.target.value as SortKey)} className="px-3 py-2 rounded-full border border-border bg-background text-sm font-medium focus:border-orange-500 outline-none">
              <option value="az">A–Z</option>
              <option value="za">Z–A</option>
            </select>
            <button onClick={() => setShowFavs(v => !v)} className={`px-3 py-2 rounded-full border text-sm font-medium flex items-center gap-1.5 transition-colors ${showFavs ? 'bg-orange-500 text-white border-orange-500' : 'border-border bg-background hover:border-orange-500'}`}>
              <Heart className={`w-4 h-4 ${showFavs ? 'fill-current' : ''}`} /> {favs.length}
            </button>
            <div className="flex items-center rounded-full border border-border overflow-hidden">
              <button onClick={() => setView('grid')} className={`p-2 ${view === 'grid' ? 'bg-orange-500 text-white' : 'bg-background hover:bg-muted'}`} aria-label="Grid view"><LayoutGrid className="w-4 h-4" /></button>
              <button onClick={() => setView('list')} className={`p-2 ${view === 'list' ? 'bg-orange-500 text-white' : 'bg-background hover:bg-muted'}`} aria-label="List view"><List className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
        {/* chip filters */}
        <div className="max-w-7xl mx-auto px-6 pb-4 flex flex-col md:flex-row gap-3">
          <ChipRow items={industries} value={industry} onChange={setIndustry} />
          <div className="hidden md:block w-px bg-border" />
          <ChipRow items={levels} value={level} onChange={setLevel} accent />
        </div>
      </div>

      {/* Main grid + sidebar */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold">
              {filtered.length} example{filtered.length === 1 ? '' : 's'}
              {(industry !== 'All' || level !== 'All' || query) && <span className="text-muted-foreground font-medium text-base ml-2">matching filters</span>}
            </h2>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 rounded-3xl border border-dashed border-border">
              <Filter className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-lg font-bold mb-1">No matches</h3>
              <p className="text-sm text-muted-foreground">Try clearing filters or searching a different keyword.</p>
              <button onClick={() => { setIndustry('All'); setLevel('All'); setQuery(''); setShowFavs(false); }} className="mt-4 px-4 py-2 rounded-full bg-orange-500 text-white text-sm font-semibold">Reset filters</button>
            </div>
          )}

          {view === 'grid' && paged.length > 0 && (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {paged.map(r => (
                <ExampleCard key={r.title} r={r} onOpen={() => setSelected(r)} fav={favs.includes(r.title)} onFav={() => toggleFav(r.title)} />
              ))}
            </div>
          )}

          {view === 'list' && paged.length > 0 && (
            <div className="space-y-3">
              {paged.map(r => (
                <ExampleRow key={r.title} r={r} onOpen={() => setSelected(r)} fav={favs.includes(r.title)} onFav={() => toggleFav(r.title)} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-full border border-border disabled:opacity-40 hover:border-orange-500"><ChevronLeft className="w-4 h-4" /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)} className={`w-9 h-9 rounded-full text-sm font-semibold ${n === page ? 'bg-orange-500 text-white' : 'border border-border hover:border-orange-500'}`}>{n}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-full border border-border disabled:opacity-40 hover:border-orange-500"><ChevronRight className="w-4 h-4" /></button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-[220px] lg:self-start">
          <SidebarCard title="Featured Examples" icon={<TrendingUp className="w-4 h-4" />}>
            <ol className="space-y-3">
              {featuredList.map((r, i) => (
                <li key={r.title}>
                  <button onClick={() => setSelected(r)} className="flex items-start gap-3 w-full text-left group">
                    <span className="text-2xl font-extrabold text-orange-500 leading-none w-6">{i + 1}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold group-hover:text-orange-500 transition-colors line-clamp-2">{r.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{r.level} · {r.industry}</div>
                    </div>
                  </button>
                </li>
              ))}
            </ol>
          </SidebarCard>

          <SidebarCard title="Popular Skills" icon={<Zap className="w-4 h-4" />}>
            <div className="flex flex-wrap gap-2">
              {allKeywords.map(([k]) => (
                <button key={k} onClick={() => setQuery(k)} className="text-xs px-2.5 py-1 rounded-full bg-muted hover:bg-orange-500 hover:text-white transition-colors font-medium">
                  {k}
                </button>
              ))}
            </div>
          </SidebarCard>

          <div className="rounded-2xl p-6 bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg">
            <Sparkles className="w-6 h-6 mb-3" />
            <h3 className="font-extrabold text-lg mb-2 leading-tight">Skip the example — build yours with AI</h3>
            <p className="text-sm text-white/90 mb-4 leading-relaxed">Paste any job description and get a tailored ATS resume in 2 minutes.</p>
            <button onClick={() => onNavigate(1)} className="w-full py-2.5 rounded-full bg-white text-orange-600 font-bold text-sm hover:scale-[1.02] transition-transform">Start Free →</button>
          </div>
        </aside>
      </div>

      {/* Tips */}
      <section className="border-t border-border/50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Resume writing tips that actually work</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl">Four things every recruiter looks for — and every ATS system scores against.</p>
          <div className="grid md:grid-cols-4 gap-5">
            {[
              { i: <Clock className="w-5 h-5" />, t: "Keep it 1–2 pages", d: "Recruiters spend seconds on the first scan. Every line should earn its place." },
              { i: <Search className="w-5 h-5" />, t: "Mirror the job keywords", d: "Most resumes are filtered by ATS. Use the exact terms from the posting." },
              { i: <TrendingUp className="w-5 h-5" />, t: "Quantify everything", d: "‘Grew revenue 40%’ beats ‘managed sales.’ Numbers make bullets more credible." },
              { i: <Zap className="w-5 h-5" />, t: "Tailor per role", d: "One resume for every job hurts your interview rate. AI can retarget in 2 minutes." }
            ].map((t, i) => (
              <div key={i} className="p-6 rounded-2xl border border-border bg-card hover:border-orange-500/50 hover:shadow-lg transition-all">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-4">{t.i}</div>
                <h3 className="font-bold text-lg mb-2">{t.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border/50 py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3 text-center">Frequently asked</h2>
          <p className="text-muted-foreground text-center mb-10">Everything about picking and using a resume example.</p>
          <div className="space-y-3">
            {[
              { q: "What is the best resume format?", a: "Reverse-chronological works for most people. Career changers and long gaps benefit from functional or combination formats. Our examples cover all three." },
              { q: "How long should my resume be?", a: "One page if under 10 years' experience, two pages otherwise. Executive resumes can stretch to three, but only if every line matters." },
              { q: "What does ATS-friendly actually mean?", a: "It means using standard sections, real text (not images or shapes), no tables or complex columns, and keywords pulled from the job posting. Every example here follows those formatting principles." },
              { q: "How do I write a resume with no experience?", a: "Lead with skills, education, projects, and volunteer work. Our entry-level examples show the exact structure that lands first interviews." },
              { q: "Template or from scratch?", a: "Always start from a proven example. You'll finish faster and pass ATS on the first try. Then customize with our AI builder." },
              { q: "How do I tailor a resume to a job?", a: "Copy repeated phrases and skills from the posting into your summary, skills, and top bullets. Our AI builder does this automatically in under 2 minutes." }
            ].map((f, i) => <FAQItem key={i} question={f.q} answer={f.a} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border/50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="rounded-3xl p-10 md:p-16 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white text-center shadow-2xl">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">Found your example? Build yours in 2 minutes.</h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">AI writes bullets, matches keywords, and scores your ATS-readiness instantly.</p>
            <button onClick={() => onNavigate(1)} className="px-8 py-4 rounded-full bg-white text-orange-600 font-extrabold text-lg hover:scale-[1.03] transition-transform shadow-xl">
              Build My Free Resume →
            </button>
            <p className="mt-4 text-sm text-white/80">Free to start. No credit card. ATS score shown instantly.</p>
          </div>
        </div>
      </section>

      {/* Preview modal */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 20 }} className="relative bg-background w-full max-w-6xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-border">
              <button onClick={() => setSelected(null)} aria-label="Close preview" className="absolute top-4 right-4 z-10 w-10 h-10 bg-background border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
              <div className="flex-1 bg-muted/30 p-6 md:p-10 overflow-y-auto hidden md:block">
                <div className="bg-white text-gray-900 w-full max-w-[780px] mx-auto min-h-[900px] shadow-xl p-12 font-serif">
                  <div className="text-center mb-8 border-b border-gray-300 pb-6">
                    <h1 className="text-3xl font-bold uppercase tracking-widest mb-2">Alex Morgan</h1>
                    <div className="text-sm text-gray-600 flex justify-center gap-3 flex-wrap">
                      <span>alex.morgan@email.com</span><span>|</span><span>/in/alexmorgan</span><span>|</span><span>(555) 012-3456</span>
                    </div>
                  </div>
                  <Section title="Professional Summary">
                    <p className="text-sm leading-relaxed">Results-driven {selected.title.replace(' Resume Example', '').replace(' — No Experience', '').replace(' — C-Suite', '')} with proven track record delivering measurable impact in {selected.industry}. Expertise across {selected.keywords.slice(0, 3).join(', ')}, and modern industry practices.</p>
                  </Section>
                  <Section title="Work Experience">
                    <Job title={`Senior ${selected.title.split(' Resume')[0]} — TechCorp Inc`} date="Jan 2022 – Present" bullets={[
                      "Architected core systems handling 500K+ daily requests, reducing latency by 40%",
                      "Led cross-functional team of 6, delivering $2M initiative 15% under budget",
                      "Drove operational efficiency by 60% through automation and best practices"
                    ]} />
                    <Job title={`${selected.title.split(' Resume')[0]} — StartupXYZ`} date="Mar 2020 – Dec 2021" bullets={[
                      "Built end-to-end solutions serving 2M+ monthly active users at 99.9% uptime",
                      "Cut infrastructure costs by $180K/year via targeted optimization",
                      "Mentored 3 juniors; 2 promoted within 12 months"
                    ]} />
                  </Section>
                  <Section title="Education"><div className="flex justify-between text-sm"><span className="font-bold">B.S. in Related Field — State University</span><span>2019</span></div></Section>
                  <Section title="Core Competencies"><div className="text-sm">{selected.keywords.join(' • ')}</div></Section>
                </div>
              </div>
              <div className="w-full md:w-[380px] bg-background p-8 flex flex-col overflow-y-auto">
                <div className="flex items-center gap-2 mb-2">
                  {selected.badge && <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400">{selected.badge}</span>}
                  <button onClick={() => toggleFav(selected.title)} className="ml-auto p-2 hover:bg-muted rounded-full"><Heart className={`w-4 h-4 ${favs.includes(selected.title) ? 'fill-orange-500 text-orange-500' : ''}`} /></button>
                </div>
                <h3 className="text-2xl font-extrabold mb-1 leading-tight">{selected.title}</h3>
                <p className="text-sm text-muted-foreground mb-6">{selected.industry} • {selected.level} • {selected.format}</p>

                <h4 className="font-bold mb-3 text-sm">Why this works</h4>
                <ul className="space-y-2 mb-6">
                  {selected.highlights.map((h: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" /> {h}</li>
                  ))}
                </ul>

                <h4 className="font-bold mb-3 text-sm">Keywords included</h4>
                <div className="flex flex-wrap gap-1.5 mb-8">
                  {selected.keywords.map((k: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-muted rounded text-xs font-semibold">{k}</span>
                  ))}
                </div>

                <div className="mt-auto space-y-2">
                  <button onClick={() => onNavigate(1)} className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-full shadow-lg hover:scale-[1.02] transition-transform text-sm">Build My Own With AI →</button>
                  <button onClick={() => onLoadTemplate?.(selected)} className="w-full py-3 border-2 border-orange-500 text-orange-600 dark:text-orange-400 hover:bg-orange-500/10 font-bold rounded-full text-sm">Edit This Template</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- helpers ---------- */

function ChipRow({ items, value, onChange, accent }: { items: string[]; value: string; onChange: (v: string) => void; accent?: boolean }) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
      {items.map(i => {
        const active = i === value;
        return (
          <button key={i} onClick={() => onChange(i)} className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap ${active ? (accent ? 'bg-foreground text-background border-foreground' : 'bg-orange-500 text-white border-orange-500') : 'bg-background text-muted-foreground border-border hover:border-orange-500 hover:text-foreground'}`}>{i}</button>
        );
      })}
    </div>
  );
}

function ExampleCard({ r, onOpen, fav, onFav }: { r: any; onOpen: () => void; fav: boolean; onFav: () => void }) {
  return (
    <div onClick={onOpen} className="group relative rounded-2xl border border-border bg-card hover:border-orange-500/50 hover:shadow-[0_20px_40px_-20px_rgba(234,88,12,0.3)] hover:-translate-y-0.5 transition-all cursor-pointer overflow-hidden flex flex-col">
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{r.industry}</span>
            {r.badge && <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${r.badge === 'New' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : r.badge === 'Premium' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' : 'bg-orange-500/10 text-orange-600 dark:text-orange-400'}`}>{r.badge}</span>}
          </div>
          <button onClick={e => { e.stopPropagation(); onFav(); }} className="p-1.5 -mr-1 -mt-1 rounded-full hover:bg-muted"><Heart className={`w-4 h-4 ${fav ? 'fill-orange-500 text-orange-500' : 'text-muted-foreground'}`} /></button>
        </div>
        <div className="mb-4 h-24 rounded-lg bg-gradient-to-br from-muted/50 to-muted p-3 border border-border/50 space-y-1.5">
          <div className="h-1.5 w-1/2 rounded-full bg-foreground/20" />
          <div className="h-1 w-3/4 rounded-full bg-foreground/10" />
          <div className="pt-1 space-y-1">
            <div className="h-1 w-full rounded-full bg-foreground/10" />
            <div className="h-1 w-5/6 rounded-full bg-foreground/10" />
            <div className="h-1 w-2/3 rounded-full bg-foreground/10" />
          </div>
        </div>
        <h3 className="font-bold text-base mb-1 leading-tight group-hover:text-orange-500 transition-colors">{r.title}</h3>
        <p className="text-xs text-muted-foreground mb-3">{r.level} • {r.format}</p>
        <div className="flex flex-wrap gap-1">
          {r.keywords.slice(0, 3).map((k: string) => <span key={k} className="text-[10px] px-1.5 py-0.5 bg-muted rounded font-medium text-muted-foreground">{k}</span>)}
        </div>
      </div>
      <div className="px-5 py-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-semibold text-foreground flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> {r.format}</span>
        <span className="font-semibold">{r.level}</span>
      </div>
    </div>
  );
}

function ExampleRow({ r, onOpen, fav, onFav }: { r: any; onOpen: () => void; fav: boolean; onFav: () => void }) {
  return (
    <div onClick={onOpen} className="group flex flex-col sm:flex-row gap-4 items-start sm:items-center p-4 rounded-2xl border border-border bg-card hover:border-orange-500/50 hover:shadow-lg cursor-pointer transition-all">
      <div className="w-14 h-16 rounded bg-gradient-to-br from-muted/50 to-muted border border-border/50 p-2 space-y-1 shrink-0">
        <div className="h-1 w-full rounded-full bg-foreground/20" />
        <div className="h-0.5 w-3/4 rounded-full bg-foreground/10" />
        <div className="h-0.5 w-full rounded-full bg-foreground/10" />
        <div className="h-0.5 w-5/6 rounded-full bg-foreground/10" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{r.industry}</span>
          {r.badge && <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400">{r.badge}</span>}
        </div>
        <h3 className="font-bold group-hover:text-orange-500 transition-colors">{r.title}</h3>
        <p className="text-xs text-muted-foreground">{r.level} • {r.format} • {r.keywords.slice(0, 4).join(' · ')}</p>
      </div>
      <div className="flex items-center gap-4 text-xs shrink-0">
        <button onClick={e => { e.stopPropagation(); onFav(); }} className="p-1.5 rounded-full hover:bg-muted"><Heart className={`w-4 h-4 ${fav ? 'fill-orange-500 text-orange-500' : 'text-muted-foreground'}`} /></button>
      </div>
    </div>
  );
}

function SidebarCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">{icon} {title}</div>
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-900 pb-1 mb-3">{title}</h2>
      {children}
    </div>
  );
}

function Job({ title, date, bullets }: { title: string; date: string; bullets: string[] }) {
  return (
    <div className="mb-5">
      <div className="flex justify-between font-bold mb-1"><span>{title}</span><span>{date}</span></div>
      <ul className="list-disc pl-5 text-sm space-y-1">
        {bullets.map((b, i) => <li key={i}>{b}</li>)}
      </ul>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <button onClick={() => setOpen(o => !o)} className="w-full px-5 py-4 flex items-center justify-between text-left font-semibold hover:bg-muted/40 transition-colors">
        <span>{question}</span>
        <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${open ? 'rotate-90 text-orange-500' : 'text-muted-foreground'}`} />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{answer}</p>
      </motion.div>
    </div>
  );
}
