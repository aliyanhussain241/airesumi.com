import { createFileRoute } from "@tanstack/react-router";
import { callAIGateway, safeJSON } from "@/lib/ai-gateway";
import { createClient } from "@supabase/supabase-js";
import { consumeCredit, OUT_OF_CREDITS_RESPONSE } from "@/lib/credits";

export const Route = createFileRoute("/api/generate-bullets")({
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

          if (!(await consumeCredit(user.id))) return OUT_OF_CREDITS_RESPONSE();

          const { role, company, existingBullet, jobDescription } = await request.json() as any;

          const prompt = `You are an expert resume writer. Generate 5 powerful, ATS-optimized resume bullet points.

Role: ${role || "Professional"}
Company: ${company || ""}
Existing bullet to improve: ${existingBullet || ""}
Job description keywords: ${jobDescription || ""}

Rules:
1. Start each bullet with a strong action verb (Led, Built, Increased, Reduced, etc.)
2. Include metrics/numbers where possible (%, $, time saved)
3. Show impact, not just duties
4. Keep each bullet under 20 words
5. ATS-friendly

Return ONLY a JSON array of 5 strings, no markdown, no explanation:
["bullet 1", "bullet 2", "bullet 3", "bullet 4", "bullet 5"]`;

          const response = await callAIGateway({ language: request.headers.get("x-user-language") || undefined,
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
              .map((l: string) => l.replace(/^[-•"*\d.]+\s*/, "").replace(/",$/, "").replace(/^"|"$/g, "").trim())
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
