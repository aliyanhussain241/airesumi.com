import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Blog } from "../app/Blog";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const slug = params.slug;
    const title = slug
      .split("-")
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    return {
      meta: [
        { title: `${title} | airesumi Career Blog` },
        {
          name: "description",
          content: `Read our guide on ${title.toLowerCase()}. Expert career advice, resume tips, and job search strategies from airesumi.`,
        },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: `${title} | airesumi Career Blog` },
        {
          property: "og:description",
          content: `Read our guide on ${title.toLowerCase()}. Expert career advice from airesumi.`,
        },
        { property: "og:type", content: "article" },
        {
          property: "og:url",
          content: `https://airesumi.com/blog/${slug}`,
        },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: `${title} | airesumi Career Blog` },
      ],
      links: [
        { rel: "canonical", href: `https://airesumi.com/blog/${slug}` },
      ],
    };
  },
  component: function Page() {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Blog />
      </motion.div>
    );
  },
});
