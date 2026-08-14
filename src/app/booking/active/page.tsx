"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, getStatusLabel, formatCurrency } from "@/lib/matching";
import { MapPin, Clock, Siren, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Booking, CareEvent } from "@/lib/types";

export default function ActiveBookingPage() {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [events, setEvents] = useState<CareEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((data) => {
        const active = (data.bookings || []).find((b: Booking) => b.status === "in-progress");
        if (active) {
          setBooking(active);
          return fetch(`/api/bookings/${active.id}`).then((r) => r.json());
        }
        return null;
      })
      .then((detail) => {
        if (detail) setEvents(detail.events || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSos = async () => {
    if (!booking) return;
    await fetch(`/api/bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "sos" }),
    });
    toast.error("SOS alert sent to emergency contacts and support team!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!booking) {
    return (
      <>
        <Navbar variant="app" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No active booking found.</p>
            <Button asChild><Link href="/book">Book Care</Link></Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar variant="app" />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Active Booking</h1>
            <Badge className={cn("text-sm", getStatusColor(booking.status))}>
              {getStatusLabel(booking.status)}
            </Badge>
          </div>

          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="font-semibold text-lg">{booking.caregiverName}</h2>
              <p className="text-sm text-muted-foreground">{booking.serviceName}</p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="h-3.5 w-3.5" />
                {booking.location}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Patient</span>
                  <p className="font-medium">{booking.patientName || "—"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Checked in</span>
                  <p className="font-medium">{booking.checkInTime || "—"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration</span>
                  <p className="font-medium">{booking.duration} hours</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Amount</span>
                  <p className="font-medium">{formatCurrency(booking.totalAmount)}</p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button variant="destructive" size="sm" className="gap-1.5 ml-auto" onClick={handleSos}>
                  <Siren className="h-4 w-4" /> SOS
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Live Activity Feed
              </h3>
              <div className="space-y-4">
                {events.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Waiting for caregiver updates...</p>
                ) : (
                  events.map((event, i) => (
                    <div key={event.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="h-3 w-3 rounded-full bg-success ring-4 ring-success/20" />
                        {i < events.length - 1 && <div className="w-px flex-1 bg-border mt-1 min-h-[2rem]" />}
                      </div>
                      <div className="pb-2">
                        <p className="font-medium text-sm">{event.title}</p>
                        {event.description && (
                          <p className="text-xs text-muted-foreground">{event.description}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-0.5">{event.timestamp}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 flex gap-3">
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/family">Family Dashboard</Link>
            </Button>
            <Button className="flex-1" asChild>
              <Link href="/history">View History</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
