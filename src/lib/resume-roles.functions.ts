import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServer } from "./supabase-server";

export type ResumeTip = { heading: string; content: string };
export type RoleFaq = { q: string; a: string };
export type RoleCertification = { name: string; detail: string };

export type ResumeRoleExample = {
  id: string;
  slug: string;
  job_title: string;
  industry: string | null;
  seo_title: string | null;
  seo_description: string | null;
  intro_content: string | null;
  sample_bullet_points: string[];
  key_skills: string[];
  resume_tips: ResumeTip[];
  related_role_slugs: string[];
  role_faqs: RoleFaq[];
  certifications: RoleCertification[];
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type ResumeRoleSummary = Pick<
  ResumeRoleExample,
  "slug" | "job_title" | "industry" | "seo_description"
>;

function normalize(row: any): ResumeRoleExample {
  return {
    ...row,
    sample_bullet_points: Array.isArray(row.sample_bullet_points) ? row.sample_bullet_points : [],
    key_skills: Array.isArray(row.key_skills) ? row.key_skills : [],
    resume_tips: Array.isArray(row.resume_tips) ? row.resume_tips : [],
    related_role_slugs: Array.isArray(row.related_role_slugs) ? row.related_role_slugs : [],
    role_faqs: Array.isArray(row.role_faqs) ? row.role_faqs : [],
    certifications: Array.isArray(row.certifications) ? row.certifications : [],
  };
}


export const getPublishedRoleExamples = createServerFn({ method: "GET" }).handler(
  async (): Promise<ResumeRoleSummary[]> => {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("resume_role_examples")
      .select("slug, job_title, industry, seo_description")
      .eq("published", true)
      .order("job_title", { ascending: true });
    if (error || !data) return [];
    return data as ResumeRoleSummary[];
  },
);

export type ResumeRoleWithRelated = {
  role: ResumeRoleExample;
  related: ResumeRoleSummary[];
} | null;

export const getRoleExampleWithRelated = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<ResumeRoleWithRelated> => {
    const supabase = getSupabaseServer();
    const { data: row, error } = await supabase
      .from("resume_role_examples")
      .select("*")
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    if (error || !row) return null;
    const role = normalize(row);

    let related: ResumeRoleSummary[] = [];
    if (role.related_role_slugs.length > 0) {
      const { data: rel } = await supabase
        .from("resume_role_examples")
        .select("slug, job_title, industry, seo_description")
        .eq("published", true)
        .in("slug", role.related_role_slugs);
      related = (rel as ResumeRoleSummary[]) || [];
    }
    if (related.length < 3 && role.industry) {
      const { data: fill } = await supabase
        .from("resume_role_examples")
        .select("slug, job_title, industry, seo_description")
        .eq("published", true)
        .eq("industry", role.industry)
        .neq("slug", role.slug)
        .limit(3 - related.length);
      const existing = new Set(related.map((r) => r.slug));
      for (const r of (fill as ResumeRoleSummary[]) || []) {
        if (!existing.has(r.slug)) related.push(r);
      }
    }
    return { role, related: related.slice(0, 3) };
  });
