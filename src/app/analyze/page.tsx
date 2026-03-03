"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageCapture } from "@/components/image-capture";
import { DishCard, type DishAnalysis } from "@/components/dish-card";
import { ChatInterface, type ChatMessage } from "@/components/chat-interface";

export default function AnalyzePage() {
  const [imageData, setImageData] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<DishAnalysis | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleImageCaptured(base64: string) {
    setImageData(base64);
    setError(null);
    setAnalyzing(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });

      if (!res.ok) throw new Error("Analysis failed");

      const data = await res.json();
      setAnalysis(data);
    } catch {
      setError("Failed to analyze the image. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleChatSend(message: string) {
    const newMessages: ChatMessage[] = [
      ...chatMessages,
      { role: "user", content: message },
    ];
    setChatMessages(newMessages);
    setChatLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history: chatMessages,
          dishContext: analysis,
        }),
      });

      if (!res.ok) throw new Error("Chat failed");

      const data = await res.json();
      setChatMessages([
        ...newMessages,
        { role: "assistant", content: data.response },
      ]);
    } catch {
      setChatMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Sorry, I couldn't process that. Please try again.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  function handleReset() {
    setImageData(null);
    setAnalysis(null);
    setChatMessages([]);
    setError(null);
  }

  return (
    <div className="space-y-6">
      <ImageCapture
        onImageCaptured={handleImageCaptured}
        disabled={analyzing}
      />

      {analyzing && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-3" />
          <p className="text-muted-foreground">Analyzing your dish...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-4 text-red-500 text-sm">{error}</div>
      )}

      {analysis && (
        <>
          <DishCard analysis={analysis} />
          <ChatInterface
            messages={chatMessages}
            onSend={handleChatSend}
            loading={chatLoading}
          />
        </>
      )}

      {(analysis || imageData) && !analyzing && (
        <div className="text-center pt-4">
          <Button variant="outline" onClick={handleReset}>
            🔄 Scan Another Dish
          </Button>
        </div>
      )}
    </div>
  );
}
