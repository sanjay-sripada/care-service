"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MOCK_CARE_EVENTS, MOCK_BOOKINGS } from "@/lib/mock-data";
import { MOCK_CAREGIVERS } from "@/lib/mock-data";
import { CaregiverAvatar } from "@/components/shared/caregiver-avatar";
import { Activity, Siren, Share2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function FamilyDashboardPage() {
  const activeBooking = MOCK_BOOKINGS.find((b) => b.status === "in-progress");
  const caregiver = MOCK_CAREGIVERS.find((c) => c.id === activeBooking?.caregiverId);
  const events = MOCK_CARE_EVENTS.filter((e) => e.bookingId === activeBooking?.id);

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
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => toast.success("Dashboard link copied to clipboard!")}
            >
              <Share2 className="h-4 w-4" /> Share
            </Button>
          </div>

          {activeBooking && caregiver ? (
            <>
              <Card className="mb-6 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">
                      {activeBooking.patientName?.split("(")[0].trim()}&apos;s Care — Today
                    </h2>
                    <span className="inline-flex items-center gap-1.5 text-sm text-success font-medium">
                      <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                      Active
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-muted/50">
                    <CaregiverAvatar name={caregiver.name} photo={caregiver.photo} size="md" />
                    <div>
                      <p className="font-medium">{caregiver.name}</p>
                      <p className="text-sm text-muted-foreground">{activeBooking.serviceName}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {events.map((event, i) => (
                      <div key={event.id} className="flex gap-3 py-2">
                        <div className="flex flex-col items-center pt-1">
                          <span className="text-success text-sm">🟢</span>
                          {i < events.length - 1 && (
                            <div className="w-px flex-1 bg-border min-h-[1rem]" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {event.title} — <span className="text-muted-foreground font-normal">{event.timestamp}</span>
                          </p>
                          {event.description && (
                            <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Button
                variant="destructive"
                className="w-full h-12 gap-2"
                onClick={() => toast.error("Emergency SOS sent to all family members and support!")}
              >
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
