import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { serializeCareEvent } from "@/lib/serializers";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireSession(["caregiver"]);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { title, description, type } = await request.json();

  const booking = await db.booking.findFirst({
    where: { id, caregiver: { userId: session.userId }, status: "IN_PROGRESS" },
  });

  if (!booking) {
    return NextResponse.json({ error: "Active booking not found" }, { status: 404 });
  }

  const typeMap: Record<string, "CHECK_IN" | "ACTIVITY" | "MEDICATION" | "APPOINTMENT" | "CHECK_OUT" | "ALERT"> = {
    "check-in": "CHECK_IN",
    activity: "ACTIVITY",
    medication: "MEDICATION",
    appointment: "APPOINTMENT",
    "check-out": "CHECK_OUT",
    alert: "ALERT",
  };

  const event = await db.careEvent.create({
    data: {
      bookingId: id,
      title,
      description,
      type: typeMap[type] || "ACTIVITY",
    },
  });

  return NextResponse.json({ event: serializeCareEvent(event) });
}
