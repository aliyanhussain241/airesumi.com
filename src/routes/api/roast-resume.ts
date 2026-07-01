import { createFileRoute } from "@tanstack/react-router";
import { callAIGateway, safeJSON } from "@/lib/ai-gateway";

export const Route = createFileRoute("/api/roast-resume")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { resumeText, jobDescription } = (await request.json()) as any;
          if (!resumeText || String(resumeText).trim().length < 50) {
            return new Response(
              JSON.stringify({ error: "Please paste at least 50 characters of resume text." }),
              { status: 400 },
            );
          }

          const clean = (s: string) => String(s || "").replace(/[<>]/g, "").slice(0, 8000);

          const system = `You are a brutally honest senior tech recruiter with 15 years of experience. You have seen thousands of resumes. You score resumes fairly but you don't sugarcoat feedback. You call out weak summaries, vague bullets, missing metrics, buzzwords, and formatting issues. Respond ONLY in valid JSON.`;

          const prompt = `Analyze this resume and return a JSON object with this EXACT shape:
{
  "score": <0-100 integer, realistic — most resumes are 45-70>,
  "grade": "A" | "B" | "C" | "D" | "F",
  "ats": <0-100>,
  "content": <0-100>,
  "impact": <0-100>,
  "keywords": <0-100>,
  "strengths": [<3-4 short strings>],
  "weaknesses": [<3-4 short strings>],
  "quickFixes": [<3-5 short actionable strings>],
  "roast": "<2-3 sentences of blunt, witty, honest feedback like a burned-out senior recruiter. Be specific to their resume. No generic advice. Use dry humor.>"
}

Grading: 90+ A, 80-89 B, 70-79 C, 55-69 D, <55 F.

RESUME:
${clean(resumeText)}

${jobDescription ? `TARGET JOB:\n${clean(jobDescription)}` : "No job description provided — evaluate general resume quality and ATS-readiness."}`;

          const text = await callAIGateway({
            messages: [
              { role: "system", content: system },
              { role: "user", content: prompt },
            ],
            temperature: 0.7,
            json: true,
          });

          return new Response(JSON.stringify(safeJSON(text)), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (e: any) {
          return new Response(
            JSON.stringify({ error: e?.message || "Failed to analyze resume" }),
            { status: 500 },
          );
        }
      },
    },
  },
});
