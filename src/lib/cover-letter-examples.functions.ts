import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServer } from "./supabase-server";

export type CoverLetterExample = {
  id: string;
  slug: string;
  job_title: string;
  industry: string | null;
  intro_content: string | null;
  example_letter: string;
  key_tips: string[];
  seo_title: string | null;
  seo_description: string | null;
  published: boolean;
};

export type CoverLetterSummary = Pick<
  CoverLetterExample,
  "slug" | "job_title" | "industry" | "seo_description"
>;

function normalize(row: any): CoverLetterExample {
  return {
    ...row,
    key_tips: Array.isArray(row.key_tips) ? row.key_tips : [],
  };
}

export const getPublishedCoverLetterExamples = createServerFn({ method: "GET" }).handler(
  async (): Promise<CoverLetterSummary[]> => {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("cover_letter_examples")
      .select("slug, job_title, industry, seo_description")
      .eq("published", true)
      .order("job_title", { ascending: true });
    if (error || !data) return [];
    return data as CoverLetterSummary[];
  },
);

export type CoverLetterWithRelated = {
  example: CoverLetterExample;
  related: CoverLetterSummary[];
} | null;

export const getCoverLetterExampleWithRelated = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<CoverLetterWithRelated> => {
    const supabase = getSupabaseServer();
    const { data: row, error } = await supabase
      .from("cover_letter_examples")
      .select("*")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error || !row) return null;
    const example = normalize(row);

    let related: CoverLetterSummary[] = [];
    if (example.industry) {
      const { data: fill } = await supabase
        .from("cover_letter_examples")
        .select("slug, job_title, industry, seo_description")
        .eq("published", true)
        .eq("industry", example.industry)
        .neq("slug", example.slug)
        .limit(3);
      related = (fill as CoverLetterSummary[]) || [];
    }
    if (related.length < 3) {
      const { data: fill } = await supabase
        .from("cover_letter_examples")
        .select("slug, job_title, industry, seo_description")
        .eq("published", true)
        .neq("slug", example.slug)
        .limit(6);
      const existing = new Set(related.map((r) => r.slug));
      for (const r of (fill as CoverLetterSummary[]) || []) {
        if (!existing.has(r.slug) && related.length < 3) related.push(r);
      }
    }
    return { example, related: related.slice(0, 3) };
  });
