import { createFileRoute } from "@tanstack/react-router";
import { callAIGateway } from "@/lib/ai-gateway";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/api/generate-resignation")({
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

          const { yourName, jobTitle, companyName, managerName, lastDay, reason, tone, highlights } = await request.json() as any;

          const prompt = `You are an expert HR writer. Write a professional resignation letter.

Details:
- Name: ${yourName || ""}
- Job Title: ${jobTitle || ""}
- Company: ${companyName || ""}
- Manager: ${managerName || "Hiring Manager"}
- Last Working Day: ${lastDay || "two weeks from today"}
- Reason: ${reason || "personal reasons"}
- Tone: ${tone || "Professional"}
- Positive highlights: ${highlights || ""}

Rules:
1. Keep it short — 3-4 paragraphs max
2. Always positive, no complaints
3. Thank the company/manager
4. Offer to help with transition
5. Professional closing

Return ONLY the letter text. Start with "Dear ${managerName || "Hiring Manager"},"`;

          const response = await callAIGateway({ language: request.headers.get("x-user-language") || undefined,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.6,
          });

          return new Response(JSON.stringify({ letter: response.trim() }), {
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
