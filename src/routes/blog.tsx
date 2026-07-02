import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Blog } from "../app/Blog";

function Page() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Blog />
    </motion.div>
  );
}

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Resume Tips & Career Advice Blog | airesumi.com" },
      { name: "description", content: "Expert resume writing tips, interview advice, salary guides, and AI career tools. Updated weekly to help job seekers land their dream job faster." },
      { property: "og:title", content: "Resume Tips & Career Advice Blog | airesumi.com" },
      { property: "og:description", content: "Expert resume writing tips, interview advice, and AI career strategies. Free guides for job seekers." },
      { property: "og:url", content: "https://airesumi.com/blog" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://airesumi.com/api/public/og/blog" },
      { name: "twitter:image", content: "https://airesumi.com/api/public/og/blog" },
      { name: "twitter:title", content: "Resume Tips & Career Advice Blog | airesumi.com" },
      { name: "twitter:description", content: "Expert resume writing tips, interview advice, and AI career strategies. Free guides for job seekers." },
    ],
    links: [{ rel: "canonical", href: "https://airesumi.com/blog" }],
  }),
  component: Page,
});
