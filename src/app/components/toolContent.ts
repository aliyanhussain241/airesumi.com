import type { HowToStep, FaqItem, FeatureItem } from "../components/ToolContentSection";

export interface ToolContent {
  whatTitle: string;
  whatParagraphs: string[];
  howToTitle: string;
  howToSteps: HowToStep[];
  faqs: FaqItem[];
  features?: FeatureItem[];
}

/* ------------------------------------------------------------------ */
/* Resume builder                                                      */
/* ------------------------------------------------------------------ */
export const RESUME_CONTENT: ToolContent = {
  whatTitle: "What Is an AI Resume Creator — and How Is It Different?",
  whatParagraphs: [
    "A lot of people expect an AI resume creator to drop their name into a generic template. That's not what this does. It reads the job description you paste and builds your resume around it — your experience, your skills, your job title, formatted and worded to match what that specific employer is looking for.",
    "The output is a complete, ATS-ready PDF. It's not perfect for everyone on the first pass — some people need to tweak a bullet or adjust the summary — but you're editing a solid draft, not starting from a blank page. And the whole thing is free. No credit card, no paywall on the core builder.",
  ],
  howToTitle: "How to Build a Resume That Gets Interviews",
  howToSteps: [
    { title: "Start with the job description", desc: "Paste the exact role you're applying for. The AI extracts required skills and keywords so your resume mirrors what recruiters and ATS software are scanning for." },
    { title: "Lead each bullet with a result", desc: "Recruiters skim in 6 seconds. Start every bullet with a measurable outcome — 'Increased conversion 34%' beats 'Responsible for conversion optimization'." },
    { title: "Keep it to one page (unless senior)", desc: "0-10 years of experience → one page. 10+ years or executive → up to two. Anything longer gets skimmed and dropped." },
    { title: "Pick a clean, ATS-safe template", desc: "Avoid columns, text boxes, and graphics. All Airesumi templates are single-column and parse cleanly in Workday, Greenhouse, Lever, and Taleo." },
  ],
  faqs: [
    { q: "Is the AI resume builder free?", a: "Yes. Building and downloading your first resume is completely free. No credit card, no sign-up required to generate." },
    { q: "Will my resume pass ATS (Applicant Tracking Systems)?", a: "Yes. Every Airesumi template is built single-column with standard headings — the exact format that Workday, Greenhouse, Lever, and Taleo parse without errors." },
    { q: "Can I upload my existing CV?", a: "Yes. Upload your PDF or DOCX and the AI extracts your details, then rewrites bullets and summary to match the role you're targeting." },
    { q: "How long does it take to build a resume?", a: "Most users go from a blank page to a downloaded PDF in under 3 minutes when they upload an existing CV, and about 8 minutes starting from scratch." },
    { q: "Can I edit the resume after the AI generates it?", a: "Yes. Every field is editable. Tweak bullets, swap templates, and re-download as many times as you want." },
    { q: "What file format do I download?", a: "PDF by default, which is the format 98% of employers request. The PDF is text-based (not an image), so ATS software can still read every word." },
    { q: "Is there a truly free AI resume creator — no credit card?", a: "Yes. airesumi's core resume builder is free with no credit card required. Build, customize, and download your resume as a PDF. A Pro plan exists for unlimited saves and premium templates, but it's not required to get a complete, usable resume." },
    { q: "Can airesumi tailor my resume to a specific job description?", a: "That's the main thing it does. Paste the job description and your background, and the AI aligns your resume to match the keywords, skills, and priorities the employer listed. This is what gets resumes past ATS filters and in front of humans." },
    { q: "How good are AI-generated resumes compared to writing one yourself?", a: "A well-prompted AI resume is typically stronger than what most people write on their own — not because AI is smarter, but because it doesn't second-guess itself or undersell experience. The key is giving it accurate information. airesumi asks the right questions so the output is specific to you, not generic." },
  ],
  features: [
    { title: "AI-Powered Content", desc: "Gemini-powered bullets, summary, and skills — tailored to the exact job description you paste." },
    { title: "ATS-Safe Templates", desc: "Single-column layouts parsed cleanly by Workday, Greenhouse, Lever, and Taleo." },
    { title: "One-Click CV Import", desc: "Upload your existing PDF or DOCX — we extract and rewrite everything for the target role." },
    { title: "10+ Premium Designs", desc: "From minimal to executive. Swap templates any time without losing your content." },
    { title: "Live Preview", desc: "See changes update in real time in a paper-accurate preview before you download." },
    { title: "PDF Download, No Watermark", desc: "Text-based, recruiter-ready PDF — the format 98% of employers accept." },
  ],
};

