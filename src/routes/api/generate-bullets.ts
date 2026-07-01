import { createFileRoute } from "@tanstack/react-router";
import { callAIGateway, safeJSON } from "@/lib/ai-gateway";
import { requireAuth } from "@/lib/auth";

export const Route = createFileRoute("/api/generate-bullets")({
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

          const { role, company, existingBullet, jobDescription } = await request.json() as any;

          const prompt = `Resume writer. 5 powerful ATS bullet points. Strong action verbs, metrics, impact. Under 20 words each. Respond ONLY as JSON array of 5 strings:
["bullet1","bullet2","bullet3","bullet4","bullet5"]

Role: ${String(role || "").slice(0, 100)} at ${String(company || "").slice(0, 100)}
Improve: ${String(existingBullet || "").slice(0, 200)}
Keywords: ${String(jobDescription || "").slice(0, 300)}`;

          const response = await callAIGateway({
            language: request.headers.get("x-user-language") || undefined,
            messages: [{ role: "user", content: prompt }],
            json: true,
            temperature: 0.7,
          });

          let bullets: string[];
          try {
            bullets = safeJSON<string[]>(response);
            if (!Array.isArray(bullets)) throw new Error("Not array");
          } catch {
            bullets = response
              .split("\n")
              .filter((l: string) => l.trim().length > 10)
              .map((l: string) => l.replace(/^[-•"*\d.]+\s*/, "").replace(/",?$/, "").replace(/^"|"$/g, "").trim())
              .filter(Boolean)
              .slice(0, 5);
          }

          return new Response(JSON.stringify({ bullets }), {
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
