import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, Search, ArrowRight, CheckCircle2, Download, Star, Filter, 
  MapPin, Briefcase, FileText, X, ArrowLeft
} from 'lucide-react';

const resumeExamples = [
  {
    title: "Software Engineer Resume Example",
    industry: "Technology",
    level: "Mid Level",
    format: "Chronological",
    atsScore: 96,
    downloads: "34,200",
    rating: 4.9,
    badge: "Most Popular",
    highlights: ["Landed jobs at Google, Meta, Amazon", "Skills-first ATS format", "Used by 34,000+ engineers"],
    keywords: ["Python", "JavaScript", "AWS", "React", "System Design", "Agile"]
  },
  {
    title: "Data Scientist Resume Example",
    industry: "Technology",
    level: "Senior",
    format: "Chronological",
    atsScore: 94,
    downloads: "18,700",
    rating: 4.8,
    badge: "New",
    highlights: ["Quantified ML project results", "PhD and non-PhD versions", "98% recruiter approval rate"],
    keywords: ["Python", "Machine Learning", "SQL", "TensorFlow", "Data Analysis", "Statistics"]
  },
  {
    title: "Entry Level Resume Example — No Experience",
    industry: "General",
    level: "Entry Level",
    format: "Functional",
    atsScore: 91,
    downloads: "28,900",
    rating: 4.8,
    badge: "Most Popular",
    highlights: ["Perfect for fresh graduates", "Skills-based format hides lack of experience", "Works for any industry"],
    keywords: ["Communication", "Teamwork", "Microsoft Office", "Problem Solving", "Leadership", "Adaptability"]
  },
  {
    title: "Registered Nurse Resume Example",
    industry: "Healthcare",
    level: "Mid Level",
    format: "Chronological",
    atsScore: 95,
    downloads: "22,100",
    rating: 4.9,
    badge: "Popular",
    highlights: ["Hospital and clinic versions", "Licenses and certifications section", "HIPAA-compliant language"],
    keywords: ["Patient Care", "EMR Systems", "HIPAA", "Critical Care", "BLS Certified", "Clinical Assessment"]
  },
  {
    title: "Marketing Manager Resume Example",
    industry: "Marketing",
    level: "Senior",
    format: "Chronological",
    atsScore: 93,
    downloads: "15,400",
    rating: 4.7,
    badge: "Popular",
    highlights: ["ROI-focused achievement bullets", "Digital and traditional marketing", "B2B and B2C versions"],
    keywords: ["SEO", "Google Analytics", "Campaign Management", "Content Strategy", "CRM", "Lead Generation"]
  },
  {
    title: "Financial Analyst Resume Example",
    industry: "Finance",
    level: "Mid Level",
    format: "Chronological",
    atsScore: 94,
    downloads: "12,800",
    rating: 4.8,
    badge: "New",
    highlights: ["CFA and non-CFA versions", "Quantified financial impact", "Investment banking format"],
    keywords: ["Financial Modeling", "Excel", "Bloomberg", "Valuation", "DCF Analysis", "Risk Assessment"]
  },
  {
    title: "UX Designer Resume Example",
    industry: "Design",
    level: "Mid Level",
    format: "Combination",
    atsScore: 92,
    downloads: "11,200",
    rating: 4.7,
    badge: "Popular",
    highlights: ["Portfolio link section included", "Design tools prominently featured", "User research focused"],
    keywords: ["Figma", "User Research", "Prototyping", "Wireframing", "Usability Testing", "Adobe XD"]
  },
  {
    title: "Product Manager Resume Example",
    industry: "Technology",
    level: "Senior",
    format: "Chronological",
    atsScore: 95,
    downloads: "16,300",
    rating: 4.9,
    badge: "Most Popular",
    highlights: ["Metrics-driven achievement format", "Used at FAANG and startups", "B2B and B2C versions"],
    keywords: ["Product Roadmap", "Agile", "Stakeholder Management", "User Stories", "KPIs", "Go-to-Market"]
  },
  {
    title: "Sales Executive Resume Example",
    industry: "Sales",
    level: "Senior",
    format: "Chronological",
    atsScore: 93,
    downloads: "13,600",
    rating: 4.8,
    badge: "Popular",
    highlights: ["Revenue numbers front and center", "Quota attainment highlighted", "SaaS and enterprise versions"],
    keywords: ["Salesforce", "CRM", "Revenue Growth", "Pipeline Management", "B2B Sales", "Account Management"]
  },
  {
    title: "HR Manager Resume Example",
    industry: "HR",
    level: "Mid Level",
    format: "Chronological",
    atsScore: 91,
    downloads: "9,800",
    rating: 4.7,
    badge: "New",
    highlights: ["Talent acquisition focused", "SHRM certification section", "Culture and DEI experience"],
    keywords: ["Talent Acquisition", "HRIS", "Employee Relations", "Performance Management", "Onboarding", "SHRM"]
  },
  {
    title: "Graphic Designer Resume Example",
    industry: "Design",
    level: "Entry Level",
    format: "Combination",
    atsScore: 90,
    downloads: "8,900",
    rating: 4.6,
    badge: "Popular",
    highlights: ["Portfolio-first layout", "Creative yet ATS-safe format", "Print and digital design versions"],
    keywords: ["Adobe Illustrator", "Photoshop", "InDesign", "Typography", "Brand Identity", "Print Design"]
  },
  {
    title: "Teacher Resume Example",
    industry: "Education",
    level: "Mid Level",
    format: "Chronological",
    atsScore: 92,
    downloads: "14,200",
    rating: 4.8,
    badge: "Popular",
    highlights: ["K-12 and university versions", "Classroom management highlighted", "Curriculum development focus"],
    keywords: ["Curriculum Development", "Classroom Management", "Google Classroom", "IEP", "Differentiated Instruction", "STEM"]
  },
  {
    title: "Business Analyst Resume Example",
    industry: "Technology",
    level: "Mid Level",
    format: "Chronological",
    atsScore: 93,
    downloads: "11,700",
    rating: 4.7,
    badge: "Popular",
    highlights: ["Process improvement metrics", "JIRA and Agile experience", "Stakeholder communication focus"],
    keywords: ["Business Analysis", "JIRA", "SQL", "Process Improvement", "Requirements Gathering", "Agile"]
  },
  {
    title: "DevOps Engineer Resume Example",
    industry: "Technology",
    level: "Senior",
    format: "Chronological",
    atsScore: 96,
    downloads: "10,400",
    rating: 4.9,
    badge: "New",
    highlights: ["CI/CD pipeline experience", "Cloud certifications section", "Infrastructure as code focused"],
    keywords: ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform", "CI/CD"]
  },
  {
    title: "Content Writer Resume Example",
    industry: "Creative",
    level: "Entry Level",
    format: "Combination",
    atsScore: 89,
    downloads: "9,100",
    rating: 4.6,
    badge: "Popular",
    highlights: ["Portfolio and bylines section", "SEO writing skills highlighted", "Freelance and agency versions"],
    keywords: ["SEO Writing", "Content Strategy", "WordPress", "Copywriting", "Social Media", "Editorial Calendar"]
  },
  {
    title: "Project Manager Resume Example",
    industry: "Engineering",
    level: "Senior",
    format: "Chronological",
    atsScore: 94,
    downloads: "13,300",
    rating: 4.8,
    badge: "Popular",
    highlights: ["PMP certification highlighted", "Budget and scope management", "Cross-functional team leadership"],
    keywords: ["PMP", "Agile", "Scrum", "Risk Management", "Stakeholder Communication", "MS Project"]
  },
  {
    title: "Accountant Resume Example",
    industry: "Finance",
    level: "Mid Level",
    format: "Chronological",
    atsScore: 92,
    downloads: "10,600",
    rating: 4.7,
    badge: "Popular",
    highlights: ["CPA and non-CPA versions", "Tax and audit experience", "Big 4 and corporate formats"],
    keywords: ["QuickBooks", "CPA", "Tax Preparation", "Financial Reporting", "GAAP", "Audit"]
  },
  {
    title: "Customer Success Manager Resume Example",
    industry: "Technology",
    level: "Mid Level",
    format: "Chronological",
    atsScore: 91,
    downloads: "8,700",
    rating: 4.7,
    badge: "New",
    highlights: ["NPS and retention metrics", "SaaS customer success format", "Onboarding and churn reduction"],
    keywords: ["Customer Retention", "NPS", "Salesforce", "Churn Reduction", "Onboarding", "SaaS"]
  },
  {
    title: "Frontend Developer Resume Example",
    industry: "Technology",
    level: "Mid Level",
    format: "Chronological",
    atsScore: 95,
    downloads: "17,800",
    rating: 4.9,
    badge: "Most Popular",
    highlights: ["GitHub portfolio section", "React and Vue.js focused", "Performance optimization metrics"],
    keywords: ["React", "JavaScript", "TypeScript", "CSS", "Vue.js", "REST APIs"]
  },
  {
    title: "Operations Manager Resume Example",
    industry: "Engineering",
    level: "Senior",
    format: "Chronological",
    atsScore: 93,
    downloads: "9,400",
    rating: 4.7,
    badge: "Popular",
    highlights: ["Supply chain and logistics versions", "Cost reduction achievements", "Team size and P&L responsibility"],
    keywords: ["Operations Management", "Supply Chain", "Lean Six Sigma", "P&L", "Process Improvement", "KPIs"]
  },
  {
    title: "Social Media Manager Resume Example",
    industry: "Marketing",
    level: "Entry Level",
    format: "Combination",
    atsScore: 90,
    downloads: "12,100",
    rating: 4.7,
    badge: "Popular",
    highlights: ["Follower growth metrics", "Platform-specific expertise", "Content calendar management"],
    keywords: ["Instagram", "TikTok", "Content Creation", "Analytics", "Community Management", "Paid Social"]
  },
  {
    title: "Civil Engineer Resume Example",
    industry: "Engineering",
    level: "Mid Level",
    format: "Chronological",
    atsScore: 92,
    downloads: "7,800",
    rating: 4.6,
    badge: "New",
    highlights: ["PE license section", "Infrastructure project scale", "AutoCAD and BIM software"],
    keywords: ["AutoCAD", "BIM", "Structural Analysis", "Project Management", "PE License", "Construction Management"]
  },
  {
    title: "Career Change Resume Example",
    industry: "General",
    level: "Career Change",
    format: "Functional",
    atsScore: 90,
    downloads: "19,400",
    rating: 4.8,
    badge: "Most Popular",
    highlights: ["Transferable skills format", "Works for any industry switch", "Hides employment gaps naturally"],
    keywords: ["Transferable Skills", "Leadership", "Communication", "Problem Solving", "Adaptability", "Project Management"]
  },
  {
    title: "Digital Marketing Specialist Resume Example",
    industry: "Marketing",
    level: "Mid Level",
    format: "Chronological",
    atsScore: 92,
    downloads: "11,300",
    rating: 4.7,
    badge: "Popular",
    highlights: ["PPC and SEO metrics", "Google Ads certified format", "ROAS and CPA achievements"],
    keywords: ["Google Ads", "SEO", "PPC", "Facebook Ads", "Email Marketing", "Google Analytics"]
  },
  {
    title: "Executive Resume Example — C-Suite",
    industry: "General",
    level: "Executive",
    format: "Two Page",
    atsScore: 94,
    downloads: "8,200",
    rating: 4.9,
    badge: "Premium",
    highlights: ["Board-ready format", "P&L and company growth focus", "CEO, COO, CFO versions"],
    keywords: ["Executive Leadership", "Board Presentations", "Strategic Planning", "P&L Management", "M&A", "Organizational Growth"]
  }
];

