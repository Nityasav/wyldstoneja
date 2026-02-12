import OpenAI from "openai";

const SYSTEM_BASE = `You are the Wyldstone chat assistant. Wyldstone sells handmade beaded bracelets with endangered animal charms and donates 10% of sales to wildlife conservation.

STRICT RULES: Your entire reply must be ONE sentence. Maximum 15 words. No second sentence. No "We also..." or "Additionally" or "If you'd like..." Example good reply: "We make bracelets with animal charms and give 10% to wildlife." Never write more than one sentence.`;

// Inline default facts so serverless works without reading server/chat-knowledge.txt
const DEFAULT_FACTS = "Each bracelet costs $10.";
const FACTS_BLOCK = `\n\nIMPORTANT FACTS (always use these when relevant; they override general knowledge):\n${DEFAULT_FACTS}`;
const SYSTEM_PROMPT = SYSTEM_BASE + FACTS_BLOCK;

type Req = { method?: string; body?: unknown };
type Res = {
  status: (n: number) => { json: (o: object) => void; end: (s?: string) => void };
  setHeader: (name: string, value: string) => void;
};

function sendJson(res: Res, status: number, data: object) {
  try {
    res.status(status).json(data);
  } catch {
    res.setHeader("Content-Type", "application/json");
    res.status(status).end(JSON.stringify(data));
  }
}

export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey || apiKey === "your_openai_api_key_here") {
      sendJson(res, 503, {
        error:
          "Chat is not configured. Set OPENAI_API_KEY in Vercel Project Settings → Environment Variables.",
      });
      return;
    }

    const body = req.body as { messages?: { role: string; content: string }[] } | undefined;
    const messages = body?.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      sendJson(res, 400, { error: "messages array is required" });
      return;
    }

    const openai = new OpenAI({ apiKey });
    const formatted = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
        content: String(m.content ?? ""),
      })),
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: formatted,
      max_tokens: 30,
    });
    const content =
      completion.choices[0]?.message?.content?.trim() ??
      "I couldn't generate a reply. Please try again.";
    sendJson(res, 200, { message: content });
  } catch (err: unknown) {
    let message = "OpenAI request failed";
    try {
      message = err instanceof Error ? err.message : String(err ?? message);
    } catch {
      // ignore
    }
    sendJson(res, 500, { error: message });
  }
}
