import { createFileRoute } from "@tanstack/react-router";
import { callAIGateway, safeJSON } from "@/lib/ai-gateway";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/api/analyze-ats")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // ✅ AUTH CHECK
          const authHeader = request.headers.get("Authorization");
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return new Response(JSON.stringify({ error: "Unauthorized. Please log in." }), { status: 401 });
          }
          const token = authHeader.replace("Bearer ", "");
         const supabase = createClient(
  (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL)!,
  (process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY)!
);
          const { data: { user }, error: authError } = await supabase.auth.getUser(token);
          if (authError || !user) {
            return new Response(JSON.stringify({ error: "Invalid or expired session. Please log in again." }), { status: 401 });
          }

          const { resumeText, jobDescription } = (await request.json()) as any;
          if (!resumeText) {
            return new Response(JSON.stringify({ error: "Resume text is required" }), { status: 400 });
          }

          // ✅ PROMPT INJECTION PROTECTION
          const clean = (str: string) => String(str || "").replace(/[<>\[\]]/g, "").slice(0, 2000);

          const systemInstruction = `You are an expert ATS Evaluator. Identify missing keywords, formatting errors, lacking quantifications, missing structural sections, and provide a realistic score from 0 to 100. Respond ONLY in JSON.`;

          const prompt = `RESUME TEXT:
${clean(resumeText)}
JOB DESCRIPTION:
${clean(jobDescription) || "No specific job description provided. Perform a general ATS compliance check."}
Provide analysis in EXACTLY this JSON structure:
{
  "score": 67,
  "metrics": { "keywordMatch": 58, "formatScore": 82, "contentScore": 71, "readability": 75 },
  "issues": {
    "critical": [{ "title": "", "description": "", "fix": "" }],
    "warnings": [{ "title": "", "description": "", "fix": "" }],
    "passed": ["string"]
  },
  "keywords": {
    "found": ["string"],
    "missing": [{ "keyword": "string", "importance": "high" }],
    "suggested": ["string"]
  },
  "formatting": [{ "check": "", "status": "pass", "details": "" }],
  "improvementPlan": [{ "priority": 1, "title": "", "impact": "", "description": "", "example": "", "action": "" }]
}`;

          const text = await callAIGateway({ language: request.headers.get("x-user-language") || undefined,
            messages: [
              { role: "system", content: systemInstruction },
              { role: "user", content: prompt },
            ],
            temperature: 0.2,
            json: true,
          });
          return new Response(JSON.stringify(safeJSON(text)), { headers: { "Content-Type": "application/json" } });
        } catch (e: any) {
          return new Response(JSON.stringify({ error: e?.message || "Failed to analyze ATS" }), { status: 500 });
        }
      },
    },
  },
});
