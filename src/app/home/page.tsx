"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Calendar, Heart, Users, ArrowRight, Loader2 } from "lucide-react";
import type { Booking } from "@/lib/types";

export default function CustomerHomePage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((data) => setBookings(data.bookings || []))
      .finally(() => setLoading(false));
  }, []);

  const activeBooking = bookings.find((b) => b.status === "in-progress");
  const upcomingBooking = bookings.find((b) => b.status === "confirmed");

  return (
    <>
      <Navbar variant="app" />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Welcome back{user ? `, ${user.name.split(" ")[0]}` : ""}</h1>
            <p className="text-muted-foreground">How can we help your family today?</p>
          </div>

          <Button size="lg" className="w-full h-16 text-lg mb-6" asChild>
            <Link href="/book">
              <Heart className="h-5 w-5 mr-2" />
              Find Care
            </Link>
          </Button>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {activeBooking && (
                <Card className="mb-4 border-primary/30 bg-primary/5">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-primary">Active Now</p>
                        <h3 className="font-semibold">{activeBooking.serviceName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {activeBooking.caregiverName} • {activeBooking.patientName}
                        </p>
                      </div>
                      <Button asChild>
                        <Link href="/booking/active">Track <ArrowRight className="h-4 w-4 ml-1" /></Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {upcomingBooking && (
                <Card className="mb-6">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" /> Upcoming
                        </p>
                        <h3 className="font-semibold">{upcomingBooking.serviceName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {upcomingBooking.date} at {upcomingBooking.startTime}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/booking/${upcomingBooking.id}`}>Details</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/family">
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-5">
                  <Users className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold">Family Dashboard</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Monitor care for your loved ones in real-time
                  </p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/history">
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-5">
                  <Calendar className="h-8 w-8 text-primary mb-3" />
                  <h3 className="font-semibold">Booking History</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    View past and upcoming bookings
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