/* ------------------------------------------------------------------ */
/* Bullet Writer                                                       */
/* ------------------------------------------------------------------ */
export const BULLET_CONTENT: ToolContent = {
  whatTitle: "What is a Resume Bullet Writer?",
  whatParagraphs: [
    "A resume bullet writer turns a plain task description into a metric-driven achievement bullet. You describe what you did; the AI rewrites it in the STAR format (Situation, Task, Action, Result) with strong action verbs and quantified impact.",
    "Great bullets are the single biggest lever for interview callbacks. Airesumi's free bullet writer gives you five variations per input so you can pick the one that best matches the role you're applying for.",
  ],
  howToTitle: "How to Write Resume Bullets That Get Noticed",
  howToSteps: [
    { title: "Start with a strong action verb", desc: "'Led', 'Shipped', 'Reduced', 'Grew' — never 'Responsible for' or 'Helped with'. Action verbs make you the driver, not a passenger." },
    { title: "Quantify the result", desc: "Numbers make bullets credible. Percentages, dollar amounts, team size, users served, time saved — pick the metric that matters for the role." },
    { title: "Show the how, briefly", desc: "One clause on what you actually did, so the bullet is repeatable and specific rather than a vague claim." },
    { title: "Tie it to business impact", desc: "Revenue, retention, cost, speed, quality — the outcome the hiring manager cares about. That's what makes a bullet worth reading." },
  ],
  faqs: [
    { q: "Is the bullet writer free?", a: "Yes. Generate as many resume bullets as you need — free, no sign-up required." },
    { q: "How does the AI write my bullets?", a: "You describe what you did in plain language. The AI rewrites it using the STAR format with a strong action verb, a quantified result, and a business-impact tie-in." },
    { q: "Can I use these bullets on LinkedIn?", a: "Yes. The generated bullets work directly in LinkedIn Experience sections, cover letters, and interview stories — anywhere achievement-focused writing helps." },
    { q: "What if I don't have exact numbers?", a: "Use ranges or approximations ('~20%', '5+ team members', 'reduced by roughly half'). Recruiters know most metrics are estimates — vague beats missing." },
    { q: "How many bullet variations does the AI generate?", a: "Five variations per input, so you can pick the tone and emphasis that best fits the job description." },
  ],
  features: [
    { title: "5 Variations Per Bullet", desc: "Every generation returns 5 rewrites so you can pick the strongest tone and emphasis." },
    { title: "STAR-Formatted Output", desc: "Situation, Task, Action, Result — the format recruiters and hiring managers score highest." },
    { title: "Strong Action Verbs", desc: "Led, shipped, reduced, grew — no 'responsible for' or 'helped with' filler." },
    { title: "Quantified Impact", desc: "AI adds realistic metrics and percentages so your bullets prove impact, not just activity." },
    { title: "JD Keyword Matching", desc: "Paste a job description and bullets auto-mirror the exact skills recruiters filter on." },
    { title: "One-Click Copy", desc: "Copy any bullet — or all five at once — straight into your resume or LinkedIn." },
  ],
};

