import { createFileRoute } from "@tanstack/react-router";
import { callAIGateway, safeJSON } from "@/lib/ai-gateway";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/api/generate-linkedin-bio")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
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
            return new Response(JSON.stringify({ error: "Invalid session." }), { status: 401 });
          }

          const { resumeData, userData, tone } = await request.json() as any;

          const name     = String(resumeData?.header?.fullName || userData?.fullName || "").slice(0, 100);
          const title    = String(resumeData?.header?.title    || userData?.currentRole || "").slice(0, 100);
          const summary  = String(resumeData?.summary          || "").slice(0, 500);
          const skills   = (resumeData?.skills || []).flatMap((s: any) => s.items || []).slice(0, 15).join(", ");
          const exp      = (resumeData?.experience || []).slice(0, 3).map((e: any) => `${e.title} at ${e.company}`).join("; ");
          const edu      = (resumeData?.education || []).slice(0, 1).map((e: any) => `${e.degree} from ${e.institution}`).join("");

          const prompt = `You are an expert LinkedIn profile writer.

Name: ${name}
Title: ${title}
Summary: ${summary}
Skills: ${skills}
Experience: ${exp}
Education: ${edu}
Tone: ${tone || "Professional"}

Return ONLY valid JSON, no markdown:
{
  "headline": "LinkedIn headline under 220 chars",
  "about": "Full LinkedIn About section 220-260 words in first person",
  "tagline": "One punchy 1-line summary",
  "cta": "Call to action line",
  "skills_to_add": ["skill1", "skill2", "skill3", "skill4", "skill5"]
}`;

          const response = await callAIGateway({ language: request.headers.get("x-user-language") || undefined,
            messages: [{ role: "user", content: prompt }],
            json: true,
            temperature: 0.7,
          });

          const parsed = safeJSON(response);
          if (!parsed?.about) {
            return new Response(JSON.stringify({ error: "AI generation failed. Please try again." }), { status: 500 });
          }

          return new Response(JSON.stringify(parsed), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err: any) {
          return new Response(JSON.stringify({ error: err.message || "Server error" }), { status: 500 });
        }
      },
    },
  },
});
