
CREATE TABLE public.pk_guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text,
  category text NOT NULL,
  seo_title text,
  seo_description text,
  hero_intro text,
  sections jsonb NOT NULL DEFAULT '[]'::jsonb,
  faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
  cta_label text,
  cta_href text,
  related_slugs jsonb NOT NULL DEFAULT '[]'::jsonb,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.pk_guides TO anon;
GRANT SELECT ON public.pk_guides TO authenticated;
GRANT ALL ON public.pk_guides TO service_role;

ALTER TABLE public.pk_guides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published PK guides are public"
  ON public.pk_guides FOR SELECT
  USING (published = true);

CREATE TRIGGER pk_guides_set_updated_at
  BEFORE UPDATE ON public.pk_guides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed 1: Resume Format for the Pakistani Job Market
INSERT INTO public.pk_guides (slug, title, subtitle, category, seo_title, seo_description, hero_intro, sections, faqs, cta_label, cta_href, related_slugs) VALUES (
  'resume-format-pakistan',
  'Resume Format for the Pakistani Job Market',
  'What local employers, MNCs and HR managers in Pakistan actually expect on a CV in 2026.',
  'resume',
  'Resume Format for Pakistan (2026) — What Local Employers Expect',
  'Pakistan-specific CV format guide: photo, CNIC, father''s name, HEC degrees, 2-page norms and how it differs from Western resumes.',
  'A resume that works in New York will get filtered out in Karachi, and one built for a Lahore bank will look strange to a US recruiter. Pakistani hiring — whether at a local SME, a bank like HBL or UBL, an MNC like Nestlé or Unilever Pakistan, or a software house like Systems Ltd or Arbisoft — has its own conventions around personal details, education formatting, and length. This guide covers what actually gets you shortlisted here.',
  $json$[
    {"heading":"Photo: usually yes, but professional","content":"Unlike the US or UK where photos on CVs are actively discouraged, in Pakistan a formal headshot is still common and expected by many local employers, especially banks, telcos, FMCG, and government-linked roles. Rules that matter:","bullets":["Passport-style: plain background, formal attire, neutral expression.","Never a selfie, mirror photo, or a cropped wedding/event photo.","Top-right corner of page one is the standard placement.","MNCs with global ATS pipelines (Unilever, P&G, Telenor global roles) often prefer no photo — check the JD and the parent-company norm."]},
    {"heading":"Personal details block — what to keep, what to drop","content":"Pakistani CVs traditionally carry more personal info than Western ones. In 2026 keep it lean:","bullets":["Include: Full name, city + country (\"Lahore, Pakistan\"), phone with +92, professional email, LinkedIn.","Optional but common: Date of birth, nationality, marital status — still expected by many local employers and Gulf recruiters.","CNIC: Do NOT put your full CNIC on a public CV or job-portal CV. Share it only after selection during documentation.","Father''s name: Common in government, banking, and older firms. Fine to include; skip for MNCs and software houses.","Drop entirely: Religion, sect, blood group, height, weight. These are outdated and can trigger unconscious bias against you."]},
    {"heading":"Education section — HEC context matters","content":"For most Pakistani employers, your degree, university, and result carry more weight than in Western resumes, especially for freshers and mid-career.","bullets":["State the full degree name: \"BS Computer Science\", \"BBA (Hons.)\", \"ACCA\", not just \"Bachelors\".","Name the university officially: \"National University of Sciences and Technology (NUST), Islamabad\" — recruiters filter by HEC-recognized names.","Report CGPA on the actual scale used (e.g. 3.6/4.0) or percentage; do not mix scales.","Add O/A Levels or FSc/Matric only if you are a fresh graduate; drop once you have 3+ years of experience.","Foreign degrees: mention HEC equivalency status if already attested."]},
    {"heading":"Experience section — Pakistan-specific expectations","content":"Local recruiters skim for company brand, role scope, and quantified impact.","bullets":["Lead with recognizable employer brands (banks, telcos, MNCs, top software houses) — many recruiters filter mentally by employer tier.","Include internships if you have under 3 years of experience — they''re a normal expectation from HEC-recognized programs.","Quantify in local terms recruiters understand: PKR revenue, number of branches, team size, SBP/PTA/SECP compliance projects, etc.","Note notice period on the CV footer or in your Rozee.pk profile — Pakistani HR asks this in the first call."]},
    {"heading":"Length, format, and length norms","content":"","bullets":["Two pages is fully acceptable in Pakistan — even expected for 5+ years of experience. One-page rules are Western.","Save as PDF with your name in the filename (Ahmed_Raza_CV.pdf), not \"CV Final Final v3.docx\".","Use a clean single-column ATS-safe layout when applying via Rozee.pk, Mustakbil, or MNC portals; two-column designer templates often break parsers.","Font: Calibri, Arial, or Inter at 10.5–11pt for body. No decorative fonts."]},
    {"heading":"How it differs from a Western resume","content":"Quick side-by-side so you can maintain two versions if you also apply abroad.","bullets":["Photo: expected in Pakistan, avoid for US/UK/Canada.","DOB / marital status: fine in Pakistan and Gulf, illegal to ask in most Western hiring — remove for those markets.","Length: 2 pages fine in Pakistan; strict 1 page for US early-career.","References: \"Available upon request\" line is still common in Pakistan; drop it for Western CVs.","Objective/Career objective: Pakistani employers still read it; Western resumes have moved to a professional summary."]}
  ]$json$::jsonb,
  $json$[
    {"q":"Should I put my CNIC on my CV in Pakistan?","a":"No. Never put your full CNIC on a CV that you upload to public portals or send by email. Share it only after selection, during background verification and documentation."},
    {"q":"Is a photo mandatory on a Pakistani CV?","a":"Not mandatory, but expected by most local employers, banks, and government-linked roles. Use a formal passport-style headshot. For roles at global MNCs applying through their parent ATS, you can safely omit it."},
    {"q":"How long should my CV be for the Pakistan market?","a":"One page if you have under 2 years of experience, two pages once you have 3+ years. Two pages is fully acceptable in Pakistan — do not force a one-page US-style resume if it means cutting real experience."},
    {"q":"Do I need to mention father''s name?","a":"Common in banking, government, and older firms and never harmful there. For MNCs, software houses, and startups you can safely leave it out."},
    {"q":"Which file format should I use — PDF or Word?","a":"PDF for everything you email directly. For job portals like Rozee.pk, upload the format they request — usually a Word or plain PDF that their parser can read. Never upload scanned image PDFs."}
  ]$json$::jsonb,
  'Build a Pakistan-ready resume in minutes',
  '/resume',
  $json$["rozee-pk-resume-optimization","fresh-graduate-resume-pakistan","gulf-middle-east-jobs-from-pakistan"]$json$::jsonb
);

