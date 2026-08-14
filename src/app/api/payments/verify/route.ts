import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  const session = await requireSession(["customer"]);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
    await request.json();

  const booking = await db.booking.findFirst({
    where: { id: bookingId, customerId: session.userId },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  if (process.env.RAZORPAY_KEY_SECRET && razorpayOrderId && razorpayPaymentId) {
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpaySignature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }
  }

  await db.booking.update({
    where: { id: bookingId },
    data: {
      paymentStatus: "PAID",
      status: "CONFIRMED",
      razorpayPaymentId: razorpayPaymentId || null,
    },
  });

  return NextResponse.json({ success: true });
}
