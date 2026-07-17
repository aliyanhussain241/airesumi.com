import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Blog } from "../app/Blog";
import { getPublishedBlogPosts } from "@/lib/blog.functions";

function Page() {
  const posts = Route.useLoaderData();
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Blog initialPosts={posts} hasInitialPosts />
    </motion.div>
  );
}

export const Route = createFileRoute("/blog")({
  loader: () => getPublishedBlogPosts(),
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
      { name: "twitter:url", content: "https://airesumi.com/blog" },
    ],
  }),
  errorComponent: ({ error }) => (
    <div className="min-h-screen flex items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-bold mb-2">Blog unavailable</h1>
        <p className="text-sm text-[#6B7280]">{error.message}</p>
      </div>
    </div>
  ),
  notFoundComponent: () => <div className="p-10 text-center">No posts found.</div>,
  component: Page,
});
