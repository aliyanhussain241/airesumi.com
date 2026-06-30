# Multi-Language Support (i18n)

Add full website translation across the top global languages, with a language switcher in the header. User can pick any language and the entire UI translates instantly.

## Languages (Top 10)

English (en, default), Spanish (es), French (fr), German (de), Portuguese (pt), Arabic (ar, RTL), Hindi (hi), Chinese Simplified (zh), Japanese (ja), Russian (ru).

## What Gets Translated

- All static UI strings: header, footer, navigation, buttons, labels, form placeholders, error/toast messages, empty states.
- All landing/marketing pages (home, About, Contact, Privacy, Terms, Blog list, tools index).
- Tool pages UI (Resume Builder, Cover Letter, ATS Checker, Interview Prep, Salary, Keyword Scanner, Bullet Writer, Summary Generator, Resignation Letter).
- AI-generated content (resumes, cover letters, analysis) — generated in the selected language by passing the language to the Gemini prompts.

Not translated: user-entered data, blog post bodies authored in English (kept as-is unless you want AI auto-translate later), legal document binding clauses (kept English-canonical with a note).

## How It Works

1. Language switcher (globe icon + dropdown) in the header, beside the theme toggle. Shows native language names (English, Español, Français, …).
2. Selected language persists in `localStorage` and reflects in `<html lang="…" dir="…">` (RTL auto-applied for Arabic).
3. All text comes from translation JSON files via a `t("key")` helper. Switching language re-renders the whole app instantly — no reload.
4. AI prompts include the active language so generated resumes/cover letters/analysis come out in that language.

## Technical Details

- Library: `react-i18next` + `i18next` + `i18next-browser-languagedetector`.
- Init: `src/app/lib/i18n.ts`, imported once from the root route. SSR-safe (no `window` access at module scope).
- Translation files: `src/app/locales/{lng}/common.json` — one namespace to start (split later if it grows).
- Hook usage: `const { t } = useTranslation();` then `t("header.login")`.
- Direction: `useEffect` syncs `document.documentElement.lang` and `dir` on language change; Tailwind RTL utilities used where layout needs flipping.
- AI: extend `generateResume` / `generateCoverLetter` / analyzers to accept `language` and append "Respond in {languageName}." to the system prompt.
- Header: new `LanguageSwitcher` component using the existing dropdown/liquid-glass styles.
- Migration: replace hardcoded strings with `t(...)` keys file-by-file across header, footer, landing, static pages, and tool pages.

## Out of Scope (for this pass)

- Translating existing blog post bodies (English only for now).
- Per-language SEO routes (e.g. `/es/...`). Current setup keeps one URL and switches via UI; we can add localized URLs + hreflang later if you want.
