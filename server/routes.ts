import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { storage } from "./storage";

const OPENAI_SYSTEM_BASE = `You are the Wyldstone chat assistant. Wyldstone sells handmade beaded bracelets with endangered animal charms and donates 10% of sales to wildlife conservation.

STRICT RULES: Your entire reply must be ONE sentence. Maximum 15 words. No second sentence. No "We also..." or "Additionally" or "If you'd like..." Example good reply: "We make bracelets with animal charms and give 10% to wildlife." Never write more than one sentence.`;

const CHAT_KNOWLEDGE_PATH = path.join(process.cwd(), "server", "chat-knowledge.txt");

function getChatKnowledge(): string {
  try {
    const raw = fs.readFileSync(CHAT_KNOWLEDGE_PATH, "utf-8");
    const lines = raw
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"));
    if (lines.length === 0) return "";
    return "\n\nIMPORTANT FACTS (always use these when relevant; they override general knowledge):\n" + lines.join("\n");
  } catch {
    return "";
  }
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
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === "your_openai_api_key_here") {
      res.status(503).json({
        error: "Chat is not configured. Add your OPENAI_API_KEY to .env.local.",
      });
      return;
    }

    const body = req.body as { messages?: { role: string; content: string }[] };
    const messages = body?.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: "messages array is required" });
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

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: formatted,
        max_tokens: 30,
      });
      const content =
        completion.choices[0]?.message?.content?.trim() ??
        "I couldn't generate a reply. Please try again.";
      res.json({ message: content });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "OpenAI request failed";
      res.status(500).json({ error: message });
    }
  });

  return httpServer;
}
