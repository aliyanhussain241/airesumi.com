import { createFileRoute } from "@tanstack/react-router";
import { callAIGateway, safeJSON } from "@/lib/ai-gateway";
import { requireAuth } from "@/lib/auth";
import { consumeCredit, OUT_OF_CREDITS_RESPONSE } from "@/lib/credits";

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

          if (!(await consumeCredit(user.id))) return OUT_OF_CREDITS_RESPONSE();

          const { resumeData, userData, tone, industry, targetAudience, useEmojis } = await request.json() as any;

          const name    = String(resumeData?.header?.fullName || userData?.fullName || "").slice(0, 80);
          const title   = String(resumeData?.header?.title    || userData?.currentRole || "").slice(0, 80);
          const summary = String(resumeData?.summary || "").slice(0, 300);
          const skills  = (resumeData?.skills || []).flatMap((s: any) => s.items || []).slice(0, 12).join(", ");
          const exp     = (resumeData?.experience || []).slice(0, 3).map((e: any) => `${e.title} at ${e.company}`).join("; ");

          const emojiRule = useEmojis
            ? "Sprinkle 3-5 tasteful emojis into the About section for visual rhythm."
            : "Do NOT use emojis anywhere.";

          const prompt = `You are a senior LinkedIn brand strategist writing a top-1% profile. Tone: ${tone || "Professional"}.
${industry ? `Industry: ${industry}.` : ""}
${targetAudience ? `Target reader: ${targetAudience}.` : ""}
${emojiRule}

Respond ONLY with strict JSON in this exact shape:
{
  "headline_variants": ["v1 (<=220 chars, keyword-rich)", "v2 different angle", "v3 bold/creative angle"],
  "about": "First-person About section, 220-280 words, 3-4 short paragraphs, strong hook first line, concrete results with numbers, no clichés",
  "tagline": "One punchy line for banner/cover image (<=90 chars)",
  "cta": "Short call-to-action line ending About section",
  "skills_to_add": ["skill1","skill2","skill3","skill4","skill5","skill6","skill7","skill8"],
  "keywords": ["6-10 keywords LinkedIn recruiters search for in this role"],
  "profile_tips": ["3 specific, non-generic tips to boost profile visibility for this person"]
}

Name: ${name} | Title: ${title}
Summary: ${summary}
Skills: ${skills}
Experience: ${exp}`;

          const response = await callAIGateway({
            language: request.headers.get("x-user-language") || undefined,
            messages: [{ role: "user", content: prompt }],
            json: true,
            temperature: 0.75,
          });

          const parsed = safeJSON(response);
          if (!parsed?.about) {
            return new Response(JSON.stringify({ error: "AI generation failed. Please try again." }), { status: 500 });
          }

          // Backward-compat: expose primary headline from variants
          if (!parsed.headline && Array.isArray(parsed.headline_variants)) {
            parsed.headline = parsed.headline_variants[0];
          }
          if (parsed.headline && !parsed.headline_variants) {
            parsed.headline_variants = [parsed.headline];
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
