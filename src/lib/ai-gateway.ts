// Direct Google Gemini API client (replaces Lovable AI Gateway).
// Uses GEMINI_API_KEY env var. Works on Cloudflare Workers / Node / any fetch-capable runtime.

export type AIMessage = {
  role: "system" | "user" | "assistant";
  content:
    | string
    | Array<{ type: string; text?: string; image_url?: { url: string } }>;
};

const DEFAULT_MODEL = "gemini-2.5-flash";

function mapModel(model?: string): string {
  if (!model) return DEFAULT_MODEL;
  // Strip provider prefix like "google/" if present, drop "-preview" suffix variants.
  return model.replace(/^google\//, "");
}

type GeminiPart =
  | { text: string }
  | { inlineData: { mimeType: string; data: string } };

function partsFromContent(content: AIMessage["content"]): GeminiPart[] {
  if (typeof content === "string") return [{ text: content }];
  const parts: GeminiPart[] = [];
  for (const item of content) {
    if (item.type === "text" && item.text) {
      parts.push({ text: item.text });
    } else if (item.type === "image_url" && item.image_url?.url) {
      const url = item.image_url.url;
      const m = /^data:([^;]+);base64,(.+)$/.exec(url);
      if (m) {
        parts.push({ inlineData: { mimeType: m[1], data: m[2] } });
      } else {
        // Fall back: include URL as text reference
        parts.push({ text: url });
      }
    }
  }
  return parts;
}

const LANG_NAMES: Record<string, string> = {
  en: "English", es: "Spanish", fr: "French", de: "German", pt: "Portuguese",
  ar: "Arabic", hi: "Hindi", zh: "Simplified Chinese", ja: "Japanese", ru: "Russian",
};


async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3
): Promise<Response> {
  let lastError: any;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      if (![429,500,502,503,504].includes(response.status)) return response;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (err) {
      lastError = err;
    }
    const delay = 1000 * Math.pow(2, attempt - 1);
    await new Promise(r=>setTimeout(r,delay));
  }
  throw lastError;
}

export async function callAIGateway(opts: {
  messages: AIMessage[];
  model?: string;
  temperature?: number;
  json?: boolean;
  /** Two-letter language code; the model will be instructed to respond in this language. */
  language?: string;
}): Promise<string> {
  const apiKey = (globalThis as any).GEMINI_API_KEY ?? process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY missing");

  const model = mapModel(opts.model);

  // Collect system instructions; merge consecutive non-system messages into Gemini "contents".
  const systemTexts: string[] = [];
  const contents: { role: "user" | "model"; parts: GeminiPart[] }[] = [];

  // If a language was provided, add a top-level system instruction so the model
  // responds in that language. Keep JSON keys in English when json mode is on.
  if (opts.language && opts.language !== "en") {
    const langName = LANG_NAMES[opts.language] || opts.language;
    const note = opts.json
      ? `Write all human-readable content (summaries, bullets, descriptions, narrative text) in ${langName}. Keep JSON property/field names in English exactly as specified.`
      : `Respond in ${langName}.`;
    systemTexts.push(note);
  }

  for (const msg of opts.messages) {
    if (msg.role === "system") {
      const t = typeof msg.content === "string"
        ? msg.content
        : msg.content.map((c) => c.text || "").join("\n");
      if (t) systemTexts.push(t);
      continue;
    }
    contents.push({
      role: msg.role === "assistant" ? "model" : "user",
      parts: partsFromContent(msg.content),
    });
  }


  const body: any = {
    contents,
    generationConfig: {
      temperature: opts.temperature ?? 0.3,
    },
  };
  if (systemTexts.length) {
    body.systemInstruction = { parts: [{ text: systemTexts.join("\n\n") }] };
  }
  if (opts.json) {
    body.generationConfig.responseMimeType = "application/json";
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const res = await fetchWithRetry(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }
  const data: any = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  return parts.map((p: any) => p?.text ?? "").join("");
}

export function safeJSON<T = any>(text: string): T {
  let s = text.trim();
  if (s.startsWith("```")) {
    s = s.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  }
  return JSON.parse(s);
}
