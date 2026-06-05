import { createFileRoute } from "@tanstack/react-router";
import { callAIGateway } from "@/lib/ai-gateway";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/api/scan-keywords")({
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

          const { resumeText, jobDescription } = await request.json() as any;

          const prompt = `You are an ATS expert. Analyze this resume against the job description.

RESUME:
${(resumeText || "").slice(0, 3000)}

JOB DESCRIPTION:
${(jobDescription || "").slice(0, 2000)}

Return ONLY valid JSON:
{
  "score": 72,
  "matched_keywords": ["React", "Node.js", "API"],
  "missing_keywords": ["TypeScript", "AWS", "Docker"],
  "recommended_keywords": ["CI/CD", "Agile", "REST API"],
  "tips": [
    "Add 'TypeScript' to your skills section",
    "Mention AWS experience in your work history"
  ]
}`;

          const response = await callAIGateway({
            messages: [{ role: "user", content: prompt }],
            json: true,
            temperature: 0.2,
          });

          const clean = response.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "");
          const parsed = JSON.parse(clean);

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
