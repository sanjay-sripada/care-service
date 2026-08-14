import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { serializeBooking } from "@/lib/serializers";
import { getStatusColor, getStatusLabel, formatCurrency } from "@/lib/matching";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const booking = await db.booking.findUnique({
    where: { id },
    include: { customer: true, caregiver: { include: { user: true } } },
  });

  if (!booking) notFound();

  const serialized = serializeBooking(booking);

  return (
    <>
      <Navbar variant="app" />
      <main className="flex-1">
        <div className="mx-auto max-w-lg px-4 py-8 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Booking Details</h1>
            <Badge className={cn(getStatusColor(serialized.status))}>
              {getStatusLabel(serialized.status)}
            </Badge>
          </div>

          <Card className="mb-4">
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-4">{serialized.serviceName}</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{serialized.date} at {serialized.startTime}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{serialized.duration} hours</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{serialized.location}</span>
                </div>
                {serialized.patientName && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{serialized.patientName}</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t">
                  <span className="font-semibold">Caregiver</span>
                  <span>{serialized.caregiverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-primary">{formatCurrency(serialized.totalAmount)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            {serialized.status === "in-progress" && (
              <Button className="flex-1" asChild>
                <Link href="/booking/active">Track Live</Link>
              </Button>
            )}
            {serialized.status === "completed" && (
              <Button className="flex-1" asChild>
                <Link href={`/reviews?booking=${serialized.id}&caregiver=${serialized.caregiverId}`}>Leave Review</Link>
              </Button>
            )}
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/history">Back to History</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
