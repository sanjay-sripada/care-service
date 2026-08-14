import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await requireSession(["customer"]);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bookingId, caregiverId, rating, comment } = await request.json();

  const booking = await db.booking.findFirst({
    where: {
      id: bookingId,
      customerId: session.userId,
      status: "COMPLETED",
    },
  });

  if (!booking) {
    return NextResponse.json({ error: "Completed booking not found" }, { status: 404 });
  }

  const review = await db.review.create({
    data: {
      bookingId,
      customerId: session.userId,
      caregiverId: caregiverId || booking.caregiverId!,
      rating,
      comment,
    },
  });

  const caregiverIdToUpdate = caregiverId || booking.caregiverId;
  if (caregiverIdToUpdate) {
    const caregiver = await db.caregiverProfile.findUnique({
      where: { id: caregiverIdToUpdate },
    });
    if (caregiver) {
      const newCount = caregiver.reviewCount + 1;
      const newRating =
        (caregiver.rating * caregiver.reviewCount + rating) / newCount;
      await db.caregiverProfile.update({
        where: { id: caregiverIdToUpdate },
        data: { reviewCount: newCount, rating: Math.round(newRating * 100) / 100 },
      });
    }
  }

  return NextResponse.json({ review }, { status: 201 });
}
