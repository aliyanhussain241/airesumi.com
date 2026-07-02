import { createFileRoute } from "@tanstack/react-router";
import { OG_CONFIGS, renderOgSvg } from "@/lib/og-templates";

export const Route = createFileRoute("/api/public/og/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const slug = (params.slug || "").replace(/\.svg$|\.png$/i, "");
        const cfg = OG_CONFIGS[slug] || OG_CONFIGS["resume"];
        const svg = renderOgSvg(cfg);
        return new Response(svg, {
          headers: {
            "Content-Type": "image/svg+xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=86400, immutable",
          },
        });
      },
    },
  },
});
