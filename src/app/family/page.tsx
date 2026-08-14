"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CaregiverAvatar } from "@/components/shared/caregiver-avatar";
import { Activity, Siren, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Booking, CareEvent } from "@/lib/types";

export default function FamilyDashboardPage() {
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
    toast.error("Emergency SOS sent to all family members and support!");
  };

  return (
    <>
      <Navbar variant="app" />
      <main className="flex-1 bg-muted/20">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Family Care Dashboard</h1>
              <p className="text-muted-foreground">Monitor care for your loved ones</p>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success("Dashboard link copied!")}>
              <Share2 className="h-4 w-4" /> Share
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : booking ? (
            <>
              <Card className="mb-6 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">
                      {booking.patientName?.split("(")[0].trim() || "Patient"}&apos;s Care — Today
                    </h2>
                    <span className="inline-flex items-center gap-1.5 text-sm text-success font-medium">
                      <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                      Active
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{booking.caregiverName}</p>
                      <p className="text-sm text-muted-foreground">{booking.serviceName}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {events.map((event) => (
                      <div key={event.id} className="flex gap-3 py-2">
                        <span className="text-success text-sm">●</span>
                        <p className="font-medium text-sm">
                          {event.title} — <span className="text-muted-foreground font-normal">{event.timestamp}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Button variant="destructive" className="w-full h-12 gap-2" onClick={handleSos}>
                <Siren className="h-5 w-5" />
                Emergency SOS
              </Button>
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No active care session</h3>
                <p className="text-muted-foreground mb-4">
                  When a caregiver is attending to your loved one, you&apos;ll see live updates here.
                </p>
                <Button asChild>
                  <Link href="/book">Book Care</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