/* ------------------------------------------------------------------ */
/* Summary Generator                                                   */
/* ------------------------------------------------------------------ */
export const SUMMARY_CONTENT: ToolContent = {
  whatTitle: "What is a Resume Summary Generator?",
  whatParagraphs: [
    "A resume summary is the 3-4 sentence pitch at the top of your resume — the first thing a recruiter reads. A summary generator writes it for you based on your experience, target role, and industry.",
    "Airesumi's AI summary generator produces three tailored variations at once — Concise, Confident, and Story-driven — so you can pick the tone that matches the company culture.",
  ],
  howToTitle: "How to Write a Resume Summary That Gets You Read",
  howToSteps: [
    { title: "Lead with your title and years", desc: "Open with what you are: 'Senior Product Designer with 7 years shipping consumer mobile apps.' Recruiters need context in the first three seconds." },
    { title: "Name your top 2 achievements", desc: "Pick your strongest, most quantified wins. This is your proof that the title in line one is real." },
    { title: "Signal what you're targeting next", desc: "Close with the kind of role you want. This tells the recruiter this application isn't accidental — you're intentional about the move." },
    { title: "Keep it under 4 sentences", desc: "A summary that runs longer stops being a summary. If it needs a fifth sentence, it belongs in the experience section." },
  ],
  faqs: [
    { q: "Do I need a resume summary?", a: "For anyone with 2+ years of experience, yes. It's the highest-read section of a resume and sets the frame for everything below it." },
    { q: "Is a summary the same as an objective?", a: "No. Objectives ('Seeking a role where I can grow…') are outdated and self-focused. Summaries lead with what you offer the employer." },
    { q: "How long should a resume summary be?", a: "3 to 4 sentences, roughly 50-80 words. Long enough to prove credibility, short enough to be skimmed in 6 seconds." },
    { q: "Is the summary generator free?", a: "Yes, and it produces three variations per generation so you can compare tones side by side." },
    { q: "Can I use the summary as my LinkedIn About section?", a: "Yes, with light editing. LinkedIn About allows a more personal, first-person tone — use the AI output as a starting draft." },
  ],
  features: [
    { title: "3 Tone Variations", desc: "Concise, Confident, and Story-driven — pick the voice that fits the company culture." },
    { title: "Role-Tailored Output", desc: "Summaries reflect your exact title, years, and target industry — not generic templates." },
    { title: "Recruiter-Optimized Length", desc: "Every summary lands at 50–80 words, the sweet spot for 6-second recruiter skims." },
    { title: "Achievement Front-Loaded", desc: "Your strongest quantified wins appear in the first two sentences where they get read." },
    { title: "LinkedIn-Ready", desc: "Reuse the same summary as your LinkedIn About section with minimal edits." },
    { title: "Instant Regenerate", desc: "Don't like a version? Regenerate three fresh ones in seconds — no credits, no limits." },
  ],
};

/* ------------------------------------------------------------------ */
/* Keyword Scanner                                                     */
/* ------------------------------------------------------------------ */
export const KEYWORD_CONTENT: ToolContent = {
  whatTitle: "What is a Resume Keyword Scanner?",
  whatParagraphs: [
    "A resume keyword scanner compares your resume against a job description and shows you exactly which required skills, tools, and phrases are missing. It mirrors what an ATS (Applicant Tracking System) does when it screens your application.",
    "Airesumi's free scanner extracts the important keywords from any job posting, checks your resume for coverage, and returns a match score plus a fix-list you can apply in minutes.",
  ],
  howToTitle: "How to Use Keyword Analysis to Beat the ATS",
  howToSteps: [
    { title: "Paste the exact job description", desc: "Use the posting you're actually applying to. Generic role descriptions miss the specific tools and phrases this employer weights." },
    { title: "Aim for a match score above 70%", desc: "Most ATS filters pass resumes that hit 60-70% keyword coverage. Above 80% and you land in the shortlist for human review." },
    { title: "Add keywords in context, not as a list", desc: "Weave missing keywords into your bullets and skills section. Keyword-stuffing at the bottom is easy for humans (and modern ATS) to spot and discount." },
    { title: "Re-scan after every edit", desc: "Every application deserves a fresh scan. The keywords for 'Product Manager' at a fintech differ from a healthtech — tailor for each posting." },
  ],
  faqs: [
    { q: "How does the keyword scanner work?", a: "The AI parses the job description, extracts required skills, tools, and phrases, then checks your resume text for each one and produces a match percentage." },
    { q: "What's a good ATS match score?", a: "60-70% is the pass threshold for most ATS filters. 80%+ significantly increases your chances of reaching a recruiter's review queue." },
    { q: "Is the keyword scanner free?", a: "Yes. Scan unlimited resumes against unlimited job descriptions — no sign-up required." },
    { q: "Does adding keywords guarantee an interview?", a: "No — it gets you past the automated screen. Once a recruiter opens your resume, achievements and clarity still decide the callback." },
    { q: "Should I copy-paste the keywords exactly?", a: "Match the phrasing where honest ('React' vs 'ReactJS'), but never claim a skill you don't have. ATS gets you seen; the interview verifies the claim." },
  ],
  features: [
    { title: "Live Match Score", desc: "Instant 0–100% coverage score with pass / borderline / fail visual tiers." },
    { title: "Missing Keyword List", desc: "See every required skill, tool, and phrase your resume is missing — ranked by importance." },
    { title: "Hard vs Soft Skill Split", desc: "Separates technical must-haves from nice-to-have soft skills so you fix the right gaps first." },
    { title: "ATS Simulation Engine", desc: "Mirrors what Workday, Greenhouse, and Lever actually parse — not a keyword-count toy." },
    { title: "Unlimited Re-Scans", desc: "Scan the same resume against every posting you apply to — free, no limits." },
    { title: "Copy-Ready Fix List", desc: "Suggested phrasings you can paste directly into bullets and the skills section." },
  ],
};

