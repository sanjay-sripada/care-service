import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateOtp, normalizePhone } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();
    if (!phone) {
      return NextResponse.json({ error: "Phone is required" }, { status: 400 });
    }

    const normalized = normalizePhone(phone);
    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db.otpCode.create({
      data: { phone: normalized, code, expiresAt },
    });

    const response: Record<string, string> = {
      message: "OTP sent successfully",
    };

    if (process.env.DEV_OTP_EXPOSE === "true" || process.env.NODE_ENV === "development") {
      response.devOtp = code;
    }

    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
