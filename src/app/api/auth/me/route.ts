import { NextResponse } from "next/server";
import { getCurrentUser, getSession } from "@/lib/auth";
import { serializeCaregiver } from "@/lib/serializers";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ user: null });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: session.role,
      emergencyContact: user.emergencyContact,
      emergencyPhone: user.emergencyPhone,
      caregiverProfile: user.caregiverProfile
        ? serializeCaregiver({ ...user.caregiverProfile, user })
        : null,
    },
  });
}