/* ------------------------------------------------------------------ */
/* LinkedIn Bio                                                        */
/* ------------------------------------------------------------------ */
export const LINKEDIN_CONTENT: ToolContent = {
  whatTitle: "What is a LinkedIn Bio Generator?",
  whatParagraphs: [
    "A LinkedIn bio generator turns your resume into three key profile assets: a keyword-optimized headline (220 chars), a compelling About section (2,600 chars), and a skills list ordered by recruiter demand.",
    "Airesumi's AI generator writes in first person, uses LinkedIn's SEO signals so recruiters find you in searches, and produces a bio you can paste directly into your profile.",
  ],
  howToTitle: "How to Write a LinkedIn Profile That Attracts Recruiters",
  howToSteps: [
    { title: "Write a headline that's more than your title", desc: "'Product Manager' is invisible in search. 'Product Manager | B2B SaaS | Growth & Onboarding | ex-Stripe' packs keywords recruiters actively search for." },
    { title: "Use the first 3 lines of About wisely", desc: "LinkedIn truncates the About section after ~370 characters. Front-load your pitch — years, focus area, biggest result — before the '…see more' cut." },
    { title: "List skills recruiters actually search", desc: "LinkedIn's recruiter tool ranks profiles by endorsed skills. Add the 10-15 most in-demand skills for your target role, not just what you know." },
    { title: "Match your headline to your target role", desc: "If you're pivoting, don't cling to your last title. Position for the role you want next; recruiters filter by keywords, not career history." },
  ],
  faqs: [
    { q: "Is the LinkedIn bio generator free?", a: "Yes. Generate your headline, About, and skills list — free, no sign-up." },
    { q: "How long should my LinkedIn About section be?", a: "1,300-2,000 characters (roughly 200-300 words). Long enough to prove credibility, short enough that recruiters read to the end." },
    { q: "Will a keyword-optimized profile actually show up in search?", a: "Yes. LinkedIn Recruiter ranks profiles primarily by keyword matches in headline, About, experience titles, and skills — those four fields drive most inbound InMails." },
    { q: "Can I use my resume text as-is on LinkedIn?", a: "No — resume writing is third-person and terse; LinkedIn is first-person and conversational. The generator handles the rewrite." },
    { q: "How often should I update my LinkedIn bio?", a: "Every 6 months, or immediately after a role change, promotion, or new certification. Fresh profiles rank higher in recruiter search." },
  ],
  features: [
    { title: "Headline + About + Skills", desc: "Three assets in one pass — 220-char headline, 2,600-char About, and ranked skills list." },
    { title: "First-Person Voice", desc: "Conversational LinkedIn tone, not stiff third-person resume copy." },
    { title: "SEO-Tuned Keywords", desc: "Placed in the four fields LinkedIn Recruiter actually weighs: headline, About, titles, skills." },
    { title: "Industry Targeting", desc: "Choose your industry and seniority — output speaks the vocabulary of your target market." },
    { title: "Truncation-Aware", desc: "Front-loads your pitch in the first 370 characters before LinkedIn's '…see more' cut." },
    { title: "Editable Blocks", desc: "Tweak each section inline before you copy it into your profile — no all-or-nothing regen." },
  ],
};

