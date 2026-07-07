import { createFileRoute } from "@tanstack/react-router";
import { callAIGateway, safeJSON } from "@/lib/ai-gateway";
import { requireAuth } from "@/lib/auth";
import { consumeCredit, OUT_OF_CREDITS_RESPONSE } from "@/lib/credits";

export const Route = createFileRoute("/api/generate-summary")({
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

          const { role, experience, skills, jobTitle, tone } = await request.json() as any;

          const prompt = `Resume writer. Generate 3 professional summary options (50-80 words each). ATS-optimized. Respond ONLY in JSON:
{"summaries":[{"label":"Results-Focused","text":""},{"label":"Skills-Led","text":""},{"label":"Story-Driven","text":""}]}

Role: ${String(jobTitle || role || "").slice(0, 100)}
Experience: ${String(experience || "").slice(0, 100)}
Skills: ${String(skills || "").slice(0, 300)}
Tone: ${String(tone || "Professional").slice(0, 50)}`;

          const response = await callAIGateway({
            messages: [{ role: "user", content: prompt }],
            json: true,
            temperature: 0.7,
          });

          return new Response(JSON.stringify(safeJSON(response)), {
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
