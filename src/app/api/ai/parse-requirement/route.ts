import { NextRequest, NextResponse } from "next/server";
import { parseRequirement } from "@/lib/ai-parser";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }
    const parsed = parseRequirement(text);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to parse requirement" }, { status: 500 });
  }
}
