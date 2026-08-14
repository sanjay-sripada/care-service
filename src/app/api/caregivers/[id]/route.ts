import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serializeCaregiver } from "@/lib/serializers";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const caregiver = await db.caregiverProfile.findUnique({
    where: { id },
    include: { user: true, reviews: { include: { customer: true }, orderBy: { createdAt: "desc" }, take: 10 } },
  });

  if (!caregiver) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    caregiver: serializeCaregiver(caregiver),
    reviews: caregiver.reviews.map((r) => ({
      id: r.id,
      customerName: r.customer.name,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
    })),
  });
}
