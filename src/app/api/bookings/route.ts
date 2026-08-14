import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { serializeBooking } from "@/lib/serializers";
import { SERVICES } from "@/lib/constants";

export async function GET() {
  const session = await requireSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const where =
    session.role === "customer"
      ? { customerId: session.userId }
      : session.role === "caregiver"
      ? { caregiver: { userId: session.userId } }
      : {};

  const bookings = await db.booking.findMany({
    where,
    include: {
      customer: true,
      caregiver: { include: { user: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    bookings: bookings.map(serializeBooking),
  });
}

export async function POST(request: NextRequest) {
  const session = await requireSession(["customer"]);
  if (!session) {
    return NextResponse.json({ error: "Please log in to book care" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      caregiverId,
      serviceCategory,
      requirement,
      location,
      date,
      startTime,
      duration,
      totalAmount,
      patientName,
      patientAge,
      specialInstructions,
    } = body;

    if (!caregiverId || !serviceCategory || !location || !date || !startTime || !duration) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const caregiver = await db.caregiverProfile.findUnique({
      where: { id: caregiverId },
    });

    if (!caregiver || caregiver.verificationStatus !== "VERIFIED" || !caregiver.isAvailable) {
      return NextResponse.json({ error: "Caregiver is not available" }, { status: 400 });
    }

    const service = SERVICES.find((s) => s.category === serviceCategory);

    const booking = await db.booking.create({
      data: {
        customerId: session.userId,
        caregiverId,
        serviceCategory,
        serviceName: service?.name || serviceCategory,
        requirement: requirement || "",
        location,
        date,
        startTime,
        duration,
        totalAmount: totalAmount || caregiver.hourlyRate * duration,
        patientName,
        patientAge: patientAge ? parseInt(patientAge) : null,
        specialInstructions,
        status: "PENDING",
        paymentStatus: "PENDING",
      },
      include: {
        customer: true,
        caregiver: { include: { user: true } },
      },
    });

    return NextResponse.json({ booking: serializeBooking(booking) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