/* ------------------------------------------------------------------ */
/* Interview Prep                                                      */
/* ------------------------------------------------------------------ */
export const INTERVIEW_CONTENT: ToolContent = {
  whatTitle: "What is an AI Interview Question Generator?",
  whatParagraphs: [
    "An AI interview question generator produces realistic, role-specific interview questions in seconds — behavioral, technical, situational, culture-fit, case-study, and salary-negotiation prompts calibrated to your job title, seniority, industry, and company size. Instead of scrolling through generic \"top 100 questions\" lists that were written for everyone and no one, you rehearse the exact patterns hiring managers use for roles like yours in 2026.",
    "Research from LinkedIn's Global Talent Trends and Glassdoor's hiring reports consistently shows that candidates who complete at least 3 structured mock-interview sessions are roughly 2× more likely to receive an offer. The reason is simple: interviewing is a performance skill. Reading questions is not practice — answering them out loud, timing yourself, and iterating on weak answers is.",
    "Airesumi's free AI interview coach mirrors modern hiring loops at companies like Google, Amazon, Stripe, Microsoft, and high-growth startups. It combines the STAR method (Situation, Task, Action, Result) for behavioral rounds, the CARL method (Context, Action, Result, Learning) for reflection questions, and role-specific technical prompts — so a Senior Data Engineer doesn't waste time practicing entry-level SQL, and a first-time PM isn't ambushed by staff-level system design.",
  ],
  howToTitle: "How to Prepare for a Job Interview in 2026 (Recruiter-Backed Playbook)",
  howToSteps: [
    { title: "Decode the job description first", desc: "Highlight every verb, tool, and metric in the posting. Those exact phrases become the keywords behind 70–80% of the questions you'll be asked. If the JD mentions \"cross-functional stakeholder alignment\" three times, expect at least two behavioral questions probing exactly that." },
    { title: "Build 6–8 STAR stories that flex", desc: "The average 45-minute behavioral round covers 4–6 questions. Six well-crafted stories — each showing leadership, conflict, failure, impact, ambiguity, and collaboration — can be recombined to answer 80% of behavioral prompts. Write them down in a single doc; edit them until every Result has a number." },
    { title: "Rehearse out loud with a timer", desc: "Answers should land in 90–120 seconds. Silent rehearsal skips the hardest part: forming coherent sentences in real time. Record yourself on your phone, play it back, and cut the filler (\"um,\" \"basically,\" \"kind of\") — this alone lifts perceived confidence dramatically." },
    { title: "Research the company for 30 focused minutes", desc: "Read the product page, the three most recent blog or press posts, the CEO's latest LinkedIn post, and one Glassdoor interview review. Reference something specific in your answers — it is the single strongest signal of genuine interest and separates you from candidates spraying 40 applications a week." },
    { title: "Prepare 5–7 questions to ask the interviewer", desc: "The \"do you have questions for us?\" moment is where offers are won or lost. Ask about the team's biggest challenge this quarter, how success is measured in the first 90 days, and what the interviewer personally enjoys about working there. Avoid PTO, salary, and remote-policy questions until the offer stage." },
    { title: "Master the first and last 60 seconds", desc: "Interviewers form ~55% of their opinion in the first minute (first-impression research from Harvard Business Review) and remember the last thing you say most vividly (recency bias). Nail your \"tell me about yourself\" in under 90 seconds and close with a confident, specific thank-you and a forward-looking question." },
    { title: "Do a mock interview 24 hours before", desc: "Not the morning of — you want time to iterate. Use this AI generator or a friend in the industry. The goal isn't perfection; it's exposing the two or three questions that make you freeze so you can pre-write answers for them." },
  ],
  faqs: [
    { q: "What types of interview questions does the AI generate?", a: "Six categories: Behavioral (STAR-style stories about past experience), Technical (role-specific problems and concepts), Situational (hypothetical \"what would you do if…\" prompts), Culture Fit (values and motivation), Case Study (business or product scenarios for consulting, PM, and strategy roles), and Salary Negotiation (offer, counter, and compensation-package prompts). You choose which categories to include for each session." },
    { q: "Is the AI interview question generator really free?", a: "Yes — 100% free, no credit card, no sign-up required. Generate unlimited question sets for any role, seniority level, industry, or company type. You can bookmark favorites and export sessions to PDF or plain text for offline practice." },
    { q: "How many questions should I practice before an interview?", a: "20–30 questions across categories is enough for most roles; 40–60 for FAANG-style loops, executive interviews, or consulting case rounds. Practice depth over breadth — a strong, timed 2-minute answer to 15 questions beats a shallow answer to 60. Focus 60% of your prep on behavioral, 30% on technical/case, 10% on culture and questions-for-them." },
    { q: "Does the AI give me sample answers I can use?", a: "For every question you get an expert answer framework — what a strong response includes, the structure to follow (STAR, CARL, or PREP), and why the interviewer is really asking. The generator will not script your personal stories for you; those have to come from your actual experience to sound authentic and survive follow-up questions." },
    { q: "How is this different from generic interview question lists on Google?", a: "Generic lists give a Senior Backend Engineer the same \"name your greatest weakness\" prompt they give an entry-level marketing intern. This generator tailors questions to your exact title, seniority, industry, and company size — so a Staff Product Manager at a fintech gets stakeholder-alignment, roadmap-tradeoff, and 0-to-1 launch questions instead of \"why do you want this job?\"" },
    { q: "How far in advance should I start interview prep?", a: "For a standard corporate role: 5–7 days of 45-minute daily sessions. For FAANG or top-tier consulting: 4–8 weeks, including live mock interviews with peers. Cramming the night before rarely works — sleep, hydration, and one light warm-up session on the morning of the interview outperform a marathon prep session." },
    { q: "What's the STAR method, and does every answer need it?", a: "STAR = Situation, Task, Action, Result. Use it for behavioral questions (\"tell me about a time…\") — it forces you to include a measurable outcome, which is what interviewers score. For technical or opinion questions, use PREP instead (Point, Reason, Example, Point) so you don't shoehorn a story where a direct answer belongs." },
    { q: "How do I answer \"tell me about yourself\" without rambling?", a: "Use the Present–Past–Future formula in 60–90 seconds. Present: your current role and one impressive result. Past: the 1–2 experiences that got you here. Future: why this specific role at this specific company is the logical next step. Rehearse it until it sounds conversational, not memorized." },
    { q: "How should I handle a question I don't know the answer to?", a: "Never fake it — interviewers ask follow-ups. Say \"I haven't worked with X directly, but here's how I'd approach it based on Y,\" then walk through your reasoning. Demonstrating thinking beats bluffing knowledge every time, especially in technical rounds." },
    { q: "Are virtual interviews scored differently from in-person?", a: "The questions are the same, but virtual interviews weight camera presence, eye contact (look at the lens, not the screen), audio clarity, and background heavily. Test your setup 30 minutes before, use wired headphones, and light your face from the front. About 20% of remote candidates are dinged for tech issues alone." },
    { q: "What questions should I ask the interviewer at the end?", a: "Ask about the team's biggest challenge this quarter, how the person interviewing you decided to join, what success looks like in the first 90 days, and what the promotion path looks like from this role. Avoid salary, PTO, and remote-policy questions until the offer conversation." },
    { q: "Can I use this tool to prep for technical coding interviews?", a: "Yes, for conceptual and system-design questions and for the behavioral portion of technical loops (which is often 40–50% of the score). For live coding practice, pair this with LeetCode, HackerRank, or Excalidraw system-design drills — the generator handles the interview structure and communication side that pure coding sites don't." },
  ],
};

