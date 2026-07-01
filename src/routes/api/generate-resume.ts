import { createFileRoute } from "@tanstack/react-router";
import { callAIGateway, safeJSON } from "@/lib/ai-gateway";
import { requireAuth } from "@/lib/auth";
import { checkUsage } from "@/lib/usage";

export const Route = createFileRoute("/api/generate-resume")({
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

          try {
            await checkUsage(supabase, user.id, "resume");
          } catch (err: any) {
            return new Response(JSON.stringify({ error: err.message }), { status: 429 });
          }

          const { userData, jobData } = (await request.json()) as any;
          if (!userData || !jobData) {
            return new Response(JSON.stringify({ error: "Missing required data" }), { status: 400 });
          }

          const trim = (s: string, n = 600) => String(s || "").replace(/[<>\[\]]/g, "").slice(0, n);
          const trimList = (arr: string[], n = 300) => (arr || []).map(s => trim(s, n)).join("\n");

          const prompt = `You are an ATS resume expert. Tailor the resume for the job. Use keywords from the job description. Action verbs only. No invented data. Respond ONLY in JSON:
{"header":{"fullName":"","contactInfo":"","title":""},"summary":"2-3 sentences","experience":[{"title":"","company":"","dateRange":"","bullets":[""]}],"education":[{"degree":"","institution":"","dateRange":""}],"skills":[{"category":"","items":[""]}],"certifications":[{"name":"","issuer":""}]}

JOB: ${trim(jobData.title, 100)} at ${trim(jobData.company, 100)}
${trim(jobData.description, 800)}

CANDIDATE: ${trim(userData.fullName, 80)} | ${trim(userData.email, 80)} | ${trim(userData.phone, 30)} | ${trim(userData.location, 80)}${userData.linkedin ? " | " + trim(userData.linkedin, 100) : ""}${userData.portfolio ? " | " + trim(userData.portfolio, 100) : ""}
Role: ${trim(userData.currentRole, 100)}
Skills: ${trimList(userData.skills, 200)}
Experience:
${(userData.experience || []).map((e: string) => trim(e, 400)).join("\n---\n")}
Education: ${trim(userData.education, 200)}
Certs: ${(userData.certifications || []).filter(Boolean).map((c: string) => trim(c, 100)).join(", ") || "None"}`;

          const text = await callAIGateway({
            language: request.headers.get("x-user-language") || undefined,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
            json: true,
          });

          const parsed = safeJSON(text);
          if (userData.profilePicture) parsed.header.profilePicture = userData.profilePicture;
          return new Response(JSON.stringify(parsed), { headers: { "Content-Type": "application/json" } });

        } catch (e: any) {
          return new Response(JSON.stringify({ error: e?.message || "Failed to generate resume" }), { status: 500 });
        }
      },
    },
  },
});