export function ResumeExamples({ onNavigate, onLoadTemplate }: { onNavigate: (step: any) => void, onLoadTemplate?: (resumeData: any) => void }) {
  const [activeIndustry, setActiveIndustry] = useState('All Industries');
  const [activeExp, setActiveExp] = useState('All Levels');
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [selectedResume, setSelectedResume] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    // Inject SEO tags
    document.title = "Resume Examples 2025 — 500+ Free Professional Resume Samples | airesumi";
    const metaDesc = document.createElement('meta');
    metaDesc.name = "description";
    metaDesc.content = "Browse 500+ free resume examples and resume samples for every job title and industry in 2025. ATS-optimized, recruiter-approved resume templates that get interviews. Download free.";
    document.head.appendChild(metaDesc);
    
    const metaKw = document.createElement('meta');
    metaKw.name = "keywords";
    metaKw.content = "resume examples, resume examples 2025, professional resume examples, ATS resume examples, resume samples, free resume templates, resume examples by job title";
    document.head.appendChild(metaKw);

    const linkCanonical = document.createElement('link');
    linkCanonical.rel = "canonical";
    linkCanonical.href = "https://airesumi.com/examples";
    document.head.appendChild(linkCanonical);

    const schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Resume Examples 2025 — 500+ Free Professional Resume Samples",
      "description": "Browse 500+ free resume examples and resume samples for every job title and industry in 2025. ATS-optimized and recruiter-approved.",
      "url": "https://airesumi.com/examples",
      "mainEntity": {
        "@type": "ItemList",
        "name": "Professional Resume Examples",
        "numberOfItems": 500,
        "itemListElement": resumeExamples.slice(0, 3).map((r, i) => ({
          "@type": "ListItem", "position": i + 1, "name": r.title
        }))
      }
    });
    document.head.appendChild(schema);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.head.removeChild(metaDesc);
      document.head.removeChild(metaKw);
      document.head.removeChild(linkCanonical);
      document.head.removeChild(schema);
    };
  }, []);

  const filteredExamples = resumeExamples.filter(r => {
    const matchInd = activeIndustry === 'All Industries' || r.industry === activeIndustry;
    const matchExp = activeExp === 'All Levels' || r.level === activeExp;
    const matchSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchInd && matchExp && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#FFFBF7] font-sans selection:bg-[#EA580C] selection:text-white">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-[0_1px_3px_rgba(234,88,12,0.10)] border-b border-[#EA580C]/20' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => onNavigate(0)}>
            <div className="w-10 h-10 bg-[#EA580C] text-white rounded-xl flex items-center justify-center font-serif text-2xl font-bold">R</div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">airesumi</span>
          </div>
          
          <div className="hidden lg:flex gap-6 items-center">
            <button className="text-sm font-semibold text-[#EA580C]">Resume Examples</button>
            <button onClick={() => onNavigate(1)} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Resume Builder</button>
            <button className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">ATS Checker</button>
            <button className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Cover Letter</button>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button 
              onClick={() => onNavigate(1)}
              className="px-4 py-2 sm:px-6 sm:py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-medium rounded-full transition-all text-sm flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span className="hidden sm:inline">Build My Free Resume</span>
              <span className="sm:hidden">Build Resume</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
          Resume Examples 2025 — Browse 500+ <span className="text-[#EA580C]">Professional Resume Samples</span>
        </h1>
        <p className="text-xl text-gray-700 mb-6 max-w-3xl mx-auto leading-relaxed mt-4">
          Find real resume examples written for your exact job title, industry, and experience level. Every resume sample is ATS-optimized, recruiter-approved, and proven to land interviews in 2025.
        </p>
        <p className="text-sm text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed text-left md:text-center">
          Whether you are writing your first resume or updating an experienced professional resume, the fastest way to get started is by studying a strong example. Our library of 500+ free resume examples covers every job title from Software Engineer to Registered Nurse, every industry from Technology to Healthcare, and every experience level from entry-level graduates to senior executives. Every resume sample in our library follows the latest ATS formatting rules so your resume passes automated screening systems before it ever reaches a recruiter.
        </p>

        <div className="flex flex-wrap justify-center gap-6 mb-12">
           <div className="bg-[#FFF7ED] text-[#C2410C] px-5 py-2.5 rounded-full font-bold text-sm border border-[#FED7AA] flex items-center gap-2">
             <FileText className="w-4 h-4" /> 500+ Resume Examples
           </div>
           <div className="bg-[#FFF7ED] text-[#C2410C] px-5 py-2.5 rounded-full font-bold text-sm border border-[#FED7AA] flex items-center gap-2">
             <Briefcase className="w-4 h-4" /> 50+ Industries Covered
           </div>
           <div className="bg-[#FFF7ED] text-[#16A34A] px-5 py-2.5 rounded-full font-bold text-sm border border-green-200 flex items-center gap-2">
             <CheckCircle2 className="w-4 h-4" /> 94% Average ATS Score
           </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => document.getElementById('grid')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold rounded-xl text-lg transition-transform transform hover:scale-[1.02] shadow-[0_4px_14px_rgba(234,88,12,0.4)] flex items-center justify-center gap-2"
          >
            Browse Resume Examples <ArrowRight className="w-5 h-5"/>
          </button>
          <button 
            onClick={() => onNavigate(1)}
            className="px-8 py-4 bg-white border-2 border-[#EA580C] text-[#EA580C] font-bold rounded-xl text-lg hover:bg-[#FFF7ED] transition-colors flex items-center justify-center"
          >
            Build My Resume With AI
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(234,88,12,0.08)] border border-[#FED7AA]">
           <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Find Your Resume Example</h2>
           <div className="flex flex-col md:flex-row gap-4">
             <div className="relative flex-1">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
               <input 
                 type="text" 
                 placeholder="Search by job title e.g. Software Engineer, Nurse, Teacher..."
                 className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#EA580C] focus:border-[#EA580C] outline-none text-gray-800"
                 value={searchQuery}
                 onChange={e => setSearchQuery(e.target.value)}
               />
             </div>
             <div className="flex gap-4">
               <select 
                 className="px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#EA580C] outline-none bg-white text-gray-700 min-w-[160px]"
                 value={activeIndustry}
                 onChange={e => setActiveIndustry(e.target.value)}
               >
                 {["All Industries", "Technology", "Healthcare", "Finance", "Marketing", "Education", "Engineering", "Design", "Sales", "HR", "Legal", "Creative", "General"].map(i => <option key={i} value={i}>{i}</option>)}
               </select>
               <select 
                 className="px-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#EA580C] outline-none bg-white text-gray-700 min-w-[160px]"
                 value={activeExp}
                 onChange={e => setActiveExp(e.target.value)}
               >
                 {["All Levels", "Entry Level", "Mid Level", "Senior", "Manager", "Executive", "Career Change", "Student", "No Experience"].map(i => <option key={i} value={i}>{i}</option>)}
               </select>
             </div>
           </div>
           <div className="mt-4 text-sm font-medium text-gray-500 flex items-center justify-between">
             <span>Showing {filteredExamples.length} professional resume examples — updated for 2025</span>
             <div className="hidden md:flex gap-2">
               <span className="text-gray-400">Format:</span>
               {["Chronological", "Functional", "Combination", "One Page", "Two Page"].map(f => (
                 <button key={f} className="text-gray-600 hover:text-[#EA580C] underline decoration-gray-300 underline-offset-4">{f}</button>
               ))}
             </div>
           </div>
        </div>
      </div>

      {/* Featured Examples Section */}
      <div className="max-w-7xl mx-auto px-6 mb-20">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Editor's Pick — Most Downloaded Resume Examples This Week</h2>
        <p className="text-gray-600 mb-8 max-w-3xl">These resume samples have helped thousands of job seekers land interviews at top companies. Study the format, copy the structure, and personalize with your own experience.</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { t: "Software Engineer Resume Example", d: "Used by 34,000+ developers. Lands jobs at FAANG companies." },
            { t: "Marketing Manager Resume Example", d: "Proven resume format for marketing professionals in 2025." },
            { t: "Registered Nurse Resume Example", d: "ATS-optimized nurse resume sample for hospital and clinic roles." },
            { t: "Data Analyst Resume Example", d: "Quantified achievements format. 96% ATS score." }
          ].map((feat, i) => (
             <div key={i} className="bg-white rounded-2xl p-6 border border-[#FED7AA] shadow-[0_4px_12px_rgba(234,88,12,0.06)] hover:shadow-[0_8px_24px_rgba(234,88,12,0.12)] transition-shadow cursor-pointer relative overflow-hidden group" onClick={() => setSelectedResume(resumeExamples[0])}>
               <div className="absolute top-4 right-4 bg-[#FFF7ED] text-[#EA580C] text-xs font-bold px-2.5 py-1 rounded-full border border-[#FED7AA]">Editor's Pick 🏆</div>
               <div className="w-12 h-16 bg-gray-50 border border-gray-200 rounded mb-4 flex flex-col gap-1 p-2 group-hover:scale-105 transition-transform">
                 <div className="w-full h-1 bg-gray-300 rounded-full" />
                 <div className="w-3/4 h-1 bg-gray-200 rounded-full" />
                 <div className="w-full h-0.5 bg-gray-200 rounded-full mt-1" />
                 <div className="w-5/6 h-0.5 bg-gray-200 rounded-full" />
               </div>
               <h3 className="font-bold text-gray-900 mb-2">{feat.t}</h3>
               <p className="text-sm text-gray-600">{feat.d}</p>
             </div>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div id="grid" className="max-w-7xl mx-auto px-6 mb-24">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Browse All Resume Examples by Job Title</h2>
        <p className="text-gray-600 mb-10 max-w-3xl">Click any resume sample to preview the full layout, see what keywords are included, and build your own version using our AI resume builder.</p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredExamples.map((r, i) => (
            <div key={i} onClick={() => setSelectedResume(r)} className="bg-white rounded-2xl border border-gray-100 hover:border-[#EA580C] shadow-sm hover:shadow-[0_8px_24px_rgba(234,88,12,0.1)] transition-all cursor-pointer overflow-hidden flex flex-col h-full group">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{r.industry}</span>
                  {r.badge && (
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${
                      r.badge === 'New' ? 'bg-orange-50 text-orange-700' :
                      r.badge === 'Premium' ? 'bg-purple-50 text-purple-700' :
                      'bg-[#FFF7ED] text-[#EA580C]'
                    }`}>{r.badge}</span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-[#EA580C] transition-colors">{r.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{r.level} • {r.format}</p>
                
                <ul className="space-y-2 mb-6">
                  {r.highlights.slice(0,2).map((h, j) => (
                     <li key={j} className="text-xs text-gray-600 flex gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" /> {h}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gray-50 p-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {r.rating} <span className="text-gray-400 text-xs font-normal">({r.downloads})</span>
                </div>
                <div className="text-xs font-bold text-[#16A34A] bg-green-50 px-2 py-1 rounded-md border border-green-100">
                  {r.atsScore}% ATS
                </div>
              </div>
            </div>
          ))}
        </div>
        {filteredExamples.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
             <h3 className="text-xl font-bold text-gray-900 mb-2">No examples found</h3>
             <p className="text-gray-500">Try adjusting your filters or search term to find the right resume example.</p>
          </div>
        )}
      </div>

      {/* SEO Sections */}
      <div className="bg-white py-24 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 space-y-24">
           
           {/* Browse By Industry */}
           <div>
             <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Browse Resume Examples by Industry — Find Your Field</h2>
             <p className="text-gray-600 mb-10 max-w-3xl">Each industry section contains job-specific resume samples with the right keywords, format, and structure recruiters in that field expect to see.</p>
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               {[
                 { i: "Tech 💻", c: "84", v: "Technology" }, { i: "Healthcare 🏥", c: "62", v: "Healthcare" }, { i: "Finance 💰", c: "48", v: "Finance" }, 
                 { i: "Marketing 📣", c: "55", v: "Marketing" }, { i: "Design 🎨", c: "38", v: "Design" }, { i: "Education 📚", c: "41", v: "Education" }, 
                 { i: "Engineering ⚙️", c: "52", v: "Engineering" }, { i: "Sales 📈", c: "44", v: "Sales" }, { i: "Legal ⚖️", c: "29", v: "Legal" }, 
                 { i: "HR 👥", c: "33", v: "HR" }, { i: "Creative 🎭", c: "31", v: "Creative" }, { i: "Construction 🏗️", c: "27", v: "General" }
               ].map((ind, j) => (
                 <button key={j} onClick={() => { setActiveIndustry(ind.v); document.getElementById("examples-grid")?.scrollIntoView({ behavior: "smooth" }); }} className="p-4 border border-gray-200 rounded-xl hover:border-[#EA580C] hover:bg-[#FFF7ED] transition-all flex justify-between items-center group cursor-pointer bg-white w-full text-left">
                   <span className="font-bold text-gray-800 group-hover:text-[#C2410C]">{ind.i}</span>
                   <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full group-hover:bg-white">{ind.c} examples</span>
                 </button>
               ))}
             </div>
           </div>

           {/* Browse By Level */}
           <div>
             <h2 className="text-3xl font-extrabold text-gray-900 mb-10">Resume Examples by Experience Level — From Student to Executive</h2>
             <div className="grid md:grid-cols-2 gap-6">
                {[
                  { t: "Entry Level & No Experience", d: "Writing a resume with no experience is one of the most common challenges job seekers face. Our entry-level resume examples and no-experience resume samples show you how to highlight education, internships, volunteer work, and transferable skills to impress recruiters even without a full work history.", l: "47 entry-level resume examples →", v: "Entry Level" },
                  { t: "Mid Level (3–7 Years)", d: "Mid-level professionals need resumes that show career progression, measurable achievements, and readiness for greater responsibility. Our mid-level resume examples demonstrate how to frame 3 to 7 years of experience in a way that positions you for your next promotion or company move.", l: "89 mid-level resume examples →", v: "Mid Level" },
                  { t: "Senior Level (8+ Years)", d: "Senior professionals need resumes that lead with impact, not just duties. Our senior resume examples show how to quantify decades of experience, demonstrate leadership, and compete for director, VP, and head-of-department roles in a competitive job market.", l: "72 senior resume examples →", v: "Senior" },
                  { t: "Career Change", d: "Switching industries requires a different resume strategy. Our career change resume examples use a transferable skills format that repositions your existing experience for a completely new field — without hiding your background or leaving unexplained gaps.", l: "34 career change resume examples →", v: "Career Change" }
                ].map((lvl, k) => (
                  <div key={k} className="bg-[#FFFBF7] p-8 rounded-2xl border border-[#FED7AA]">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{lvl.t}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">{lvl.d}</p>
                    <button onClick={() => { setActiveExp(lvl.v); document.getElementById("examples-grid")?.scrollIntoView({ behavior: "smooth" }); }} className="font-bold text-[#EA580C] hover:text-[#C2410C] transition-colors cursor-pointer bg-transparent border-none p-0">{lvl.l}</button>
                  </div>
                ))}
             </div>
           </div>

           {/* Tips Strip */}
           <div>
             <h2 className="text-3xl font-extrabold text-gray-900 mb-10 text-center">Resume Writing Tips That Get Your Resume Past ATS and In Front of Recruiters</h2>
             <div className="grid md:grid-cols-4 gap-6">
                {[
                  { t: "Keep It 1-2 Pages", d: "Recruiters spend an average of 6 seconds scanning a resume. Keep yours to one page if you have under 10 years of experience, and two pages maximum for senior roles. Every line must earn its place." },
                  { t: "Use ATS Keywords", d: "Over 75% of resumes are rejected by Applicant Tracking Systems before a human reads them. Mirror the exact keywords from the job description in your resume to pass ATS screening automatically." },
                  { t: "Quantify Every Achievement", d: "Vague bullets like 'managed a team' mean nothing. Strong resume bullets say 'managed a team of 8 engineers, delivering 3 product launches on time and 20% under budget.' Numbers make your resume 40% more likely to get a callback." },
                  { t: "Tailor Per Application", d: "Sending the same resume to every job reduces your interview rate by 60%. Use our AI resume builder to tailor your resume to each job description in under 2 minutes — matching keywords and adjusting your summary automatically." }
                ].map((tip, m) => (
                  <div key={m} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-3 text-lg">{tip.t}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">{tip.d}</p>
                  </div>
                ))}
             </div>
           </div>

           {/* How To Use Steps */}
           <div className="bg-[#FFF7ED] rounded-3xl p-10 md:p-16 border border-[#FED7AA]">
             <h2 className="text-3xl font-extrabold text-gray-900 mb-4">How To Use a Resume Example To Write Your Own Resume in 2025</h2>
             <p className="text-lg text-gray-700 mb-12 max-w-3xl">Studying a strong resume example is the fastest way to write a better resume. Instead of starting from a blank page, you can follow a proven structure, copy the achievement format, and adapt the language for your own experience. Here is exactly how to do it.</p>
             
             <div className="grid md:grid-cols-4 gap-8">
               {[
                 { s: "Step 1", t: "Find a Resume Example for Your Exact Job Title", d: "Search our library by job title, industry, and experience level. The more specific the example, the more useful it is. A software engineer resume example is more helpful than a general tech resume because it contains the specific keywords, tools, and formatting that software engineering recruiters look for." },
                 { s: "Step 2", t: "Study the Structure and Format", d: "Look at how the resume is organized. Notice the order of sections, the length of bullet points, how achievements are phrased, and which skills are listed. ATS-optimized resumes follow a specific structure that helps automated systems parse your information correctly." },
                 { s: "Step 3", t: "Copy the Format and Achievement Style", d: "You are not copying the content — you are copying the structure. Take the bullet point format (Action verb + Task + Quantified result) and apply it to your own work experience. Take the skills section layout and fill it with your own tools and technologies." },
                 { s: "Step 4", t: "Build and Personalize With AI", d: "Use our AI resume builder to fill in your personal details, work history, and skills using the same format as the example. Our AI will automatically match your resume to any job description, optimize for ATS keywords, and suggest stronger achievement bullets based on your role." }
               ].map((step, n) => (
                 <div key={n} className="bg-white p-6 rounded-2xl shadow-sm">
                   <div className="text-xs font-black text-[#EA580C] uppercase tracking-wider mb-2">{step.s}</div>
                   <h3 className="font-bold text-gray-900 mb-3 text-lg leading-tight">{step.t}</h3>
                   <p className="text-sm text-gray-600 leading-relaxed">{step.d}</p>
                 </div>
               ))}
             </div>
             
             <div className="mt-12 text-center">
               <button onClick={() => onNavigate(1)} className="px-8 py-4 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold rounded-xl text-lg transition-transform transform hover:scale-[1.02] shadow-[0_4px_14px_rgba(234,88,12,0.4)]">
                 Start Building My Resume With AI →
               </button>
             </div>
           </div>

           {/* Popular Table */}
           <div>
             <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Most Downloaded Resume Examples in 2025</h2>
             <p className="text-gray-600 mb-8 max-w-3xl">These resume samples are downloaded most often by job seekers. They represent the roles with the highest hiring volume and the strongest demand for well-structured, ATS-optimized resumes.</p>
             
             <div className="overflow-x-auto">
               <table className="w-full text-left bg-white rounded-2xl border-collapse overflow-hidden border border-gray-200">
                 <thead className="bg-gray-50 border-b border-gray-200">
                   <tr>
                     <th className="p-4 font-bold text-gray-600">Rank</th>
                     <th className="p-4 font-bold text-gray-600">Job Title</th>
                     <th className="p-4 font-bold text-gray-600">Industry</th>
                     <th className="p-4 font-bold text-gray-600">ATS Score</th>
                     <th className="p-4 font-bold text-gray-600">Downloads</th>
                     <th className="p-4 font-bold text-gray-600">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                   {[
                     { r: 1, t: "Software Engineer Resume Example", i: "Technology", s: "96%", d: "34,200" },
                     { r: 2, t: "Entry Level Resume — No Experience", i: "General", s: "91%", d: "28,900" },
                     { r: 3, t: "Career Change Resume Example", i: "General", s: "90%", d: "19,400" },
                     { r: 4, t: "Registered Nurse Resume Example", i: "Healthcare", s: "95%", d: "22,100" },
                     { r: 5, t: "Product Manager Resume Example", i: "Technology", s: "95%", d: "16,300" },
                     { r: 6, t: "Frontend Developer Resume Example", i: "Technology", s: "95%", d: "17,800" },
                     { r: 7, t: "Marketing Manager Resume Example", i: "Marketing", s: "93%", d: "15,400" },
                     { r: 8, t: "Teacher Resume Example", i: "Education", s: "92%", d: "14,200" },
                     { r: 9, t: "Project Manager Resume Example", i: "Engineering", s: "94%", d: "13,300" },
                     { r: 10, t: "Sales Executive Resume Example", i: "Sales", s: "93%", d: "13,600" }
                   ].map(row => (
                     <tr key={row.r} className="hover:bg-gray-50 transition-colors">
                       <td className="p-4 font-bold text-gray-500">{row.r}</td>
                       <td className="p-4 font-bold text-gray-900">{row.t}</td>
                       <td className="p-4 text-gray-600">{row.i}</td>
                       <td className="p-4 font-bold text-[#16A34A]">{row.s}</td>
                       <td className="p-4 text-gray-600">{row.d}</td>
                       <td className="p-4"><button onClick={() => setSelectedResume(resumeExamples.find(re => re.title === row.t) || resumeExamples[0])} className="text-[#EA580C] font-bold hover:underline">Use Template</button></td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>

           {/* FAQ Area */}
           <div>
             <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Frequently Asked Questions About Resume Examples and Resume Writing</h2>
             <p className="text-gray-600 mb-8 max-w-3xl">Everything you need to know about finding the right resume example, using it correctly, and building an ATS-optimized resume that gets interviews in 2025.</p>
             <div className="space-y-4">
               {[
                 { q: "What is the best resume format in 2025?", a: "The best resume format in 2025 is the reverse-chronological format for most job seekers. It lists your most recent work experience first, which is what recruiters and ATS systems expect to see. The functional resume format works best for career changers or people with employment gaps, while the combination format suits senior professionals who want to highlight both skills and experience. Our resume examples cover all three formats so you can choose the right one for your situation." },
                 { q: "How long should my resume be in 2025?", a: "Your resume should be one page if you have under 10 years of work experience, and two pages if you have more. Executive-level resumes can occasionally be three pages, but only if every line is genuinely relevant. Recruiters spend an average of 6 to 7 seconds on an initial resume scan, so a concise, well-structured resume always outperforms a long, padded one. Our resume examples follow these length guidelines for every experience level." },
                 { q: "What is an ATS-optimized resume and why does it matter?", a: "An ATS-optimized resume is formatted and written so that Applicant Tracking Systems can correctly read, parse, and rank it. Over 98% of Fortune 500 companies use ATS software to screen resumes before a human recruiter sees them. A resume that fails ATS screening never reaches a hiring manager — regardless of how qualified the candidate is. ATS-safe resumes avoid tables, columns, images, and unusual fonts, and they include keywords directly from the job description. Every resume example in our library is ATS-optimized with an average ATS score of 94%." },
                 { q: "How do I write a resume with no experience?", a: "Writing a resume with no experience means focusing on transferable skills, education, internships, volunteer work, extracurricular activities, and personal projects. Use a functional or skills-based resume format that leads with what you can do rather than where you have worked. Quantify anything you can — number of people you led in a student project, GPA if above 3.5, percentage improvement in any volunteer initiative. Our entry-level resume examples and no-experience resume samples show you exactly how to structure this format for maximum impact." },
                 { q: "Should I use a resume template or write from scratch?", a: "Using a resume example or template is always faster and more effective than writing from scratch. A good resume example gives you the correct structure, the right achievement format, and proven language that recruiters in your industry respond to. Writing from scratch risks poor formatting, wrong section order, and weak bullet points. Use our resume examples as a structural guide, then customize the content with your own experience using our AI resume builder." },
                 { q: "How do I tailor my resume to a specific job description?", a: "Tailoring your resume to a job description means identifying the key skills, qualifications, and keywords in the job posting and making sure they appear in your resume — naturally and in context. Read the job description carefully and highlight repeated words and phrases. These are the ATS keywords the system is scanning for. Update your summary, skills section, and top bullet points to reflect these terms. Our AI resume builder does this automatically — paste any job description and it rewrites your resume to match in under 2 minutes." }
               ].map((faq, i) => (
                 <FAQItem key={i} question={faq.q} answer={faq.a} />
               ))}
             </div>
           </div>

        </div>
      </div>

      {/* Bottom CTA Banner */}
      <section className="bg-[#C2410C] py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">Found Your Perfect Resume Example? <br/>Now Build Yours in 2 Minutes</h2>
          <p className="text-xl text-[#FFF7ED] mb-10 max-w-3xl mx-auto leading-relaxed">
            Stop guessing what a great resume looks like. Use our AI resume builder to create an ATS-optimized, recruiter-approved resume based on the exact format of our top-performing resume examples — tailored to your job title, industry, and experience level.
          </p>
          <div className="flex flex-col items-center">
            <button onClick={() => onNavigate(1)} className="px-10 py-5 bg-white text-[#EA580C] font-extrabold rounded-full text-xl transition-transform transform hover:scale-[1.03] active:scale-[0.98] shadow-xl">
              Build My Free ATS Resume Now →
            </button>
            <p className="mt-4 text-sm text-[#FED7AA] font-medium opacity-90">Free to start. No credit card required. ATS score shown instantly.</p>
          </div>
        </div>
      </section>

      {/* Preview Modal */}
      <AnimatePresence>
        {selectedResume && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedResume(null)} className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
             <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-[#FFFBF7] w-full max-w-6xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-[#FED7AA]">
               <button onClick={() => setSelectedResume(null)} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 shadow-sm border border-gray-200">
                 <X className="w-5 h-5" />
               </button>
               
               {/* Left Panel - Resume Paper */}
               <div className="flex-1 bg-gray-100 p-6 md:p-12 overflow-y-auto hidden md:block">
                 <div className="bg-white w-full max-w-[800px] mx-auto min-h-[1000px] shadow-lg p-10 md:p-14 font-serif text-gray-800">
                    <div className="text-center mb-8 border-b border-gray-300 pb-6">
                      <h1 className="text-3xl font-bold uppercase tracking-widest text-gray-900 mb-2">James Anderson</h1>
                      <div className="text-sm text-gray-600 flex justify-center gap-4 flex-wrap">
                        <span>james.anderson@email.com</span>
                        <span>|</span>
                        <span>LinkedIn: /in/jamesanderson</span>
                        <span>|</span>
                        <span>GitHub: /jamesanderson</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">San Francisco, CA | (555) 012-3456</div>
                    </div>
                    
                    <div className="mb-6">
                      <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-900 pb-1 mb-3 text-gray-900">Professional Summary</h2>
                      <p className="text-sm leading-relaxed text-gray-700">Results-driven {selectedResume.title.split(' ')[0]} {selectedResume.title.split(' ')[1]} with 5+ years of experience building scalable applications and driving business outcomes. Proven track record of reducing system latency by 40% and delivering high-impact features used by 2M+ users. Expertise aligned perfectly with {selectedResume.industry} requirements.</p>
                    </div>

                    <div className="mb-6">
                      <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-900 pb-1 mb-4 text-gray-900">Work Experience</h2>
                      
                      <div className="mb-5">
                        <div className="flex justify-between font-bold text-gray-900 mb-1">
                          <span>Senior {selectedResume.title.split(' ')[0]} {selectedResume.title.split(' ')[1]} — TechCorp Inc</span>
                          <span>Jan 2022 – Present</span>
                        </div>
                        <div className="italic text-gray-600 text-sm mb-2">San Francisco, CA</div>
                        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1.5">
                          <li>Architected core platform handling 500K daily requests, reducing processing times by 40%</li>
                          <li>Led team of 4 professionals delivering $2M product feature on time and 15% under budget</li>
                          <li>Improved operational efficiency by 60% using automation and industry best practices</li>
                        </ul>
                      </div>

                      <div className="mb-5">
                        <div className="flex justify-between font-bold text-gray-900 mb-1">
                          <span>{selectedResume.title.split(' ')[0]} {selectedResume.title.split(' ')[1]} — StartupXYZ</span>
                          <span>Mar 2020 – Dec 2021</span>
                        </div>
                        <div className="italic text-gray-600 text-sm mb-2">Remote</div>
                        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1.5">
                          <li>Built end-to-end solutions serving 2M+ monthly active users with 99.9% uptime</li>
                          <li>Reduced infrastructure costs by $180K/year through extensive performance optimization</li>
                          <li>Mentored 3 junior team members; 2 promoted within 12 months</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-900 pb-1 mb-3 text-gray-900">Education</h2>
                      <div className="flex justify-between text-sm text-gray-800">
                        <span className="font-bold">B.S. in Related Field — State University</span>
                        <span>2019</span>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-sm font-bold uppercase tracking-widest border-b border-gray-900 pb-1 mb-3 text-gray-900">Core Competencies</h2>
                      <div className="text-sm text-gray-700">
                        {selectedResume.keywords.join(' • ')}
                      </div>
                    </div>

                 </div>
               </div>

               {/* Right Panel - Details & CTAs */}
               <div className="w-full md:w-[400px] bg-white p-8 flex flex-col overflow-y-auto">
                 <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedResume.title}</h3>
                 <p className="text-gray-500 mb-6">{selectedResume.industry} • {selectedResume.level}</p>

                 <div className="flex items-center gap-4 mb-6 p-4 bg-[#FFF7ED] rounded-xl border border-[#FED7AA]">
                   <div className="relative w-14 h-14">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#FED7AA" strokeWidth="3" />
                        <motion.path initial={{ strokeDasharray: "0, 100" }} animate={{ strokeDasharray: `${selectedResume.atsScore}, 100` }} transition={{ duration: 1 }} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#16A34A" strokeWidth="3" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-sm font-bold text-gray-900">{selectedResume.atsScore}</span>
                      </div>
                   </div>
                   <div>
                     <div className="font-bold text-gray-900 text-sm">ATS Score</div>
                     <div className="text-xs text-[#16A34A] font-bold">Excellent</div>
                   </div>
                 </div>

                 <div className="mb-6">
                   <h4 className="font-bold text-gray-900 mb-3 text-sm">What Makes This Resume Work:</h4>
                   <ul className="space-y-2">
                     <li className="flex items-start gap-2 text-sm text-gray-700">
                       <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                       Quantified every achievement with real numbers
                     </li>
                     <li className="flex items-start gap-2 text-sm text-gray-700">
                       <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                       Uses exact keywords recruiters search for
                     </li>
                     <li className="flex items-start gap-2 text-sm text-gray-700">
                       <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                       Clean ATS-safe formatting with no tables or graphics
                     </li>
                     <li className="flex items-start gap-2 text-sm text-gray-700">
                       <CheckCircle2 className="w-4 h-4 text-[#EA580C] shrink-0 mt-0.5" />
                       Strong summary targets the role directly
                     </li>
                   </ul>
                 </div>

                 <div className="mb-8">
                   <h4 className="font-bold text-gray-900 mb-3 text-sm">Keywords Included:</h4>
                   <div className="flex flex-wrap gap-2">
                     {selectedResume.keywords.map((kw: string, i: number) => (
                       <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-semibold">{kw}</span>
                     ))}
                   </div>
                 </div>

                 <div className="mt-auto space-y-3">
                   <button onClick={() => onNavigate(1)} className="w-full py-3.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold rounded-xl transition-all shadow-md text-sm">
                     Build My Own Version With AI →
                   </button>
                   <button onClick={() => onLoadTemplate?.(selectedResume)} className="w-full py-3.5 bg-white border-2 border-[#EA580C] hover:bg-[#FFF7ED] text-[#EA580C] font-bold rounded-xl transition-all text-sm">
                     Edit This Template
                   </button>
                 </div>
               </div>
             </motion.div>
           </div>
        )}
      </AnimatePresence>

    </div>
  );
}

function FAQItem({ question, answer }: { question: string, answer: string, key?: any }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-[#FED7AA] transition-colors">
      <button 
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
      >
        <span className="font-bold text-lg text-gray-900">{question}</span>
        <div className={`transform transition-transform duration-300 ${open ? 'rotate-180 text-[#EA580C]' : 'text-gray-400'}`}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>
      <AnimatePresence>
        {open && (
           <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
             <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4 cursor-text">
               {answer}
             </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
