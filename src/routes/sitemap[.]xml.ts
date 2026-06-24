import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://airesumi.com";

const STATIC_ENTRIES = [
  { path: "/",                  changefreq: "weekly",  priority: "1.0" },
  { path: "/resume",            changefreq: "monthly", priority: "0.9" },
  { path: "/ats-checker",       changefreq: "monthly", priority: "0.8" },
  { path: "/cover-letter",      changefreq: "monthly", priority: "0.8" },
  { path: "/linkedin-bio",      changefreq: "monthly", priority: "0.7" },
  { path: "/bullet-writer",     changefreq: "monthly", priority: "0.7" },
  { path: "/summary-generator", changefreq: "monthly", priority: "0.7" },
  { path: "/keyword-scanner",   changefreq: "monthly", priority: "0.7" },
  { path: "/interview-prep",    changefreq: "monthly", priority: "0.7" },
  { path: "/salary-analyzer",   changefreq: "monthly", priority: "0.7" },
  { path: "/examples",          changefreq: "weekly",  priority: "0.7" },
  { path: "/blog",              changefreq: "weekly",  priority: "0.7" },
  { path: "/premium",           changefreq: "monthly", priority: "0.6" },
  { path: "/about",             changefreq: "monthly", priority: "0.5" },
  { path: "/contact",           changefreq: "yearly",  priority: "0.4" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().split("T")[0];

        // Supabase se published blog slugs + dates dynamically fetch karo
        let blogEntries: {
          path: string;
          changefreq: string;
          priority: string;
          lastmod: string;
        }[] = [];

        try {
          const SUPABASE_URL =
            process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
          const SUPABASE_KEY =
            process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
            process.env.SUPABASE_PUBLISHABLE_KEY ||
            "";

          if (SUPABASE_URL && SUPABASE_KEY) {
            const client = createClient(SUPABASE_URL, SUPABASE_KEY);
            const { data } = await client
              .from("blog_posts")
              .select("slug, published_at, created_at")
              .eq("published", true)
              .order("published_at", { ascending: false });

            if (data) {
              blogEntries = data.map((post) => ({
                path: `/blog/${post.slug}`,
                changefreq: "monthly",
                priority: "0.6",
                lastmod: post.published_at
                  ? new Date(post.published_at).toISOString().split("T")[0]
                  : today,
              }));
            }
          }
        } catch (e) {
          // Supabase fail ho to silently skip — static entries still serve
          console.warn("[sitemap] blog fetch failed:", e);
        }

        const allEntries = [
          ...STATIC_ENTRIES.map((e) => ({ ...e, lastmod: today })),
          ...blogEntries,
        ];

        const urls = allEntries.map(
          (e) =>
            `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          urls.join("\n"),
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
