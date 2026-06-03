import { createFileRoute } from "@tanstack/react-router";
import { callAIGateway, safeJSON } from "@/lib/ai-gateway";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/api/generate-linkedin-bio")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // AUTH CHECK
          const authHeader = request.headers.get("Authorization");
          if (!authHeader?.startsWith("Bearer ")) {
            return new Response(JSON.stringify({ error: "Unauthorized. Please log in." }), { status: 401 });
          }
          const token = authHeader.replace("Bearer ", "");
          const supabase = createClient(
            (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL)!,
            (process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY)!
          );
          const { data: { user }, error: authError } = await supabase.auth.getUser(token);
          if (authError || !user) {
            return new Response(JSON.stringify({ error: "Invalid session. Please log in again." }), { status: 401 });
          }

          const { resumeData, userData, tone } = (await request.json()) as any;

          const clean = (str: string) => String(str || "").replace(/[<>\[\]]/g, "").slice(0, 2000);

          const name = clean(resumeData?.header?.fullName || userData?.fullName || "");
          const title = clean(resumeData?.header?.title || userData?.currentRole || "");
          const summary = clean(resumeData?.summary || "");
          const skills = (resumeData?.skills || [])
            .flatMap((s: any) => s.items || [])
            .slice(0, 15)
            .map(clean)
            .join(", ");
          const experience = (resumeData?.experience || [])
            .slice(0, 3)
            .map((e: any) => `${clean(e.title)} at ${clean(e.company)}`)
            .join("; ");
          const education = (resumeData?.education || [])
            .slice(0, 1)
            .map((e: any) => `${clean(e.degree)} from ${clean(e.institution)}`)
            .join("");

          const systemInstruction = `You are an expert LinkedIn profile writer and personal branding coach.
You write compelling, authentic LinkedIn About sections that get recruiters' attention.
Rules:
1. TONE: ${tone || "Professional"} — match the requested tone perfectly.
2. LENGTH: About section 220-260 words. Headline under 220 characters. Summary 1-2 lines.
3. STRUCTURE: Hook (1-2 lines) → Value proposition → Key achievements/skills → CTA.
4. VOICE: First person, conversational yet professional, no buzzword fluff.
5. FORMAT: Respond ONLY in valid JSON, no markdown, no backticks.`;

          const prompt = `Generate a LinkedIn profile for:
Name: ${name}
Current Title: ${title}
Summary: ${summary}
Top Skills: ${skills}
Experience: ${experience}
Education: ${education}
Tone: ${tone || "Professional"}

Return ONLY this JSON:
{
  "headline": "LinkedIn headline under 220 chars — title + value prop",
  "about": "Full LinkedIn About section 220-260 words in first person",
  "tagline": "One punchy 1-line summary for banner/tagline",
  "cta": "Call to action line to add at end of About",
  "skills_to_add": ["skill1", "skill2", "skill3", "skill4", "skill5"]
}`;

          const aiResponse = await callAIGateway([
            { role: "system", content: systemInstruction },
            { role: "user", content: prompt },
          ]);

          const text = aiResponse.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "");
          const parsed = safeJSON(text);

          if (!parsed || !parsed.about) {
            return new Response(JSON.stringify({ error: "AI generation failed. Please try again." }), { status: 500 });
          }

          return new Response(JSON.stringify(parsed), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: any) {
          console.error("LinkedIn Bio API error:", err);
          return new Response(JSON.stringify({ error: "Server error. Please try again." }), { status: 500 });
        }
      },
    },
  },
});
