import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const existing = await db.caregiverProfile.findUnique({
    where: { userId: session.userId },
  });

  if (existing) {
    return NextResponse.json({ error: "Profile already exists" }, { status: 400 });
  }

  await db.user.update({
    where: { id: session.userId },
    data: { role: "CAREGIVER", name: body.name || session.name },
  });

  const profile = await db.caregiverProfile.create({
    data: {
      userId: session.userId,
      photo: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(body.name || session.name)}`,
      location: body.location,
      languages: body.languages || ["English", "Hindi"],
      experience: parseInt(body.experience) || 1,
      skills: body.skills || [],
      bio: body.bio || "",
      hourlyRate: parseInt(body.hourlyRate) || 300,
      dailyRate: parseInt(body.hourlyRate || "300") * 8,
      certifications: body.certifications || [],
      availability: body.availability || ["Mon", "Tue", "Wed", "Thu", "Fri"],
      verificationStatus: "PENDING",
    },
    include: { user: true },
  });

  return NextResponse.json({ profileId: profile.id }, { status: 201 });
}
