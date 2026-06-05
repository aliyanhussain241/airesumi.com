import { createFileRoute } from "@tanstack/react-router";
import { callAIGateway } from "@/lib/ai-gateway";
import { createClient } from "@supabase/supabase-js";

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

          const { role, company, existingBullet, jobDescription } = await request.json() as any;

          const prompt = `You are an expert resume writer. Generate 5 powerful, ATS-optimized resume bullet points.

Role: ${role || "Professional"}
Company: ${company || ""}
Existing bullet (improve this): ${existingBullet || ""}
Job description keywords: ${jobDescription || ""}

Rules:
1. Start each bullet with a strong action verb (Led, Built, Increased, Reduced, etc.)
2. Include metrics/numbers where possible (%, $, time saved)
3. Show impact, not just duties
4. Keep each bullet under 20 words
5. Make them ATS-friendly

Return ONLY a JSON array of 5 strings. No markdown, no explanation.
Example: ["Led cross-functional team of 8 to deliver $2M project 2 weeks early", "..."]`;

          const response = await callAIGateway({
            messages: [{ role: "user", content: prompt }],
            json: true,
            temperature: 0.7,
          });

          const clean = response.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "");
          let bullets: string[];
          try {
            bullets = JSON.parse(clean);
            if (!Array.isArray(bullets)) throw new Error("Not array");
          } catch {
            // fallback: split by newline
            bullets = clean.split("\n").filter((l: string) => l.trim().startsWith('"') || l.trim().startsWith("-"))
              .map((l: string) => l.replace(/^[-"•]\s*/, "").replace(/",$/, "").replace(/^"|"$/g, "").trim())
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
