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
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
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
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
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
      { title: "AI Resume Builder — Free ATS-Optimized | airesumi.com" },
      { name: "description", content: "Create an ATS-optimized resume in 10 minutes with airesumi's AI builder. Get hired for remote jobs with professional templates and expert career insights." },
      { name: "author", content: "airesumi" },
      { property: "og:title", content: "AI Resume Builder — Free ATS-Optimized | airesumi.com" },
      { property: "og:description", content: "Create an ATS-optimized resume in 10 minutes with airesumi's AI builder. Get hired for remote jobs with professional templates and expert career insights." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://airesumi.com/" },
      { property: "og:site_name", content: "airesumi" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AI Resume Builder — Free ATS-Optimized | airesumi.com" },
      { name: "twitter:description", content: "Create an ATS-optimized resume in 10 minutes with airesumi's AI builder. Get hired for remote jobs with professional templates and expert career insights." },
      { property: "og:image", content: "https://airesumi.com/assets/og-image.png" },
      { name: "twitter:image", content: "https://airesumi.com/assets/og-image.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: "https://airesumi.com/" },
      { rel: "icon", href: "/favicon.webp", type: "image/webp" },
      { rel: "apple-touch-icon", href: "/favicon.webp" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "name": "airesumi",
              "url": "https://airesumi.com/",
            },
            {
              "@type": "WebSite",
              "name": "airesumi",
              "url": "https://airesumi.com/",
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
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
      <div className="min-h-screen bg-[#f5f5f4] text-[#0a0a0a] font-sans selection:bg-[#FF6321] selection:text-white print:bg-white print:m-0 print:p-0">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </QueryClientProvider>
  );
}
