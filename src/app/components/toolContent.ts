import type { HowToStep, FaqItem } from "../components/ToolContentSection";

export interface ToolContent {
  whatTitle: string;
  whatParagraphs: string[];
  howToTitle: string;
  howToSteps: HowToStep[];
  faqs: FaqItem[];
}

/* ------------------------------------------------------------------ */
/* Resume builder                                                      */
/* ------------------------------------------------------------------ */
export const RESUME_CONTENT: ToolContent = {
  whatTitle: "What is an AI Resume Builder?",
  whatParagraphs: [
    "An AI resume builder reads your work history and the job you're targeting, then writes an ATS-friendly resume that matches the two. Instead of a blank template, you get bullet points, a summary, and section ordering tuned for the specific role.",
    "airesumi's free AI resume builder takes under 3 minutes. Upload your CV or fill in the details, pick a template, and download a recruiter-ready PDF that passes automated screeners.",
  ],
  howToTitle: "How to Build a Resume That Gets Interviews",
  howToSteps: [
    { title: "Start with the job description", desc: "Paste the exact role you're applying for. The AI extracts required skills and keywords so your resume mirrors what recruiters and ATS software are scanning for." },
    { title: "Lead each bullet with a result", desc: "Recruiters skim in 6 seconds. Start every bullet with a measurable outcome — 'Increased conversion 34%' beats 'Responsible for conversion optimization'." },
    { title: "Keep it to one page (unless senior)", desc: "0-10 years of experience → one page. 10+ years or executive → up to two. Anything longer gets skimmed and dropped." },
    { title: "Pick a clean, ATS-safe template", desc: "Avoid columns, text boxes, and graphics. All airesumi templates are single-column and parse cleanly in Workday, Greenhouse, Lever, and Taleo." },
  ],
  faqs: [
    { q: "Is the AI resume builder free?", a: "Yes. Building and downloading your first resume is completely free. No credit card, no sign-up required to generate." },
    { q: "Will my resume pass ATS (Applicant Tracking Systems)?", a: "Yes. Every airesumi template is built single-column with standard headings — the exact format that Workday, Greenhouse, Lever, and Taleo parse without errors." },
    { q: "Can I upload my existing CV?", a: "Yes. Upload your PDF or DOCX and the AI extracts your details, then rewrites bullets and summary to match the role you're targeting." },
    { q: "How long does it take to build a resume?", a: "Most users go from a blank page to a downloaded PDF in under 3 minutes when they upload an existing CV, and about 8 minutes starting from scratch." },
    { q: "Can I edit the resume after the AI generates it?", a: "Yes. Every field is editable. Tweak bullets, swap templates, and re-download as many times as you want." },
    { q: "What file format do I download?", a: "PDF by default, which is the format 98% of employers request. The PDF is text-based (not an image), so ATS software can still read every word." },
  ],
};

