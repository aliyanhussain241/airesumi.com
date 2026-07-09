import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Header } from "../app/components/Header";
import { Footer } from "../app/components/Footer";
import { RouteProgressBar } from "../app/components/RouteProgressBar";
import { initI18n } from "../app/lib/i18n";

// Initialize i18next once (SSR-safe). English only.
initI18n();

// ── Schema markup ────────────────────────────────────────────────────────────
const HOMEPAGE_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "Airesumi",
      "url": "https://airesumi.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://airesumi.com/assets/ai-resumi-DYjBNKey.webp"
      },
      "sameAs": [
        "https://www.trustpilot.com/review/airesumi.com"
      ]
    },
    {
      "@type": "WebSite",
      "name": "Airesumi",
      "url": "https://airesumi.com/",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://airesumi.com/examples?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "SoftwareApplication",
      "name": "Airesumi AI Resume Builder",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "url": "https://airesumi.com/",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "description": "Free AI resume builder with ATS optimization"
      },
      // ⚠️  IMPORTANT: reviewCount must match your ACTUAL Trustpilot/G2 review count.
      // Update this number whenever your real review count changes.
      // Inflated numbers cause Google to ignore or penalize this schema.
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "120",
        "bestRating": "5"
      },
      "featureList": [
        "ATS-optimized resume generation",
        "AI cover letter generator",
        "ATS resume checker",
        "LinkedIn bio generator",
        "Resume keyword scanner",
        "Interview preparation",
        "Salary analyzer"
      ]
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is Airesumi free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Airesumi is completely free to use. You can build and download ATS-optimized resumes without any sign-up. A Pro plan is available for unlimited resumes and premium templates."
          }
        },
        {
          "@type": "Question",
          "name": "What is an ATS resume and why does it matter?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "An ATS (Applicant Tracking System) resume is formatted to pass the automated screening software used by 99% of large employers. Without ATS optimization, your resume may never reach a human recruiter. Airesumi automatically formats and optimizes every resume for ATS compatibility."
          }
        },
        {
          "@type": "Question",
          "name": "How does the AI resume builder work?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Paste the job description and your career details. Our AI generates a tailored, ATS-optimized resume in under 10 minutes — no manual formatting needed. You can then download it as a PDF."
          }
        },
        {
          "@type": "Question",
          "name": "Do I need to sign up to use Airesumi?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No sign-up is required to build your first resume. Create a free account to save and manage multiple resumes across sessions."
          }
        },
        {
          "@type": "Question",
          "name": "Can Airesumi generate a cover letter too?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Airesumi has a free AI cover letter generator that creates a tailored cover letter matching your resume and the target job description — in under 2 minutes."
          }
        },
        {
          "@type": "Question",
          "name": "How is Airesumi different from other resume builders?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Airesumi uses AI to tailor your resume to each specific job description, not just a generic template. It also includes an ATS checker, cover letter generator, LinkedIn bio tool, salary analyzer, and interview prep — all in one free platform."
          }
        }
      ]
    }
  ]
};

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Try again
          </button>
          <a href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      // FIX: Default meta — individual pages override these in their own head()
      { title: "AI Resume Builder — Free ATS-Optimized Resumes | airesumi.com" },
      { name: "description", content: "Build a professional, ATS-optimized resume in minutes using AI. Free resume builder trusted by job seekers worldwide. No sign-up required." },
      { name: "author", content: "Airesumi" },
      // Default OG — pages override with their own og: tags
      { property: "og:site_name", content: "Airesumi" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://airesumi.com/og-image.webp" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://airesumi.com/og-image.webp" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      // FCP fix: trimmed to the 4 weights we actually paint above the fold
      // (Sora 600/700 for headings, Manrope 400/600 for body/nav). Cuts the
      // Google Fonts CSS + woff2 payload roughly in half vs. the previous
      // 8-weight set, and drops the duplicate <link> that was fetching the
      // same stylesheet twice. `display=swap` keeps text visible immediately
      // in the metric-matched fallback until the web font arrives.
      {
        rel: "preload",
        as: "style",
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Manrope:wght@400;600&display=swap",
        onLoad: "this.onload=null;this.rel='stylesheet'",
      } as any,
      {
        rel: "stylesheet",
        href: appCss },
      { rel: "icon", href: "/favicon.webp", type: "image/webp" },
      { rel: "apple-touch-icon", href: "/favicon.webp" },
      { rel: "alternate", hrefLang: "en", href: "https://airesumi.com/" },
      { rel: "alternate", hrefLang: "es", href: "https://airesumi.com/?lng=es" },
      { rel: "alternate", hrefLang: "fr", href: "https://airesumi.com/?lng=fr" },
      { rel: "alternate", hrefLang: "de", href: "https://airesumi.com/?lng=de" },
      { rel: "alternate", hrefLang: "pt", href: "https://airesumi.com/?lng=pt" },
      { rel: "alternate", hrefLang: "ar", href: "https://airesumi.com/?lng=ar" },
      { rel: "alternate", hrefLang: "hi", href: "https://airesumi.com/?lng=hi" },
      { rel: "alternate", hrefLang: "zh", href: "https://airesumi.com/?lng=zh" },
      { rel: "alternate", hrefLang: "ja", href: "https://airesumi.com/?lng=ja" },
      { rel: "alternate", hrefLang: "ru", href: "https://airesumi.com/?lng=ru" },
      { rel: "alternate", hrefLang: "x-default", href: "https://airesumi.com/" },
    ],

    // FIX: Full schema markup added
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(HOMEPAGE_SCHEMA),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark'){document.documentElement.classList.add('dark');}document.documentElement.style.colorScheme=t;}catch(e){}})();`;

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-shell min-h-dvh flex flex-col liquid-bg text-[#0a0a0a] dark:text-orange-50 font-sans selection:bg-[#FF6321] selection:text-white print:bg-white print:m-0 print:p-0">
        <RouteProgressBar />
        <Header />
        <main className="app-main flex-1 min-h-[60vh]">
          <Outlet />
        </main>
        <Footer />
      </div>
    </QueryClientProvider>

  );
}
