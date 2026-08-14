import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { serializeCaregiver, serializeBooking } from "@/lib/serializers";

export async function GET() {
  const session = await requireSession(["admin"]);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [caregivers, bookings, revenue] = await Promise.all([
    db.caregiverProfile.count(),
    db.booking.count({ where: { status: "IN_PROGRESS" } }),
    db.booking.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { totalAmount: true },
    }),
  ]);

  const pendingVerification = await db.caregiverProfile.findMany({
    where: { verificationStatus: "PENDING" },
    include: { user: true },
  });

  const recentBookings = await db.booking.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: { customer: true, caregiver: { include: { user: true } } },
  });

  const recentReviews = await db.review.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: { customer: true },
  });

  return NextResponse.json({
    stats: {
      totalCaregivers: caregivers,
      activeBookings: bookings,
      totalRevenue: revenue._sum.totalAmount || 0,
      pendingVerification: pendingVerification.length,
    },
    pendingCaregivers: pendingVerification.map(serializeCaregiver),
    recentBookings: recentBookings.map(serializeBooking),
    recentReviews,
  });
}

export async function PATCH(request: NextRequest) {
  const session = await requireSession(["admin"]);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { caregiverId, status } = await request.json();

  const updated = await db.caregiverProfile.update({
    where: { id: caregiverId },
    data: {
      verificationStatus: status === "verified" ? "VERIFIED" : "REJECTED",
      identityVerified: status === "verified",
      backgroundVerified: status === "verified",
      isAvailable: status === "verified",
    },
    include: { user: true },
  });

  return NextResponse.json({ caregiver: serializeCaregiver(updated) });
}
