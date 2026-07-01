import { createFileRoute } from "@tanstack/react-router";
import { callAIGateway, safeJSON } from "@/lib/ai-gateway";
import { requireAuth } from "@/lib/auth";

export const Route = createFileRoute("/api/generate-linkedin-bio")({
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

          const { resumeData, userData, tone } = await request.json() as any;

          const name    = String(resumeData?.header?.fullName || userData?.fullName || "").slice(0, 80);
          const title   = String(resumeData?.header?.title    || userData?.currentRole || "").slice(0, 80);
          const summary = String(resumeData?.summary || "").slice(0, 300);
          const skills  = (resumeData?.skills || []).flatMap((s: any) => s.items || []).slice(0, 10).join(", ");
          const exp     = (resumeData?.experience || []).slice(0, 2).map((e: any) => `${e.title} at ${e.company}`).join("; ");

          const prompt = `LinkedIn profile writer. Tone: ${tone || "Professional"}. Respond ONLY in JSON:
{"headline":"under 220 chars","about":"220-260 words first person","tagline":"1 punchy line","cta":"call to action","skills_to_add":["","","","",""]}

Name: ${name} | Title: ${title}
Summary: ${summary}
Skills: ${skills}
Experience: ${exp}`;

          const response = await callAIGateway({
            language: request.headers.get("x-user-language") || undefined,
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
