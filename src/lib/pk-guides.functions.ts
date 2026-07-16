import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServer } from "./supabase-server";

export type PkGuideSection = { heading: string; content?: string; bullets?: string[] };
export type PkGuideFaq = { q: string; a: string };

export type PkGuide = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  category: string;
  seo_title: string | null;
  seo_description: string | null;
  hero_intro: string | null;
  sections: PkGuideSection[];
  faqs: PkGuideFaq[];
  cta_label: string | null;
  cta_href: string | null;
  related_slugs: string[];
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type PkGuideSummary = Pick<
  PkGuide,
  "slug" | "title" | "subtitle" | "category" | "seo_description"
>;

function normalize(row: any): PkGuide {
  return {
    ...row,
    sections: Array.isArray(row.sections) ? row.sections : [],
    faqs: Array.isArray(row.faqs) ? row.faqs : [],
    related_slugs: Array.isArray(row.related_slugs) ? row.related_slugs : [],
  };
}

export const listPkGuides = createServerFn({ method: "GET" }).handler(
  async (): Promise<PkGuideSummary[]> => {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("pk_guides")
      .select("slug, title, subtitle, category, seo_description")
      .eq("published", true)
      .order("created_at", { ascending: true });
    if (error || !data) return [];
    return data as PkGuideSummary[];
  },
);

export type PkGuideWithRelated = {
  guide: PkGuide;
  related: PkGuideSummary[];
} | null;

export const getPkGuideWithRelated = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<PkGuideWithRelated> => {
    const supabase = getSupabaseServer();
    const { data: row, error } = await supabase
      .from("pk_guides")
      .select("*")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error || !row) return null;
    const guide = normalize(row);

    let related: PkGuideSummary[] = [];
    if (guide.related_slugs.length > 0) {
      const { data: rel } = await supabase
        .from("pk_guides")
        .select("slug, title, subtitle, category, seo_description")
        .eq("published", true)
        .in("slug", guide.related_slugs);
      related = (rel as PkGuideSummary[]) || [];
    }
    return { guide, related: related.slice(0, 3) };
  });
