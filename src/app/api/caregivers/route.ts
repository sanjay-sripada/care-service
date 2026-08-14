import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serializeCaregiver } from "@/lib/serializers";

export async function GET() {
  const caregivers = await db.caregiverProfile.findMany({
    where: { verificationStatus: "VERIFIED" },
    include: { user: true },
    orderBy: { rating: "desc" },
  });

  return NextResponse.json({
    caregivers: caregivers.map(serializeCaregiver),
  });
}