/* ------------------------------------------------------------------ */
/* Bullet Writer                                                       */
/* ------------------------------------------------------------------ */
export const BULLET_CONTENT: ToolContent = {
  whatTitle: "What is a Resume Bullet Writer?",
  whatParagraphs: [
    "A resume bullet writer turns a plain task description into a metric-driven achievement bullet. You describe what you did; the AI rewrites it in the STAR format (Situation, Task, Action, Result) with strong action verbs and quantified impact.",
    "Great bullets are the single biggest lever for interview callbacks. airesumi's free bullet writer gives you five variations per input so you can pick the one that best matches the role you're applying for.",
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
};

/* ------------------------------------------------------------------ */
/* Summary Generator                                                   */
/* ------------------------------------------------------------------ */
export const SUMMARY_CONTENT: ToolContent = {
  whatTitle: "What is a Resume Summary Generator?",
  whatParagraphs: [
    "A resume summary is the 3-4 sentence pitch at the top of your resume — the first thing a recruiter reads. A summary generator writes it for you based on your experience, target role, and industry.",
    "airesumi's AI summary generator produces three tailored variations at once — Concise, Confident, and Story-driven — so you can pick the tone that matches the company culture.",
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
};

/* ------------------------------------------------------------------ */
/* Keyword Scanner                                                     */
/* ------------------------------------------------------------------ */
export const KEYWORD_CONTENT: ToolContent = {
  whatTitle: "What is a Resume Keyword Scanner?",
  whatParagraphs: [
    "A resume keyword scanner compares your resume against a job description and shows you exactly which required skills, tools, and phrases are missing. It mirrors what an ATS (Applicant Tracking System) does when it screens your application.",
    "airesumi's free scanner extracts the important keywords from any job posting, checks your resume for coverage, and returns a match score plus a fix-list you can apply in minutes.",
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
};

/* ------------------------------------------------------------------ */
/* LinkedIn Bio                                                        */
/* ------------------------------------------------------------------ */
export const LINKEDIN_CONTENT: ToolContent = {
  whatTitle: "What is a LinkedIn Bio Generator?",
  whatParagraphs: [
    "A LinkedIn bio generator turns your resume into three key profile assets: a keyword-optimized headline (220 chars), a compelling About section (2,600 chars), and a skills list ordered by recruiter demand.",
    "airesumi's AI generator writes in first person, uses LinkedIn's SEO signals so recruiters find you in searches, and produces a bio you can paste directly into your profile.",
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
};

/* ------------------------------------------------------------------ */
/* Interview Prep                                                      */
/* ------------------------------------------------------------------ */
export const INTERVIEW_CONTENT: ToolContent = {
  whatTitle: "What is an AI Interview Question Generator?",
  whatParagraphs: [
    "An AI interview question generator creates realistic interview questions tailored to the exact role, seniority, and company type you're targeting — behavioral, technical, and situational.",
    "airesumi's generator pulls from real interview patterns for your role level, so you practice the questions you're actually likely to hear, not generic 'tell me about yourself' filler.",
  ],
  howToTitle: "How to Prepare for a Job Interview That Lands the Offer",
  howToSteps: [
    { title: "Prepare 6 STAR stories", desc: "Six well-structured stories (Situation, Task, Action, Result) cover ~80% of behavioral questions. Practice retelling them until they feel natural, not memorized." },
    { title: "Research the company for 30 minutes", desc: "Read the product, the last 3 blog posts, and the About page. Reference something specific in your answers — it's the single strongest signal of genuine interest." },
    { title: "Prepare 5 questions to ask them", desc: "The 'do you have questions for us' moment is where candidates fail or shine. Ask about team, priorities, and success metrics — not compensation or PTO." },
    { title: "Rehearse out loud, not in your head", desc: "Silent rehearsal skips the hard part: forming sentences in real time. Record yourself answering three questions and listen back — you'll spot filler words instantly." },
  ],
  faqs: [
    { q: "What types of interview questions does the AI generate?", a: "Behavioral (STAR-style), technical (role-specific), and situational (hypotheticals) — mixed to match the format of a typical loop for your seniority." },
    { q: "Is the interview generator free?", a: "Yes. Generate unlimited question sets for any role, seniority, or industry — free, no sign-up." },
    { q: "How many questions should I practice before an interview?", a: "20-30 questions across categories is enough for most roles. Practice depth over breadth — a strong answer to 10 questions beats a shallow answer to 50." },
    { q: "Does the AI provide sample answers?", a: "The AI generates questions with answer frameworks (what a strong response includes). It doesn't script your specific stories — those need to be yours to be believable." },
    { q: "How is this different from generic interview question lists?", a: "Generic lists give you 'name a weakness' for every role. This generator tailors to your title, seniority, and industry, so a Senior Backend Engineer doesn't practice VP-level strategy questions." },
  ],
};

/* ------------------------------------------------------------------ */
/* Salary Analyzer                                                     */
/* ------------------------------------------------------------------ */
export const SALARY_CONTENT: ToolContent = {
  whatTitle: "What is a Salary Analyzer?",
  whatParagraphs: [
    "A salary analyzer benchmarks compensation for a specific role, location, and experience level against current market data — base, bonus, equity, and total comp — so you know your number before you negotiate.",
    "airesumi's AI salary analyzer factors in role, seniority, industry, and region to produce a realistic salary range plus negotiation talking points you can use in your next offer conversation.",
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
};

/* ------------------------------------------------------------------ */
/* PDF / Document Scanner                                              */
/* ------------------------------------------------------------------ */
export const PDF_SCANNER_CONTENT: ToolContent = {
  whatTitle: "What is a Mobile Document Scanner?",
  whatParagraphs: [
    "A mobile document scanner uses your phone camera to capture a document, auto-detect the edges, correct perspective, and export it as a clean, multi-page PDF — no scanner hardware required.",
    "airesumi's browser-based scanner works on any phone with a camera. Capture, reorder, apply document filters, and download a PDF you can attach to a job application or email in seconds.",
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
};

/* ------------------------------------------------------------------ */
/* Resignation Letter                                                  */
/* ------------------------------------------------------------------ */
export const RESIGNATION_CONTENT: ToolContent = {
  whatTitle: "What is a Resignation Letter Generator?",
  whatParagraphs: [
    "A resignation letter is a short, formal document that confirms your last day, thanks your employer, and leaves the door open for a good reference. A generator writes it for you in the right tone — professional, brief, and non-confrontational.",
    "airesumi's free resignation letter generator asks for your details (name, role, last day, manager) and produces a printable PDF in seconds, in the tone you choose: Formal, Grateful, Brief, or Career-change.",
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
};