-- Seed 2: Rozee.pk & Pakistani Job Portals
INSERT INTO public.pk_guides (slug, title, subtitle, category, seo_title, seo_description, hero_intro, sections, faqs, cta_label, cta_href, related_slugs) VALUES (
  'rozee-pk-resume-optimization',
  'How to Optimize Your Resume for Rozee.pk and Other Pakistani Job Portals',
  'Rozee.pk, Mustakbil.com and Jobee.pk parse and rank profiles differently — here''s how to get shortlisted on each.',
  'portals',
  'Rozee.pk Resume Tips (2026): Rank Higher on Pakistan''s Top Job Portals',
  'How to optimize your CV and profile on Rozee.pk, Mustakbil.com and Jobee.pk — completeness, keywords, and portal-specific tips.',
  'Most Pakistani job seekers upload the same CV to every portal and wonder why recruiters never call. Rozee.pk, Mustakbil.com and Jobee.pk each rank and parse candidates differently. This guide covers what actually moves your profile up the search results employers see.',
  $json$[
    {"heading":"Rozee.pk — completeness and skill tags run the ranking","content":"Rozee.pk is Pakistan''s biggest job portal and most local recruiters search its database directly rather than posting a job. Ranking on that internal search is what gets you calls.","bullets":["Fill your profile to 100% — the portal shows a completeness meter and boosts fully-filled profiles in employer search.","Add every skill tag that genuinely applies from Rozee''s skill dropdown. Recruiters search by tag, not free text — \"SQL\" tagged beats \"SQL\" only mentioned in job description.","Keep the profile summary front-loaded with your title and years of experience: \"Senior Accountant with 6 years in FMCG and audit\" ranks better than a paragraph of soft claims.","Update the profile at least once a month — Rozee''s search favors recently active candidates. Log in and hit save.","Use \"Featured CV\" only when you''re actively job hunting; it''s a paid boost and only worth it during the actual search window."]},
    {"heading":"Rozee.pk — matching the exact job requirements","content":"","bullets":["Read the JD and mirror the exact phrasing in your profile skills and summary — \"IFRS 15 revenue recognition\" beats \"revenue accounting\".","Add certifications as separate entries with the issuing body (ACCA, CIMA, PMP, AWS, Google Ads) — recruiters filter by certification name.","Set your salary expectation realistically for the market — recruiters filter out profiles that don''t declare or that overshoot by more than 30–40%.","Notice period matters. Set it accurately (Immediate, 1 month, 2 months); recruiters filter by this before calling."]},
    {"heading":"Mustakbil.com — keyword fields and cover-note reuse","content":"Mustakbil is smaller but heavily used by NGOs, mid-sized local firms, and some government-adjacent employers.","bullets":["The keyword field on Mustakbil is treated as a hard filter — put every real synonym recruiters might search (SAP FICO, SAP Finance, SAP CO).","Their CV parser reads Word files better than fancy PDFs — upload a clean .docx.","Save a short 3–4 line cover note in your profile; Mustakbil auto-attaches it to applications and many recruiters read only that."]},
    {"heading":"Jobee.pk and other niche portals","content":"","bullets":["Jobee.pk skews toward tech, remote, and startup roles — keep your GitHub, portfolio, and LinkedIn URLs on the profile.","Their parser handles single-column ATS-style resumes well; two-column designer templates lose data.","For remote roles, state your timezone (PKT / GMT+5) and English proficiency clearly."]},
    {"heading":"Universal rules across every Pakistani portal","content":"","bullets":["Upload one clean ATS-safe PDF as your master CV — no images, no icons, no text boxes.","Do not put your full CNIC or scans of educational documents on your portal profile; share only after selection.","Turn on email + WhatsApp alerts and reply within 24 hours — many Pakistani recruiters move to the next candidate if you don''t respond same-day.","Keep the same job title across LinkedIn, Rozee, and Mustakbil — recruiters cross-check and mismatches raise flags."]},
    {"heading":"Test your CV against an ATS before uploading","content":"Rozee, Mustakbil, and most MNC portals in Pakistan use automated parsing. If your resume renders as scrambled text after parsing, no recruiter ever sees it. Run it through an ATS checker first and fix parse errors before you upload anywhere."}
  ]$json$::jsonb,
  $json$[
    {"q":"Does Featured CV on Rozee.pk actually work?","a":"It genuinely surfaces your profile higher in employer searches during the featured period, so it helps if you''re actively hunting. It''s not worth paying for outside an active search window — the effect ends when the feature expires."},
    {"q":"How often should I update my Rozee.pk profile?","a":"Log in and save at least once a month even if nothing changed. Rozee''s employer search favors recently updated profiles."},
    {"q":"Should I upload PDF or Word to Rozee.pk?","a":"PDF works for most cases, but keep a clean Word version handy — some employers download and re-parse in their own ATS which handles .docx more reliably."},
    {"q":"Is it safe to put my CNIC on Rozee.pk?","a":"No. Do not put your CNIC on any public portal profile. It''s a common vector for identity misuse. Share it only after selection during formal documentation."},
    {"q":"Why am I getting no calls despite applying to many jobs?","a":"Usually one of: profile completeness under 80%, missing skill tags recruiters search for, salary expectation not declared, or notice period set unrealistically. Fix those four first."}
  ]$json$::jsonb,
  'Check if your CV passes ATS scans',
  '/ats-checker',
  $json$["resume-format-pakistan","fresh-graduate-resume-pakistan","pakistani-employer-interview-questions"]$json$::jsonb
);

