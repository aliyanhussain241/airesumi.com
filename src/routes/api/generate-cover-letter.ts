import { createFileRoute } from "@tanstack/react-router";
import { callAIGateway, safeJSON } from "@/lib/ai-gateway";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/api/generate-cover-letter")({
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

          const { userData, jobData, tone } = (await request.json()) as any;

          // ✅ PROMPT INJECTION PROTECTION
          const clean = (str: string) => String(str || "").replace(/[<>\[\]]/g, "").slice(0, 2000);

          const systemInstruction = `You are an expert Career Coach and Cover Letter Writer.
Rules:
1. TONE: ${tone || "Professional"}.
2. STRUCTURE: Strong opening hook, body paragraph highlighting key matches, professional closing with call to action.
3. PERSONALIZATION: Reference the specific company name, job title, and user experiences.
4. FORMAT: Plain text content with paragraph breaks.
5. INSIGHTS: Provide matched skills, missing keywords, and improvement tips.
Respond ONLY in JSON.`;

          const prompt = `TARGET JOB:
Title: ${clean(jobData.title)}
Company: ${clean(jobData.company)}
Description:
${clean(jobData.description)}
USER:
Name: ${clean(userData.fullName)}
Experience:
${(userData.experience || []).map((e: string, i: number) => `Role ${i + 1}:\n${clean(e)}`).join("\n\n")}
Skills:
${(userData.skills || []).map((s: string, i: number) => `Group ${i + 1}: ${clean(s)}`).join("\n")}
Respond strictly with JSON:
{
  "content": "string (cover letter text with \\n line breaks)",
  "insights": {
    "matchedSkills": ["string"],
    "missingKeywords": ["string"],
    "improvementTips": ["string"]
  }
}`;

          const text = await callAIGateway({ language: request.headers.get("x-user-language") || undefined,
            messages: [
              { role: "system", content: systemInstruction },
              { role: "user", content: prompt },
            ],
            temperature: 0.5,
            json: true,
          });
          return new Response(JSON.stringify(safeJSON(text)), { headers: { "Content-Type": "application/json" } });
        } catch (e: any) {
          return new Response(JSON.stringify({ error: e?.message || "Failed to generate cover letter" }), { status: 500 });
        }
      },
    },
  },
});
