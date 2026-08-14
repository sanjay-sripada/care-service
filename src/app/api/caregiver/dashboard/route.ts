import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { serializeBooking } from "@/lib/serializers";

export async function GET() {
  const session = await requireSession(["caregiver"]);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await db.caregiverProfile.findUnique({
    where: { userId: session.userId },
  });

  if (!profile) {
    return NextResponse.json({ error: "Caregiver profile not found" }, { status: 404 });
  }

  const [pendingJobs, activeBooking, earnings] = await Promise.all([
    db.booking.findMany({
      where: {
        caregiverId: profile.id,
        status: { in: ["CONFIRMED", "CAREGIVER_ASSIGNED"] },
      },
      include: { customer: true, caregiver: { include: { user: true } } },
      orderBy: { createdAt: "desc" },
    }),
    db.booking.findFirst({
      where: { caregiverId: profile.id, status: "IN_PROGRESS" },
      include: { customer: true, caregiver: { include: { user: true } }, careEvents: { orderBy: { createdAt: "asc" } } },
    }),
    db.booking.aggregate({
      where: { caregiverId: profile.id, paymentStatus: "PAID", status: "COMPLETED" },
      _sum: { totalAmount: true },
      _count: true,
    }),
  ]);

  return NextResponse.json({
    pendingJobs: pendingJobs.map(serializeBooking),
    activeBooking: activeBooking ? serializeBooking(activeBooking) : null,
    activeEvents: activeBooking?.careEvents || [],
    stats: {
      totalEarnings: earnings._sum.totalAmount || 0,
      completedBookings: earnings._count,
      rating: profile.rating,
      reviewCount: profile.reviewCount,
    },
  });
}
