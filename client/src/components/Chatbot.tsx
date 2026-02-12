import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const WELCOME_MESSAGE =
  "Hi! Ask me anything about Wyldstone — our story, our bracelets, or our impact. I'm here to help.";

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) scrollToBottom();
  }, [messages]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleKeyDownToggle = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleKeyDownClose = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClose();
    }
    if (e.key === "Escape") handleClose();
  };

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };
    const messagesToSend = [...messages, userMessage];
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messagesToSend.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = (await res.json()) as { message?: string; error?: string };

      if (!res.ok) {
        const fallback =
          data?.error ?? "Something went wrong. Please try again.";
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: fallback,
          },
        ]);
        return;
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data?.message ?? "I couldn't generate a reply. Please try again.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: "Network error. Please check your connection and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === "Escape") {
      (e.target as HTMLInputElement).blur();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-0">
      {/* Chat panel */}
      {isOpen && (
        <div
          className="flex flex-col w-[min(100vw-2rem,380px)] h-[min(70vh,520px)] rounded-lg border border-border bg-card text-card-foreground shadow-lg"
          role="dialog"
          aria-modal="true"
          aria-label="Chat about Wyldstone"
        >
          <div className="flex items-center justify-between shrink-0 px-4 py-3 border-b border-border bg-muted/50 rounded-t-lg">
            <span className="font-semibold text-foreground">
              Ask about Wyldstone
            </span>
            <button
              type="button"
              onClick={handleClose}
              onKeyDown={handleKeyDownClose}
              className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              aria-label="Close chat"
              tabIndex={0}
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>

          <ScrollArea className="flex-1 min-h-0 px-3 py-3">
            <div className="flex flex-col gap-3 pr-2">
              {messages.length === 0 && (
                <div className="flex justify-start">
                  <div className="rounded-lg bg-muted px-3 py-2.5 text-sm text-foreground max-w-[85%]">
                    {WELCOME_MESSAGE}
                  </div>
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-sm max-w-[85%]",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-lg bg-muted px-3 py-2.5 text-sm text-muted-foreground">
                    Thinking...
                  </div>
                </div>
              )}
            </div>
            <div ref={scrollRef} />
          </ScrollArea>

          <div className="shrink-0 flex gap-2 p-3 border-t border-border rounded-b-lg bg-muted/30">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDownInput}
              placeholder="Ask about Wyldstone..."
              className="flex-1"
              aria-label="Message"
              disabled={isLoading}
            />
            <Button
              type="button"
              size="icon"
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              aria-label="Send message"
              className="shrink-0"
            >
              <Send className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        type="button"
        onClick={handleToggle}
        onKeyDown={handleKeyDownToggle}
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          isOpen && "rotate-0"
        )}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        aria-expanded={isOpen}
        tabIndex={0}
      >
        <MessageCircle className="h-6 w-6" aria-hidden />
      </button>
    </div>
  );
};

export default Chatbot;
