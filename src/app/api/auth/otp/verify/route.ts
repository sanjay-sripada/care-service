import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createSession, normalizePhone } from "@/lib/auth";
import { UserRole } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const { phone, otp, name, role } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json({ error: "Phone and OTP are required" }, { status: 400 });
    }

    const normalized = normalizePhone(phone);

    const otpRecord = await db.otpCode.findFirst({
      where: {
        phone: normalized,
        code: otp,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 401 });
    }

    await db.otpCode.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    let user = await db.user.findUnique({ where: { phone: normalized } });

    if (!user) {
      const roleMap: Record<string, UserRole> = {
        customer: UserRole.CUSTOMER,
        caregiver: UserRole.CAREGIVER,
        admin: UserRole.ADMIN,
      };

      user = await db.user.create({
        data: {
          phone: normalized,
          name: name || "User",
          role: roleMap[role] || UserRole.CUSTOMER,
        },
      });
    }

    const session = await createSession(user);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: session.role,
      },
    });
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
