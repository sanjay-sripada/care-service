import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { matchCaregivers } from "@/lib/matching";
import { serializeCaregiver } from "@/lib/serializers";
import { ParsedRequirement } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const requirement: ParsedRequirement = body.requirement;
    const location: string = body.location || "";

    const caregivers = await db.caregiverProfile.findMany({
      where: { verificationStatus: "VERIFIED", isAvailable: true },
      include: { user: true },
    });

    const serialized = caregivers.map(serializeCaregiver);
    const matches = matchCaregivers(serialized, requirement, location);

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
