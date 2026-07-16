# Pakistan Content Cluster — Plan

Mirror the `resume_role_examples` architecture: DB-backed content, SSR via server functions in the loader, unique per-page SEO metadata, sitemap inclusion.

## URL structure

No existing `/career-advice` route, so keep it clean and localized:

- `/pk` — hub/index listing the 5 guides (SSR)
- `/pk/resume-format-pakistan`
- `/pk/rozee-pk-resume-optimization`
- `/pk/gulf-middle-east-jobs-from-pakistan`
- `/pk/fresh-graduate-resume-pakistan`
- `/pk/pakistani-employer-interview-questions`

Rationale: short, keyword-forward, extensible (future `/pk/salary-guide-pakistan` etc.), and parallel to `/resume-examples/[slug]`.

## Database

New table `public.pk_guides` — same shape philosophy as `resume_role_examples`:

```text
id uuid pk
slug text unique
title text
subtitle text
category text        -- 'resume' | 'portals' | 'gulf' | 'fresher' | 'interview'
seo_title text
seo_description text
hero_intro text
sections jsonb       -- [{ heading, content, bullets?: string[] }]
faqs jsonb           -- [{ q, a }]
cta_label text
cta_href text        -- '/resume', '/ats-checker', '/cover-letter', etc.
related_slugs jsonb  -- string[]
published boolean default true
created_at, updated_at timestamptz
```

GRANTs: `SELECT` to `anon` + `authenticated` (public content), `ALL` to `service_role`. RLS: single "published rows are public" SELECT policy.

Seed the 5 guides in the same migration (real, locally accurate content — see "Content spec" below).

## Server functions

`src/lib/pk-guides.functions.ts`:
- `listPkGuides()` — `slug, title, subtitle, category, seo_description` for hub + sitemap
- `getPkGuideWithRelated({ slug })` — full row + up to 3 related guides

Uses `getSupabaseServer()` (already in project). Same normalization pattern as `resume-roles.functions.ts`.

## Routes

- `src/routes/pk.tsx` — layout `() => <Outlet />`
- `src/routes/pk.index.tsx` — hub page: loader calls `listPkGuides`, renders card grid, sets self-referencing canonical + Pakistan-targeted title/description, `og:locale=en_PK`.
- `src/routes/pk.$slug.tsx` — leaf: loader calls `getPkGuideWithRelated`, throws `notFound()` on miss. `head({ loaderData })` builds unique `title`, `description`, `og:title/description/type=article`, canonical, and Article + FAQPage JSON-LD (when `faqs` present) + BreadcrumbList. Body renders hero, TOC, sections, FAQ accordion, CTA button linking to `cta_href`, related-guides strip. Full `<Header />` + `<Footer />` inside the leaf (matches how blog/example leaves render).

Both routes get `notFoundComponent` + `errorComponent` per project convention.

## Sitemap

Extend `src/routes/sitemap[.]xml.ts` with a `pkEntries` fetch (mirrors `roleEntries`): `/pk` static entry + one URL per published `pk_guides` row using `updated_at` as `lastmod`.

## Content spec (real, not generic)

1. **Resume Format for the Pakistani Job Market** — photo conventions (still common in Pakistan, unlike US/UK), CNIC/DOB/marital status norms and when to omit, father's name convention, HEC-recognized degree formatting, address/city norms, sect/religion field pitfalls, 2-page acceptance, differences vs. Western ATS-first resume. CTA → `/resume`.

2. **Optimize Your Resume for Rozee.pk and Other Pakistani Job Portals** — Rozee.pk profile completeness score levers, skill-tag matching, "Featured CV", employer search filters that actually rank you; Mustakbil.com keyword fields; Jobee.pk parsing quirks; how each portal's search/parse works. CTA → `/ats-checker`.

3. **Resume Tips for Gulf & Middle East Jobs (From Pakistan)** — Bayt.com CV profile, Naukrigulf, GulfTalent; passport/visa-status line, nationality field, expected salary in AED/SAR/QAR, English-only, photo yes for Gulf, driving license (UAE) mention, attestation references, differences vs. Pakistan-market CV. CTA → `/cover-letter`.

4. **Fresh Graduate Resume Guide — Pakistan** — structure without full-time experience: FYP, semester projects, HEC-recognized university naming, CGPA reporting (out of 4.0 vs percentage), internships at local firms (Systems Ltd, TPS, NetSol, Descon, Engro, banks), NUST/LUMS/FAST/COMSATS/UET context, societies, competitions (PSIFI, LDF, NASCON), NTS/PPSC prep line. CTA → `/resume`.

5. **Interview Questions Commonly Asked by Pakistani Employers** — realistic bank/telecom/FMCG/software-house question sets: "Why should we hire you over someone with experience?", salary expectation in PKR with taxation awareness, notice period norms (1 month standard), willingness to relocate to Karachi/Lahore/Islamabad, "Tumhari family kya karti hai?" cultural framing, technical rounds at software houses (Systems, Arbisoft, Afiniti, VentureDive) vs HR rounds at banks (HBL, UBL, MCB), plus how to answer. CTA → `/interview-prep`.

Each page ≈ 800–1200 words across `hero_intro` + `sections` + 4–6 FAQs. No filler.

## Header nav (light touch)

Add a "Pakistan" link inside the existing header's resources/examples dropdown (or footer resource column if header is tight) so the cluster is internally linked. Non-blocking.

## Deliverables per turn

1. Migration: `CREATE TABLE public.pk_guides` + GRANTs + RLS + policy + 5 `INSERT`s with full content.
2. `src/lib/pk-guides.functions.ts`
3. `src/routes/pk.tsx`, `src/routes/pk.index.tsx`, `src/routes/pk.$slug.tsx`
4. Sitemap update
5. One footer/nav link

Approve and I'll build it.