-- Seed 3: Gulf & Middle East from Pakistan
INSERT INTO public.pk_guides (slug, title, subtitle, category, seo_title, seo_description, hero_intro, sections, faqs, cta_label, cta_href, related_slugs) VALUES (
  'gulf-middle-east-jobs-from-pakistan',
  'Resume Tips for Gulf & Middle East Jobs (From Pakistan)',
  'Applying to UAE, KSA, Qatar and Oman from Pakistan? Here''s what Gulf employers and Bayt.com actually look for.',
  'gulf',
  'Gulf Job Resume Tips for Pakistanis (2026): UAE, KSA, Qatar, Bayt.com',
  'How Pakistani candidates should format CVs for UAE, Saudi, Qatar and Oman jobs — Bayt.com, visa status, salary, and photo norms.',
  'A Gulf CV is not just a Pakistani CV translated into fancier fonts. UAE, Saudi, Qatar and Oman recruiters filter by nationality, visa status, salary expectation in local currency, and specific document readiness. If you''re applying to Dubai, Riyadh, or Doha from Pakistan, these are the rules that actually get you shortlisted.',
  $json$[
    {"heading":"Header block — what Gulf recruiters expect on page one","content":"","bullets":["Full name as on passport, not as on CNIC if they differ — inconsistency triggers visa/documentation issues.","Nationality: Pakistani. State it plainly; Gulf employers screen by nationality quota (kafala / Emiratisation / Saudization).","Current location: state clearly (\"Karachi, Pakistan\" or \"Dubai, UAE — on visit visa\") — this drives whether they need to sponsor.","Visa status: If already on a UAE/KSA/Qatar residence visa, say so — it''s a huge shortlisting advantage. Include transferable / cancellable status.","Contact: WhatsApp-enabled +92 number and email. Add a UAE/local number only if you actually own one.","Passport validity: many Gulf employers ask; add \"Passport valid until MM/YYYY\" for high-mobility roles.","Photo: yes for the Gulf. Formal, plain background, no beard/scarf issues if applying to KSA — follow the norm of the country.","Driving license: mention UAE/GCC/Pakistani license — mandatory for sales, logistics, engineering site roles."]},
    {"heading":"Salary expectation — in the local currency","content":"State expected salary in AED, SAR, QAR or OMR, monthly, all-inclusive. \"Negotiable\" is a red flag — recruiters filter it out. Do a market check on Bayt Salary Report or GulfTalent before you set the number.","bullets":["UAE: quote monthly AED all-inclusive (basic + housing + transport) — this is how Gulf packages are structured.","KSA: quote monthly SAR and mention whether you''re counting Saudization-scheme benefits.","Qatar: quote monthly QAR; family status matters — bachelor vs family package differ by ~30%."]},
    {"heading":"Bayt.com — the dominant Gulf job portal","content":"","bullets":["Bayt uses a CV Search product; recruiters filter by nationality, years of experience, current location, and specialization tags.","Fill the Bayt CV Profile to 100% — completeness is a documented ranking signal.","Add every relevant specialization from Bayt''s taxonomy — free-text mentions don''t rank.","Turn on \"Open to relocation\" if you''re still in Pakistan. Set target countries explicitly (UAE, KSA, Qatar).","Upload one clean single-column CV PDF as your primary — Bayt''s parser handles it best.","Bayt CV Writing service exists but is not required — most Pakistani candidates get calls with a well-structured self-made CV."]},
    {"heading":"Other Gulf portals worth targeting","content":"","bullets":["Naukrigulf — strong for Indian and Pakistani expat roles in UAE and KSA.","GulfTalent — mid-to-senior roles, tech, finance, oil & gas.","LinkedIn Jobs — heavily used by MNCs in the Gulf; keep your LinkedIn location set to your target city if you''re seriously relocating.","Company career sites for Emirates, Etihad, ADNOC, Saudi Aramco, QatarEnergy — direct applications outrank agency submissions for large employers."]},
    {"heading":"Documents to have ready before you apply","content":"Gulf hiring moves fast once they''re interested — recruiters will ask for documents within 48 hours. Have digital copies ready:","bullets":["Passport (bio page) — 6+ months validity.","HEC-attested degree — many Gulf employers now require HEC + MOFA + destination-country attestation. Start the attestation before you land offers.","Experience letters from every past employer on company letterhead.","Police clearance certificate (from local police station, then MOFA-attested).","Passport-size photos (white background for KSA, any for UAE)."]},
    {"heading":"Key differences from a Pakistan-market CV","content":"","bullets":["Currency: Gulf salaries in AED/SAR/QAR monthly all-inclusive, not PKR annual.","Notice period: 1–2 months standard; state on CV.","Nationality and visa status are must-mention on Gulf CVs; optional on Pakistan CVs.","English only — no Urdu phrases, no bilingual formatting.","Family status (single / married / children) is expected on Gulf CVs, especially for housing-allowance-eligible roles."]}
  ]$json$::jsonb,
  $json$[
    {"q":"Do I need my degree attested before applying to Gulf jobs?","a":"You can apply before attestation, but once you have an offer you''ll need HEC + MOFA + destination country attestation (UAE Embassy, Saudi Culture Mission, Qatar Embassy). Start the HEC step early — it takes 2–4 weeks."},
    {"q":"Should I put my expected salary in AED or PKR on a Gulf CV?","a":"Always in the local currency of the country you''re applying to (AED / SAR / QAR / OMR), monthly, all-inclusive. PKR salaries confuse Gulf recruiters and get you filtered out."},
    {"q":"Is a photo required on a CV for UAE and KSA jobs?","a":"Yes for both — a formal passport-style photo is expected in the Gulf, unlike Western markets. Plain background, professional attire. For KSA some employers prefer specific dress norms; follow the JD."},
    {"q":"Does having a UAE residence visa really help my application?","a":"Yes, significantly. Employers save on visa cost and time-to-hire, and many roles are explicitly filtered to \"UAE visa holders\". State transferable/cancellable status clearly."},
    {"q":"Can I apply to Gulf jobs while still in Pakistan?","a":"Absolutely — most Pakistani hires apply from home. Turn on \"Open to relocation\" on Bayt and LinkedIn, keep documents ready, and be prepared for a video interview within 48 hours of first contact."}
  ]$json$::jsonb,
  'Write a Gulf-ready cover letter in minutes',
  '/cover-letter',
  $json$["resume-format-pakistan","rozee-pk-resume-optimization","pakistani-employer-interview-questions"]$json$::jsonb
);

