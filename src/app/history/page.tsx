"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CaregiverAvatar } from "@/components/shared/caregiver-avatar";
import { getStatusColor, getStatusLabel, formatCurrency } from "@/lib/matching";
import { useAuth } from "@/hooks/use-auth";
import { Calendar, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Booking } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function HistoryPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((data) => setBookings(data.bookings || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar variant="app" />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <h1 className="text-2xl font-bold mb-6">Booking History</h1>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : bookings.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No bookings yet.</p>
                <Button asChild><Link href="/book">Book Care</Link></Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{booking.serviceName}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Caregiver: {booking.caregiverName}
                        </p>
                      </div>
                      <Badge className={cn("shrink-0", getStatusColor(booking.status))}>
                        {getStatusLabel(booking.status)}
                      </Badge>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" /> {booking.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {booking.startTime} ({booking.duration}h)
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {booking.location}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-semibold text-primary">{formatCurrency(booking.totalAmount)}</span>
                      <div className="flex gap-2">
                        {booking.status === "in-progress" && (
                          <Button size="sm" variant="outline" asChild>
                            <Link href="/booking/active">Track</Link>
                          </Button>
                        )}
                        {booking.status === "completed" && (
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/reviews?booking=${booking.id}&caregiver=${booking.caregiverId}`}>Review</Link>
                          </Button>
                        )}
                        <Button size="sm" asChild>
                          <Link href={`/booking/${booking.id}`}>Details</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