/* ------------------------------------------------------------------ */
/* Salary Analyzer                                                     */
/* ------------------------------------------------------------------ */
export const SALARY_CONTENT: ToolContent = {
  whatTitle: "What is a Salary Analyzer?",
  whatParagraphs: [
    "A salary analyzer benchmarks compensation for a specific role, location, and experience level against current market data — base, bonus, equity, and total comp — so you know your number before you negotiate.",
    "Airesumi's AI salary analyzer factors in role, seniority, industry, and region to produce a realistic salary range plus negotiation talking points you can use in your next offer conversation.",
  ],
  howToTitle: "How to Use Salary Data to Negotiate a Better Offer",
  howToSteps: [
    { title: "Know your range before the recruiter call", desc: "When the recruiter asks 'what are you looking for?', a specific range signals research. 'Market rate' signals you'll accept anything." },
    { title: "Anchor at the top of your range, not the middle", desc: "Offers rarely go up more than 10-15% from your first number. Start where you'd be delighted; you can always come down to where you'd be satisfied." },
    { title: "Negotiate total comp, not just base", desc: "Signing bonus, equity refreshers, and PTO are often more flexible than base salary. Ask for the full package before deciding it's 'not enough.'" },
    { title: "Always get the offer in writing before responding", desc: "Verbal numbers change. A written offer is a real offer; anything else is a conversation, and you should not counter a conversation." },
  ],
  faqs: [
    { q: "How accurate is the AI salary analyzer?", a: "The AI is trained on aggregated compensation data across roles, regions, and seniorities. Ranges are directional — use them alongside Levels.fyi, Glassdoor, and Blind for a full picture." },
    { q: "Is the salary analyzer free?", a: "Yes. Compare unlimited roles across regions and seniority levels — free, no sign-up required." },
    { q: "Does the range include equity and bonus?", a: "Yes. Total comp includes base salary, target bonus, and expected equity value at grant. Base-only comparisons undersell most tech and finance roles." },
    { q: "Should I share my current salary with a recruiter?", a: "No — in most US states it's illegal for employers to ask, and it anchors the offer to your last comp rather than the role's market value. Redirect to your target range." },
    { q: "How often does salary data change?", a: "Materially every 6-12 months, faster during hiring booms or freezes. Re-check any role you're targeting within 6 months of your negotiation." },
  ],
  features: [
    { title: "Total-Comp Ranges", desc: "Base + bonus + equity in one number — not just base salary that undersells your offer." },
    { title: "Role & Region Filters", desc: "Benchmark by exact title, seniority, industry, and city — global coverage." },
    { title: "Negotiation Talking Points", desc: "AI-generated scripts you can use verbatim on recruiter calls to counter an offer." },
    { title: "Anchor-Range Guidance", desc: "Shows where to open, where to land, and where to walk away for your target role." },
    { title: "Live Market Data", desc: "Ranges recalibrated regularly against current comp data — not stale 2019 numbers." },
    { title: "Free Unlimited Compares", desc: "Compare as many roles, cities, and seniorities as you want — no sign-up." },
  ],
};

