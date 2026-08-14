import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { serializeBooking, serializeCareEvent } from "@/lib/serializers";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const booking = await db.booking.findUnique({
    where: { id },
    include: {
      customer: true,
      caregiver: { include: { user: true } },
      careEvents: { orderBy: { createdAt: "asc" } },
      review: true,
    },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  return NextResponse.json({
    booking: serializeBooking(booking),
    events: booking.careEvents.map(serializeCareEvent),
    review: booking.review,
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { action } = body;

  const booking = await db.booking.findUnique({
    where: { id },
    include: { caregiver: true },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  if (action === "accept" && session.role === "caregiver") {
    if (booking.caregiver?.userId !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const updated = await db.booking.update({
      where: { id },
      data: { status: "CONFIRMED" },
      include: { customer: true, caregiver: { include: { user: true } } },
    });
    return NextResponse.json({ booking: serializeBooking(updated) });
  }

  if (action === "reject" && session.role === "caregiver") {
    if (booking.caregiver?.userId !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const updated = await db.booking.update({
      where: { id },
      data: { status: "CANCELLED", caregiverId: null },
      include: { customer: true, caregiver: { include: { user: true } } },
    });
    return NextResponse.json({ booking: serializeBooking(updated) });
  }

  if (action === "start" && session.role === "caregiver") {
    if (booking.caregiver?.userId !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const now = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const updated = await db.booking.update({
      where: { id },
      data: { status: "IN_PROGRESS", checkInTime: now },
      include: { customer: true, caregiver: { include: { user: true } } },
    });
    await db.careEvent.create({
      data: {
        bookingId: id,
        title: "Caregiver arrived",
        type: "CHECK_IN",
      },
    });
    return NextResponse.json({ booking: serializeBooking(updated) });
  }

  if (action === "end" && session.role === "caregiver") {
    if (booking.caregiver?.userId !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const now = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const updated = await db.booking.update({
      where: { id },
      data: { status: "COMPLETED", checkOutTime: now },
      include: { customer: true, caregiver: { include: { user: true } } },
    });
    await db.careEvent.create({
      data: {
        bookingId: id,
        title: "Service completed",
        type: "CHECK_OUT",
      },
    });
    if (booking.caregiverId) {
      await db.caregiverProfile.update({
        where: { id: booking.caregiverId },
        data: { completedBookings: { increment: 1 } },
      });
    }
    return NextResponse.json({ booking: serializeBooking(updated) });
  }

  if (action === "sos") {
    await db.careEvent.create({
      data: {
        bookingId: id,
        title: "Emergency SOS triggered",
        description: "Alert sent to family and support team",
        type: "ALERT",
      },
    });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
