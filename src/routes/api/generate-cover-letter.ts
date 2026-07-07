import { createFileRoute } from "@tanstack/react-router";
import { callAIGateway, safeJSON } from "@/lib/ai-gateway";
import { requireAuth } from "@/lib/auth";
import { checkUsage } from "@/lib/usage";
import { consumeCredit, OUT_OF_CREDITS_RESPONSE } from "@/lib/credits";

export const Route = createFileRoute("/api/generate-cover-letter")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          let user: any, supabase: any;
          try {
            ({ user, supabase } = await requireAuth(request));
          } catch (err: any) {
            return new Response(JSON.stringify({ error: err.message }), { status: 401 });
          }

          if (!(await consumeCredit(user.id))) return OUT_OF_CREDITS_RESPONSE();

          try {
            await checkUsage(supabase, user.id, "coverLetter");
          } catch (err: any) {
            return new Response(JSON.stringify({ error: err.message }), { status: 429 });
          }

          const { userData, jobData, tone } = (await request.json()) as any;
          const trim = (s: string, n = 600) => String(s || "").replace(/[<>\[\]]/g, "").slice(0, n);

          const prompt = `Expert cover letter writer. Tone: ${tone || "Professional"}. Strong opening, key matches, call to action. Respond ONLY in JSON:
{"content":"cover letter text with \\n breaks","insights":{"matchedSkills":[""],"missingKeywords":[""],"improvementTips":[""]}}

JOB: ${trim(jobData.title, 100)} at ${trim(jobData.company, 100)}
${trim(jobData.description, 800)}

CANDIDATE: ${trim(userData.fullName, 80)}
Experience: ${(userData.experience || []).map((e: string) => trim(e, 300)).join("\n")}
Skills: ${(userData.skills || []).map((s: string) => trim(s, 150)).join(", ")}`;

          const text = await callAIGateway({
            language: request.headers.get("x-user-language") || undefined,
            messages: [{ role: "user", content: prompt }],
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
