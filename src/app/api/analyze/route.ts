import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const SYSTEM_PROMPT = `You are a food analysis expert. Analyze the dish shown in the image and return ONLY valid JSON (no markdown, no code fences) with this exact structure:
{
  "dishName": "Name of the dish",
  "cuisine": "Cuisine type (e.g. Italian, Japanese, Filipino, etc.)",
  "flavorProfile": ["array", "of", "flavor", "descriptors"],
  "keyIngredients": ["array", "of", "key", "ingredients"],
  "healthScore": 7,
  "healthLight": "green",
  "healthReason": "Brief explanation of health assessment"
}

Rules for healthLight:
- "green" = healthScore 7-10 (healthy, nutritious)
- "yellow" = healthScore 4-6 (moderate, some concerns)
- "red" = healthScore 1-3 (high calorie, high fat, high sugar, etc.)

Be accurate and helpful. If you cannot identify the dish, make your best educated guess.`;

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent([
      SYSTEM_PROMPT,
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: image,
        },
      },
    ]);

    const text = result.response.text();

    // Parse JSON from response (handle potential markdown code fences)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse analysis" },
        { status: 500 }
      );
    }

    const analysis = JSON.parse(jsonMatch[0]);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 }
    );
  }
}
