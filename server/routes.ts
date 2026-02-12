import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";
import { storage } from "./storage";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const OPENAI_SYSTEM_BASE = `You are the Wyldstone chat assistant. Wyldstone sells handmade beaded bracelets with endangered animal charms and donates 10% of sales to wildlife conservation.

STRICT RULES: Your entire reply must be ONE sentence. Maximum 15 words. No second sentence. No "We also..." or "Additionally" or "If you'd like..." Example good reply: "We make bracelets with animal charms and give 10% to wildlife." Never write more than one sentence.`;

const CHAT_KNOWLEDGE_CANDIDATES = [
  path.join(__dirname, "chat-knowledge.txt"),
  path.join(process.cwd(), "server", "chat-knowledge.txt"),
];

function getChatKnowledge(): string {
  for (const p of CHAT_KNOWLEDGE_CANDIDATES) {
    try {
      const raw = fs.readFileSync(p, "utf-8");
      const lines = raw
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#"));
      if (lines.length === 0) continue;
      return "\n\nIMPORTANT FACTS (always use these when relevant; they override general knowledge):\n" + lines.join("\n");
    } catch {
      continue;
    }
  }
  return "";
}

function getSystemPrompt(): string {
  return OPENAI_SYSTEM_BASE + getChatKnowledge();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Chat: POST /api/chat — body: { messages: { role: "user"|"assistant", content: string }[] }
  app.post("/api/chat", async (req: Request, res: Response) => {
    const sendJson = (status: number, data: object) => {
      try {
        res.status(status).json(data);
      } catch {
        res.status(status).end(JSON.stringify(data));
      }
    };

    try {
      const apiKey = process.env.OPENAI_API_KEY?.trim();
      if (!apiKey || apiKey === "your_openai_api_key_here") {
        sendJson(503, {
          error:
            "Chat is not configured. Set OPENAI_API_KEY in .env.local (local) or in your host's environment variables (e.g. Vercel Project Settings → Environment Variables).",
        });
        return;
      }

      const body = req.body as { messages?: { role: string; content: string }[] } | undefined;
      const messages = body?.messages;
      if (!Array.isArray(messages) || messages.length === 0) {
        sendJson(400, { error: "messages array is required" });
        return;
      }

      const openai = new OpenAI({ apiKey });
      const formatted = [
        { role: "system" as const, content: getSystemPrompt() },
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
      sendJson(200, { message: content });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "OpenAI request failed";
      sendJson(500, { error: message });
    }
  });

  return httpServer;
}
