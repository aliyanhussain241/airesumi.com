import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServer } from "./supabase-server";

export type BlogPostSeo = {
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  created_at: string;
} | null;

export const getBlogPostSeo = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<BlogPostSeo> => {
    const supabase = getSupabaseServer();
    const { data: post, error } = await supabase
      .from("blog_posts")
      .select("title, slug, excerpt, cover_image_url, seo_title, seo_description, published_at, created_at")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error || !post) return null;
    return post as BlogPostSeo;
  });
