import { createFileRoute } from "@tanstack/react-router";
import { callAIGateway, safeJSON } from "@/lib/ai-gateway";
import { createClient } from "@supabase/supabase-js";
import { consumeCredit, OUT_OF_CREDITS_RESPONSE } from "@/lib/credits";

export const Route = createFileRoute("/api/tailor-resume")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // ✅ Auth is OPTIONAL — matches "no sign-up required" promise.
          // Logged-in users spend 1 credit; guests get the tool free.
          const authHeader = request.headers.get("Authorization");
          if (authHeader?.startsWith("Bearer ")) {
            const token = authHeader.replace("Bearer ", "");
            const supabase = createClient(
              (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL)!,
              (process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY)!
            );
            const { data: { user }, error: authError } = await supabase.auth.getUser(token);
            if (authError || !user) {
              return new Response(JSON.stringify({ error: "Invalid session." }), { status: 401 });
            }
            if (!(await consumeCredit(user.id))) return OUT_OF_CREDITS_RESPONSE();
          }

          const { resumeText, jobDescription } = await request.json() as any;
          if (!resumeText?.trim() || !jobDescription?.trim()) {
            return new Response(JSON.stringify({ error: "Resume and job description are required." }), { status: 400 });
          }

          const prompt = `You are a resume tailoring expert. Compare this resume to the job description and return a match analysis with AI-tailored bullet rewrites.

RESUME:
${resumeText.slice(0, 4000)}

JOB DESCRIPTION:
${jobDescription.slice(0, 2500)}

Return ONLY valid JSON, no markdown, no explanation, matching this exact shape:
{
  "score": 68,
  "matched_keywords": ["React", "Node.js", "REST API"],
  "missing_keywords": ["TypeScript", "AWS", "CI/CD"],
  "suggested_bullets": [
    { "keyword": "TypeScript", "original": "Built React components for the dashboard.", "rewrite": "Built type-safe React + TypeScript components for the analytics dashboard, cutting runtime errors 40%." },
    { "keyword": "AWS", "original": "Deployed backend services.", "rewrite": "Deployed Node.js backend services on AWS (ECS, S3, CloudFront), improving deploy speed 3×." }
  ],
  "summary_tip": "Add TypeScript and AWS to your skills section and rework 2-3 experience bullets to naturally include them."
}

Rules:
- score is 0-100, percentage of important JD keywords present in the resume.
- Extract 8-15 matched and 5-10 missing keywords (focus on hard skills, tools, methodologies).
- Provide 3-5 suggested_bullets. For each: pick an EXISTING bullet from the resume as "original" that can naturally absorb the missing keyword, then produce a stronger "rewrite" (action verb + metric + keyword woven in).
- Never invent skills the candidate doesn't have — only tie keywords to work they've clearly done.
- Keep rewrites under 22 words.`;

          const response = await callAIGateway({
            messages: [{ role: "user", content: prompt }],
            json: true,
            temperature: 0.3,
          });

          const parsed = safeJSON(response);
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
