import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const SYSTEM_PROMPT = `You are a friendly and knowledgeable food assistant. You previously analyzed a dish for the user. Answer their follow-up questions about the dish, including dietary concerns, allergies, alternatives, nutrition, cooking methods, etc. Keep responses concise and helpful (2-3 sentences max). Do not use markdown formatting.`;

export async function POST(request: NextRequest) {
  try {
    const { message, history, dishContext } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "No message provided" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Build conversation with context
    const contextMessage = dishContext
      ? `Context about the dish being discussed: ${JSON.stringify(dishContext)}\n\n`
      : "";

    const conversationHistory = (history || [])
      .map(
        (msg: { role: string; content: string }) =>
          `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`
      )
      .join("\n");

    const prompt = `${SYSTEM_PROMPT}\n\n${contextMessage}${conversationHistory ? `Previous conversation:\n${conversationHistory}\n\n` : ""}User: ${message}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to get response" },
      { status: 500 }
    );
  }
}
