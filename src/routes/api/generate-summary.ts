import { createFileRoute } from "@tanstack/react-router";
import { callAIGateway } from "@/lib/ai-gateway";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/api/generate-summary")({
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

          const { role, experience, skills, jobTitle, tone } = await request.json() as any;

          const prompt = `You are an expert resume writer. Generate 3 different professional resume summary options.

Target Role: ${jobTitle || role || "Professional"}
Years of Experience: ${experience || ""}
Key Skills: ${skills || ""}
Tone: ${tone || "Professional"}

Rules:
1. Each summary 2-3 sentences, 50-80 words
2. Start with years of experience or key strength
3. Include 2-3 relevant skills
4. End with value proposition
5. ATS-optimized, no buzzwords

Return ONLY valid JSON:
{
  "summaries": [
    { "label": "Results-Focused", "text": "..." },
    { "label": "Skills-Led", "text": "..." },
    { "label": "Story-Driven", "text": "..." }
  ]
}`;

          const response = await callAIGateway({
            messages: [{ role: "user", content: prompt }],
            json: true,
            temperature: 0.7,
          });

          const clean = response.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "");
          const parsed = JSON.parse(clean);

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