-- Seed 4: Fresh Graduate Pakistan
INSERT INTO public.pk_guides (slug, title, subtitle, category, seo_title, seo_description, hero_intro, sections, faqs, cta_label, cta_href, related_slugs) VALUES (
  'fresh-graduate-resume-pakistan',
  'Fresh Graduate Resume Guide — Pakistan',
  'How NUST, LUMS, FAST, COMSATS, UET, IBA and other HEC-recognized graduates should build a first CV that gets interviews.',
  'fresher',
  'Fresh Graduate CV Guide — Pakistan (2026): NUST, LUMS, FAST, IBA',
  'Fresh graduate CV guide for Pakistani universities — FYP, internships, HEC-recognized degrees, and CGPA formatting that gets shortlisted.',
  'Fresh graduate CVs in Pakistan get filtered on three signals: university brand, CGPA/percentage, and internship/FYP quality. If you''re graduating from NUST, LUMS, FAST, COMSATS, UET, IBA, GIKI, ITU, or any HEC-recognized program, this is how to structure a first CV that gets you interviews at Systems Ltd, HBL, Nestlé, Telenor and the graduate programs everyone applies to.',
  $json$[
    {"heading":"Header — keep it simple and professional","content":"","bullets":["Name, city (Islamabad / Lahore / Karachi), +92 phone with WhatsApp, professional email — not xxfirefox98@hotmail.","LinkedIn URL — non-negotiable for fresh graduates in 2026.","GitHub / portfolio URL for CS, SE, and design students.","Add a one-line professional summary: \"BS Computer Science graduate from NUST with FYP in ML-driven urdu NLP and internship at Systems Ltd, seeking associate software engineer role.\""]},
    {"heading":"Education — this is your strongest section as a fresher","content":"Put education above experience if you have under 1 year of work — Pakistani recruiters look here first.","bullets":["Full official university name: \"National University of Sciences and Technology (NUST), Islamabad\" — not just \"NUST\".","Full degree name: \"BS Computer Science\", \"BBA (Hons.) — Marketing\", not \"Bachelors\".","CGPA on the actual scale: \"3.72 / 4.00\" — if under 3.0, use percentage or skip and lead with projects.","Graduation year and month: \"Aug 2022 – Jun 2026\".","Add 2–4 relevant coursework lines only if directly related to the target role.","Below that: A-Levels/FSc with grade and school. Add Matric only if it''s from a nationally recognized board and you have room."]},
    {"heading":"Final year project (FYP) — treat it like a real project","content":"Recruiters at Systems, VentureDive, Afiniti, Arbisoft, and Confiz specifically ask about FYPs. Structure yours like a mini experience entry:","bullets":["Title + one-line problem statement.","Your role (Team Lead / Backend / ML): \"Team of 4, led backend on Node.js + PostgreSQL.\"","Tech stack: React Native, Python, TensorFlow, AWS — list what you actually used.","Outcome: winner of PSIFI / NASCON / LDF / Softec, or link to demo/repo.","Keep to 3–4 lines."]},
    {"heading":"Internships and part-time work","content":"Internships are a normal expectation from HEC-recognized programs. If you have zero, do at least one before graduating.","bullets":["Common paths: Systems Ltd, TPS, NetSol, Descon, Engro, Nestlé, Unilever, Telenor, Jazz, State Bank internship programs.","Format each internship as: Company, role, duration, 2–3 bullet points with quantified outcomes.","Freelance work on Fiverr/Upwork counts — frame it as \"Freelance Frontend Developer\" with real client outcomes.","Teaching assistant, research assistant, and student council leadership all belong here if space permits."]},
    {"heading":"Skills, certifications, and extracurriculars","content":"","bullets":["Skills: split into Technical (Python, SQL, React, Excel, Power BI) and Soft (rarely worth listing — outcomes prove them).","Certifications: Google Data Analytics, AWS Cloud Practitioner, Meta Frontend, Coursera specializations, DataCamp tracks — put the issuing body.","Test prep and government exams: NTS / PPSC / CSS attempt lines only if the target role is government or bank management trainee.","Extracurriculars: student societies (ACM, IEEE, LUMUN, PSIFI), sports at university color level, volunteer work at Edhi, TCF, Akhuwat — Pakistani employers value these more than most fresh graduates realize."]},
    {"heading":"Common fresh-graduate mistakes to avoid","content":"","bullets":["Listing every subject you studied — nobody reads it.","Using a colorful two-column template that ATS parsers scramble.","Objective statements that say \"seeking a challenging role in a dynamic environment to grow my skills\" — meaningless. Replace with a concrete target role.","Overstating group projects as sole work — recruiters ask in the interview and inconsistency costs you the offer.","No LinkedIn URL, or a LinkedIn profile with placeholder photo and no education filled in."]}
  ]$json$::jsonb,
  $json$[
    {"q":"My CGPA is low. Should I mention it on my CV?","a":"If your CGPA is under 2.8 / 4.0, don''t hide it — replace it with percentage if the percentage looks stronger, or drop the number entirely and lead with your FYP, internships, and projects. Recruiters ask in the first call anyway."},
    {"q":"How many internships do I need before graduating?","a":"At least one is now the baseline expectation from HEC-recognized programs; two is competitive. Quality matters — one internship at Systems, Nestlé, or an SBP-registered bank beats three at unknown firms."},
    {"q":"Should I include my Matric and O-Levels?","a":"Include A-Levels or FSc — recruiters do glance at it. Include Matric only if you''re a very recent graduate and have room; drop it once you have any full-time experience."},
    {"q":"Do Pakistani employers care about my LinkedIn as a fresher?","a":"Yes. HR at MNCs and top software houses will check LinkedIn before calling you. A blank or unpolished LinkedIn signals lack of professionalism — spend one afternoon fixing it."},
    {"q":"How long should a fresh graduate CV be in Pakistan?","a":"One page. Two pages is only justifiable if you have a strong FYP, multiple internships, and real project work — otherwise it looks padded."}
  ]$json$::jsonb,
  'Build your first CV with our free builder',
  '/resume',
  $json$["resume-format-pakistan","rozee-pk-resume-optimization","pakistani-employer-interview-questions"]$json$::jsonb
);

