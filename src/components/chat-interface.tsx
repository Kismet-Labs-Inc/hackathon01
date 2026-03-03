"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSend: (message: string) => void;
  loading?: boolean;
}

const suggestions = [
  "Is this gluten-free?",
  "I'm diabetic — is this okay?",
  "Something spicier?",
  "What about allergies?",
];

export function ChatInterface({
  messages,
  onSend,
  loading,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;
    onSend(input.trim());
    setInput("");
  }

  function handleSuggestion(text: string) {
    if (loading) return;
    onSend(text);
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-sm text-muted-foreground">
        Ask about this dish
      </h3>

      {/* Suggestion Chips */}
      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <Button
              key={s}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => handleSuggestion(s)}
              disabled={loading}
            >
              {s}
            </Button>
          ))}
        </div>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`rounded-lg px-3 py-2 max-w-[85%] text-sm ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-3 py-2 text-sm text-muted-foreground animate-pulse">
                Thinking...
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about ingredients, allergies, diet..."
          disabled={loading}
          className="flex-1"
        />
        <Button type="submit" disabled={!input.trim() || loading}>
          Send
        </Button>
      </form>
    </div>
  );
}