/* ------------------------------------------------------------------ */
/* PDF / Document Scanner                                              */
/* ------------------------------------------------------------------ */
export const PDF_SCANNER_CONTENT: ToolContent = {
  whatTitle: "What is a Mobile Document Scanner?",
  whatParagraphs: [
    "A mobile document scanner uses your phone camera to capture a document, auto-detect the edges, correct perspective, and export it as a clean, multi-page PDF — no scanner hardware required.",
    "Airesumi's browser-based scanner works on any phone with a camera. Capture, reorder, apply document filters, and download a PDF you can attach to a job application or email in seconds.",
  ],
  howToTitle: "How to Get Scanner-Quality PDFs From Your Phone",
  howToSteps: [
    { title: "Lay the document on a flat, dark surface", desc: "Dark surfaces make edge detection more reliable. Wrinkled documents scan poorly — flatten first." },
    { title: "Use even, indirect lighting", desc: "Overhead light beats window light. Shadows fool the auto-crop and produce dark bands across the page." },
    { title: "Shoot straight down, not at an angle", desc: "Hold the phone parallel to the page. Perspective correction fixes small tilts; big tilts distort text." },
    { title: "Apply 'Document' filter for color, 'B&W' for text-only", desc: "The Document filter cleans backgrounds while keeping stamps and highlights. Pure text? B&W produces smaller files that email faster." },
  ],
  faqs: [
    { q: "Do I need to install an app?", a: "No. The scanner runs in your mobile browser — Safari, Chrome, or any browser with camera access. Works on iOS and Android." },
    { q: "Is my document uploaded to a server?", a: "No. Scanning happens on your device. The PDF is generated in the browser and saved directly to your phone — nothing leaves your device." },
    { q: "Can I scan multi-page documents?", a: "Yes. Capture pages one at a time, reorder them by drag, and export as a single multi-page PDF." },
    { q: "Is the scanner free?", a: "Yes. Unlimited scans, unlimited pages, no watermark — free forever." },
    { q: "What's the maximum PDF file size?", a: "There's no hard limit — the scanner compresses images so a 20-page text document typically stays under 5 MB, small enough to email or upload to any job portal." },
  ],
  features: [
    { title: "Auto Edge Detection", desc: "Finds document corners the moment you snap — with a 4-point crop editor for manual override." },
    { title: "Perspective Correction", desc: "Real bilinear homography warp turns tilted photos into flat, straight-on pages." },
    { title: "6 Smart Filters", desc: "Original, Magic Auto, Document, Vivid, Grayscale, and B&W — pick the best look per page." },
    { title: "OCR Text Extraction", desc: "Tesseract-powered OCR pulls copyable text out of any scanned page in your browser." },
    { title: "Password-Protected PDF", desc: "AES-encrypt sensitive scans with an open password before you download or share." },
    { title: "100% On-Device", desc: "Nothing uploads — capture, OCR, and PDF export all happen locally in your browser." },
  ],
};

