import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import Razorpay from "razorpay";

function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export async function POST(request: NextRequest) {
  const session = await requireSession(["customer"]);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bookingId } = await request.json();
  const booking = await db.booking.findFirst({
    where: { id: bookingId, customerId: session.userId },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const razorpay = getRazorpay();

  if (!razorpay) {
    // Demo mode — mark as paid immediately
    const updated = await db.booking.update({
      where: { id: bookingId },
      data: {
        paymentStatus: "PAID",
        status: "CONFIRMED",
      },
    });
    return NextResponse.json({
      demo: true,
      bookingId: updated.id,
      amount: updated.totalAmount,
    });
  }

  const order = await razorpay.orders.create({
    amount: booking.totalAmount * 100,
    currency: "INR",
    receipt: booking.id,
  });

  await db.booking.update({
    where: { id: bookingId },
    data: { razorpayOrderId: order.id },
  });

  return NextResponse.json({
    orderId: order.id,
    amount: booking.totalAmount,
    currency: "INR",
    keyId: process.env.RAZORPAY_KEY_ID,
  });
}
