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

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  category: string | null;
  tags: string | null;
  seo_title: string | null;
  seo_description: string | null;
  read_time: number | null;
};

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

export const getPublishedBlogPosts = createServerFn({ method: "GET" })
  .handler(async (): Promise<BlogPost[]> => {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });
    if (error || !data) return [];
    return data as BlogPost[];
  });

export type BlogPostWithRelated = {
  post: BlogPost;
  related: BlogPost[];
} | null;

export const getBlogPostWithRelated = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<BlogPostWithRelated> => {
    const supabase = getSupabaseServer();
    const { data: post, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error || !post) return null;
    const p = post as BlogPost;

    let relQuery = supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .neq("id", p.id)
      .order("published_at", { ascending: false })
      .limit(3);
    if (p.category) relQuery = relQuery.eq("category", p.category);
    const { data: rel } = await relQuery;
    return { post: p, related: (rel as BlogPost[]) || [] };
  });
