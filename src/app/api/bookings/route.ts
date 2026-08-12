import { NextRequest, NextResponse } from "next/server";
import { MOCK_BOOKINGS } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json({ bookings: MOCK_BOOKINGS });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const booking = {
      id: `bk-${Date.now()}`,
      ...body,
      status: "pending",
      paymentStatus: "pending",
      createdAt: new Date().toISOString(),
    };
    return NextResponse.json({ booking }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
