import { createFileRoute } from "@tanstack/react-router";
import { callAIGateway, safeJSON } from "@/lib/ai-gateway";
import { getSupabaseServer } from "@/lib/supabase-server";

export const Route = createFileRoute("/api/generate-resume")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // ✅ AUTH CHECK
          let user;

try {
  ({ user } = await requireAuth(request));
} catch (err: any) {
  return new Response(
    JSON.stringify({ error: err.message }),
    { status: 401 }
  );
}

          const { userData, jobData } = (await request.json()) as any;
          if (!userData || !jobData) {
            return new Response(JSON.stringify({ error: "Missing required data" }), { status: 400 });
          }

          // ✅ PROMPT INJECTION PROTECTION
          const clean = (str: string) => String(str || "").replace(/[<>\[\]]/g, "").slice(0, 2000);

          const systemInstruction = `You are an expert Executive Recruiter and ATS Optimization Specialist.
Your task is to take a user's raw experience, education, and skills, and tailor it specifically for a target job description.

Rules:
1. MAXIMIZE ATS MATCH: Naturally integrate keywords from the job description.
2. ACTION-ORIENTED: Rewrite bullet points to start with strong action verbs.
3. TAILORED SUMMARY: Write a focused 2-3 sentence professional summary.
4. NO LIES: Do not invent experiences or skills the user did not provide.
5. RELEVANCE: Keep only the most relevant education and skills.
6. CERTIFICATIONS: Always include certifications if provided — they are important for ATS.
7. CONTACT: Include location and portfolio/website in contactInfo if provided.

Respond ONLY in JSON.`;

          const prompt = `TARGET JOB:
Title: ${clean(jobData.title)}
Company: ${clean(jobData.company)}
Description:
${clean(jobData.description)}

USER RAW DATA:
Name: ${clean(userData.fullName)}
Contact: Email: ${clean(userData.email)} | Phone: ${clean(userData.phone)} | Location: ${clean(userData.location || "")} | LinkedIn: ${clean(userData.linkedin || "")}${userData.portfolio ? ` | Portfolio: ${clean(userData.portfolio)}` : ""}
Current Role: ${clean(userData.currentRole)}
Skills:
${(userData.skills || []).map((s: string, i: number) => `Group ${i + 1}: ${clean(s)}`).join("\n")}
Experience:
${(userData.experience || []).map((e: string, i: number) => `Role ${i + 1}:\n${clean(e)}`).join("\n\n")}
Education:
${clean(userData.education)}
Certifications:
${(userData.certifications || []).filter(Boolean).map((c: string) => clean(c)).join("\n") || "None"}

Generate a highly optimized resume in JSON matching:
{
  "header": { "fullName": "string", "contactInfo": "string", "title": "string" },
  "summary": "string",
  "experience": [{ "title": "string", "company": "string", "dateRange": "string", "bullets": ["string"] }],
  "education": [{ "degree": "string", "institution": "string", "dateRange": "string" }],
  "skills": [{ "category": "string", "items": ["string"] }],
  "certifications": [{ "name": "string", "issuer": "string" }]
}`;

          const text = await callAIGateway({ language: request.headers.get("x-user-language") || undefined,
            messages: [
              { role: "system", content: systemInstruction },
              { role: "user", content: prompt },
            ],
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