-- Seed 5: Pakistani Interview Questions
INSERT INTO public.pk_guides (slug, title, subtitle, category, seo_title, seo_description, hero_intro, sections, faqs, cta_label, cta_href, related_slugs) VALUES (
  'pakistani-employer-interview-questions',
  'Interview Questions Commonly Asked by Pakistani Employers',
  'What HR at banks, telcos, FMCG, and software houses in Pakistan actually ask — and how to answer.',
  'interview',
  'Pakistani Interview Questions (2026): Banks, Telcos, FMCG, Software Houses',
  'Real interview questions asked by Pakistani employers — HBL, UBL, Systems Ltd, Nestlé, Telenor — with clear, honest answer approaches.',
  'Generic \"tell me about yourself\" advice does not prepare you for the actual questions Pakistani interviewers ask. HR at HBL and UBL will ask about your family and hometown. Systems Ltd and Arbisoft will grill you on data structures. Nestlé and Unilever run case-based rounds. Here are the real questions you''ll face — grouped by employer type — and how to answer without sounding rehearsed.',
  $json$[
    {"heading":"Questions every Pakistani employer asks","content":"","bullets":["\"Tell me about yourself.\" — 90 seconds: education → most relevant experience → why this role. Not a life story.","\"Why do you want to leave your current job?\" — Never trash your employer. Frame as pull toward the new role: growth, scope, product, technology.","\"What is your current and expected salary?\" — Give a specific number, not \"as per company policy\". Research the market first.","\"What is your notice period?\" — Be honest. \"1 month\" is standard; \"immediate\" reads as either lying or you were let go.","\"Are you willing to relocate to Karachi / Lahore / Islamabad?\" — Answer clearly yes or no. Wishy-washy answers cost offers.","\"What are your strengths and weaknesses?\" — Give one real weakness with what you''re doing about it. \"I''m a perfectionist\" is a bad answer."]},
    {"heading":"Banks (HBL, UBL, MCB, Meezan, Bank Alfalah, Faysal)","content":"Bank HR rounds are structured and slower. Panels expect professionalism, stability, and ethics awareness.","bullets":["\"What do you know about our bank?\" — Have real facts: number of branches, recent SBP-approved product, latest annual report highlights.","\"Why banking?\" — Not \"job security\". Talk about scale, risk, regulated environment, or client-facing exposure.","\"How do you handle a customer who is angry about a wrong debit?\" — Acknowledge, verify, escalate through the right SLA, follow up.","\"What is your understanding of KYC / AML?\" — Basic Know Your Customer and Anti-Money Laundering awareness expected even for non-compliance roles.","\"Where do you see yourself in 5 years?\" — Realistic banking progression: officer → AVP → VP path is what they want to hear, not \"CEO\"."]},
    {"heading":"Software houses (Systems, Arbisoft, Afiniti, VentureDive, Confiz, 10Pearls, TPS)","content":"Technical rounds are heavier and more Western in style. Expect DSA, coding, and system design.","bullets":["DSA round: arrays, strings, hash maps, trees, graph BFS/DFS, dynamic programming basics. LeetCode Easy–Medium is table stakes.","Language deep-dive: JavaScript event loop, Python GIL, Java memory model, C# async — whatever''s on your CV, expect deep questions.","System design (mid–senior): design a URL shortener, ride-sharing dispatch, or a WhatsApp-scale chat. Talk through DB choice, caching, load balancing, sharding.","Culture-fit round: \"Tell me about a conflict with a teammate — how did you resolve it?\" — Use STAR (Situation, Task, Action, Result).","Compensation negotiation is normal at software houses — do not accept the first offer without a counter if you have leverage."]},
    {"heading":"FMCG and MNCs (Nestlé, Unilever, P&G, Coca-Cola, Engro Foods)","content":"Multi-round case interviews and psychometric tests. Global playbook, adapted to Pakistan.","bullets":["Case interviews: market sizing (\"how many packs of ice-cream are sold in Karachi in June?\"), profitability, market entry.","Behavioral: \"Give an example of when you led without authority.\" — Have 3–4 STAR stories ready and reuse them across questions.","Group discussion: contribute early, build on others'' points, don''t dominate, summarize toward the end.","\"Why FMCG and why Pakistan?\" — Talk distribution scale, brand-building in a large young market, real career pathways.","Psychometric tests (SHL, Aon) — practice free samples online before the actual test."]},
    {"heading":"Telcos (Jazz, Zong, Telenor, Ufone)","content":"","bullets":["Product / commercial roles: know PTA regulations, MNP process, telco revenue split, spectrum basics.","Technical / RF: 4G/5G basics, KPIs (call drop, throughput, RSRP), OSS/BSS awareness.","\"How would you increase ARPU in a saturated urban market?\" — Segment, upsell data + services, retention.","Behavioral: same STAR playbook as FMCG — MNC telcos run structured competency-based rounds."]},
    {"heading":"Culturally-loaded questions — how to handle them","content":"Pakistani interviewers, especially at older / family-owned firms, may ask questions that are illegal in the West. Answer graciously without oversharing.","bullets":["\"Ap ki family kya karti hai? / Your family background?\" — 1 line: father''s profession, siblings status. Do not go deep.","\"Are you married? / Any marriage plans in the next year?\" — Legal in Pakistan hiring practice. Answer briefly and pivot to your commitment to the role.","\"Which city are you originally from?\" — Answer straight; do not read tribal/political undertones into it.","If a question is clearly discriminatory (sect, biradari), you can politely say \"I''d prefer to focus on my professional fit for the role.\" — most professional interviewers move on."]},
    {"heading":"Closing questions you must ask","content":"When they say \"any questions for us?\", never say no. Ask 2–3:","bullets":["\"What does success in this role look like in the first 6 months?\"","\"Who would I be reporting to and how is the team structured?\"","\"What''s the confirmation / probation period and review process?\"","Avoid asking about leaves or gratuity in the first interview — save for the offer stage."]}
  ]$json$::jsonb,
  $json$[
    {"q":"Are Pakistani interviews really so different from Western ones?","a":"The technical rounds at top software houses and MNCs are globally standardized. The HR rounds are where Pakistan-specific questions come up — family background, marital status, relocation to specific cities, and cultural fit."},
    {"q":"How should I state my salary expectation?","a":"Give a specific number based on market research (Bayt, Rozee.pk salary data, Payscale Pakistan), not \"as per company policy\". A range with a firm floor works: \"I''m targeting PKR 250k–280k monthly.\""},
    {"q":"Is it ok to ask about salary and benefits in the first interview?","a":"HR usually brings it up themselves in the first or second call. If they don''t, ask at the end of the second round or when they signal an offer is coming. Don''t open with it."},
    {"q":"What''s a normal notice period in Pakistan?","a":"One month is the norm across banks, MNCs, and software houses. Some senior roles have two- or three-month notices. Be honest — bluffing gets caught during reference checks."},
    {"q":"How do I answer \"why should we hire you?\"","a":"Match two or three of your strongest experiences to the top requirements from the JD, then close with why you''re personally motivated for this specific role. Concrete beats generic every time."},
    {"q":"Should I follow up after the interview?","a":"Yes — one email or LinkedIn message within 24 hours thanking the interviewer and briefly restating your interest. Follow up again after 5–7 working days if you haven''t heard back."}
  ]$json$::jsonb,
  'Practice with our AI interview prep tool',
  '/interview-prep',
  $json$["resume-format-pakistan","rozee-pk-resume-optimization","fresh-graduate-resume-pakistan"]$json$::jsonb
);