/* ------------------------------------------------------------------ */
/* Resignation Letter                                                  */
/* ------------------------------------------------------------------ */
export const RESIGNATION_CONTENT: ToolContent = {
  whatTitle: "What is a Resignation Letter Generator?",
  whatParagraphs: [
    "A resignation letter is a short, formal document that confirms your last day, thanks your employer, and leaves the door open for a good reference. A generator writes it for you in the right tone — professional, brief, and non-confrontational.",
    "Airesumi's free resignation letter generator asks for your details (name, role, last day, manager) and produces a printable PDF in seconds, in the tone you choose: Formal, Grateful, Brief, or Career-change.",
  ],
  howToTitle: "How to Resign Professionally and Protect Your Reference",
  howToSteps: [
    { title: "Tell your manager in person (or on a call) first", desc: "A letter that lands in HR before your manager has heard from you burns the relationship instantly. The written letter is the paperwork after the conversation." },
    { title: "Give at least two weeks' notice", desc: "Two weeks is the standard in most industries. Senior roles and specialized functions often warrant four. Less than two only in truly hostile situations." },
    { title: "Keep the letter to one page and neutral in tone", desc: "State your last day, thank the company briefly, offer to help with transition. Do not list grievances — that's for the exit interview, if at all." },
    { title: "Offer a real handover", desc: "Documenting your open projects and introducing your successor is what earns strong references two years later. Skipping it is what loses them." },
  ],
  faqs: [
    { q: "Is the resignation letter generator free?", a: "Yes. Generate and download unlimited resignation letters — free, no sign-up required." },
    { q: "How much notice should I give?", a: "Two weeks is the industry standard. Senior or specialized roles warrant three to four. Check your employment contract for any specific notice period." },
    { q: "Should I mention why I'm leaving in the letter?", a: "Only in one neutral sentence, if at all ('to pursue a new opportunity'). The letter is a formal record — save specific feedback for the exit interview." },
    { q: "Can I resign by email?", a: "Only after telling your manager in a live conversation. The email or letter formalizes what you've already discussed — it should never be the first they hear of it." },
    { q: "What tone should my resignation letter use?", a: "Professional and grateful, even if the job wasn't. The letter goes into your HR file and often gets shown to future reference checkers years later." },
  ],
  features: [
    { title: "4 Tone Presets", desc: "Formal, Grateful, Brief, or Career-change — matched to your relationship with the company." },
    { title: "Notice Period Quick-Pick", desc: "One-tap 2-week, 3-week, or 1-month notice with the correct last-day date auto-filled." },
    { title: "Live Letter Preview", desc: "See a paper-textured preview update in real time as you fill in your details." },
    { title: "Printable PDF Download", desc: "One-page, single-column PDF ready to hand to your manager or email to HR." },
    { title: "Reference-Safe Wording", desc: "Neutral, professional language that keeps the door open for future references." },
    { title: "No Sign-Up, No Watermark", desc: "Generate and download unlimited letters — completely free." },
  ],
};
