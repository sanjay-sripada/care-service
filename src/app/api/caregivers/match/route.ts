import { NextRequest, NextResponse } from "next/server";
import { MOCK_CAREGIVERS } from "@/lib/mock-data";
import { matchCaregivers } from "@/lib/matching";
import { ParsedRequirement } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const requirement: ParsedRequirement = body.requirement;
    const location: string = body.location || "";

    const matches = matchCaregivers(MOCK_CAREGIVERS, requirement, location);

    return NextResponse.json({
      matches: matches.map((m) => ({
        caregiver: m.caregiver,
        matchScore: m.matchScore,
        reasons: m.reasons,
      })),
      total: matches.length,
    });
  } catch {
    return NextResponse.json({ error: "Failed to match caregivers" }, { status: 500 });
  }
}
