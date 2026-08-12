import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_BOOKINGS, MOCK_CAREGIVERS } from "@/lib/mock-data";
import { CaregiverAvatar } from "@/components/shared/caregiver-avatar";
import { getStatusColor, getStatusLabel, formatCurrency } from "@/lib/matching";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const booking = MOCK_BOOKINGS.find((b) => b.id === id);

  if (!booking) notFound();

  const caregiver = MOCK_CAREGIVERS.find((c) => c.id === booking.caregiverId);

  return (
    <>
      <Navbar variant="app" />
      <main className="flex-1">
        <div className="mx-auto max-w-lg px-4 py-8 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Booking Details</h1>
            <Badge className={cn(getStatusColor(booking.status))}>
              {getStatusLabel(booking.status)}
            </Badge>
          </div>

          <Card className="mb-4">
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg mb-4">{booking.serviceName}</h2>

              {caregiver && (
                <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-muted/50">
                  <CaregiverAvatar name={caregiver.name} photo={caregiver.photo} size="md" />
                  <div>
                    <p className="font-medium">{caregiver.name}</p>
                    <p className="text-sm text-muted-foreground">Assigned caregiver</p>
                  </div>
                </div>
              )}

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span>{booking.date} at {booking.startTime}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span>{booking.duration} hours</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>{booking.location}</span>
                </div>
                {booking.patientName && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4 shrink-0" />
                    <span>{booking.patientName}{booking.patientAge ? `, ${booking.patientAge} years` : ""}</span>
                  </div>
                )}
              </div>

              {booking.requirement && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm font-medium mb-1">Requirement</p>
                  <p className="text-sm text-muted-foreground">{booking.requirement}</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="text-lg font-bold text-primary">{formatCurrency(booking.totalAmount)}</span>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            {booking.status === "in-progress" && (
              <Button className="flex-1" asChild>
                <Link href="/booking/active">Track Live</Link>
              </Button>
            )}
            {booking.status === "completed" && (
              <Button className="flex-1" asChild>
                <Link href="/reviews">Leave Review</Link>
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
