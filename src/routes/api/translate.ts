// Batch UI translation endpoint. Takes an array of English strings + target
// language, returns translated strings via Gemini. Used by AutoTranslate
// client-side runtime so static page text gets localized without code changes.

import { createFileRoute } from "@tanstack/react-router";
import { callAIGateway } from "@/lib/ai-gateway";

const LANG_NAMES: Record<string, string> = {
  en: "English", es: "Spanish", fr: "French", de: "German", pt: "Portuguese",
  ar: "Arabic", hi: "Hindi", zh: "Simplified Chinese", ja: "Japanese", ru: "Russian",
};

export const Route = createFileRoute("/api/translate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json() as { texts?: string[]; lang?: string };
          const texts = Array.isArray(body.texts) ? body.texts.filter((t) => typeof t === "string") : [];
          const lang = String(body.lang || "en");

          if (lang === "en" || texts.length === 0) {
            return Response.json({ translations: texts });
          }
          const langName = LANG_NAMES[lang];
          if (!langName) return Response.json({ error: "Unsupported language" }, { status: 400 });
          if (texts.length > 200) {
            return Response.json({ error: "Too many strings (max 200 per request)" }, { status: 400 });
          }

          // Build a numbered list so the model returns parallel output we can split.
          const numbered = texts.map((t, i) => `${i + 1}. ${t.replace(/\n/g, " ")}`).join("\n");

          const raw = await callAIGateway({
            model: "gemini-2.5-flash",
            json: true,
            messages: [
              {
                role: "system",
                content: `You are a professional UI translator. Translate each numbered English string into natural, concise ${langName} suitable for a SaaS web app (resume builder). Preserve placeholders like {{name}}, %s, arrows (→, ←), emojis, and punctuation. Do NOT translate brand names: airesumi, Rezumi, LinkedIn, ATS, PDF, AI. Return strict JSON: {"items":[{"i":1,"t":"..."}, ...]} with one entry per input, in order.`,
              },
              { role: "user", content: numbered },
            ],
          });

          let parsed: { items?: { i: number; t: string }[] };
          try { parsed = JSON.parse(raw); } catch { parsed = {}; }
          const map = new Map<number, string>();
          for (const it of parsed.items || []) {
            if (typeof it?.i === "number" && typeof it?.t === "string") map.set(it.i, it.t);
          }
          const translations = texts.map((src, idx) => map.get(idx + 1) ?? src);
          return Response.json({ translations });
        } catch (err: any) {
          return Response.json({ error: err?.message || "Translation failed" }, { status: 500 });
        }
      },
    },
  },
});
