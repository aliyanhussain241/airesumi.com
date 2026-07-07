// Direct Google Gemini API client with OpenRouter fallback.
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
        parts.push({ text: url });
      }
    }
  }
  return parts;
}


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
      if (![429, 500, 502, 503, 504].includes(response.status)) return response;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (err) {
      lastError = err;
    }
    const delay = 1000 * Math.pow(2, attempt - 1);
    await new Promise(r => setTimeout(r, delay));
  }
  throw lastError;
}

async function callGemini(opts: {
  messages: AIMessage[];
  model?: string;
  temperature?: number;
  json?: boolean;
}): Promise<string> {
  const apiKey = (globalThis as any).GEMINI_API_KEY ?? process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY missing");

  const model = mapModel(opts.model);
  const systemTexts: string[] = [];
  const contents: { role: "user" | "model"; parts: GeminiPart[] }[] = [];


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
    generationConfig: { temperature: opts.temperature ?? 0.3 },
  };
  if (systemTexts.length) {
    body.systemInstruction = { parts: [{ text: systemTexts.join("\n\n") }] };
  }
  if (opts.json) {
    body.generationConfig.responseMimeType = "application/json";
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const res = await fetchWithRetry(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini error ${res.status}: ${errText}`);
  }

  const data: any = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts ?? [];
  return parts.map((p: any) => p?.text ?? "").join("");
}

async function callOpenRouter(opts: {
  messages: AIMessage[];
  temperature?: number;
  json?: boolean;
}): Promise<string> {
  const apiKey = (globalThis as any).OPENROUTER_API_KEY ?? process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY missing");

  const messages: { role: string; content: string }[] = [];


  for (const msg of opts.messages) {
    messages.push({
      role: msg.role,
      content: typeof msg.content === "string"
        ? msg.content
        : msg.content.map((c) => c.text || "").join("\n"),
    });
  }

  const body: any = {
    model: "deepseek/deepseek-chat",
    messages,
    temperature: opts.temperature ?? 0.3,
  };

  if (opts.json) {
    body.response_format = { type: "json_object" };
  }

  const res = await fetchWithRetry("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": "https://airesumi.com",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${errText}`);
  }

  const data: any = await res.json();
  return data?.choices?.[0]?.message?.content ?? "";
}

export async function callAIGateway(opts: {
  messages: AIMessage[];
  model?: string;
  temperature?: number;
  json?: boolean;
}): Promise<string> {
  try {
    return await callGemini(opts);
  } catch (geminiError: any) {
    console.warn("[ai-gateway] Gemini failed, trying OpenRouter:", geminiError.message);
    try {
      const result = await callOpenRouter(opts);
      console.log("[ai-gateway] OpenRouter fallback succeeded");
      return result;
    } catch (openRouterError: any) {
      console.error("[ai-gateway] Both failed");
      throw new Error("AI service temporarily unavailable. Please try again.");
    }
  }
}

export function safeJSON<T = any>(text: string): T {
  let s = text.trim();
  if (s.startsWith("```")) {
    s = s.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  }
  return JSON.parse(s);
}
